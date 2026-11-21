import { GoogleGenerativeAI } from '@google/generative-ai';
import { ActionPlanSchema, GenAIActionPlan } from '../types/plan';
import { HouseholdProfile } from '../types/profile';
import { CityData } from '../types/aqi';
import { getCachedData, setCachedData } from '../utils/cache';
import { getPrecomputedActionPlan } from './mockData';
import { sanitizeString } from '../utils/sanitizer';

/**
 * Retrieves the effective Gemini API key from environment variables or browser storage.
 */
export function getActiveApiKey(): string {
  // Check localStorage first (user custom key), then Vite env variable
  try {
    const userKey = localStorage.getItem('vayumitra_gemini_key') || sessionStorage.getItem('vayumitra_gemini_key');
    if (userKey && userKey.trim().length > 10) {
      return userKey.trim();
    }
  } catch (e) {
    console.warn('Storage check failed:', e);
  }

  return (import.meta.env.VITE_GEMINI_API_KEY as string) || '';
}

/**
 * Saves a user-provided Gemini API key securely in browser storage.
 */
export function saveActiveApiKey(apiKey: string): void {
  try {
    if (apiKey.trim()) {
      localStorage.setItem('vayumitra_gemini_key', apiKey.trim());
    } else {
      localStorage.removeItem('vayumitra_gemini_key');
    }
  } catch (e) {
    console.warn('Failed to save API key:', e);
  }
}

/**
 * Generates a tailored Anti-Smog Action Plan using Gemini AI with structured JSON mode,
 * with automatic fallback to high-fidelity precomputed responses.
 */
export async function generateAntiSmogActionPlan(
  profile: HouseholdProfile,
  cityData: CityData,
  forceRefresh: boolean = false
): Promise<GenAIActionPlan> {
  const cacheKey = `action_plan_${cityData.id}_${profile.primaryCommute}_${profile.homeSetup}_${profile.vulnerableMembers.childrenUnder5}_${profile.vulnerableMembers.asthmaOrCardiac}`;

  // 1. Check 15-minute TTL Cache
  if (!forceRefresh) {
    const cached = getCachedData<GenAIActionPlan>(cacheKey);
    if (cached) {
      return cached;
    }
  }

  const apiKey = getActiveApiKey();

  // 2. If no API key configured, seamlessly use the offline demo fallback
  if (!apiKey) {
    const fallbackPlan = getPrecomputedActionPlan(profile, cityData);
    setCachedData(cacheKey, fallbackPlan);
    return fallbackPlan;
  }

  // 3. Attempt Gemini API Generation with strict structured JSON output
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.3,
      },
    });

    const safeCity = sanitizeString(cityData.name);
    const safeNotes = sanitizeString(profile.lifestyleNotes || 'None');

    const prompt = `You are VayuMitra, an expert AI Urban Environmental Health and Anti-Smog Specialist.
Create a comprehensive, scientifically rigorous, and empathetic Anti-Smog Action Plan for a family residing in ${safeCity}.

Current Environmental Situation:
- City: ${safeCity} (${cityData.state})
- AQI: ${cityData.aqi} (${cityData.category})
- PM2.5: ${cityData.pollutants.pm25} µg/m³, PM10: ${cityData.pollutants.pm10} µg/m³
- Temperature: ${cityData.pollutants.temp}°C, Humidity: ${cityData.pollutants.humidity}%
- Winter Thermal Inversion: Active (traps pollutants at night & morning)

Household Profile:
- Household size: ${profile.householdSize} members
- Vulnerable members: ${profile.vulnerableMembers.childrenUnder5} toddlers (<5 yrs), ${profile.vulnerableMembers.elderlyOver65} elderly (>65 yrs), ${profile.vulnerableMembers.asthmaOrCardiac} members with asthma/cardiac sensitivity
- Commute Mode: ${profile.primaryCommute}
- Home Setup: ${profile.homeSetup}
- Kitchen Exhaust Available: ${profile.hasVentilationExhaust ? 'Yes' : 'No'}
- Lifestyle Notes: ${safeNotes}

STRICT JSON SCHEMA REQUIRED:
You must output a single JSON object matching this exact structure:
{
  "smogSummary": "string explaining current smog & inversion dynamics in simple language",
  "healthAdvisory": "string clear health guidance tailored to this family",
  "vulnerabilityWarning": "string warning tailored to children/seniors/asthma in the home",
  "lowEmissionRoutines": [
    {
      "timeWindow": "string, e.g., '06:00 AM – 09:30 AM (Morning Inversion Peak)'",
      "title": "string action headline",
      "recommendation": "string practical advice for exercise, commute, or school",
      "smogInversionRisk": "High" | "Moderate" | "Low",
      "actionType": "outdoor_exercise" | "commute" | "indoor_ventilation" | "school_kids",
      "rationale": "string scientific reason related to boundary layer/particulates"
    }
  ],
  "indoorAirHacks": [
    {
      "id": "hack-1",
      "title": "string",
      "category": "cleaning" | "ventilation" | "diy_purifier" | "plants" | "cooking",
      "costLevel": "Free ($0)" | "Low (<$15 / ₹1200)" | "Moderate",
      "instruction": "string step-by-step practical hack",
      "scientificBenefit": "string quantified health mechanism",
      "estimatedPM25DropPercent": number between 15 and 85
    }
  ],
  "sustainableSwaps": [
    {
      "id": "swap-1",
      "habit": "string current habit",
      "ecoAlternative": "string greener alternative",
      "monthlyCO2ReductionKg": number between 10 and 150,
      "neighborhoodBenefit": "string community air quality benefit"
    }
  ],
  "emergencyChecklist": [
    "string checklist item 1",
    "string checklist item 2",
    "string checklist item 3",
    "string checklist item 4",
    "string checklist item 5"
  ]
}

Provide 4 detailed low-emission routine time-slots (covering morning inversion, commute, midday ventilation window, and night smog), at least 4 indoor air quality hacks (including DIY low-cost solutions if they have no purifier), 3 sustainable swaps, and 5 emergency checklist items. Output valid JSON only with no markdown backticks.`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Clean response in case model wrapped in code fences
    const cleanedText = responseText
      .replace(/^```json/gi, '')
      .replace(/^```/gi, '')
      .replace(/```$/gi, '')
      .trim();

    const parsedJson = JSON.parse(cleanedText);

    // Validate with Zod schema
    const validated = ActionPlanSchema.parse(parsedJson);

    const fullPlan: GenAIActionPlan = {
      ...validated,
      planId: `vayu-live-${Date.now()}`,
      generatedAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      isDemoFallback: false,
    };

    // Cache valid plan for 15 minutes
    setCachedData(cacheKey, fullPlan);
    return fullPlan;
  } catch (error) {
    console.warn('[VayuMitra AI Service] Live generation failed or rate limited, falling back to precomputed intelligence:', error);
    const fallbackPlan = getPrecomputedActionPlan(profile, cityData);
    setCachedData(cacheKey, fallbackPlan);
    return fallbackPlan;
  }
}
