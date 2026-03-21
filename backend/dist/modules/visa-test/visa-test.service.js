"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VisaTestService = void 0;
const common_1 = require("@nestjs/common");
const scoring_service_1 = require("../scoring/scoring.service");
const supabase_js_1 = require("@supabase/supabase-js");
const resend_1 = require("resend");
const puppeteer_core_1 = __importDefault(require("puppeteer-core"));
const chromium_1 = __importDefault(require("@sparticuz/chromium"));
let VisaTestService = class VisaTestService {
    scoringService;
    supabase;
    resend;
    constructor(scoringService) {
        this.scoringService = scoringService;
        this.supabase = (0, supabase_js_1.createClient)(process.env.SUPABASE_URL || 'https://placeholder.supabase.co', process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder');
        this.resend = new resend_1.Resend(process.env.RESEND_API_KEY || 're_placeholder');
    }
    async submitTest(profile, userId = '00000000-0000-0000-0000-000000000000') {
        const result = this.scoringService.calculate(profile);
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
        if (testErr)
            throw new Error(`Test creation failed: ${testErr.message}`);
        await this.supabase.from('ds160_profiles').insert({
            test_id: test.id,
            ...profile
        });
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
    async unlockTest(testId) {
        await this.supabase
            .from('visa_tests')
            .update({ status: 'paid' })
            .eq('id', testId);
        return { success: true, status: 'paid' };
    }
    async getStatus(testId) {
        const { data, error } = await this.supabase
            .from('visa_tests')
            .select('status')
            .eq('id', testId)
            .single();
        if (error || !data)
            throw new common_1.NotFoundException('Test not found');
        return data;
    }
    async getResult(testId, currentUserId) {
        console.log('[DEBUG] getResult TEST ID:', testId);
        console.log('[DEBUG] SUPABASE_URL:', process.env.SUPABASE_URL);
        const { data: testDumb, error: errorDumb } = await this.supabase
            .from('visa_tests')
            .select('*')
            .limit(1);
        console.log('[DEBUG] SIMPLE QUERY RESULT:', testDumb, 'ERROR:', errorDumb);
        const { data: test, error } = await this.supabase
            .from('visa_tests')
            .select('*')
            .eq('id', testId)
            .maybeSingle();
        if (error || !test)
            throw new common_1.NotFoundException('Test not found');
        if (currentUserId &&
            test.user_id !== currentUserId &&
            test.user_id !== '00000000-0000-0000-0000-000000000000') {
            throw new common_1.ForbiddenException('No tienes permiso para ver este resultado.');
        }
        if (test.status !== 'paid') {
            throw new common_1.ForbiddenException('Resultado bloqueado. Pago requerido.');
        }
        const { data: breakdown } = await this.supabase
            .from('visa_score_breakdown')
            .select('*')
            .eq('test_id', testId)
            .maybeSingle();
        return {
            overall_score: test.overall_score,
            approval_probability: test.metadata?.approval_probability || 0,
            category: test.overall_score > 700
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
    async sendEmail(testId, email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            throw new common_1.BadRequestException('Formato de correo inválido');
        }
        const { data: test, error } = await this.supabase
            .from('visa_tests')
            .select('overall_score, metadata')
            .eq('id', testId)
            .maybeSingle();
        if (error || !test) {
            throw new common_1.NotFoundException('Test no encontrado');
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
        }
        catch (err) {
            console.error('Error enviando email con Resend:', err);
            throw new common_1.InternalServerErrorException('Error interno al enviar el reporte');
        }
    }
    async generateReportPdf(testId) {
        const { data: test, error } = await this.supabase
            .from('visa_tests')
            .select('overall_score, metadata')
            .eq('id', testId)
            .maybeSingle();
        if (error || !test) {
            throw new common_1.NotFoundException('Test no encontrado');
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
      <html>
        <body>
          <h1>VisaScore Report</h1>
          <p>Test ID: ${testId}</p>
          <p>Score: ${score}</p>
          <p>Status: ${test.status || 'paid'}</p>
        </body>
      </html>
    `;
        try {
            console.log("HTML preview:", htmlContent.slice(0, 500));
            console.log("Launching Puppeteer...");
            const execPath = await chromium_1.default.executablePath();
            console.log("Chromium executablePath:", execPath);
            if (!execPath) {
                throw new Error("Chromium executable path not found");
            }
            const browser = await puppeteer_core_1.default.launch({
                args: chromium_1.default.args,
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
                throw new common_1.InternalServerErrorException('PDF buffer is empty');
            }
            return Buffer.from(pdfBuffer);
        }
        catch (err) {
            const error = err;
            console.error("PDF generation error:", error?.message);
            console.error("STACK:", error?.stack);
            throw new common_1.InternalServerErrorException('Error generating PDF');
        }
    }
};
exports.VisaTestService = VisaTestService;
exports.VisaTestService = VisaTestService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [scoring_service_1.ScoringService])
], VisaTestService);
//# sourceMappingURL=visa-test.service.js.map