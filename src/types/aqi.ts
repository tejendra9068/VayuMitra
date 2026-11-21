import { z } from 'zod';

export type AQICategory = 
  | 'Good' 
  | 'Satisfactory' 
  | 'Moderate' 
  | 'Poor' 
  | 'Very Poor' 
  | 'Severe'
  | 'Hazardous';

export interface PollutantValues {
  pm25: number;   // µg/m³
  pm10: number;   // µg/m³
  no2: number;    // ppb
  co: number;     // ppm
  temp: number;   // °C
  humidity: number; // %
}

export interface HourlyForecastItem {
  hour: string; // e.g., "06:00 AM"
  aqi: number;
  pm25: number;
  isInversionPeak: boolean;
  outdoorSafe: boolean;
}

export interface CityData {
  id: string;
  name: string;
  state: string;
  aqi: number;
  category: AQICategory;
  smogSeverityIndex: number; // 1 to 10
  pollutants: PollutantValues;
  lastUpdated: string;
  source: string;
  isStubbleBurningSeason: boolean;
  hourlyForecast: HourlyForecastItem[];
}

export const CityInputSchema = z.object({
  cityName: z.string().min(2, "City name must be at least 2 characters").max(50, "City name too long"),
});
