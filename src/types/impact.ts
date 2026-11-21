export interface ImpactHabitItem {
  id: string;
  title: string;
  description: string;
  category: 'commute' | 'indoor' | 'lifestyle' | 'community';
  pm25SavedDailyUgM3: number;  // Micrograms per cubic meter personal exposure avoided
  co2SavedMonthlyKg: number;   // Kilograms of CO2 prevented per month
  familyHealthBenefit: string; // Plain-language explanation for families
  applicableIf?: (homeSetup: string, commute: string) => boolean;
}

export interface CalculatedImpact {
  totalPM25ReductionUgM3: number;
  totalCO2PreventedKgMonth: number;
  cleanAirEquivalenceHours: number; // Hours of clean room air inhaled equivalent
  treesPlantedEquivalent: number;    // Carbon offset equivalent in tree-months
  activeHabitCount: number;
  keyFamilyTakeaway: string;
}
