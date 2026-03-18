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

  // =============================
  // CREATE PAYMENT
  // =============================
  async createPayment(testId: string) {
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

    if (!signature || !this.isValidWompiSignature(body, signature)) {
      this.logger.warn('Firma inválida');
      throw new BadRequestException('Firma inválida');
    }

    if (body.event !== 'transaction.updated') {
      return { received: true, ignored: true };
    }

    const transaction = body.data?.transaction;
    if (!transaction) {
      throw new BadRequestException('Transacción inválida');
    }

    const testId = transaction.reference;
    const status = transaction.status;

    // 🔥 IMPORTANTE: guardar SIEMPRE la transacción
    const { data: existing } = await this.supabase
      .from('payments')
      .select('id')
      .eq('wompi_transaction_id', transaction.id)
      .single();

    if (existing) {
      this.logger.log(`Transacción ya registrada: ${transaction.id}`);
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

    if (status === 'APPROVED') {
      this.logger.log(`Pago aprobado para test ${testId}`);

      await this.supabase
        .from('visa_tests')
        .update({ status: 'paid' })
        .eq('id', testId);

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
    this.logger.log(`Buscando transactionId: ${transactionId}`);

    const { data, error } = await this.supabase
      .from('payments')
      .select('test_id')
      .eq('wompi_transaction_id', transactionId)
      .maybeSingle(); // 🔥 CAMBIO CLAVE

    if (!data) {
      this.logger.warn(`Aún no existe en BD: ${transactionId}`);
      return { testId: null }; // 🔥 NO lanzar error
    }

    this.logger.log(`Encontrado → testId: ${data.test_id}`);

    return {
      testId: data.test_id
    };
  }

  // =============================
  // DEBUG
  // =============================
  async debugTransaction(transactionId: string) {
    const { data, error } = await this.supabase
      .from('payments')
      .select('*')
      .eq('wompi_transaction_id', transactionId)
      .maybeSingle();

    return {
      found: !!data,
      data: data || null,
      error: error || null
    };
  }

  // =============================
  // HELPER
  // =============================
  async findByTransactionId(transactionId: string) {
    const { data } = await this.supabase
      .from('payments')
      .select('*')
      .eq('wompi_transaction_id', transactionId)
      .maybeSingle();

    return data;
  }
}