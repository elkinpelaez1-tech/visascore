import { PaymentsService } from './payments.service';
export declare class PaymentsController {
    private readonly paymentsService;
    private readonly logger;
    constructor(paymentsService: PaymentsService);
    create(testId: string): Promise<{
        paymentUrl: string;
    }>;
    webhook(body: any, signature: string): Promise<{
        received: boolean;
        deduplicated: boolean;
    } | {
        received: boolean;
        deduplicated?: undefined;
    }>;
}
