import { z } from 'zod';

export interface TimeSlotRoutine {
  timeWindow: string; // e.g., "06:00 AM - 09:00 AM (Morning Inversion Peak)"
  title: string;
  recommendation: string;
  smogInversionRisk: 'High' | 'Moderate' | 'Low';
  actionType: 'outdoor_exercise' | 'commute' | 'indoor_ventilation' | 'school_kids';
  rationale: string;
}

export interface IAQHack {
  id: string;
  title: string;
  category: 'cleaning' | 'ventilation' | 'diy_purifier' | 'plants' | 'cooking';
  costLevel: 'Free ($0)' | 'Low (<$15 / ₹1200)' | 'Moderate';
  instruction: string;
  scientificBenefit: string;
  estimatedPM25DropPercent: number; // e.g., 35%
}

export interface SustainableSwap {
  id: string;
  habit: string;
  ecoAlternative: string;
  monthlyCO2ReductionKg: number;
  neighborhoodBenefit: string;
}

export interface GenAIActionPlan {
  planId: string;
  generatedAt: string;
  smogSummary: string;
  healthAdvisory: string;
  vulnerabilityWarning?: string;
  lowEmissionRoutines: TimeSlotRoutine[];
  indoorAirHacks: IAQHack[];
  sustainableSwaps: SustainableSwap[];
  emergencyChecklist: string[];
  isDemoFallback: boolean;
}

export const ActionPlanSchema = z.object({
  smogSummary: z.string(),
  healthAdvisory: z.string(),
  vulnerabilityWarning: z.string().optional(),
  lowEmissionRoutines: z.array(z.object({
    timeWindow: z.string(),
    title: z.string(),
    recommendation: z.string(),
    smogInversionRisk: z.enum(['High', 'Moderate', 'Low']),
    actionType: z.enum(['outdoor_exercise', 'commute', 'indoor_ventilation', 'school_kids']),
    rationale: z.string(),
  })),
  indoorAirHacks: z.array(z.object({
    id: z.string(),
    title: z.string(),
    category: z.enum(['cleaning', 'ventilation', 'diy_purifier', 'plants', 'cooking']),
    costLevel: z.enum(['Free ($0)', 'Low (<$15 / ₹1200)', 'Moderate']),
    instruction: z.string(),
    scientificBenefit: z.string(),
    estimatedPM25DropPercent: z.number(),
  })),
  sustainableSwaps: z.array(z.object({
    id: z.string(),
    habit: z.string(),
    ecoAlternative: z.string(),
    monthlyCO2ReductionKg: z.number(),
    neighborhoodBenefit: z.string(),
  })),
  emergencyChecklist: z.array(z.string()),
});
