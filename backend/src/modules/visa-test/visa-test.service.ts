import { Injectable, NotFoundException, ForbiddenException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { ScoringService, DS160Profile } from '../scoring/scoring.service';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';

@Injectable()
export class VisaTestService {
  private supabase: any;
  private resend: Resend;

  constructor(private scoringService: ScoringService) {
    this.supabase = createClient(
      process.env.SUPABASE_URL || 'https://placeholder.supabase.co',
      process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder'
    );
    this.resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder');
  }

  async submitTest(profile: DS160Profile, userId: string = '00000000-0000-0000-0000-000000000000') {
    try {
      console.log('📥 profile data:', profile);

      const testId = randomUUID();
      const payload = {
        id: testId,
        user_id: userId,
        status: 'pending'
      };
      
      console.log('📥 payload enviado:', JSON.stringify(payload, null, 2));

      // Create the test record
      const { data: test, error: testErr } = await this.supabase
        .from('visa_tests')
        .insert(payload)
        .select()
        .single();

      if (testErr) {
        console.error('❌ Supabase FULL error:', JSON.stringify(testErr, null, 2));
        throw testErr;
      }
      
      if (!test) {
        throw new Error('❌ Failed to create visa test');
      }

      const result = this.scoringService.calculate(profile);
      await this.supabase.from('ds160_profiles').insert({
        test_id: test.id,
        ...profile
      });

      // Create the score breakdown
      await this.supabase.from('visa_score_breakdown').insert({
        test_id: test.id,
        personal_points: result.breakdown.personal,
        economic_points: result.breakdown.economic,
        rootedness_points: result.breakdown.ties,
        travel_history_points: result.breakdown.travel,
        migration_history_points: result.breakdown.migration,
        strengths: result.strengths,
        weaknesses: result.weaknesses,
        recommendations: result.recommendations,
        improvement_simulations: result.simulations
      });

      return {
        testId: test.id,
        status: 'locked',
        message: 'Tu VisaScore está listo. Realiza el pago para desbloquear.'
      };
    } catch (error) {
      console.error('❌ submit error:', error);
      throw error;
    }
  }

  async unlockTest(testId: string) {
    await this.supabase
      .from('visa_tests')
      .update({ status: 'paid' })
      .eq('id', testId);

    return { success: true, status: 'paid' };
  }

  async getStatus(testId: string) {
    const { data, error } = await this.supabase
      .from('visa_tests')
      .select('status')
      .eq('id', testId)
      .single();

    if (error || !data) throw new NotFoundException('Test not found');
    return data;
  }

  async getResult(testId: string, currentUserId?: string) {
    console.log('[DEBUG] getResult TEST ID:', testId);
    console.log('[DEBUG] SUPABASE_URL:', process.env.SUPABASE_URL);
    
    // Primero probar la conexión simple sin joins
    const { data: testDumb, error: errorDumb } = await this.supabase
      .from('visa_tests')
      .select('*')
      .limit(1);
    console.log('[DEBUG] SIMPLE QUERY RESULT:', testDumb, 'ERROR:', errorDumb);

    // ✅ 1. Obtener test SIN JOIN (clave del fix)
    let { data: test, error } = await this.supabase
      .from('visa_tests')
      .select('*')
      .eq('id', testId)
      .maybeSingle();

    if (error || !test) throw new NotFoundException('Test not found');

    // ✅ Seguridad: usuario
    if (
      currentUserId &&
      test.user_id !== currentUserId &&
      test.user_id !== '00000000-0000-0000-0000-000000000000'
    ) {
      throw new ForbiddenException('No tienes permiso para ver este resultado.');
    }

    // ✅ Seguridad: pago
    if (test.status !== 'paid') {
      throw new ForbiddenException('Resultado bloqueado. Pago requerido.');
    }

    if (test.status === 'paid' && (test.overall_score === null || test.overall_score === undefined)) {
      console.log(`Score missing, regenerating for testId: ${testId}`);
      await this.generateScore(testId);
      
      const { data: refreshedTest } = await this.supabase
        .from('visa_tests')
        .select('*')
        .eq('id', testId)
        .maybeSingle();
      
      if (refreshedTest) {
        test = refreshedTest;
      }
    }

    // ✅ 2. Obtener breakdown aparte (NO rompe si no existe)
    const { data: breakdown } = await this.supabase
      .from('visa_score_breakdown')
      .select('*')
      .eq('test_id', testId)
      .maybeSingle();

    return {
      overall_score: test.overall_score,
      approval_probability: test.metadata?.approval_probability || 0,
      category:
        test.overall_score > 700
          ? 'HIGH'
          : test.overall_score > 400
          ? 'MEDIUM'
          : 'LOW',
      breakdown: {
        economic: breakdown?.economic_points || 0,
        ties: breakdown?.rootedness_points || 0,
        travel: breakdown?.travel_history_points || 0,
        migration: breakdown?.migration_history_points || 0,
        personal: breakdown?.personal_points || 0
      },
      strengths: breakdown?.strengths || [],
      weaknesses: breakdown?.weaknesses || [],
      recommendations: breakdown?.recommendations || [],
      simulations: breakdown?.improvement_simulations || []
    };
  }

  private async generateScore(testId: string) {
    console.log(`Generating score...`);
    try {
      const { data: profile } = await this.supabase
        .from('ds160_profiles')
        .select('*')
        .eq('test_id', testId)
        .maybeSingle();

      if (!profile) {
        console.log(`Score generation failed: No profile found`);
        return;
      }

      const profileData = { ...profile };
      delete profileData.id;
      delete profileData.test_id;
      delete profileData.created_at;
      delete profileData.updated_at;

      const result = this.scoringService.calculate(profileData as DS160Profile);

      await this.supabase
        .from('visa_tests')
        .update({
          overall_score: result.totalScore,
          metadata: { 
            approval_probability: result.approvalProbability 
          }
        })
        .eq('id', testId);

      const { data: existingBreakdown } = await this.supabase
        .from('visa_score_breakdown')
        .select('id')
        .eq('test_id', testId)
        .maybeSingle();

      if (!existingBreakdown) {
        await this.supabase.from('visa_score_breakdown').insert({
          test_id: testId,
          personal_points: result.breakdown.personal,
          economic_points: result.breakdown.economic,
          rootedness_points: result.breakdown.ties,
          travel_history_points: result.breakdown.travel,
          migration_history_points: result.breakdown.migration,
          strengths: result.strengths,
          weaknesses: result.weaknesses,
          recommendations: result.recommendations,
          improvement_simulations: result.simulations
        });
      }

      console.log(`Score generated successfully`);
    } catch (err: any) {
      console.log(`Score generation failed: ${err.message}`);
    }
  }

  async sendEmail(testId: string, email: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      throw new BadRequestException('Formato de correo inválido');
    }

    const { data: test, error } = await this.supabase
      .from('visa_tests')
      .select('overall_score, metadata')
      .eq('id', testId)
      .maybeSingle();

    if (error || !test) {
      throw new NotFoundException('Test no encontrado');
    }

    const score = test.overall_score || 0;
    const level = score > 700 
      ? 'Perfil sólido' 
      : score > 400 
      ? 'Riesgo moderado' 
      : 'Alto riesgo / baja probabilidad';

    try {
      const htmlBody = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <h2 style="color: #0A3161; font-weight: bold;">Tu resultado VisaScore</h2>
          <p style="font-size: 16px; line-height: 1.5; color: #4A5568;">
            Hemos evaluado tu perfil con criterios utilizados en procesos consulares reales e inteligencia algorítmica.
          </p>
          
          <div style="background-color: #F4F6F8; padding: 30px; border-radius: 12px; margin: 30px 0; text-align: center; border: 1px solid #E2E8F0;">
            <p style="margin: 0; font-size: 12px; color: #718096; text-transform: uppercase; letter-spacing: 1.5px; font-weight: bold;">
              Puntaje estimado
            </p>
            <h1 style="font-size: 56px; margin: 15px 0; color: #0A3161; letter-spacing: -1px;">${score}</h1>
            
            <p style="margin: 0; font-size: 12px; color: #718096; text-transform: uppercase; letter-spacing: 1.5px; font-weight: bold; margin-top: 25px;">
              Nivel de Riesgo
            </p>
            <h3 style="font-size: 22px; margin: 10px 0 0; color: #B31942; font-weight: 800;">${level}</h3>
          </div>

          <div style="text-align: center; margin-top: 40px;">
            <a href="${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'https://visascore.co'}/gracias?testId=${testId}" 
               style="background-color: #0A3161; color: #ffffff; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">
               Ver mi reporte completo
            </a>
          </div>
        </div>
      `;

      await this.resend.emails.send({
        from: 'VisaScore <noreply@visascore.co>',
        to: email,
        subject: 'Tu resultado VisaScore',
        html: htmlBody,
      });

      return { success: true, message: 'Reporte enviado correctamente' };
    } catch (err) {
      console.error('Error enviando email con Resend:', err);
      throw new InternalServerErrorException('Error interno al enviar el reporte');
    }
  }

  async generateReportPdf(testId: string): Promise<Buffer> {
    const { data: test, error } = await this.supabase
      .from('visa_tests')
      .select('overall_score, metadata')
      .eq('id', testId)
      .maybeSingle();

    if (error || !test) {
      throw new NotFoundException('Test no encontrado');
    }

    const { data: breakdown } = await this.supabase
      .from('visa_score_breakdown')
      .select('*')
      .eq('test_id', testId)
      .maybeSingle();

    const score = test.overall_score || 0;
    const normalizedScore = Math.min(100, Math.max(0, Math.round(score / 10)));
    
    // Perfil Text
    const profileText = normalizedScore >= 80 ? "Perfil Sólido" : normalizedScore >= 60 ? "Perfil Medio" : "Perfil en Riesgo";
    const probLabel = normalizedScore >= 80 ? "ALTA PROBABILIDAD" : normalizedScore >= 60 ? "PROBABILIDAD MODERADA" : "RIESGO DE RECHAZO";
    const probColor = normalizedScore >= 80 ? "#15803d" : normalizedScore >= 60 ? "#b45309" : "#b91c1c";
    const probBg = normalizedScore >= 80 ? "#f0fdf4" : normalizedScore >= 60 ? "#fffbeb" : "#fef2f2";
    const probBorder = normalizedScore >= 80 ? "#bbf7d0" : normalizedScore >= 60 ? "#fde68a" : "#fecaca";
    const probIcon = normalizedScore >= 80 
      ? `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>` 
      : `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`;

    const fecha = new Date().toLocaleDateString('en-US', { 
      year: 'numeric', month: 'long', day: 'numeric' 
    });

    const getIconSvg = (text: string, type: 'strength'|'risk') => {
      const t = text.toLowerCase();
      if (t.includes('laboral') || t.includes('trabajo') || t.includes('empleo')) return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>`;
      if (t.includes('ingreso') || t.includes('financier') || t.includes('fondo') || t.includes('banco') || t.includes('dinero') || t.includes('econ')) return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"></rect><circle cx="12" cy="12" r="2"></circle><path d="M6 12h.01M18 12h.01"></path></svg>`;
      if (t.includes('viaje') || t.includes('historial') || t.includes('visa')) return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12l-9.5-6.5-1.5 5-7.5-1.5-1.5 2 6 2 1.5 6 3-1-3.5-3 9.5-3z"></path></svg>`;
      if (t.includes('arraigo') || t.includes('lazo') || t.includes('familia') || t.includes('dependiente') || t.includes('propiedad')) return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>`;
      return type === 'strength' 
        ? `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`
        : `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>`;
    };

    let strengthsHtml = '';
    const strengthsArr = breakdown?.strengths || [];
    if (strengthsArr.length > 0) {
      strengthsHtml = strengthsArr.map((s: string) => `
        <div class="pill pill-green">
          <div class="pill-icon">${getIconSvg(s, 'strength')}</div>
          <span>${s}</span>
        </div>
      `).join('');
    } else {
      strengthsHtml = '<div class="pill" style="color: #94A3B8;"><span>No se registraron fortalezas destacadas.</span></div>';
    }

    let risksHtml = '';
    const risksArr = breakdown?.weaknesses || [];
    if (risksArr.length > 0) {
      risksHtml = risksArr.map((w: string) => `
        <div class="pill pill-red">
          <div class="pill-icon">${getIconSvg(w, 'risk')}</div>
          <span>${w}</span>
        </div>
      `).join('');
    } else {
      risksHtml = '<div class="pill" style="color: #94A3B8;"><span>No se registraron riesgos críticos.</span></div>';
    }

    const strengthPercentage = Math.min(100, Math.max(0, Math.round(score / 10)));
    const riskPercentage = Math.max(0, 100 - strengthPercentage);

    const formatActionableInsight = (text: string) => {
      const keywords = ['estabilidad laboral', 'viajes internacionales', 'capacidad financiera', 'arraigo', 'ingresos', 'historial', 'soportes económicos'];
      let formattedText = text;
      keywords.forEach(kw => {
        const regex = new RegExp(`(${kw})`, 'gi');
        formattedText = formattedText.replace(regex, '<strong>$1</strong>');
      });
      return formattedText;
    };

    const customRecommendations = [...(breakdown?.recommendations || [])];
    if (normalizedScore < 60 && !customRecommendations.some((r: string) => r.toLowerCase().includes("estabilidad"))) {
      customRecommendations.push("Se recomienda fortalecer estabilidad laboral antes de realizar la aplicación formal para mitigar dudas sobre la intención de retorno.");
    }
    if (breakdown?.travel_history_points !== undefined && breakdown.travel_history_points < 20) {
      customRecommendations.push("Considerar viajes internacionales previos a países de libre acceso como soporte histórico y capacidad en pasaporte.");
    }
    if (breakdown?.economic_points !== undefined && breakdown.economic_points < 30) {
      customRecommendations.push("Demostrar capacidad financiera adicional mediante ahorros sostenidos, transacciones, certificados a término o propiedades.");
    }
    if (customRecommendations.length === 0) {
      customRecommendations.push("Mantener su perfil íntegro, seguro y real al momento de presentarse a su entrevista oficial consular.");
    }

    const recommendationsHtml = customRecommendations.map((r: string) => `
      <div class="insight-item">
        <p>${formatActionableInsight(r)}</p>
      </div>
    `).join('');

    const conicGradientStr = `conic-gradient(var(--green) 0% ${strengthPercentage}%, #0A192F ${strengthPercentage}% 100%)`;
    const conicGradientStrSmallGreen = `conic-gradient(var(--green) 0% ${strengthPercentage}%, #E2E8F0 ${strengthPercentage}% 100%)`;
    const conicGradientStrSmallRed = `conic-gradient(var(--red) 0% ${riskPercentage}%, #FEE2E2 ${riskPercentage}% 100%)`;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          :root {
            --bg: #F8FAFC;
            --navy: #0B1F3A;
            --navy-light: #0A192F;
            --green: #22C55E;
            --yellow: #F59E0B;
            --red: #EF4444;
            --gray-text: #64748B;
            --gray-border: #E2E8F0;
          }
          body {
            font-family: 'Inter', 'Helvetica Neue', Arial, sans-serif;
            background-color: var(--bg);
            color: #0F172A;
            margin: 0;
            padding: 0;
            -webkit-print-color-adjust: exact;
          }
          .page {
            padding: 40px 50px;
            max-width: 800px;
            margin: 0 auto;
            background: var(--bg);
            box-sizing: border-box;
          }
          
          /* HEADER */
          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid var(--gray-border);
            padding-bottom: 20px;
            margin-bottom: 40px;
          }
          .header-left {
            display: flex;
            align-items: center;
            gap: 12px;
          }
          .doc-icon {
            background: var(--navy);
            color: white;
            padding: 10px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .logo {
            font-size: 20px;
            font-weight: 900;
            color: var(--navy);
            letter-spacing: -0.5px;
            margin-bottom: 2px;
          }
          .subtitle {
            font-size: 11px;
            color: #94A3B8;
            text-transform: uppercase;
            letter-spacing: 1px;
            font-weight: 700;
          }
          .header-right {
            text-align: right;
            font-size: 12px;
            color: var(--gray-text);
            font-weight: 600;
            display: flex;
            gap: 15px;
            align-items: center;
            text-transform: uppercase;
          }
          .header-right strong {
            color: var(--navy);
            font-weight: 800;
          }
          .sep { color: var(--gray-border); font-size: 16px; font-weight: 300; }

          /* HERO SCORE */
          .hero-section {
            text-align: center;
            margin-bottom: 40px;
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .donut-wrapper {
            position: relative;
            width: 170px;
            height: 170px;
            margin: 0 auto 20px auto;
            border-radius: 50%;
            background: ${conicGradientStr};
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 10px 30px rgba(11, 31, 58, 0.1);
          }
          .donut-wrapper::before {
            content: '';
            position: absolute;
            top: -6px; left: -6px; right: -6px; bottom: -6px;
            border: 2px dashed rgba(34, 197, 94, 0.15); /* Subtly decor */
            border-radius: 50%;
          }
          .donut-inner {
            width: 154px;
            height: 154px;
            background: var(--navy-light);
            border-radius: 50%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: white;
            z-index: 2;
          }
          .hero-score {
            font-size: 58px;
            font-weight: 900;
            margin: 0;
            line-height: .9;
            letter-spacing: -2px;
          }
          .hero-score-divider {
            width: 25px;
            height: 2px;
            background: rgba(255,255,255,0.2);
            margin: 8px 0;
            border-radius: 2px;
          }
          .hero-score-max {
            font-size: 13px;
            color: #94A3B8;
            font-weight: 800;
            letter-spacing: 1px;
          }
          
          .profile-title {
            font-size: 26px;
            font-weight: 900;
            color: var(--navy);
            margin: 10px 0 12px 0;
            letter-spacing: -0.5px;
          }
          .prob-badge {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 8px 22px;
            border-radius: 20px;
            font-weight: 800;
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            background-color: ${probBg};
            color: ${probColor};
            border: 1px solid ${probBorder};
            box-shadow: 0 2px 4px rgba(0,0,0,0.02);
          }

          /* Sm Indicators */
          .indicators-row {
            display: flex;
            justify-content: center;
            gap: 30px;
            margin-top: 30px;
          }
          .ind-gauge {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 10px;
          }
          .sm-donut-wrapper-g {
            width: 65px;
            height: 65px;
            border-radius: 50%;
            background: ${conicGradientStrSmallGreen};
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
          }
          .sm-donut-wrapper-r {
            width: 65px;
            height: 65px;
            border-radius: 50%;
            background: ${conicGradientStrSmallRed};
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
          }
          .sm-donut-inner {
            width: 53px;
            height: 53px;
            background: var(--bg);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 900;
            font-size: 16px;
            z-index: 2;
          }
          .ind-label {
            font-size: 10px;
            font-weight: 800;
            color: var(--gray-text);
            text-transform: uppercase;
            letter-spacing: 1.5px;
          }

          /* Grid Cards */
          .grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 25px;
            margin-bottom: 35px;
          }
          .card {
            background: white;
            border-radius: 20px;
            padding: 35px 30px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.03);
            border: 1px solid white;
          }
          .card-header {
            display: flex;
            align-items: center;
            gap: 14px;
            margin-bottom: 25px;
          }
          .icon-box-g {
            width: 34px;
            height: 34px;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #dcfce7;
            color: var(--green);
          }
          .icon-box-r {
            width: 34px;
            height: 34px;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #fee2e2;
            color: var(--red);
          }
          .card h3 {
            margin: 0;
            font-size: 17px;
            color: #0F172A;
            font-weight: 800;
            letter-spacing: -0.3px;
          }
          
          /* Pills */
          .pill {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 14px 18px;
            border-radius: 14px;
            margin-bottom: 12px;
            font-size: 13px;
            font-weight: 600;
            color: var(--navy);
          }
          .pill-green {
            background: #F1F5F9;
          }
          .pill-green .pill-icon {
            color: var(--green);
            display: flex;
          }
          .pill-red {
            background: #FEF2F2;
          }
          .pill-red .pill-icon {
            color: var(--red);
            display: flex;
          }

          /* Recommendations */
          .insights-card {
            background: var(--navy-light);
            border-radius: 24px;
            padding: 45px 50px;
            color: white;
            margin-bottom: 30px;
            position: relative;
            overflow: hidden;
            box-shadow: 0 15px 35px rgba(11, 31, 58, 0.2);
          }
          .insights-bg-icon {
            position: absolute;
            right: 40px;
            top: 50%;
            transform: translateY(-50%);
            opacity: 0.15;
            color: rgba(255,255,255,0.5);
            /* lightbulb SVG via CSS bg doesn't print well, so it's injected inside div */
          }
          .insights-sup {
            font-size: 10px;
            color: #64748B;
            font-weight: 800;
            letter-spacing: 2px;
            text-transform: uppercase;
            margin-bottom: 10px;
          }
          .insights-title {
            margin: 0 0 35px 0;
            font-size: 28px;
            font-weight: 800;
            color: white;
            letter-spacing: -0.5px;
          }
          .insight-item {
            border-left: 2px solid rgba(255,255,255,0.15);
            padding-left: 25px;
            margin-bottom: 30px;
          }
          .insight-item:last-child {
            margin-bottom: 0;
          }
          .insight-item p {
            margin: 0;
            font-size: 14.5px;
            line-height: 1.6;
            color: #CBD5E1;
            font-weight: 500;
            max-width: 85%;
          }
          .insight-item p strong {
            color: white;
            font-weight: 700;
          }

          /* Footer */
          .footer {
            text-align: center;
            padding-top: 30px;
            margin-top: 20px;
          }
          .footer-logo-text {
            font-size: 11px;
            color: #CBD5E1;
            font-weight: 800;
            letter-spacing: 1.5px;
            text-transform: uppercase;
            margin-bottom: 15px;
          }
          .footer-disclaimer {
            font-size: 11px;
            color: #94A3B8;
            line-height: 1.6;
            max-width: 450px;
            margin: 0 auto 20px auto;
            font-weight: 500;
          }
          .footer-links {
            display: flex;
            justify-content: center;
            gap: 25px;
            font-size: 11px;
            color: #94A3B8;
            font-weight: 600;
          }
          .footer-links span {
            text-decoration: underline;
            color: #64748B;
          }
        </style>
      </head>
      <body>
        <div class="page">
          
          <div class="header">
            <div class="header-left">
              <div class="doc-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
              </div>
              <div>
                <div class="logo">VisaScore Report</div>
                <div class="subtitle">Visa Eligibility Analysis</div>
              </div>
            </div>
            <div class="header-right">
              <div>CASE <strong style="text-transform: uppercase;">#VS-${testId.split('-')[0].substring(0,4)}</strong></div>
              <div class="sep">|</div>
              <div><strong>${fecha}</strong></div>
            </div>
          </div>
          
          
          <div class="hero-section">
            <div class="donut-wrapper">
              <div class="donut-inner">
                <div class="hero-score">${normalizedScore}</div>
                <div class="hero-score-divider"></div>
                <div class="hero-score-max">100</div>
              </div>
            </div>
            <div class="profile-title">${profileText}</div>
            <div class="prob-badge">
              ${probIcon}
              ${probLabel}
            </div>

            <div class="indicators-row">
              <div class="ind-gauge">
                <div class="sm-donut-wrapper-g">
                  <div class="sm-donut-inner" style="color: var(--green);">
                    ${strengthPercentage}%
                  </div>
                </div>
                <div class="ind-label">Fortalezas</div>
              </div>
              <div class="ind-gauge">
                <div class="sm-donut-wrapper-r">
                  <div class="sm-donut-inner" style="color: var(--red);">
                    ${riskPercentage}%
                  </div>
                </div>
                <div class="ind-label">Riesgos</div>
              </div>
            </div>
          </div>
          
          <div class="grid">
            <div class="card">
              <div class="card-header">
                <div class="icon-box-g">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
                <h3>Fortalezas</h3>
              </div>
              <div class="list-wrapper">
                ${strengthsHtml}
              </div>
            </div>
            <div class="card">
              <div class="card-header">
                <div class="icon-box-r">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                </div>
                <h3>Áreas de Riesgo</h3>
              </div>
              <div class="list-wrapper">
                 ${risksHtml}
              </div>
            </div>
          </div>
          
          <div class="insights-card">
            <div class="insights-bg-icon">
              <!-- Background Lightbulb Watermark -->
              <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 2v2"></path><path d="M12 20v2"></path><path d="M5 5l1.5 1.5"></path>
                <path d="M17.5 17.5L19 19"></path><path d="M2 12h2"></path><path d="M20 12h2"></path>
                <path d="M5 19l1.5-1.5"></path><path d="M17.5 6.5L19 5"></path><circle cx="12" cy="12" r="5"></circle>
              </svg>
            </div>
            <div class="insights-sup">Actionable Insights</div>
            <h2 class="insights-title">Recomendaciones</h2>
            <div class="insights-list">
              ${recommendationsHtml}
            </div>
          </div>
          
          <div class="footer">
            <div class="footer-logo-text">ACTIVO DIGITAL VISASCORE</div>
            <div class="footer-disclaimer">
              Este reporte es una evaluación automatizada algorítmicamente y no garantiza la aprobación de la visa, ya que es potestad absoluta del Cónsula de los Estados Unidos. Lo que se define es tu perfil para obtar a la Visa Americana.<br>
              Todos los datos son procesados de forma segura y se basan en información detallada de acuerdo a los parámetros del Formulario DS160.
            </div>
            <div class="footer-links">
              <a href="${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'https://visascore.co'}/terminos-y-condiciones" style="text-decoration: none; color: inherit;"><span>Términos y Condiciones</span></a>
              <a href="${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'https://visascore.co'}/politica-de-privacidad" style="text-decoration: none; color: inherit;"><span>Política de Privacidad</span></a>
            </div>
          </div>
          
        </div>
      </body>
      </html>
    `;

    try {
      console.log("HTML preview:", htmlContent.slice(0, 500));
      console.log("Launching Puppeteer...");

      const execPath = await chromium.executablePath();
      console.log("Chromium executablePath:", execPath);

      if (!execPath) {
        throw new Error("Chromium executable path not found");
      }

      const browser = await puppeteer.launch({
        args: chromium.args,
        executablePath: execPath,
        headless: true
      });
      
      console.log("Browser launched successfully");
      const page = await browser.newPage();
      await page.setContent(htmlContent, {
        waitUntil: 'domcontentloaded'
      });
      const pdfBuffer = await page.pdf({ 
        format: 'A4', 
        printBackground: true, 
        margin: { top: '40px', bottom: '40px', left: '40px', right: '40px' } 
      });
      await browser.close();
      
      if (!pdfBuffer || pdfBuffer.length === 0) {
        throw new InternalServerErrorException('PDF buffer is empty');
      }
      
      return Buffer.from(pdfBuffer);
    } catch (err) {
      const error = err as any;
      console.error("PDF generation error:", error?.message);
      console.error("STACK:", error?.stack);
      throw new InternalServerErrorException('Error generating PDF');
    }
  }
}