import { Controller, Post, Param, Res, Get } from '@nestjs/common';
import { ReportsService } from './reports.service';
import type { Response } from 'express';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post('generate/:id')
  async generate(@Param('id') id: string, @Res() res: Response) {
    const buffer = await this.reportsService.generatePdf(id);
    
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=VisaScore_Report_${id}.pdf`,
      'Content-Length': buffer.length,
    });
    
    res.end(buffer);
  }
}
