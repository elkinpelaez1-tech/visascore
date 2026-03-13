import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';
import { BrowserService } from './browser.service';

@Injectable()
export class ReportsService {
  private readonly logger = new Logger(ReportsService.name);
  private supabase: any;

  constructor(private browserService: BrowserService) {
    this.supabase = createClient(
      process.env.SUPABASE_URL || 'https://placeholder.supabase.co',
      process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder'
    );
  }

  async generatePdf(testId: string): Promise<Buffer> {
    this.logger.log(`Generating PDF for test ${testId}`);
    
    // 1. Get data from DB
    const { data: test, error } = await this.supabase
      .from('visa_tests')
      .select('*, visa_score_breakdown(*)')
      .eq('id', testId)
      .single();

    if (error || !test) {
      this.logger.error(`Test ${testId} not found for PDF generation`);
      throw new NotFoundException('Test not found');
    }
    
    const breakdown = test.visa_score_breakdown;

    // 2. Generate HTML Template
    const htmlContent = `
      <html>
        <head>
          <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;700&family=Inter:wght@400;700;900&display=swap" rel="stylesheet">
          <style>
            body { 
              font-family: 'Inter', sans-serif; 
              padding: 0; 
              margin: 0;
              color: #1e293b; 
              line-height: 1.6;
              background-color: #ffffff;
            }
            .page {
              padding: 50px;
              position: relative;
            }
            .header { 
              display: flex; 
              justify-content: space-between; 
              align-items: center; 
              border-bottom: 3px solid #003366; 
              padding-bottom: 25px;
              margin-bottom: 40px;
            }
            .brand {
              font-family: 'Outfit', sans-serif;
              font-size: 28px;
              font-weight: 800;
              color: #003366;
            }
            .brand span { color: #cc0000; }
            .report-id { font-size: 10px; color: #94a3b8; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; }
            
            .main-content {
              display: grid;
              grid-template-cols: 1fr 1fr;
              gap: 40px;
            }

            .score-card {
              grid-column: span 2;
              background-color: #f8fafc;
              border-radius: 40px;
              padding: 40px;
              text-align: center;
              border: 1px solid #e2e8f0;
              margin-bottom: 40px;
              position: relative;
              overflow: hidden;
            }
            .score-card::after {
              content: "";
              position: absolute;
              top: 0; left: 0;
              width: 100%; height: 5px;
              background: linear-gradient(90deg, #003366, #cc0000);
            }

            .score-circle {
              width: 140px;
              height: 140px;
              border-radius: 50%;
              border: 8px solid #003366;
              display: inline-flex;
              align-items: center;
              justify-content: center;
              font-size: 48px;
              font-weight: 900;
              color: #003366;
              margin-bottom: 20px;
            }
            
            .probability-badge {
              display: inline-block;
              padding: 8px 16px;
              background-color: #ecfdf5;
              color: #059669;
              border-radius: 12px;
              font-size: 14px;
              font-weight: 800;
              text-transform: uppercase;
              letter-spacing: 1px;
            }

            .section { margin-bottom: 40px; }
            .section-title { 
              font-family: 'Outfit', sans-serif;
              font-size: 16px; 
              font-weight: 800; 
              color: #64748b; 
              margin-bottom: 20px; 
              text-transform: uppercase;
              letter-spacing: 2px;
              border-bottom: 1px solid #f1f5f9;
              padding-bottom: 10px;
            }
            
            .insight-item {
              background-color: #ffffff;
              padding: 15px;
              border-radius: 16px;
              margin-bottom: 12px;
              display: flex;
              gap: 15px;
              align-items: center;
              font-size: 13px;
              font-weight: 600;
              border: 1px solid #f1f5f9;
            }
            .icon-bullet {
              width: 24px;
              height: 24px;
              border-radius: 8px;
              background-color: #f1f5f9;
              display: flex;
              align-items: center;
              justify-content: center;
              color: #003366;
              font-weight: 900;
            }

            .recommendations {
              grid-column: span 2;
              background-color: #003366;
              color: #ffffff;
              border-radius: 32px;
              padding: 40px;
            }
            .rec-item {
              background-color: rgba(255,255,255,0.05);
              padding: 20px;
              border-radius: 20px;
              margin-bottom: 15px;
              display: flex;
              gap: 20px;
              border: 1px solid rgba(255,255,255,0.1);
            }
            .rec-num {
              width: 32px; height: 32px;
              background-color: #ffffff;
              color: #003366;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              font-weight: 900;
              flex-shrink: 0;
            }

            .footer { 
              margin-top: 50px; 
              padding-top: 20px;
              font-size: 10px; 
              color: #94a3b8; 
              text-align: center;
              border-top: 1px solid #f1f5f9;
            }
          </style>
        </head>
        <body>
          <div class="page">
            <div class="header">
              <div class="brand">Visa<span>Score</span> Pro</div>
              <div class="report-id">Ref: VSRP-${testId.slice(0, 8).toUpperCase()}</div>
            </div>
            
            <div class="score-card">
              <div class="score-circle">${test.overall_score}</div>
              <div style="font-size: 18px; font-weight: 700; color: #475569; margin-bottom: 5px;">Probabilidad de Aprobación Real</div>
              <div style="font-size: 36px; font-weight: 900; color: #003366; margin-bottom: 15px;">${test.metadata?.approval_probability || 'N/A'}%</div>
              <div class="probability-badge">Perfil de Alta Tracción</div>
            </div>

            <div class="main-content">
              <div class="section">
                <div class="section-title">Análisis de Fortalezas</div>
                ${breakdown.strengths.map(s => `
                  <div class="insight-item">
                    <div class="icon-bullet">✓</div>
                    ${s}
                  </div>
                `).join('')}
              </div>

              <div class="section">
                <div class="section-title">Factores de Riesgo</div>
                ${breakdown.weaknesses.map(w => `
                  <div class="insight-item" style="border-left: 4px solid #cc0000;">
                    <div class="icon-bullet" style="color: #cc0000;">!</div>
                    ${w}
                  </div>
                `).join('')}
              </div>

              <div class="recommendations">
                <div class="section-title" style="color: #94a3b8; border-color: rgba(255,255,255,0.1);">Hoja de Ruta de Mejora</div>
                ${breakdown.recommendations.map((r, i) => `
                  <div class="rec-item">
                    <div class="rec-num">${i + 1}</div>
                    <div style="font-size: 14px; font-weight: 500; color: #e2e8f0;">${r}</div>
                  </div>
                `).join('')}
              </div>
            </div>

            <div class="footer">
              Este reporte corresponde a un análisis automatizado del perfil migratorio basado en variables del formulario DS-160.<br>
              El resultado no constituye una garantía de aprobación de visa. La decisión final corresponde exclusivamente al oficial consular de la Embajada o Consulado de los Estados Unidos.<br>
              © 2026 VisaScore. Inteligencia Migratoria.
            </div>
          </div>
        </body>
      </html>
    `;

    // 3. Use BrowserService for instance reuse
    const browser = await this.browserService.getBrowser();
    const page = await browser.newPage();
    
    try {
      await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
      const pdf = await page.pdf({ format: 'A4', printBackground: true });
      
      // Update reports table
      await this.supabase.from('reports').upsert({
          test_id: testId,
          report_url: `generated_${Date.now()}`,
          status: 'generated'
      }, { onConflict: 'test_id' });

      return Buffer.from(pdf);
    } finally {
      await page.close();
    }
  }
}
