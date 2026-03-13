import { BrowserService } from './browser.service';
export declare class ReportsService {
    private browserService;
    private readonly logger;
    private supabase;
    constructor(browserService: BrowserService);
    generatePdf(testId: string): Promise<Buffer>;
}
