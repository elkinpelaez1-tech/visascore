import { Controller, Post, Body, Get, Param, Header, StreamableFile } from '@nestjs/common';
import { VisaTestService } from './visa-test.service';
import type { DS160Profile } from '../scoring/scoring.service';

@Controller('visa-test')
export class VisaTestController {
  constructor(private readonly visaTestService: VisaTestService) {}

  @Post('submit')
  async submit(@Body() profile: DS160Profile) {
    return this.visaTestService.submitTest(profile);
  }

  @Get('report/:id')
  @Header('Content-Type', 'application/pdf')
  @Header('Content-Disposition', 'attachment; filename="reporte-visascore.pdf"')
  async getReport(@Param('id') id: string): Promise<StreamableFile> {
    const pdfBuffer = await this.visaTestService.generateReportPdf(id);
    return new StreamableFile(pdfBuffer);
  }

  @Get(':id/status')
  async getStatus(@Param('id') id: string) {
    return this.visaTestService.getStatus(id);
  }

  @Get('result/:id')
  async getResult(@Param('id') id: string) {
    return this.visaTestService.getResult(id);
  }

  @Post('send-email')
  async sendEmail(@Body() body: { testId: string; email: string }) {
    return this.visaTestService.sendEmail(body.testId, body.email);
  }
}
