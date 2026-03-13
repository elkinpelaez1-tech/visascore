"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScoringService = void 0;
const common_1 = require("@nestjs/common");
let ScoringService = class ScoringService {
    calculate(profile) {
        const breakdown = {
            economic: this.calculateEconomic(profile),
            ties: this.calculateTies(profile),
            travel: this.calculateTravel(profile),
            migration: this.calculateMigration(profile),
            personal: this.calculatePersonal(profile),
        };
        const totalScore = Object.values(breakdown).reduce((a, b) => a + b, 0);
        let approvalProbability = 0;
        if (totalScore > 700) {
            approvalProbability = Math.min(95, 70 + Math.floor(((totalScore - 700) / 300) * 25));
        }
        else if (totalScore > 400) {
            approvalProbability = 40 + Math.floor(((totalScore - 400) / 300) * 30);
        }
        else {
            approvalProbability = Math.max(10, Math.floor((totalScore / 400) * 40));
        }
        const category = totalScore > 700 ? 'HIGH' : totalScore > 400 ? 'MEDIUM' : 'LOW';
        const simulations = [
            { label: 'Adquisición de propiedad', points: '+80', result: Math.min(1000, totalScore + 80) },
            { label: 'Viaje a zona Schengen/Canadá', points: '+60', result: Math.min(1000, totalScore + 60) },
            { label: 'Incremento de ingresos (+2 SMMLV)', points: '+40', result: Math.min(1000, totalScore + 40) }
        ];
        return {
            totalScore,
            approvalProbability,
            category,
            breakdown,
            strengths: this.getStrengths(profile, breakdown),
            weaknesses: this.getWeaknesses(profile, breakdown),
            recommendations: this.getRecommendations(profile, breakdown),
            simulations,
        };
    }
    calculateEconomic(p) {
        let score = 0;
        if (p.monthlyIncomeCop > 8000000)
            score += 150;
        else if (p.monthlyIncomeCop > 4000000)
            score += 100;
        else if (p.monthlyIncomeCop > 2000000)
            score += 50;
        if (p.employmentDurationMonths > 24)
            score += 100;
        else if (p.employmentDurationMonths > 6)
            score += 50;
        if (p.isCompanyRegistered)
            score += 30;
        return Math.min(250, score);
    }
    calculateTies(p) {
        let score = 0;
        if (p.hasProperties)
            score += 100;
        if (p.hasVehicle)
            score += 50;
        if (p.familyInHomeCountry)
            score += 80;
        return Math.min(230, score);
    }
    calculateTravel(p) {
        let score = 0;
        if (p.travelHistoryInternational)
            score += 100;
        if (p.travelHistoryTier1)
            score += 100;
        return Math.min(200, score);
    }
    calculateMigration(p) {
        let score = 150;
        if (p.hasPreviousUsVisa)
            score += 50;
        if (p.hasVisaDenial)
            score -= 200;
        if (p.hasOverstayHistory)
            score -= 200;
        if (p.familyInUs)
            score -= 50;
        return Math.max(0, Math.min(200, score));
    }
    calculatePersonal(p) {
        let score = 0;
        if (['universitario', 'posgrado/maestría', 'técnico/tecnólogo'].includes(p.educationLevel.toLowerCase()))
            score += 60;
        if (['casado/a', 'unión libre'].includes(p.maritalStatus.toLowerCase()))
            score += 60;
        return Math.min(120, score);
    }
    getStrengths(p, b) {
        const s = [];
        if (b.economic > 200)
            s.push('Estabilidad económica sólida');
        if (b.travel > 150)
            s.push('Historial de viajes internacionales robusto');
        if (p.hasProperties)
            s.push('Vínculos materiales fuertes (Propiedades)');
        if (p.hasPreviousUsVisa && p.previousVisaUsageCorrect)
            s.push('Uso correcto de visas previas');
        return s;
    }
    getWeaknesses(p, b) {
        const w = [];
        if (b.economic < 100)
            w.push('Ingresos o estabilidad laboral limitados');
        if (b.travel < 50)
            w.push('Falta de historial de viajes fuera del país');
        if (p.hasVisaDenial)
            w.push('Antecedente de visa negada');
        if (p.familyInUs)
            w.push('Vínculos familiares en EE.UU. (mayor riesgo migratorio)');
        return w;
    }
    getRecommendations(p, b) {
        const r = [];
        if (b.travel < 100)
            r.push('Realiza viajes de turismo a países que no requieran visa compleja para fortalecer tu historial.');
        if (!p.hasProperties)
            r.push('Intenta consolidar activos a tu nombre antes de la próxima solicitud.');
        if (p.monthlyIncomeCop < 4000000)
            r.push('Mejora tu perfil de ingresos o espera a tener mayor antigüedad en tu empleo actual.');
        return r;
    }
};
exports.ScoringService = ScoringService;
exports.ScoringService = ScoringService = __decorate([
    (0, common_1.Injectable)()
], ScoringService);
//# sourceMappingURL=scoring.service.js.map