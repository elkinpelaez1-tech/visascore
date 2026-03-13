"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VisaTestService = void 0;
const common_1 = require("@nestjs/common");
const scoring_service_1 = require("../scoring/scoring.service");
const supabase_js_1 = require("@supabase/supabase-js");
let VisaTestService = class VisaTestService {
    scoringService;
    supabase;
    constructor(scoringService) {
        this.scoringService = scoringService;
        this.supabase = (0, supabase_js_1.createClient)(process.env.SUPABASE_URL || 'https://placeholder.supabase.co', process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder');
    }
    async submitTest(profile, userId = '00000000-0000-0000-0000-000000000000') {
        const result = this.scoringService.calculate(profile);
        const { data: test, error: testErr } = await this.supabase
            .from('visa_tests')
            .insert({
            user_id: userId,
            overall_score: result.totalScore,
            status: 'locked',
            metadata: {
                approval_probability: result.approvalProbability
            }
        })
            .select()
            .single();
        if (testErr)
            throw new Error(`Test creation failed: ${testErr.message}`);
        await this.supabase.from('ds160_profiles').insert({
            test_id: test.id,
            ...profile
        });
        await this.supabase.from('visa_score_breakdown').insert({
            test_id: test.id,
            personal_points: result.breakdown.personal,
            economic_points: result.breakdown.economic,
            rootedness_points: result.breakdown.ties,
            travel_history_points: result.breakdown.travel,
            migration_history_points: result.breakdown.migration,
            strengths: result.strengths,
            weaknesses: result.weaknesses,
            recommendations: result.recommendations,
            improvement_simulations: result.simulations
        });
        return {
            testId: test.id,
            status: 'locked',
            message: 'Tu VisaScore está listo. Realiza el pago para desbloquear.'
        };
    }
    async unlockTest(testId) {
        await this.supabase.from('visa_tests').update({ status: 'paid' }).eq('id', testId);
        return { success: true, status: 'paid' };
    }
    async getStatus(testId) {
        const { data, error } = await this.supabase
            .from('visa_tests')
            .select('status')
            .eq('id', testId)
            .single();
        if (error || !data)
            throw new common_1.NotFoundException('Test not found');
        return data;
    }
    async getResult(testId, currentUserId) {
        const { data: test, error } = await this.supabase
            .from('visa_tests')
            .select('*, visa_score_breakdown(*)')
            .eq('id', testId)
            .single();
        if (error || !test)
            throw new common_1.NotFoundException('Test not found');
        if (currentUserId && test.user_id !== currentUserId && test.user_id !== '00000000-0000-0000-0000-000000000000') {
            throw new common_1.ForbiddenException('No tienes permiso para ver este resultado.');
        }
        if (test.status !== 'paid') {
            throw new common_1.ForbiddenException('Resultado bloqueado. Pago requerido.');
        }
        const breakdown = test.visa_score_breakdown;
        return {
            overall_score: test.overall_score,
            approval_probability: test.metadata?.approval_probability || 0,
            category: test.overall_score > 700 ? 'HIGH' : test.overall_score > 400 ? 'MEDIUM' : 'LOW',
            breakdown: {
                economic: breakdown.economic_points,
                ties: breakdown.rootedness_points,
                travel: breakdown.travel_history_points,
                migration: breakdown.migration_history_points,
                personal: breakdown.personal_points
            },
            strengths: breakdown.strengths,
            weaknesses: breakdown.weaknesses,
            recommendations: breakdown.recommendations,
            simulations: breakdown.improvement_simulations
        };
    }
};
exports.VisaTestService = VisaTestService;
exports.VisaTestService = VisaTestService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [scoring_service_1.ScoringService])
], VisaTestService);
//# sourceMappingURL=visa-test.service.js.map