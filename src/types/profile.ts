import { z } from 'zod';

export type CommuteMode = 'petrol_car' | 'two_wheeler' | 'metro_public' | 'electric' | 'wfh';
export type HomeFilterSetup = 'commercial_purifier' | 'diy_filter' | 'no_purifier';

export interface VulnerableMemberCounts {
  childrenUnder5: number;
  elderlyOver65: number;
  asthmaOrCardiac: number;
}

export interface HouseholdProfile {
  cityId: string;
  customCityName?: string;
  householdSize: number;
  vulnerableMembers: VulnerableMemberCounts;
  primaryCommute: CommuteMode;
  homeSetup: HomeFilterSetup;
  hasVentilationExhaust: boolean;
  lifestyleNotes?: string;
}

export const HouseholdProfileSchema = z.object({
  cityId: z.string().min(1, "Please select a city"),
  customCityName: z.string().max(60).optional(),
  householdSize: z.number().int().min(1, "Household size must be at least 1").max(20),
  vulnerableMembers: z.object({
    childrenUnder5: z.number().int().min(0).max(10),
    elderlyOver65: z.number().int().min(0).max(10),
    asthmaOrCardiac: z.number().int().min(0).max(10),
  }),
  primaryCommute: z.enum(['petrol_car', 'two_wheeler', 'metro_public', 'electric', 'wfh']),
  homeSetup: z.enum(['commercial_purifier', 'diy_filter', 'no_purifier']),
  hasVentilationExhaust: z.boolean(),
  lifestyleNotes: z.string().max(200).optional(),
});
