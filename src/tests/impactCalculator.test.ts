import { describe, it, expect } from 'vitest';
import { calculateImpactMetrics } from '../utils/impactCalculator';
import { ImpactHabitItem } from '../types/impact';

describe('Impact Calculator Utility', () => {
  const mockHabits: ImpactHabitItem[] = [
    {
      id: 'habit-1',
      title: 'Metro Commute',
      description: 'Switch car to metro',
      category: 'commute',
      pm25SavedDailyUgM3: 40,
      co2SavedMonthlyKg: 60,
      familyHealthBenefit: 'Reduces road exhaust intake',
    },
    {
      id: 'habit-2',
      title: 'Wet Mopping',
      description: 'Avoid dry sweeping',
      category: 'indoor',
      pm25SavedDailyUgM3: 30,
      co2SavedMonthlyKg: 0,
      familyHealthBenefit: 'Protects toddler airways',
    },
  ];

  it('calculates zero impact when no habits are selected', () => {
    const result = calculateImpactMetrics([], mockHabits, 4);
    expect(result.totalPM25ReductionUgM3).toBe(0);
    expect(result.totalCO2PreventedKgMonth).toBe(0);
    expect(result.activeHabitCount).toBe(0);
  });

  it('calculates single habit correctly', () => {
    const result = calculateImpactMetrics(['habit-1'], mockHabits, 4);
    expect(result.totalPM25ReductionUgM3).toBe(40);
    expect(result.totalCO2PreventedKgMonth).toBe(60);
    expect(result.activeHabitCount).toBe(1);
    expect(result.treesPlantedEquivalent).toBeGreaterThan(0);
  });

  it('scales indoor habits with household size', () => {
    const solo = calculateImpactMetrics(['habit-2'], mockHabits, 1);
    const familyOfFour = calculateImpactMetrics(['habit-2'], mockHabits, 4);

    expect(familyOfFour.totalPM25ReductionUgM3).toBeGreaterThan(solo.totalPM25ReductionUgM3);
  });
});
