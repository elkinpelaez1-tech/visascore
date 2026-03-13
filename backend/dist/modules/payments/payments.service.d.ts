import { MailService } from '../mail/mail.service';
import { ReportsService } from '../reports/reports.service';
export declare class PaymentsService {
    private mailService;
    private reportsService;
    private readonly logger;
    private supabase;
    constructor(mailService: MailService, reportsService: ReportsService);
    createPayment(testId: string): Promise<{
        paymentUrl: string;
    }>;
    handleWebhook(body: any, signature: string): Promise<{
        received: boolean;
        deduplicated: boolean;
    } | {
        received: boolean;
        deduplicated?: undefined;
    }>;
    private isValidWompiSignature;
}
