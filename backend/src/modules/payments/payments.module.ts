import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { MailModule } from '../mail/mail.module';
import { ReportsModule } from '../reports/reports.module';

@Module({
  imports: [MailModule, ReportsModule],
  providers: [PaymentsService],
  controllers: [PaymentsController]
})
export class PaymentsModule {}
