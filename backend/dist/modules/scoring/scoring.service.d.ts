export interface DS160Profile {
    age: number;
    maritalStatus: string;
    hasChildren: boolean;
    educationLevel: string;
    occupation: string;
    employmentDurationMonths: number;
    monthlyIncomeCop: number;
    isCompanyRegistered: boolean;
    hasProperties: boolean;
    hasVehicle: boolean;
    bankAccountsCount: number;
    familyInHomeCountry: boolean;
    travelHistoryInternational: boolean;
    travelHistoryTier1: boolean;
    hasPreviousUsVisa: boolean;
    previousVisaUsageCorrect: boolean;
    hasVisaDenial: boolean;
    hasOverstayHistory: boolean;
    familyInUs: boolean;
    travelPurpose: string;
}
export interface ScoringResult {
    totalScore: number;
    approvalProbability: number;
    category: 'LOW' | 'MEDIUM' | 'HIGH';
    breakdown: {
        personal: number;
        economic: number;
        ties: number;
        travel: number;
        migration: number;
    };
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
    simulations: {
        label: string;
        points: string;
        result: number;
    }[];
}
export declare class ScoringService {
    calculate(profile: DS160Profile): ScoringResult;
    private calculateEconomic;
    private calculateTies;
    private calculateTravel;
    private calculateMigration;
    private calculatePersonal;
    private getStrengths;
    private getWeaknesses;
    private getRecommendations;
}
