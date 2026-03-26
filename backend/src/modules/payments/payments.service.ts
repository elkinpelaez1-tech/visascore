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
    console.log('📦 webhook body completo:', JSON.stringify(body, null, 2));

    try {
      const transaction = body?.data?.transaction || body?.data;
      console.log('🔎 transaction object:', JSON.stringify(transaction, null, 2));

      const reference = transaction?.reference;
      const wompiTxId = transaction?.id;
      const status = transaction?.status;

      console.log('🔍 reference:', reference);
      console.log('🔍 wompiTxId:', wompiTxId);
      console.log('🔍 status:', status);

      // Solo procesar pagos aprobados
      if (status !== 'APPROVED') {
        console.log(`⏭️ Ignorando webhook con status: ${status}`);
        return { received: true };
      }

      // reference debe ser el testId (UUID). Si no viene, no podemos hacer nada.
      const testId = reference?.trim();
      if (!testId) {
        console.error('❌ No se encontró reference en el webhook. wompiTxId:', wompiTxId);
        return { received: true };
      }

      console.log('🔍 testId a actualizar:', testId);

      const { data: updateData, error } = await this.supabase
        .from('visa_tests')
        .update({ status: 'paid' })
        .eq('id', testId)
        .select();

      console.log('🧾 resultado update:', updateData);
      console.log('❌ error update:', error);

      // Registrar transacción en tabla payments para que Phase 1 (resolve) funcione
      await this.supabase.from('payments').upsert({
        wompi_transaction_id: transaction?.id,
        test_id: testId,
        status: transaction?.status || 'APPROVED'
      }, { onConflict: 'wompi_transaction_id' });

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
  // VERIFY & UNLOCK (fallback si el webhook no actualizó el status)
  // =============================
  async verifyAndUnlock(testId: string): Promise<{ unlocked: boolean; message: string }> {
    try {
      // Primero verificar que el test exista y esté pendiente
      const { data: test } = await this.supabase
        .from('visa_tests')
        .select('id, status')
        .eq('id', testId)
        .maybeSingle();

      if (!test) {
        return { unlocked: false, message: 'Test no encontrado' };
      }

      // Si ya está pagado, no hacer nada
      if (test.status === 'paid') {
        return { unlocked: true, message: 'Ya estaba desbloqueado' };
      }

      // Consultar Wompi para verificar si existe una transacción APPROVED con esta reference
      const privateKey = process.env.WOMPI_PRIVATE_KEY;
      const wompiBase = 'https://production.wompi.co/v1';

      const response = await fetch(
        `${wompiBase}/transactions?reference=${testId}`,
        { headers: { Authorization: `Bearer ${privateKey}` } }
      );

      if (!response.ok) {
        console.error('❌ Error consultando Wompi:', response.status);
        return { unlocked: false, message: 'Error consultando Wompi' };
      }

      const wompiData = await response.json();
      const transactions: any[] = wompiData?.data ?? [];
      console.log(`🔎 Wompi transactions para ${testId}:`, JSON.stringify(transactions.map(t => ({ id: t.id, status: t.status, reference: t.reference }))));

      const approved = transactions.find(t => t.status === 'APPROVED');

      if (!approved) {
        return { unlocked: false, message: 'No hay transacción APPROVED para este testId' };
      }

      // Hay pago aprobado → desbloquear
      await this.supabase
        .from('visa_tests')
        .update({ status: 'paid' })
        .eq('id', testId);

      console.log(`✅ Test ${testId} desbloqueado via verificación Wompi. TxId: ${approved.id}`);
      return { unlocked: true, message: 'Desbloqueado correctamente' };

    } catch (err: any) {
      console.error('❌ verifyAndUnlock error:', err.message);
      return { unlocked: false, message: 'Error interno' };
    }
  }

  // =============================
  // RESOLVE BY WOMPI TRANSACTION ID
  // =============================
  async resolveByWompiId(wompiId: string): Promise<{ testId: string | null }> {
    try {
      const privateKey = process.env.WOMPI_PRIVATE_KEY;
      if (!privateKey) {
        this.logger.error('WOMPI_PRIVATE_KEY no configurado');
        return { testId: null };
      }

      // 1. Obtener la transacción por ID directo (GET /transactions/{id})
      const res = await fetch(
        `https://production.wompi.co/v1/transactions/${wompiId}`,
        { headers: { Authorization: `Bearer ${privateKey}` } }
      );

      if (!res.ok) {
        this.logger.error(`Error consultando Wompi transaction ${wompiId}: ${res.status}`);
        return { testId: null };
      }

      const data = await res.json();
      const transaction = data?.data;
      const reference = transaction?.reference ?? null;
      const status = transaction?.status;

      this.logger.log(`resolveByWompiId ${wompiId} → reference: ${reference}, status: ${status}`);

      if (!reference) {
        this.logger.error(`No se encontró reference en transacción ${wompiId}`);
        return { testId: null };
      }

      // 2. Si la transacción está APPROVED, marcar el test como paid
      if (status === 'APPROVED') {
        const { error } = await this.supabase
          .from('visa_tests')
          .update({ status: 'paid' })
          .eq('id', reference)
          .neq('status', 'paid'); // evitar update innecesario si ya está paid

        if (error) {
          this.logger.error(`Error actualizando status a paid para ${reference}: ${error.message}`);
        } else {
          this.logger.log(`✅ Test ${reference} marcado como paid via wompiId ${wompiId}`);
          // Disparar generación de score en background (no bloquea la respuesta)
          this.visaTestService.generateScore(reference).catch(err =>
            this.logger.error(`Error en generateScore para ${reference}: ${err.message}`)
          );
        }
      }

      return { testId: reference };
    } catch (err: any) {
      this.logger.error(`resolveByWompiId error: ${err.message}`);
      return { testId: null };
    }
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