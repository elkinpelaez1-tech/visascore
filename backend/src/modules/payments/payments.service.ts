import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';
import { MailService } from '../mail/mail.service';
import { ReportsService } from '../reports/reports.service';
import { VisaTestService } from '../visa-test/visa-test.service';
import * as crypto from 'crypto-js';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);
  private supabase: any;

  constructor(
    private mailService: MailService,
    private reportsService: ReportsService,
    private visaTestService: VisaTestService
  ) {
    this.supabase = createClient(
      process.env.SUPABASE_URL || 'https://placeholder.supabase.co',
      process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder'
    );
  }

  // =============================
  // CREATE PAYMENT
  // =============================
  async createPayment(testId: string) {
    // Verificar si el test ya existe
    const { data: testExists, error } = await this.supabase
      .from('visa_tests')
      .select('id')
      .eq('id', testId)
      .single();

    if (error || !testExists) {
      throw new Error('❌ test_id does not exist');
    }

    const baseUrl = process.env.CHECKOUT_UI_URL;
    const frontendUrl = process.env.FRONTEND_URL || "https://visascore.info";
    const redirectUrl = encodeURIComponent(`${frontendUrl}/gracias?testId=${testId}`);

    return {
      paymentUrl: `${baseUrl}?reference=${testId}&redirect-url=${redirectUrl}`
    };
  }

  // =============================
  // WEBHOOK WOMPI
  // =============================
  async handleWebhook(body: any) {
    this.logger.log('Webhook Wompi recibido');

    const signature = body.signature?.checksum;

    // if (!signature || !this.isValidWompiSignature(body, signature)) {
    //   this.logger.warn('Firma inválida');
    //   throw new BadRequestException('Firma inválida');
    // }

    try {
      console.log('📩 webhook payload:', JSON.stringify(body, null, 2));

      const transaction = body?.data?.transaction || body?.data;

      const testId =
        transaction?.reference ||
        transaction?.id ||
        body?.data?.reference;

      console.log('🔍 testId extraído:', testId);

      if (!testId) {
        console.error('❌ no testId en webhook');
        return { received: true };
      }
      
      const status = transaction?.status || 'UNKNOWN';

      // VALIDACIÓN PERMISIVA:
      const { data } = await this.supabase
        .from('visa_tests')
        .select('id')
        .eq('id', testId)
        .maybeSingle();

      if (!data) {
        console.warn('⚠️ testId no encontrado, pero continuando:', testId);
      }
      
      console.log('🔍 testId encontrado:', data);

      // 🔥 IMPORTANTE: guardar SIEMPRE la transacción
      const { data: existing } = await this.supabase
        .from('payments')
        .select('id')
        .eq('wompi_transaction_id', transaction.id)
        .single();

      if (existing) {
        this.logger.log(`Transacción ya registrada: ${transaction.id}. Asegurando que visa_tests refleje status 'paid' si cambió a APPROVED.`);
        if (transaction.status === 'APPROVED') {
          const testIdToUpdate = transaction.reference;
          await this.supabase
            .from('visa_tests')
            .update({ status: 'paid' })
            .eq('id', testIdToUpdate);
            
          // 🔥 IMPORTANTE: GENERAR SCORE INMEDIATAMENTE
          await this.visaTestService.generateScore(testIdToUpdate);
        }
        return { received: true };
      }

      await this.supabase.from('payments').insert({
        test_id: testId,
        wompi_transaction_id: transaction.id,
        amount: transaction.amount_in_cents / 100,
        status: status.toLowerCase(),
        payment_method: transaction.payment_method_type,
        raw_webhook_data: body
      });

      if (transaction.status === 'APPROVED') {
        this.logger.log(`Pago aprobado para test ${testId}`);

        const currentTestId = transaction.reference;
        await this.supabase
          .from('visa_tests')
          .update({ status: 'paid' })
          .eq('id', currentTestId);
          
        // 🔥 IMPORTANTE: GENERAR SCORE INMEDIATAMENTE
        await this.visaTestService.generateScore(currentTestId);

        const { data: test } = await this.supabase
          .from('visa_tests')
          .select('*, profiles(email)')
          .eq('id', testId)
          .single();

        if (test?.profiles?.email) {
          const pdfBuffer = await this.reportsService.generatePdf(testId);

          await this.mailService.sendResultEmail(
            test.profiles.email,
            testId,
            test.overall_score,
            pdfBuffer
          );
        }
      }

    } catch (error) {
      console.error('❌ webhook error:', error);
    }

    // 🔥 SIEMPRE responder OK a Wompi
    return { received: true };
  }

  // =============================
  // VALIDAR FIRMA
  // =============================
  private isValidWompiSignature(body: any, signature: string): boolean {
    const transaction = body.data?.transaction;
    const timestamp = body.timestamp;
    const secret = process.env.WOMPI_WEBHOOK_SECRET;

    if (!transaction || !timestamp || !secret) return false;

    const raw = `${transaction.id}${transaction.status}${transaction.amount_in_cents}${timestamp}${secret}`;
    const hash = crypto.SHA256(raw).toString();

    return hash === signature;
  }

  // =============================
  // 🔥 RESOLVE (EL CLAVE)
  // =============================
  async resolveTransaction(transactionId: string) {
    return { message: 'ok', transactionId };
  }

  // =============================
  // DEBUG
  // =============================
  async debugTransaction(transactionId: string) {
    return { message: 'debug ok', transactionId };
  }
  // =============================
  // HELPER
  // =============================
  async findByTransactionId(transactionId: string) {
    const { data, error } = await this.supabase
      .from('payments')
      .select('test_id')
      .eq('wompi_transaction_id', transactionId)
      .maybeSingle();

    if (error) {
      this.logger.error(`Error en findByTransactionId: ${error.message}`);
      return null;
    }

    if (!data || !data.test_id) {
      return null;
    }

    const testExists = await this.supabase
      .from('visa_tests')
      .select('id')
      .eq('id', data.test_id)
      .single();

    if (!testExists.data) {
      return null; // 👈 CLAVE
    }

    return data;
  }
}