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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var PaymentsController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsController = void 0;
const common_1 = require("@nestjs/common");
const payments_service_1 = require("./payments.service");
let PaymentsController = PaymentsController_1 = class PaymentsController {
    paymentsService;
    logger = new common_1.Logger(PaymentsController_1.name);
    constructor(paymentsService) {
        this.paymentsService = paymentsService;
    }
    async resolve(transactionId) {
        const payment = await this.paymentsService.findByTransactionId(transactionId);
        return {
            message: 'ok',
            testId: payment?.test_id || null
        };
    }
    async debug(transactionId) {
        return { message: 'ok' };
    }
    async resolveByWompiId(wompiId, testId) {
        if (!wompiId)
            return { testId: null, message: 'wompiId requerido' };
        return this.paymentsService.resolveByWompiId(wompiId, testId);
    }
    async verify(testId) {
        if (!testId)
            return { unlocked: false, message: 'testId requerido' };
        return this.paymentsService.verifyAndUnlock(testId);
    }
    async create(testId) {
        this.logger.log(`Payment creation requested for test: ${testId}`);
        return this.paymentsService.createPayment(testId);
    }
    async webhook(body) {
        this.logger.log('🔥 webhook hit');
        try {
            await this.paymentsService.handleWebhook(body);
        }
        catch (error) {
            this.logger.error('❌ webhook controller error:', error);
        }
        return { received: true };
    }
};
exports.PaymentsController = PaymentsController;
__decorate([
    (0, common_1.Get)('resolve/:transactionId'),
    __param(0, (0, common_1.Param)('transactionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "resolve", null);
__decorate([
    (0, common_1.Get)('debug/:transactionId'),
    __param(0, (0, common_1.Param)('transactionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "debug", null);
__decorate([
    (0, common_1.Post)('resolve'),
    __param(0, (0, common_1.Body)('wompiId')),
    __param(1, (0, common_1.Body)('testId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "resolveByWompiId", null);
__decorate([
    (0, common_1.Post)('verify'),
    __param(0, (0, common_1.Body)('testId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "verify", null);
__decorate([
    (0, common_1.Post)('create'),
    __param(0, (0, common_1.Body)('testId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('webhook'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "webhook", null);
exports.PaymentsController = PaymentsController = PaymentsController_1 = __decorate([
    (0, common_1.Controller)('payments'),
    __metadata("design:paramtypes", [payments_service_1.PaymentsService])
], PaymentsController);
//# sourceMappingURL=payments.controller.js.map