import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { MailModule } from '../mail/mail.module';
import { ReportsModule } from '../reports/reports.module';
import { VisaTestModule } from '../visa-test/visa-test.module';

@Module({
  imports: [MailModule, ReportsModule, VisaTestModule],
  providers: [PaymentsService],
  controllers: [PaymentsController]
})
export class PaymentsModule {}
