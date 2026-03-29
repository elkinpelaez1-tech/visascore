import { PaymentsService } from './payments.service';
export declare class PaymentsController {
    private readonly paymentsService;
    private readonly logger;
    constructor(paymentsService: PaymentsService);
    resolve(transactionId: string): Promise<{
        message: string;
        testId: any;
    }>;
    debug(transactionId: string): Promise<{
        message: string;
    }>;
    resolveByWompiId(wompiId: string, testId?: string): Promise<{
        testId: string | null;
    } | {
        testId: null;
        message: string;
    }>;
    verify(testId: string): Promise<{
        unlocked: boolean;
        message: string;
    }>;
    create(testId: string): Promise<{
        checkoutUrl: string;
    }>;
    webhook(body: any): Promise<{
        received: boolean;
    }>;
}
