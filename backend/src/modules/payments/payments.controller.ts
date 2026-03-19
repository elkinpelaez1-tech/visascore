import { Controller, Post, Body, Headers, Logger, Get, Param } from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  private readonly logger = new Logger(PaymentsController.name);

  constructor(private readonly paymentsService: PaymentsService) {}

//   @Get('resolve/:transactionId')
//   async resolve(@Param('transactionId') transactionId: string) {
//     return this.paymentsService.resolveTransaction(transactionId);
//   }

//   @Get('debug/:transactionId')
//   async debug(@Param('transactionId') transactionId: string) {
//     const payment = await this.paymentsService.findByTransactionId(transactionId);

//     return {
//       found: !!payment,
//       data: payment || null,
//       error: null
//     };
//   }

  @Post('create')
  async create(@Body('testId') testId: string) {
    this.logger.log(`Payment creation requested for test: ${testId}`);
    return this.paymentsService.createPayment(testId);
  }

  @Post('webhook')
  async webhook(@Body() body: any) {
    this.logger.log('Webhook Wompi recibido');
    return this.paymentsService.handleWebhook(body);
  }
}