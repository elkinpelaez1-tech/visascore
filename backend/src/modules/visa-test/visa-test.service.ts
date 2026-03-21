import { Injectable, NotFoundException, ForbiddenException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
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
    const result = this.scoringService.calculate(profile);
    
    // Create the test record
    const { data: test, error: testErr } = await this.supabase
      .from('visa_tests')
      .insert({
        user_id: userId,
        overall_score: result.totalScore,
        status: 'locked',
        metadata: { 
          approval_probability: result.approvalProbability 
        }
      })
      .select()
      .single();

    if (testErr) throw new Error(`Test creation failed: ${testErr.message}`);

    // Create the detailed profile
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
    const { data: test, error } = await this.supabase
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
    // Normalización de score a 100
    const normalizedScore = Math.round(score / 10);
    
    // Nivel de perfil
    const profileText = normalizedScore >= 80 
      ? "Perfil Sólido" 
      : normalizedScore >= 60 
      ? "Perfil Medio" 
      : "Perfil en Riesgo";
      
    // Categorización de colores e indicadores visuales
    const probLabel = normalizedScore >= 80 ? "Alta Probabilidad" : normalizedScore >= 60 ? "Probabilidad Moderada" : "Riesgo de Rechazo";
    const probColor = normalizedScore >= 80 ? "#15803d" : normalizedScore >= 60 ? "#b45309" : "#b91c1c";
    const probBg = normalizedScore >= 80 ? "#dcfce7" : normalizedScore >= 60 ? "#fef3c7" : "#fee2e2";

    const fecha = new Date().toLocaleDateString('en-US', { 
      year: 'numeric', month: 'long', day: 'numeric' 
    });

    let strengthsHtml = '';
    if (breakdown?.strengths && breakdown.strengths.length > 0) {
      strengthsHtml = breakdown.strengths.map((s: string) => `<li>${s}</li>`).join('');
    } else {
      strengthsHtml = '<li style="color: #64748B;">No se registran fortalezas destacadas.</li>';
    }

    let risksHtml = '';
    if (breakdown?.weaknesses && breakdown.weaknesses.length > 0) {
      risksHtml = breakdown.weaknesses.map((w: string) => `<li>${w}</li>`).join('');
    } else {
      risksHtml = '<li style="color: #64748B;">No se registran riesgos críticos.</li>';
    }

    // Lógica de validación dinámica para el motor de recomendaciones simples
    const customRecommendations = [...(breakdown?.recommendations || [])];
    
    if (normalizedScore < 60 && !customRecommendations.some((r: string) => r.toLowerCase().includes("estabilidad"))) {
      customRecommendations.push("Se recomienda fortalecer su estabilidad laboral y comprobar soportes económicos constantes antes de aplicar.");
    }
    if (breakdown?.travel_history_points !== undefined && breakdown.travel_history_points < 20) {
      customRecommendations.push("Considere realizar viajes internacionales previos a países de libre acceso como soporte fuerte de historial migratorio.");
    }
    if (breakdown?.economic_points !== undefined && breakdown.economic_points < 30) {
      customRecommendations.push("Demuestre capacidad financiera adicional mediante ahorros sostenidos, certificados a término o propiedades a su nombre.");
    }
    
    // Recomendación genérica si estuviese vacío o en perfiles perfectos
    if (customRecommendations.length === 0) {
      customRecommendations.push("Mantenga las condiciones positivas actuales establecidas al momento de su entrevista consular oficial.");
    }

    const recommendationsHtml = customRecommendations.map((r: string) => `<li>${r}</li>`).join('');

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          :root {
            --bg: #F8FAFC;
            --navy: #0B1F3A;
            --green: #22C55E;
            --yellow: #F59E0B;
            --red: #EF4444;
            --gray-text: #64748B;
            --gray-border: #E2E8F0;
          }
          body {
            font-family: 'Helvetica Neue', Arial, sans-serif;
            background-color: var(--bg);
            color: #0F172A;
            margin: 0;
            padding: 0;
            -webkit-print-color-adjust: exact;
          }
          .page {
            padding: 50px;
            max-width: 800px;
            margin: 0 auto;
            background: white;
            box-sizing: border-box;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px solid var(--navy);
            padding-bottom: 25px;
            margin-bottom: 35px;
          }
          .header-left .logo {
            font-size: 26px;
            font-weight: 900;
            color: var(--navy);
            letter-spacing: -1px;
            margin-bottom: 5px;
          }
          .header-left .subtitle {
            font-size: 14px;
            color: var(--gray-text);
            text-transform: uppercase;
            letter-spacing: 1.5px;
            font-weight: 600;
          }
          .header-right {
            text-align: right;
            font-size: 13px;
            color: var(--gray-text);
            line-height: 1.6;
          }
          .header-right strong {
            color: var(--navy);
            font-weight: 700;
          }
          .hero {
            background-color: var(--navy);
            border-radius: 16px;
            padding: 45px;
            text-align: center;
            color: white;
            margin-bottom: 35px;
          }
          .hero-title {
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 2.5px;
            color: #94A3B8;
            margin-bottom: 15px;
            font-weight: 600;
          }
          .hero-score-wrapper {
            margin-bottom: 12px;
          }
          .hero-score {
            font-size: 85px;
            font-weight: 900;
            margin: 0;
            line-height: 1;
            letter-spacing: -3px;
          }
          .hero-score span {
            font-size: 32px;
            color: #64748B;
            font-weight: 700;
            letter-spacing: 0;
          }
          .hero-category {
            display: inline-block;
            margin-top: 15px;
            padding: 8px 24px;
            border-radius: 20px;
            font-weight: 700;
            font-size: 16px;
            background: rgba(255,255,255,0.1);
            letter-spacing: 0.5px;
          }
          .probability-card {
            background: white;
            border: 1px solid var(--gray-border);
            border-radius: 16px;
            padding: 25px 30px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 35px;
          }
          .prob-info h3 {
            margin: 0 0 6px 0;
            font-size: 18px;
            color: var(--navy);
            font-weight: 800;
          }
          .prob-info p {
            margin: 0;
            font-size: 14px;
            color: var(--gray-text);
          }
          .prob-badge {
            padding: 12px 24px;
            border-radius: 12px;
            font-weight: 800;
            font-size: 16px;
          }
          .grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 25px;
            margin-bottom: 35px;
          }
          .card {
            border: 1px solid var(--gray-border);
            border-radius: 16px;
            padding: 25px;
          }
          .card h3 {
            margin: 0 0 20px 0;
            font-size: 16px;
            text-transform: uppercase;
            letter-spacing: 1.2px;
            color: var(--navy);
            font-weight: 800;
          }
          ul {
            list-style: none;
            padding: 0;
            margin: 0;
          }
          li {
            position: relative;
            padding-left: 24px;
            margin-bottom: 14px;
            font-size: 14.5px;
            color: #334155;
            line-height: 1.5;
            font-weight: 500;
          }
          .card.strengths li::before {
            content: '\\2713';
            position: absolute;
            left: 0;
            color: var(--green);
            font-weight: 900;
            font-size: 16px;
          }
          .card.weaknesses li::before {
            content: '\\26A0';
            position: absolute;
            left: 0;
            color: var(--red);
            font-weight: 900;
            font-size: 14px;
          }
          .card.weaknesses h3 {
            color: var(--red);
          }
          .recommendations {
            background: #F8FAFC;
            border: 1px solid var(--gray-border);
            border-radius: 16px;
            padding: 35px;
            margin-bottom: 40px;
          }
          .recommendations h3 {
            margin: 0 0 24px 0;
            color: var(--navy);
            font-size: 20px;
            font-weight: 800;
          }
          .recommendations ol {
            margin: 0;
            padding-left: 20px;
            color: #334155;
          }
          .recommendations li {
            margin-bottom: 16px;
            font-size: 15px;
            padding-left: 8px;
            line-height: 1.6;
            font-weight: 500;
          }
          .footer {
            text-align: center;
            border-top: 1px solid var(--gray-border);
            padding-top: 25px;
            font-size: 12px;
            color: var(--gray-text);
            line-height: 1.6;
          }
        </style>
      </head>
      <body>
        <div class="page">
          <div class="header">
            <div class="header-left">
              <div class="logo">VisaScore</div>
              <div class="subtitle">Visa Eligibility Analysis</div>
            </div>
            <div class="header-right">
              <div>Date: <strong>${fecha}</strong></div>
              <div>Case ID: <strong style="text-transform: uppercase;">${testId.split('-')[0]}</strong></div>
            </div>
          </div>
          
          <div class="hero">
            <div class="hero-title">Overall Assessment Score</div>
            <div class="hero-score-wrapper">
              <h1 class="hero-score">${normalizedScore}<span>/100</span></h1>
            </div>
            <div>
              <div class="hero-category">${profileText}</div>
            </div>
          </div>
          
          <div class="probability-card">
            <div class="prob-info">
              <h3>Probabilidad de aprobación estimada</h3>
              <p>Basado en factores de riesgo consular e historial migratorio.</p>
            </div>
            <div class="prob-badge" style="background-color: ${probBg}; color: ${probColor};">
              ${probLabel}
            </div>
          </div>
          
          <div class="grid">
            <div class="card strengths">
              <h3 style="color: var(--green);">Fortalezas del Perfil</h3>
              <ul>
                ${strengthsHtml}
              </ul>
            </div>
            <div class="card weaknesses">
              <h3 style="color: var(--red);">Áreas de Riesgo</h3>
              <ul>
                ${risksHtml}
              </ul>
            </div>
          </div>
          
          <div class="recommendations">
            <h3>Plan de Acción Estratégico</h3>
            <ol>
              ${recommendationsHtml}
            </ol>
          </div>
          
          <div class="footer">
            This report is an automated assessment and does not guarantee visa approval.<br>
            CONFIDENTIAL - VISASCORE &copy; ${new Date().getFullYear()}
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