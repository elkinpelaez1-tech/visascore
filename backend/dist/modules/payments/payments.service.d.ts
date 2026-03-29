import { MailService } from '../mail/mail.service';
import { ReportsService } from '../reports/reports.service';
import { VisaTestService } from '../visa-test/visa-test.service';
import { ScoringService } from '../scoring/scoring.service';
export declare class PaymentsService {
    private mailService;
    private reportsService;
    private visaTestService;
    private scoringService;
    private readonly logger;
    private supabase;
    constructor(mailService: MailService, reportsService: ReportsService, visaTestService: VisaTestService, scoringService: ScoringService);
    createPayment(testId: string): Promise<{
        checkoutUrl: string;
    }>;
    handleWebhook(body: any): Promise<{
        received: boolean;
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
    verifyAndUnlock(testId: string): Promise<{
        unlocked: boolean;
        message: string;
    }>;
    resolveByWompiId(wompiId: string, frontendTestId?: string): Promise<{
        testId: string | null;
    }>;
    findByTransactionId(transactionId: string): Promise<any>;
}
