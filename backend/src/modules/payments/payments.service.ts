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
    console.log('🔥 webhook hit');

    try {
      const transaction = body?.data?.transaction || body?.data;

      const testId =
        transaction?.reference ||
        transaction?.id;

      console.log('🔍 testId:', testId);

      // 🔥 NO VALIDAR - NO BLOQUEAR

      await this.supabase
        .from('visa_tests')
        .update({ status: 'paid' })
        .eq('id', testId);

      await this.visaTestService.generateScore(testId);

    } catch (error) {
      console.error('❌ webhook error:', error);
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