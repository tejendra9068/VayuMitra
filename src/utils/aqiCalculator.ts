import { AQICategory } from '../types/aqi';

/**
 * Categorizes an AQI value according to the National Air Quality Index (India CPCB / US EPA standards).
 */
export function getAQICategory(aqi: number): AQICategory {
  if (aqi <= 50) return 'Good';
  if (aqi <= 100) return 'Satisfactory';
  if (aqi <= 200) return 'Moderate';
  if (aqi <= 300) return 'Poor';
  if (aqi <= 400) return 'Very Poor';
  if (aqi <= 450) return 'Severe';
  return 'Hazardous';
}

/**
 * Returns high-contrast accessible colors (WCAG 2.1 AA compliant) for each AQI tier.
 */
export function getAQIColorConfig(category: AQICategory): {
  badgeBg: string;
  badgeText: string;
  gaugeColor: string;
  borderColor: string;
  bgLight: string;
  cardRing: string;
} {
  switch (category) {
    case 'Good':
      return {
        badgeBg: 'bg-emerald-700',
        badgeText: 'text-white',
        gaugeColor: '#047857',
        borderColor: 'border-emerald-500',
        bgLight: 'bg-emerald-50',
        cardRing: 'ring-emerald-600',
      };
    case 'Satisfactory':
      return {
        badgeBg: 'bg-lime-700',
        badgeText: 'text-white',
        gaugeColor: '#4d7c0f',
        borderColor: 'border-lime-500',
        bgLight: 'bg-lime-50',
        cardRing: 'ring-lime-600',
      };
    case 'Moderate':
      return {
        badgeBg: 'bg-amber-600',
        badgeText: 'text-white',
        gaugeColor: '#d97706',
        borderColor: 'border-amber-500',
        bgLight: 'bg-amber-50',
        cardRing: 'ring-amber-500',
      };
    case 'Poor':
      return {
        badgeBg: 'bg-rose-600',
        badgeText: 'text-white',
        gaugeColor: '#e11d48',
        borderColor: 'border-rose-500',
        bgLight: 'bg-rose-50',
        cardRing: 'ring-rose-500',
      };
    case 'Very Poor':
      return {
        badgeBg: 'bg-purple-700',
        badgeText: 'text-white',
        gaugeColor: '#7e22ce',
        borderColor: 'border-purple-500',
        bgLight: 'bg-purple-50',
        cardRing: 'ring-purple-600',
      };
    case 'Severe':
    case 'Hazardous':
    default:
      return {
        badgeBg: 'bg-red-900',
        badgeText: 'text-white',
        gaugeColor: '#7f1d1d',
        borderColor: 'border-red-700',
        bgLight: 'bg-red-50',
        cardRing: 'ring-red-800',
      };
  }
}

/**
 * Calculates a 1 to 10 Smog Severity Index (SSI) based on PM2.5, PM10, and atmospheric moisture.
 * Higher winter humidity traps micro-particles close to ground level (temperature inversion).
 */
export function calculateSmogSeverityIndex(pm25: number, pm10: number, humidity: number): number {
  // Base metric from PM2.5 (WHO safe limit is 15 µg/m³ 24h average)
  const pm25Factor = Math.min(pm25 / 35, 7); // max 7 points
  const pm10Factor = Math.min(pm10 / 100, 2); // max 2 points
  // High humidity (>70%) amplifies smog persistence through fog droplets
  const humidityAmplifier = humidity > 70 ? 1 : humidity > 50 ? 0.5 : 0;

  const rawScore = pm25Factor + pm10Factor + humidityAmplifier;
  const clampedScore = Math.min(Math.max(Math.round(rawScore * 10) / 10, 1.0), 10.0);
  return clampedScore;
}

/**
 * Generates an empathetic health advisory for families based on AQI and vulnerability status.
 */
export function getHealthAdvisory(category: AQICategory, hasVulnerableMembers: boolean): string {
  switch (category) {
    case 'Good':
      return 'Air quality is satisfactory. Ideal time to ventilate rooms, exercise outdoors, and enjoy fresh air.';
    case 'Satisfactory':
      return 'Air quality is acceptable. Sensitive individuals may experience mild throat irritation during strenuous outdoor exercise.';
    case 'Moderate':
      return hasVulnerableMembers
        ? 'Precaution advised: Children and seniors with respiratory conditions should limit prolonged outdoor physical exertion.'
        : 'Air quality is moderate. Healthy adults may notice slight discomfort with long outdoor activities.';
    case 'Poor':
      return hasVulnerableMembers
        ? 'High caution: Keep toddlers, asthmatic members, and seniors indoors. Run indoor air filtration and close road-facing windows.'
        : 'Poor air quality: Avoid morning runs or prolonged cycling near heavy traffic corridors. Consider wearing an N95 mask outdoors.';
    case 'Very Poor':
      return 'Significant health risk: Prolonged exposure can trigger respiratory illness. Keep windows sealed, avoid outdoor workouts, and run HEPA filtration continuously.';
    case 'Severe':
    case 'Hazardous':
    default:
      return 'Emergency Smog Advisory: Toxic atmospheric inversion in effect. Unsafe for all age groups. Children and elderly must stay indoors in sealed rooms. Use N95 masks if commute is unavoidable.';
  }
}
