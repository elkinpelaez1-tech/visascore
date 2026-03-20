import { Injectable, NotFoundException, ForbiddenException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { ScoringService, DS160Profile } from '../scoring/scoring.service';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import * as puppeteer from 'puppeteer';

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
    const level = score > 700 
      ? 'Perfil sólido' 
      : score > 400 
      ? 'Riesgo moderado' 
      : 'Alto riesgo / baja probabilidad';

    const fecha = new Date().toLocaleDateString('es-ES', { 
      year: 'numeric', month: 'long', day: 'numeric' 
    });

    let strengthsHtml = '';
    if (breakdown?.strengths && breakdown.strengths.length > 0) {
      strengthsHtml = `
        <h3 style="color: #0A3161; font-size: 18px; margin-bottom: 10px;">Fortalezas actuales</h3>
        <ul style="padding-left: 20px; line-height: 1.6; color: #4A5568;">
          ${breakdown.strengths.map(s => `<li style="margin-bottom: 8px;">${s}</li>`).join('')}
        </ul>
      `;
    }

    let risksHtml = '';
    if (breakdown?.weaknesses && breakdown.weaknesses.length > 0) {
      risksHtml = `
        <h3 style="color: #B31942; font-size: 18px; margin-bottom: 10px;">Áreas de riesgo</h3>
        <ul style="padding-left: 20px; line-height: 1.6; color: #B31942;">
          ${breakdown.weaknesses.map(w => `<li style="margin-bottom: 8px;">${w}</li>`).join('')}
        </ul>
      `;
    }
    
    let recommendationsHtml = '';
    if (breakdown?.recommendations && breakdown.recommendations.length > 0) {
      recommendationsHtml = `
        <div style="margin-top: 30px; background-color: #0A3161; color: white; padding: 30px; border-radius: 12px;">
          <h3 style="color: white; margin-top: 0; font-size: 20px;">Plan de mejora estratégico</h3>
          <ol style="padding-left: 20px; line-height: 1.6;">
            ${breakdown.recommendations.map(r => `<li style="margin-bottom: 10px;">${r}</li>`).join('')}
          </ol>
        </div>
      `;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333; margin: 0; padding: 40px; }
            .header { border-bottom: 3px solid #0A3161; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: baseline; }
            .title { color: #0A3161; margin: 0; font-size: 28px; font-weight: 900; letter-spacing: -0.5px; }
            .date { color: #718096; font-size: 14px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;}
            .message { font-size: 16px; line-height: 1.6; color: #4A5568; margin-bottom: 30px; background: #F8FAFC; padding: 20px; border-radius: 8px; border-left: 4px solid #0A3161; font-weight: 500;}
            .score-box { background-color: #F4F6F8; border: 1px solid #E2E8F0; border-radius: 16px; padding: 40px; text-align: center; margin-bottom: 40px; }
            .score-label { text-transform: uppercase; letter-spacing: 2px; color: #718096; font-size: 12px; margin: 0; font-weight: bold; }
            .score-value { font-size: 80px; font-weight: 900; color: #0A3161; margin: 15px 0; letter-spacing: -2px;}
            .risk-value { font-size: 24px; font-weight: 900; color: #B31942; margin: 0; }
            .section { margin-bottom: 30px; }
            .grid { display: flex; gap: 40px; margin-top: 20px; }
            .col { flex: 1; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 class="title">Reporte Consular VisaScore</h1>
            <span class="date">${fecha}</span>
          </div>

          <div class="message">
            Hemos evaluado tu perfil con criterios utilizados en procesos consulares reales e inteligencia algorítmica.
          </div>

          <div class="score-box">
            <p class="score-label">Puntaje Estimado VisaScore</p>
            <div class="score-value">${score}</div>
            <p class="score-label" style="margin-top: 20px;">Nivel de Riesgo y Probabilidad</p>
            <div class="risk-value">${level}</div>
          </div>

          <div class="section">
            <h2 style="color: #0A3161; border-bottom: 1px solid #E2E8F0; padding-bottom: 10px; font-size: 22px;">Resumen del análisis</h2>
            <div class="grid">
              <div class="col">${strengthsHtml}</div>
              <div class="col">${risksHtml}</div>
            </div>
            ${recommendationsHtml}
          </div>
          
          <div style="margin-top: 50px; text-align: center; font-size: 12px; color: #A0AEC0; border-top: 1px solid #E2E8F0; padding-top: 20px;">
            Este reporte oficial es generado de forma automatizada por el motor de VisaScore.<br/>
            ID de Análisis: ${testId}
          </div>
        </body>
      </html>
    `;

    try {
      console.log("HTML preview:", htmlContent.slice(0, 500));

      const browser = await puppeteer.launch({
        headless: "new" as any,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
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
      
      return Buffer.from(pdfBuffer);
    } catch (err) {
      const error = err as any;
      console.error("PDF generation error:", error?.message);
      console.error("STACK:", error?.stack);
      throw new InternalServerErrorException('Error generating PDF');
    }
  }
}