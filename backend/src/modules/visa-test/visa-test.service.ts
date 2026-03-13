import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { ScoringService, DS160Profile } from '../scoring/scoring.service';
import { createClient } from '@supabase/supabase-js';

@Injectable()
export class VisaTestService {
  private supabase: any;

  constructor(private scoringService: ScoringService) {
    this.supabase = createClient(
      process.env.SUPABASE_URL || 'https://placeholder.supabase.co',
      process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder'
    );
  }

  async submitTest(profile: DS160Profile, userId: string = '00000000-0000-0000-0000-000000000000') {
    const result = this.scoringService.calculate(profile);
    
    // Create the test record
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

    if (testErr) throw new Error(`Test creation failed: ${testErr.message}`);

    // Create the detailed profile
    await this.supabase.from('ds160_profiles').insert({
      test_id: test.id,
      ...profile
    });

    // Create the score breakdown
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

  async unlockTest(testId: string) {
    await this.supabase.from('visa_tests').update({ status: 'paid' }).eq('id', testId);
    return { success: true, status: 'paid' };
  }

  async getStatus(testId: string) {
    const { data, error } = await this.supabase
      .from('visa_tests')
      .select('status')
      .eq('id', testId)
      .single();

    if (error || !data) throw new NotFoundException('Test not found');
    return data;
  }

  async getResult(testId: string, currentUserId?: string) {
    const { data: test, error } = await this.supabase
      .from('visa_tests')
      .select('*, visa_score_breakdown(*)')
      .eq('id', testId)
      .single();

    if (error || !test) throw new NotFoundException('Test not found');
    
    // Security check: Identity (if userId is provided)
    if (currentUserId && test.user_id !== currentUserId && test.user_id !== '00000000-0000-0000-0000-000000000000') {
        throw new ForbiddenException('No tienes permiso para ver este resultado.');
    }

    // Security check: Payment status
    if (test.status !== 'paid') {
      throw new ForbiddenException('Resultado bloqueado. Pago requerido.');
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
}
