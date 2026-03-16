import { Controller, Post, Param, Body, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { MailService } from './mail.service';
import { ReportsService } from '../reports/reports.service';
import { createClient } from '@supabase/supabase-js';

@Controller('mail')
export class MailController {
  private supabase: any;

  constructor(
    private readonly mailService: MailService,
    private readonly reportsService: ReportsService
  ) {
    this.supabase = createClient(
      process.env.SUPABASE_URL || 'https://placeholder.supabase.co',
      process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder'
    );
  }

  @Post('send/:id')
  async sendReportEmail(@Param('id') id: string, @Body('email') email: string) {
    if (!email) {
      throw new InternalServerErrorException('Se requiere una dirección de correo (email)');
    }

    // Obtener información del test (para el puntaje)
    const { data: test, error } = await this.supabase
      .from('visa_tests')
      .select('overall_score')
      .eq('id', id)
      .single();

    if (error || !test) {
      throw new NotFoundException('Visa test no encontrado');
    }

    try {
      // Generar PDF
      const pdfBuffer = await this.reportsService.generatePdf(id);

      // Enviar el correo
      await this.mailService.sendResultEmail(
        email,
        id,
        test.overall_score,
        pdfBuffer
      );

      return { success: true, message: 'Correo enviado correctamente' };
    } catch (err) {
      console.error('Error enviando correo manualmente:', err);
      throw new InternalServerErrorException('No se pudo enviar el correo de resultados');
    }
  }
}
