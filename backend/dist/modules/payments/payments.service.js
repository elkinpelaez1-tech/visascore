"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var PaymentsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const supabase_js_1 = require("@supabase/supabase-js");
const mail_service_1 = require("../mail/mail.service");
const reports_service_1 = require("../reports/reports.service");
const visa_test_service_1 = require("../visa-test/visa-test.service");
const scoring_service_1 = require("../scoring/scoring.service");
const crypto = __importStar(require("crypto-js"));
let PaymentsService = PaymentsService_1 = class PaymentsService {
    mailService;
    reportsService;
    visaTestService;
    scoringService;
    logger = new common_1.Logger(PaymentsService_1.name);
    supabase;
    constructor(mailService, reportsService, visaTestService, scoringService) {
        this.mailService = mailService;
        this.reportsService = reportsService;
        this.visaTestService = visaTestService;
        this.scoringService = scoringService;
        this.supabase = (0, supabase_js_1.createClient)(process.env.SUPABASE_URL || 'https://placeholder.supabase.co', process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder');
    }
    async createPayment(testId) {
        const { data: testExists, error } = await this.supabase
            .from('visa_tests')
            .select('id')
            .eq('id', testId)
            .single();
        if (error || !testExists) {
            throw new Error('❌ test_id does not exist');
        }
        const cleanTestId = (testId || "").toString().trim();
        console.log('🧾 testId en payment:', cleanTestId);
        if (!cleanTestId || cleanTestId === "undefined") {
            this.logger.error(`❌ Intento de crear pago con testId inválido: ${cleanTestId}`);
            throw new Error('testId inválido');
        }
        const publicKey = (process.env.WOMPI_PUBLIC_KEY || "").trim();
        const frontendUrl = (process.env.FRONTEND_URL || "https://visascore.info").trim();
        const redirectUrl = `${frontendUrl}/gracias?testId=${cleanTestId}`;
        console.log("🔁 Redirect final:", redirectUrl);
        const encodedRedirectUrl = encodeURIComponent(redirectUrl);
        const integritySecret = (process.env.WOMPI_INTEGRITY_SECRET || "").trim();
        const amountInCents = "5000000";
        const currency = "COP";
        const rawIntegrity = `${cleanTestId}${amountInCents}${currency}${integritySecret}`;
        const integrityHash = crypto.SHA256(rawIntegrity).toString();
        const paymentUrl = `https://checkout.wompi.co/p/?public-key=${publicKey}&currency=${currency}&amount-in-cents=${amountInCents}&reference=${cleanTestId}&redirect_url=${encodedRedirectUrl}&redirect-url=${encodedRedirectUrl}&signature:integrity=${integrityHash}`;
        this.logger.log(`💳 createPayment → publicKey present: ${!!publicKey}, testId: ${cleanTestId}`);
        this.logger.log(`🔗 Wompi checkout URL: ${paymentUrl}`);
        try {
            const { error: paymentError } = await this.supabase
                .from('payments')
                .insert({
                test_id: cleanTestId,
                amount: 50000,
                status: 'PENDING'
            });
            if (paymentError) {
                this.logger.error('❌ Error creando registro de pago PENDING:', paymentError.message);
            }
            else {
                this.logger.log(`✅ Registro de pago PENDING creado para testId: ${cleanTestId}`);
            }
        }
        catch (err) {
            this.logger.error('❌ Error excepcional creando pago PENDING:', err);
        }
        return { checkoutUrl: paymentUrl };
    }
    async handleWebhook(body) {
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
            if (status !== 'APPROVED') {
                console.log(`⏭️ Ignorando webhook con status: ${status}`);
                return { received: true };
            }
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
            try {
                const { data: visaTest } = await this.supabase
                    .from('visa_tests')
                    .select('id, overall_score')
                    .eq('id', testId)
                    .single();
                if (visaTest && !visaTest.overall_score) {
                    console.log(`⚠️ Webhook detectó test ${testId} "paid" SIN overall_score. Recalculando...`);
                    const { data: profile } = await this.supabase
                        .from('ds160_profiles')
                        .select('*')
                        .eq('test_id', testId)
                        .single();
                    if (profile) {
                        const score = this.scoringService.calculate(profile);
                        await this.supabase
                            .from('visa_tests')
                            .update({ overall_score: score.totalScore })
                            .eq('id', testId);
                        console.log(`✅ overall_score recalculado y guardado desde el webhook: ${score.totalScore}`);
                    }
                }
            }
            catch (scoreCheckErr) {
                console.error('❌ Error forzando cálculo de overall_score en el webhook:', scoreCheckErr);
            }
            const { error: paymentUpsertError } = await this.supabase
                .from('payments')
                .update({
                wompi_transaction_id: wompiTxId,
                status: status,
                amount: transaction?.amount_in_cents ? transaction.amount_in_cents / 100 : null,
                payment_method: transaction?.payment_method_type || null,
                raw_webhook_data: body
            })
                .eq('test_id', testId);
            if (paymentUpsertError) {
                console.error('❌ Error guardando datos en tabla payments:', paymentUpsertError.message);
            }
            else {
                console.log(`✅ Tabla payments actualizada exitosamente para testId: ${testId}`);
            }
            await this.visaTestService.generateScore(testId);
        }
        catch (error) {
            console.error('❌ webhook error:', error);
        }
        return { received: true };
    }
    isValidWompiSignature(body, signature) {
        const transaction = body.data?.transaction;
        const timestamp = body.timestamp;
        const secret = process.env.WOMPI_WEBHOOK_SECRET;
        if (!transaction || !timestamp || !secret)
            return false;
        const raw = `${transaction.id}${transaction.status}${transaction.amount_in_cents}${timestamp}${secret}`;
        const hash = crypto.SHA256(raw).toString();
        return hash === signature;
    }
    async resolveTransaction(transactionId) {
        return { message: 'ok', transactionId };
    }
    async debugTransaction(transactionId) {
        return { message: 'debug ok', transactionId };
    }
    async verifyAndUnlock(testId) {
        try {
            const { data: test } = await this.supabase
                .from('visa_tests')
                .select('id, status')
                .eq('id', testId)
                .maybeSingle();
            if (!test) {
                return { unlocked: false, message: 'Test no encontrado' };
            }
            if (test.status === 'paid') {
                return { unlocked: true, message: 'Ya estaba desbloqueado' };
            }
            const privateKey = process.env.WOMPI_PRIVATE_KEY;
            const wompiBase = 'https://production.wompi.co/v1';
            const response = await fetch(`${wompiBase}/transactions?reference=${testId}`, { headers: { Authorization: `Bearer ${privateKey}` } });
            if (!response.ok) {
                console.error('❌ Error consultando Wompi:', response.status);
                return { unlocked: false, message: 'Error consultando Wompi' };
            }
            const wompiData = await response.json();
            const transactions = wompiData?.data ?? [];
            console.log(`🔎 Wompi transactions para ${testId}:`, JSON.stringify(transactions.map(t => ({ id: t.id, status: t.status, reference: t.reference }))));
            const approved = transactions.find(t => t.status === 'APPROVED');
            if (!approved) {
                return { unlocked: false, message: 'No hay transacción APPROVED para este testId' };
            }
            await this.supabase
                .from('visa_tests')
                .update({ status: 'paid' })
                .eq('id', testId);
            console.log(`✅ Test ${testId} desbloqueado via verificación Wompi. TxId: ${approved.id}`);
            return { unlocked: true, message: 'Desbloqueado correctamente' };
        }
        catch (err) {
            console.error('❌ verifyAndUnlock error:', err.message);
            return { unlocked: false, message: 'Error interno' };
        }
    }
    async resolveByWompiId(wompiId, frontendTestId) {
        try {
            const privateKey = process.env.WOMPI_PRIVATE_KEY;
            if (!privateKey) {
                this.logger.error('WOMPI_PRIVATE_KEY no configurado');
                return { testId: null };
            }
            const res = await fetch(`https://production.wompi.co/v1/transactions/${wompiId}`, { headers: { Authorization: `Bearer ${privateKey}` } });
            if (!res.ok) {
                this.logger.error(`Error consultando Wompi transaction ${wompiId}: ${res.status}`);
                return { testId: null };
            }
            const data = await res.json();
            const transaction = data?.data;
            this.logger.log(`Wompi Transaction Payload Completo: ${JSON.stringify(transaction)}`);
            const reference = transaction?.reference ?? null;
            const status = transaction?.status;
            let finalTestId = reference;
            if (!finalTestId && frontendTestId) {
                finalTestId = frontendTestId;
                this.logger.warn(`Reference no encontrada en Wompi para ${wompiId}, usando testId del frontend: ${frontendTestId}`);
            }
            const { data: existingPayment } = await this.supabase
                .from('payments')
                .select('test_id')
                .eq('wompi_transaction_id', wompiId)
                .maybeSingle();
            if (existingPayment?.test_id) {
                finalTestId = existingPayment.test_id;
                this.logger.log(`Usando testId mapeado desde la base de datos: ${finalTestId}`);
            }
            if (!finalTestId) {
                this.logger.error(`No hay forma de asociar el wompiId ${wompiId} a un testId`);
                return { testId: null };
            }
            this.logger.log(`resolveByWompiId ${wompiId} → finalTestId: ${finalTestId}, status: ${status}`);
            if (status === 'APPROVED') {
                const { error } = await this.supabase
                    .from('visa_tests')
                    .update({ status: 'paid' })
                    .eq('id', finalTestId)
                    .neq('status', 'paid');
                if (error) {
                    this.logger.error(`Error actualizando status a paid para ${finalTestId}: ${error.message}`);
                }
                else {
                    this.logger.log(`✅ Test ${finalTestId} marcado como paid via wompiId ${wompiId}`);
                    await this.supabase.from('payments').update({
                        wompi_transaction_id: wompiId,
                        status: 'APPROVED'
                    }).eq('test_id', finalTestId);
                    this.visaTestService.generateScore(finalTestId).catch(err => this.logger.error(`Error en generateScore para ${finalTestId}: ${err.message}`));
                }
            }
            return { testId: finalTestId };
        }
        catch (err) {
            this.logger.error(`resolveByWompiId error: ${err.message}`);
            return { testId: null };
        }
    }
    async findByTransactionId(transactionId) {
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
            return null;
        }
        return data;
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = PaymentsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [mail_service_1.MailService,
        reports_service_1.ReportsService,
        visa_test_service_1.VisaTestService,
        scoring_service_1.ScoringService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map