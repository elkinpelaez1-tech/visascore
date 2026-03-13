import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class MailService {
  private resend: Resend;

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder');
  }

  async sendResultEmail(email: string, testId: string, score: number, pdfBuffer?: Uint8Array | Buffer) {
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
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }
}
