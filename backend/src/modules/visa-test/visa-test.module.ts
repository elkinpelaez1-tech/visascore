import { Module } from '@nestjs/common';
import { VisaTestService } from './visa-test.service';
import { VisaTestController } from './visa-test.controller';
import { ScoringService } from '../scoring/scoring.service';

@Module({
  providers: [VisaTestService, ScoringService],
  controllers: [VisaTestController]
})
export class VisaTestModule {}
