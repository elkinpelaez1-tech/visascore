import { Controller, Post, Body, Headers, Logger, Get, Param } from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  private readonly logger = new Logger(PaymentsController.name);

  constructor(private readonly paymentsService: PaymentsService) {}

  @Get('resolve/:transactionId')
  async resolve(@Param('transactionId') transactionId: string) {
    const payment = await this.paymentsService.findByTransactionId(transactionId);
    return { 
      message: 'ok', 
      testId: payment?.test_id || null 
    };
  }

  @Get('debug/:transactionId')
  async debug(@Param('transactionId') transactionId: string) {
    return { message: 'ok' };
  }
  @Post('verify')
  async verify(@Body('testId') testId: string) {
    if (!testId) return { unlocked: false, message: 'testId requerido' };
    return this.paymentsService.verifyAndUnlock(testId);
  }

  @Post('create')
  async create(@Body('testId') testId: string) {
    this.logger.log(`Payment creation requested for test: ${testId}`);
    return this.paymentsService.createPayment(testId);
  }

  @Post('webhook')
  async webhook(@Body() body: any) {
    this.logger.log('🔥 webhook hit');
    try {
      await this.paymentsService.handleWebhook(body);
    } catch (error) {
      this.logger.error('❌ webhook controller error:', error);
    }
    // 🔥 CRÍTICO: SIEMPRE RESPONDER 200
    return { received: true };
  }
}