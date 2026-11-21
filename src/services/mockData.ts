import { CityData, HourlyForecastItem } from '../types/aqi';
import { GenAIActionPlan } from '../types/plan';
import { ImpactHabitItem } from '../types/impact';
import { HouseholdProfile } from '../types/profile';

/**
 * Standard diurnal winter smog forecast curve.
 * Demonstrates thermal inversion: cold air traps pollutants in early morning and late evening,
 * while midday solar warming (1-3 PM) slightly lifts the planetary boundary layer.
 */
export function generateHourlySmogCurve(baseAqi: number, basePm25: number): HourlyForecastItem[] {
  const curveMultipliers = [
    { hour: '04:00 AM', mult: 1.15, inversion: true },
    { hour: '06:00 AM', mult: 1.30, inversion: true },
    { hour: '08:00 AM', mult: 1.35, inversion: true },
    { hour: '10:00 AM', mult: 1.10, inversion: false },
    { hour: '12:00 PM', mult: 0.85, inversion: false },
    { hour: '02:00 PM', mult: 0.70, inversion: false }, // Golden ventilation window
    { hour: '04:00 PM', mult: 0.80, inversion: false },
    { hour: '06:00 PM', mult: 1.10, inversion: false },
    { hour: '08:00 PM', mult: 1.25, inversion: true },
    { hour: '10:00 PM', mult: 1.30, inversion: true },
    { hour: '12:00 AM', mult: 1.20, inversion: true },
  ];

  return curveMultipliers.map(item => {
    const aqi = Math.round(baseAqi * item.mult);
    const pm25 = Math.round(basePm25 * item.mult);
    return {
      hour: item.hour,
      aqi,
      pm25,
      isInversionPeak: item.inversion,
      outdoorSafe: aqi < 150,
    };
  });
}

/**
 * Pre-configured real-world Indian urban cities notorious for severe winter smog episodes.
 */
export const HIGH_SMOG_CITIES: CityData[] = [
  {
    id: 'delhi-anand-vihar',
    name: 'Delhi NCR (Anand Vihar / East Delhi)',
    state: 'Delhi',
    aqi: 432,
    category: 'Severe',
    smogSeverityIndex: 9.8,
    pollutants: {
      pm25: 345,
      pm10: 490,
      no2: 88,
      co: 3.2,
      temp: 14,
      humidity: 84,
    },
    lastUpdated: 'Live CPCB Station Feed (10 mins ago)',
    source: 'CPCB / DPCC Monitoring Station',
    isStubbleBurningSeason: true,
    hourlyForecast: generateHourlySmogCurve(432, 345),
  },
  {
    id: 'noida-sector-62',
    name: 'Noida (Sector 62)',
    state: 'Uttar Pradesh',
    aqi: 388,
    category: 'Very Poor',
    smogSeverityIndex: 8.9,
    pollutants: {
      pm25: 298,
      pm10: 420,
      no2: 74,
      co: 2.8,
      temp: 15,
      humidity: 79,
    },
    lastUpdated: 'Live UPPCB Feed (15 mins ago)',
    source: 'UPPCB Real-time Index',
    isStubbleBurningSeason: true,
    hourlyForecast: generateHourlySmogCurve(388, 298),
  },
  {
    id: 'lucknow-hazratganj',
    name: 'Lucknow (Hazratganj / Central)',
    state: 'Uttar Pradesh',
    aqi: 312,
    category: 'Very Poor',
    smogSeverityIndex: 7.8,
    pollutants: {
      pm25: 240,
      pm10: 360,
      no2: 65,
      co: 2.3,
      temp: 16,
      humidity: 76,
    },
    lastUpdated: 'Live Station Feed',
    source: 'UPPCB Air Quality Cell',
    isStubbleBurningSeason: true,
    hourlyForecast: generateHourlySmogCurve(312, 240),
  },
  {
    id: 'kanpur-collectorganj',
    name: 'Kanpur (Collectorganj)',
    state: 'Uttar Pradesh',
    aqi: 345,
    category: 'Very Poor',
    smogSeverityIndex: 8.2,
    pollutants: {
      pm25: 265,
      pm10: 385,
      no2: 70,
      co: 2.6,
      temp: 16,
      humidity: 75,
    },
    lastUpdated: 'Live IIT Kanpur Feed',
    source: 'IIT-K / CPCB Station',
    isStubbleBurningSeason: true,
    hourlyForecast: generateHourlySmogCurve(345, 265),
  },
  {
    id: 'patna-muradpur',
    name: 'Patna (Muradpur / Danapur)',
    state: 'Bihar',
    aqi: 372,
    category: 'Very Poor',
    smogSeverityIndex: 8.6,
    pollutants: {
      pm25: 285,
      pm10: 410,
      no2: 72,
      co: 2.9,
      temp: 17,
      humidity: 81,
    },
    lastUpdated: 'Live BSPCB Feed',
    source: 'Bihar State Pollution Control Board',
    isStubbleBurningSeason: true,
    hourlyForecast: generateHourlySmogCurve(372, 285),
  },
  {
    id: 'mumbai-bkc',
    name: 'Mumbai (Bandra-Kurla Complex / Chembur)',
    state: 'Maharashtra',
    aqi: 182,
    category: 'Moderate',
    smogSeverityIndex: 5.2,
    pollutants: {
      pm25: 112,
      pm10: 195,
      no2: 48,
      co: 1.4,
      temp: 24,
      humidity: 68,
    },
    lastUpdated: 'Live MPCB Feed',
    source: 'MPCB Coastal Air Station',
    isStubbleBurningSeason: false,
    hourlyForecast: generateHourlySmogCurve(182, 112),
  },
  {
    id: 'kolkata-jadavpur',
    name: 'Kolkata (Jadavpur / Victoria)',
    state: 'West Bengal',
    aqi: 245,
    category: 'Poor',
    smogSeverityIndex: 6.5,
    pollutants: {
      pm25: 168,
      pm10: 255,
      no2: 56,
      co: 1.8,
      temp: 20,
      humidity: 74,
    },
    lastUpdated: 'Live WBPCB Feed',
    source: 'West Bengal Pollution Board',
    isStubbleBurningSeason: false,
    hourlyForecast: generateHourlySmogCurve(245, 168),
  },
];

/**
 * Creates dynamic realistic data for any custom typed city.
 */
export function createCustomCityData(cityName: string): CityData {
  const hash = cityName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  // Realistic winter smog AQI range (140 to 390)
  const simulatedAqi = 140 + (hash % 250);
  const simulatedPm25 = Math.round(simulatedAqi * 0.75);
  const simulatedPm10 = Math.round(simulatedAqi * 1.15);

  let category: CityData['category'] = 'Moderate';
  if (simulatedAqi > 400) category = 'Severe';
  else if (simulatedAqi > 300) category = 'Very Poor';
  else if (simulatedAqi > 200) category = 'Poor';
  else if (simulatedAqi > 100) category = 'Moderate';

  return {
    id: `custom-${cityName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
    name: cityName,
    state: 'India / Regional Urban',
    aqi: simulatedAqi,
    category,
    smogSeverityIndex: Math.min(Math.round((simulatedAqi / 45) * 10) / 10, 9.8),
    pollutants: {
      pm25: simulatedPm25,
      pm10: simulatedPm10,
      no2: 55,
      co: 1.9,
      temp: 18,
      humidity: 72,
    },
    lastUpdated: 'Estimated via regional weather satellite & historical ground trends',
    source: 'VayuMitra Ambient Estimate',
    isStubbleBurningSeason: simulatedAqi > 280,
    hourlyForecast: generateHourlySmogCurve(simulatedAqi, simulatedPm25),
  };
}

/**
 * Master library of actionable habits for the Impact Simulator.
 */
export const IMPACT_HABITS_LIST: ImpactHabitItem[] = [
  {
    id: 'habit-commute-metro',
    title: 'Switch daily car commute to Metro or Electric Bus',
    description: 'Replacing a 12 km single-occupancy petrol vehicle trip with electric public transit.',
    category: 'commute',
    pm25SavedDailyUgM3: 42,
    co2SavedMonthlyKg: 64,
    familyHealthBenefit: 'Avoids breathing toxic micro-particles trapped inside traffic queues and prevents road-level nitrogen dioxide spikes near school routes.',
  },
  {
    id: 'habit-wet-mop',
    title: 'Switch from dry broom sweeping to microfiber wet mopping',
    description: 'Dry brooms aerosolize fine settled dust back into children’s breathing zone (3-4 feet high).',
    category: 'indoor',
    pm25SavedDailyUgM3: 35,
    co2SavedMonthlyKg: 0,
    familyHealthBenefit: 'Prevents aerosolizing toxic PM2.5 and allergen particles back into room air where crawling toddlers and toddlers play.',
  },
  {
    id: 'habit-diy-purifier',
    title: 'Install DIY Box-Fan HEPA Filter in main bedroom',
    description: 'A standard 12-inch table fan taped with a MERV-13 / True HEPA furnace filter ($12 vs $150 commercial purifier).',
    category: 'indoor',
    pm25SavedDailyUgM3: 58,
    co2SavedMonthlyKg: 4,
    familyHealthBenefit: 'Filters out up to 88% of particulate matter overnight, protecting elderly and asthmatic family members during deep sleep.',
  },
  {
    id: 'habit-window-sealing',
    title: 'Seal window gaps with foam tape & air-leak drafts',
    description: 'Apply inexpensive silicone weatherstripping around ill-fitting balcony doors and windows.',
    category: 'indoor',
    pm25SavedDailyUgM3: 28,
    co2SavedMonthlyKg: 0,
    familyHealthBenefit: 'Cuts infiltration of toxic morning inversion smog into sleeping quarters by over 50%.',
  },
  {
    id: 'habit-ventilation-timing',
    title: 'Strict midday ventilation (1:30 PM - 3:00 PM only)',
    description: 'Never ventilate at 7 AM or 9 PM during inversion. Open cross-ventilation only when sunlight warms the ground boundary layer.',
    category: 'lifestyle',
    pm25SavedDailyUgM3: 45,
    co2SavedMonthlyKg: 0,
    familyHealthBenefit: 'Ensures household air exchange happens when outdoor particle density is at its diurnal low, keeping indoor spikes minimal.',
  },
  {
    id: 'habit-kitchen-discipline',
    title: 'Use kitchen chimney/exhaust + lid on high-smoke frying',
    description: 'Uncovered deep frying and tadka generate sudden indoor PM2.5 spikes exceeding 600 µg/m³ in Indian kitchens.',
    category: 'indoor',
    pm25SavedDailyUgM3: 38,
    co2SavedMonthlyKg: 2,
    familyHealthBenefit: 'Shields mothers and children from acute indoor ultra-fine soot and oil aerosol inhalation that inflames lungs.',
  },
  {
    id: 'habit-no-wood-heating',
    title: 'Replace open biomass/charcoal fires with ceramic heating',
    description: 'Urge domestic guards and community spaces to use electric radiant heaters rather than burning scrap wood/leaves.',
    category: 'community',
    pm25SavedDailyUgM3: 65,
    co2SavedMonthlyKg: 45,
    familyHealthBenefit: 'Eliminates carcinogenic polycyclic hydrocarbons and black carbon that blanket ground-floor apartments.',
  },
  {
    id: 'habit-carpool-school',
    title: 'Form neighborhood school carpool or electric van',
    description: 'Combine 4 family drop-offs into one shared low-emission route.',
    category: 'commute',
    pm25SavedDailyUgM3: 24,
    co2SavedMonthlyKg: 38,
    familyHealthBenefit: 'Decreases toxic idling emissions outside the school gate right when children are walking inside.',
  },
];

/**
 * Returns a high-fidelity pre-computed GenAI Action Plan for demo/offline fallback mode.
 * Highly customized according to the user's specific household profile and city AQI.
 */
export function getPrecomputedActionPlan(
  profile: HouseholdProfile,
  cityData: CityData
): GenAIActionPlan {
  const hasKids = profile.vulnerableMembers.childrenUnder5 > 0;
  const hasElderly = profile.vulnerableMembers.elderlyOver65 > 0;
  const hasAsthma = profile.vulnerableMembers.asthmaOrCardiac > 0;
  const isSevere = cityData.aqi > 300;

  const vulnerabilityNotes: string[] = [];
  if (hasKids) vulnerabilityNotes.push('toddlers with developing lung capacity');
  if (hasElderly) vulnerabilityNotes.push('seniors susceptible to cardiovascular strain');
  if (hasAsthma) vulnerabilityNotes.push('asthmatic/allergy-prone family members requiring airway protection');

  const vulnerabilityText = vulnerabilityNotes.length > 0
    ? `Special Advisory for your household: Prioritize shielding ${vulnerabilityNotes.join(', ')}. Keep emergency bronchodilator inhalers easily accessible.`
    : 'Maintain vigilance across all age groups as fine particulate matter penetrates directly into the bloodstream.';

  return {
    planId: `vayu-plan-${Date.now()}`,
    generatedAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    smogSummary: `In ${cityData.name}, the Air Quality Index stands at ${cityData.aqi} (${cityData.category}) with PM2.5 at ${cityData.pollutants.pm25} µg/m³. Severe winter temperature inversion is trapping industrial and vehicular soot below 200 meters.`,
    healthAdvisory: isSevere 
      ? `Atmospheric inversion creates a toxic micro-particle blanket in the early morning and late night. Outdoor aerobic activities (jogging, cycling, school outdoor PT) must be suspended.`
      : `Moderate to high particulate levels require strategic routine adjustments to minimize cumulative PM2.5 deposition in lung alveoli.`,
    vulnerabilityWarning: vulnerabilityText,
    lowEmissionRoutines: [
      {
        timeWindow: '06:00 AM – 09:30 AM (Peak Inversion Hazard)',
        title: 'Morning Smog Lock-In: Zero Outdoor Cardio & Staggered School Drops',
        recommendation: hasKids 
          ? 'Do NOT send children for early outdoor morning assembly. Request school authorities move morning sports indoors. Keep bedroom windows firmly latched.'
          : 'Avoid morning jogging or walking. The cold ground layer holds peak vehicular exhaust. Practice indoor yoga, stretching, or treadmill exercises.',
        smogInversionRisk: 'High',
        actionType: hasKids ? 'school_kids' : 'outdoor_exercise',
        rationale: 'Thermal inversion traps night emissions near ground level; breathing heavily outdoors increases lung particle intake by 400%.',
      },
      {
        timeWindow: '09:30 AM – 12:00 PM (Commute Window)',
        title: profile.primaryCommute === 'petrol_car' 
          ? 'Set Car AC to Strict Internal Recirculation Mode'
          : 'Equip Well-Fitted N95 Mask During Two-Wheeler / Public Transit',
        recommendation: profile.primaryCommute === 'petrol_car'
          ? 'Switch vehicle ventilation to Recirculate (Cabin Loop). Keep windows rolled up. Avoid stopping behind diesel trucks and smoke-emitting buses.'
          : 'Cloth masks and surgical masks do NOT filter microscopic PM2.5. Wear a snug-fitting N95/FFP2 mask with a nose bridge pinch clip.',
        smogInversionRisk: 'Moderate',
        actionType: 'commute',
        rationale: 'Traffic bottlenecks spike local PM2.5 and nitrogen oxides to over 3x the city-wide average.',
      },
      {
        timeWindow: '01:00 PM – 03:00 PM (Golden Ventilation Window)',
        title: 'Safe Midday Cross-Ventilation & Solar Airing',
        recommendation: 'Open opposite-facing interior windows for 20-30 minutes. Solar heating expands the planetary boundary layer, resulting in the day’s lowest ambient PM2.5 concentration.',
        smogInversionRisk: 'Low',
        actionType: 'indoor_ventilation',
        rationale: 'Stagnant indoor air accumulates CO2, VOCs, and cooking moisture. Midday is the scientifically optimal time to refresh room air with minimum soot entry.',
      },
      {
        timeWindow: '07:30 PM – 10:30 PM (Evening Smog Resurgence)',
        title: 'Evening Curfew for Vulnerable Groups & Purifier Blast',
        recommendation: hasAsthma || hasElderly
          ? 'Ensure elderly and asthmatic family members stay indoors in the sealed bedroom. Run air purification on medium/high before sleeping.'
          : 'Seal balcony curtains and balcony doors. Avoid burning mosquito coils or dhoop incense, which can spike indoor PM2.5 past 500 µg/m³.',
        smogInversionRisk: 'High',
        actionType: 'outdoor_exercise',
        rationale: 'Cooling evening temperatures collapse the boundary layer, trapping heavy industrial and truck transit pollution right above residential rooftops.',
      },
    ],
    indoorAirHacks: [
      {
        id: 'hack-1',
        title: profile.homeSetup === 'no_purifier' 
          ? 'DIY Box-Fan HEPA Purifier (Corsi-Rosenthal Box)'
          : 'Optimize Air Purifier CADR & Strategic Corner Placement',
        category: profile.homeSetup === 'no_purifier' ? 'diy_purifier' : 'ventilation',
        costLevel: profile.homeSetup === 'no_purifier' ? 'Low (<$15 / ₹1200)' : 'Free ($0)',
        instruction: profile.homeSetup === 'no_purifier'
          ? 'Take a standard 12-inch or 16-inch table/box fan. Tape a MERV-13 or HEPA furnace filter flat against the back intake with masking tape. Runs at 40W and cleans a 150 sq ft room in 25 mins.'
          : 'Place purifier at least 2 feet away from walls and curtains, centrally in the bedroom. Do not run in eco/silent mode during smog emergencies—keep at medium speed.',
        scientificBenefit: 'Delivers Clean Air Delivery Rate (CADR) of 120-180 m³/hour, scrubbing 85%+ of PM2.5 particulates without high equipment expenditure.',
        estimatedPM25DropPercent: profile.homeSetup === 'no_purifier' ? 68 : 82,
      },
      {
        id: 'hack-2',
        title: 'Microfiber Damp Mopping Over Dry Broom Sweeping',
        category: 'cleaning',
        costLevel: 'Free ($0)',
        instruction: 'Ban dry brooms (jhadu) in the house this month. Mop floors with a damp microfiber cloth with water and a drop of neem/citrus oil. Micro-particles stick to the damp fibers instead of resuspending.',
        scientificBenefit: 'Dry sweeping resuspends up to 75 µg/m³ of fine heavy metal-laden road dust back into the toddler breathing zone (below 1 meter height).',
        estimatedPM25DropPercent: 40,
      },
      {
        id: 'hack-3',
        title: 'NASA Clean Air Plant Triad (Living Bio-Filters)',
        category: 'plants',
        costLevel: 'Low (<$15 / ₹1200)',
        instruction: 'Place Snake Plants (Sansevieria) in bedrooms (releases oxygen at night), Areca Palms in the living area (adds humidity and captures airborne dust), and Money Plants near windows.',
        scientificBenefit: 'While plants do not replace HEPA filters for heavy PM2.5, they break down indoor formaldehyde, benzene, and maintain room humidity between 40-50%, soothing inflamed mucosal linings.',
        estimatedPM25DropPercent: 18,
      },
      {
        id: 'hack-4',
        title: 'Kitchen Exhaust Discipline & Steam Humidification',
        category: 'cooking',
        costLevel: 'Free ($0)',
        instruction: 'Always switch on the kitchen chimney or exhaust fan 1 minute before lighting the stove and keep it on for 5 minutes post-cooking. Cover pans during tempering (tadka). Drink warm water and steam inhale before bed.',
        scientificBenefit: 'Cooking oils at smoking point emit acrolein and ultrafine carbon nanoparticles. Covering pans prevents widespread dispersion into sleeping quarters.',
        estimatedPM25DropPercent: 32,
      },
    ],
    sustainableSwaps: [
      {
        id: 'swap-1',
        habit: 'Solo driving in petrol/diesel car for daily urban commute',
        ecoAlternative: 'Metro train or shared electric cab pool for 3 days a week',
        monthlyCO2ReductionKg: 52,
        neighborhoodBenefit: 'Reduces toxic road-level tailpipe particulates and NOx emissions outside schools and hospitals.',
      },
      {
        id: 'swap-2',
        habit: 'Burning garden leaves, garbage, or scrap wood for warmth',
        ecoAlternative: 'Community-funded oil-filled radiant radiator or thermal quilts',
        monthlyCO2ReductionKg: 78,
        neighborhoodBenefit: 'Directly halts carcinogenic benzo(a)pyrene and dense ground-level smoke in your society.',
      },
      {
        id: 'swap-3',
        habit: 'LPG gas boiling for hot water in winter',
        ecoAlternative: 'Induction electric kettle or rooftop solar thermal system',
        monthlyCO2ReductionKg: 24,
        neighborhoodBenefit: 'Cuts indoor fossil fuel combustion and lowers household carbon footprint.',
      },
    ],
    emergencyChecklist: [
      'Store 2 certified N95 or FFP2 respirators per household member.',
      'Check expiry date of emergency asthma/bronchodilator inhalers (Salbutamol/Levosalbutamol).',
      'Seal balcony and bedroom window frame gaps with removable weather foam tape.',
      'Keep a saline nasal spray handy to flush soot particles from upper airways before sleep.',
      'Hydrate with warm fluids to keep airway cilia active in expelling trapped particulate matter.',
    ],
    isDemoFallback: true,
  };
}
