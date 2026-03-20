import { StreamableFile } from '@nestjs/common';
import { VisaTestService } from './visa-test.service';
import type { DS160Profile } from '../scoring/scoring.service';
export declare class VisaTestController {
    private readonly visaTestService;
    constructor(visaTestService: VisaTestService);
    submit(profile: DS160Profile): Promise<{
        testId: any;
        status: string;
        message: string;
    }>;
    getReport(id: string): Promise<StreamableFile>;
    getStatus(id: string): Promise<any>;
    getResult(id: string): Promise<{
        overall_score: any;
        approval_probability: any;
        category: string;
        breakdown: {
            economic: any;
            ties: any;
            travel: any;
            migration: any;
            personal: any;
        };
        strengths: any;
        weaknesses: any;
        recommendations: any;
        simulations: any;
    }>;
    sendEmail(body: {
        testId: string;
        email: string;
    }): Promise<{
        success: boolean;
        message: string;
    }>;
}
