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
    handleWebhook(body: any): Promise<{
        received: boolean;
        ignored: boolean;
    } | {
        received: boolean;
        ignored?: undefined;
    }>;
    private isValidWompiSignature;
    resolveTransaction(transactionId: string): Promise<{
        message: string;
        transactionId: string;
    }>;
    debugTransaction(transactionId: string): Promise<{
        message: string;
        transactionId: string;
    }>;
    findByTransactionId(transactionId: string): Promise<any>;
}
