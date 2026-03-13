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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailService = void 0;
const common_1 = require("@nestjs/common");
const resend_1 = require("resend");
let MailService = class MailService {
    resend;
    constructor() {
        this.resend = new resend_1.Resend(process.env.RESEND_API_KEY || 're_placeholder');
    }
    async sendResultEmail(email, testId, score, pdfBuffer) {
        try {
            await this.resend.emails.send({
                from: 'VisaScore <noreply@visascore.co>',
                to: email,
                subject: '¡Tu VisaScore está listo!',
                html: `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>¡Tu análisis migratorio ya está disponible!</h2>
            <p>Tu VisaScore calculado es: <strong>${score} / 1000</strong></p>
            <p>Puedes ver el análisis detallado y descargar tu reporte en el siguiente enlace:</p>
            <a href="https://visascore.co/dashboard?id=${testId}" 
               style="background: #003366; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; display: inline-block; margin: 20px 0;">
               Ver mi Dashboard
            </a>
            <p>Adjunto encontrarás tu reporte profesional en PDF.</p>
            <br/>
            <p>Atentamente,<br/>El equipo de VisaScore</p>
          </div>
        `,
                attachments: pdfBuffer ? [
                    {
                        filename: `VisaScore_Report_${testId}.pdf`,
                        content: Buffer.from(pdfBuffer),
                    }
                ] : []
            });
            console.log(`Email sent to ${email}`);
        }
        catch (error) {
            console.error('Error sending email:', error);
        }
    }
};
exports.MailService = MailService;
exports.MailService = MailService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], MailService);
//# sourceMappingURL=mail.service.js.map