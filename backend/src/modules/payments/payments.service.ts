import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';
import { MailService } from '../mail/mail.service';
import { ReportsService } from '../reports/reports.service';
import * as crypto from 'crypto-js';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);
  private supabase: any;

  constructor(
    private mailService: MailService,
    private reportsService: ReportsService
  ) {
    this.supabase = createClient(
      process.env.SUPABASE_URL || 'https://placeholder.supabase.co',
      process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder'
    );
  }

  async createPayment(testId: string) {
    this.logger.log(`Initiating payment for test ${testId}`);
    return {
       paymentUrl: `${process.env.CHECKOUT_UI_URL}${testId}`
    };
  }

  async handleWebhook(body: any) {
    this.logger.log('Webhook Wompi recibido, procesando payload');
    
    // Extraer firma de la estructura original de Wompi
    const signature = body.signature?.checksum;
    
    // 1. Validate signature
    if (!signature || !this.isValidWompiSignature(body, signature)) {
      this.logger.warn('Firma inválida: el webhook no pudo ser verificado');
      throw new BadRequestException('Firma inválida del evento Wompi');
    }

    // 2. Validate Event
    if (body.event !== 'transaction.updated') {
      this.logger.log(`Evento ignorado: esperado transaction.updated pero se recibió ${body.event}`);
      return { received: true, ignored: true };
    }

    const transaction = body.data?.transaction;
    if (!transaction) {
       throw new BadRequestException('Payload incompleto: falta transacción');
    }

    const testId = transaction.reference;
    const status = transaction.status;

    if (status === 'APPROVED') {
      this.logger.log(`Pago aprobado para el test ID: ${testId}`);

      // 2. Idempotency Check: check if already processed
      const { data: existingPayment } = await this.supabase
        .from('payments')
        .select('id')
        .eq('wompi_transaction_id', transaction.id)
        .single();

      if (existingPayment) {
        this.logger.log(`Payment ${transaction.id} already processed. Skipping.`);
        return { received: true, deduplicated: true };
      }

      // 3. Unlock test
      await this.supabase
        .from('visa_tests')
        .update({ status: 'paid' })
        .eq('id', testId);

      // 4. Log payment
      await this.supabase.from('payments').insert({
        test_id: testId,
        wompi_transaction_id: transaction.id,
        amount: transaction.amount_in_cents / 100,
        status: 'approved',
        payment_method: transaction.payment_method_type,
        raw_webhook_data: body
      });

      // 5. Fetch test details for email (including approval probability from metadata)
      const { data: test } = await this.supabase
        .from('visa_tests')
        .select('*, profiles(email)')
        .eq('id', testId)
        .single();
      
      if (test && test.profiles?.email) {
        this.logger.log(`Triggering report generation and email for ${test.profiles.email}`);
        
        // Generate PDF
        const pdfBuffer = await this.reportsService.generatePdf(testId);
        
        // Send Email
        await this.mailService.sendResultEmail(
          test.profiles.email,
          testId,
          test.overall_score,
          pdfBuffer
        );
      }
    } else if (status === 'DECLINED' || status === 'ERROR' || status === 'VOIDED') {
      this.logger.log(`Pago rechazado o fallido para el test ID: ${testId} con estado: ${status}`);
    } else {
      this.logger.log(`Estado de pago ignorado para el test ID: ${testId} - Estado: ${status}`);
    }

    return { received: true };
  }

  private isValidWompiSignature(body: any, signature: string): boolean {
    const transaction = body.data?.transaction;
    const timestamp = body.timestamp;
    const secret = process.env.WOMPI_WEBHOOK_SECRET;
    
    if (!transaction || !timestamp || !secret) {
      return false;
    }

    // Wompi uses: sha256(transaction.id + transaction.status + transaction.amount_in_cents + timestamp + secret)
    const rawString = `${transaction.id}${transaction.status}${transaction.amount_in_cents}${timestamp}${secret}`;
    const hash = crypto.SHA256(rawString).toString();
    
    return hash === signature;
  }
}
