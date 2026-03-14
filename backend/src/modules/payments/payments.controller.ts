import { Controller, Post, Body, Headers, Logger } from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  private readonly logger = new Logger(PaymentsController.name);

  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('create')
  async create(@Body('testId') testId: string) {
    this.logger.log(`Payment creation requested for test: ${testId}`);
    return this.paymentsService.createPayment(testId);
  }

  @Post('webhook')
  async webhook(@Body() body: any) {
    this.logger.log('Webhook Wompi recibido');
    // Enviamos el body completo al servicio, que extraerá el signature
    return this.paymentsService.handleWebhook(body);
  }
}
