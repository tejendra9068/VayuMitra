import { CalculatedImpact, ImpactHabitItem } from '../types/impact';

/**
 * Calculates total PM2.5 exposure avoided and CO2 emissions prevented based on selected habits.
 * 
 * Scientific assumptions:
 * - Average adult breathes ~11 m³ of air per day.
 * - Typical winter smog day in North Indian urban plains exposes residents to 150-350 µg/m³ PM2.5.
 * - Switching from a petrol car (10km round trip) saves ~2.4 kg CO2/day (~72 kg/month).
 * - Room HEPA filtration/sealing avoids ~60-120 µg/m³ of indoor particulate loading.
 */
export function calculateImpactMetrics(
  selectedHabitIds: string[],
  allHabits: ImpactHabitItem[],
  householdSize: number = 4
): CalculatedImpact {
  const activeHabits = allHabits.filter(h => selectedHabitIds.includes(h.id));

  let totalPM25 = 0;
  let totalCO2 = 0;

  activeHabits.forEach(habit => {
    // Indoor habits scale with household size
    if (habit.category === 'indoor') {
      totalPM25 += habit.pm25SavedDailyUgM3 * (1 + (householdSize - 1) * 0.25);
    } else {
      totalPM25 += habit.pm25SavedDailyUgM3;
    }
    totalCO2 += habit.co2SavedMonthlyKg;
  });

  // Calculate equivalent clean air hours
  // Every 25 µg/m³ PM2.5 avoided corresponds to roughly 1 hour of clean lung clearance equivalent
  const cleanAirHours = Math.round((totalPM25 / 25) * 2);

  // 1 mature urban tree absorbs approximately 1.8 kg of CO2 per month
  const treeEquivalents = Math.round((totalCO2 / 1.8) * 10) / 10;

  // Plain-language empathetic family takeaway
  let familyTakeaway = 'Select habits above to simulate how small daily choices shield your family from toxic winter smog.';
  if (totalPM25 > 100) {
    familyTakeaway = `Outstanding protection! Your family avoids inhaling an estimated ${Math.round(totalPM25)} µg/m³ of toxic microscopic soot every day—significantly cutting pediatric bronchitis and asthma flare-up risks.`;
  } else if (totalPM25 > 40) {
    familyTakeaway = `Meaningful defense: You have reduced your household's daily toxic particle burden by ${Math.round(totalPM25)} µg/m³, giving vulnerable lungs precious relief.`;
  } else if (totalPM25 > 0) {
    familyTakeaway = `Good start! Even minor habit changes prevent soot accumulation in household living spaces.`;
  }

  return {
    totalPM25ReductionUgM3: Math.round(totalPM25),
    totalCO2PreventedKgMonth: Math.round(totalCO2 * 10) / 10,
    cleanAirEquivalenceHours: cleanAirHours,
    treesPlantedEquivalent: treeEquivalents,
    activeHabitCount: activeHabits.length,
    keyFamilyTakeaway: familyTakeaway,
  };
}
