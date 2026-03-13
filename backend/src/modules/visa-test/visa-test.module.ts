import { Module } from '@nestjs/common';
import { VisaTestService } from './visa-test.service';
import { VisaTestController } from './visa-test.controller';

@Module({
  providers: [VisaTestService],
  controllers: [VisaTestController]
})
export class VisaTestModule {}
