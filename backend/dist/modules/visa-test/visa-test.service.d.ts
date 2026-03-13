import { ScoringService, DS160Profile } from '../scoring/scoring.service';
export declare class VisaTestService {
    private scoringService;
    private supabase;
    constructor(scoringService: ScoringService);
    submitTest(profile: DS160Profile, userId?: string): Promise<{
        testId: any;
        status: string;
        message: string;
    }>;
    unlockTest(testId: string): Promise<{
        success: boolean;
        status: string;
    }>;
    getStatus(testId: string): Promise<any>;
    getResult(testId: string, currentUserId?: string): Promise<{
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
}
