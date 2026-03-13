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
const crypto = __importStar(require("crypto-js"));
let PaymentsService = PaymentsService_1 = class PaymentsService {
    mailService;
    reportsService;
    logger = new common_1.Logger(PaymentsService_1.name);
    supabase;
    constructor(mailService, reportsService) {
        this.mailService = mailService;
        this.reportsService = reportsService;
        this.supabase = (0, supabase_js_1.createClient)(process.env.SUPABASE_URL || 'https://placeholder.supabase.co', process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder');
    }
    async createPayment(testId) {
        this.logger.log(`Initiating payment for test ${testId}`);
        return {
            paymentUrl: `${process.env.CHECKOUT_UI_URL}${testId}`
        };
    }
    async handleWebhook(body, signature) {
        this.logger.log('Payment webhook received');
        if (!this.isValidWompiSignature(body, signature)) {
            this.logger.warn('Invalid Wompi signature received');
            throw new common_1.BadRequestException('Invalid signature');
        }
        const { data: transaction } = body;
        const testId = transaction.reference;
        const status = transaction.status;
        if (status === 'APPROVED') {
            this.logger.log(`Payment APPROVED for test ${testId}`);
            const { data: existingPayment } = await this.supabase
                .from('payments')
                .select('id')
                .eq('wompi_transaction_id', transaction.id)
                .single();
            if (existingPayment) {
                this.logger.log(`Payment ${transaction.id} already processed. Skipping.`);
                return { received: true, deduplicated: true };
            }
            await this.supabase
                .from('visa_tests')
                .update({ status: 'paid' })
                .eq('id', testId);
            await this.supabase.from('payments').insert({
                test_id: testId,
                wompi_transaction_id: transaction.id,
                amount: transaction.amount_in_cents / 100,
                status: 'approved',
                payment_method: transaction.payment_method_type,
                raw_webhook_data: body
            });
            const { data: test } = await this.supabase
                .from('visa_tests')
                .select('*, profiles(email)')
                .eq('id', testId)
                .single();
            if (test && test.profiles?.email) {
                this.logger.log(`Triggering report generation and email for ${test.profiles.email}`);
                const pdfBuffer = await this.reportsService.generatePdf(testId);
                await this.mailService.sendResultEmail(test.profiles.email, testId, test.overall_score, pdfBuffer);
            }
        }
        else {
            this.logger.log(`Payment status for ${testId}: ${status}`);
        }
        return { received: true };
    }
    isValidWompiSignature(body, signature) {
        const { data: transaction, timestamp } = body;
        const secret = process.env.WOMPI_EVENTS_SECRET;
        const rawString = `${transaction.id}${transaction.status}${transaction.amount_in_cents}${timestamp}${secret}`;
        const hash = crypto.SHA256(rawString).toString();
        return hash === signature;
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = PaymentsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [mail_service_1.MailService,
        reports_service_1.ReportsService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map