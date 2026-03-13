import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { BrowserService } from './browser.service';

@Module({
  providers: [ReportsService, BrowserService],
  controllers: [ReportsController],
  exports: [ReportsService],
})
export class ReportsModule {}
