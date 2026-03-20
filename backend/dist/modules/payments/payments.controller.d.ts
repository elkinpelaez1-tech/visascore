import { PaymentsService } from './payments.service';
export declare class PaymentsController {
    private readonly paymentsService;
    private readonly logger;
    constructor(paymentsService: PaymentsService);
    resolve(transactionId: string): Promise<{
        message: string;
    }>;
    debug(transactionId: string): Promise<{
        message: string;
    }>;
    create(testId: string): Promise<{
        paymentUrl: string;
    }>;
    webhook(body: any): Promise<{
        received: boolean;
        ignored: boolean;
    } | {
        received: boolean;
        ignored?: undefined;
    }>;
}
