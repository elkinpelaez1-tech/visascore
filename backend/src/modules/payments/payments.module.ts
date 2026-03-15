import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { MailService } from '../mail/mail.service';
import { ReportsService } from '../reports/reports.service';

@Module({
  providers: [PaymentsService, MailService, ReportsService],
  controllers: [PaymentsController]
})
export class PaymentsModule {}
