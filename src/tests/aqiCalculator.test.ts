import { describe, it, expect } from 'vitest';
import { 
  getAQICategory, 
  getAQIColorConfig, 
  calculateSmogSeverityIndex, 
  getHealthAdvisory 
} from '../utils/aqiCalculator';

describe('AQI Calculator Utilities', () => {
  it('correctly categorizes AQI into CPCB / EPA tiers', () => {
    expect(getAQICategory(35)).toBe('Good');
    expect(getAQICategory(85)).toBe('Satisfactory');
    expect(getAQICategory(150)).toBe('Moderate');
    expect(getAQICategory(250)).toBe('Poor');
    expect(getAQICategory(350)).toBe('Very Poor');
    expect(getAQICategory(430)).toBe('Severe');
    expect(getAQICategory(490)).toBe('Hazardous');
  });

  it('returns valid WCAG color configurations for each category', () => {
    const goodColors = getAQIColorConfig('Good');
    expect(goodColors.badgeBg).toBe('bg-emerald-700');
    expect(goodColors.gaugeColor).toBe('#047857');

    const severeColors = getAQIColorConfig('Severe');
    expect(severeColors.badgeBg).toBe('bg-red-900');
  });

  it('calculates Smog Severity Index with winter humidity amplification', () => {
    // Normal dry day
    const dryScore = calculateSmogSeverityIndex(200, 300, 40);
    // Foggy winter morning with humidity > 70%
    const foggyScore = calculateSmogSeverityIndex(200, 300, 85);

    expect(foggyScore).toBeGreaterThan(dryScore);
    expect(dryScore).toBeGreaterThanOrEqual(1.0);
    expect(foggyScore).toBeLessThanOrEqual(10.0);
  });

  it('generates protective health advisories for vulnerable family members', () => {
    const generalAdvisory = getHealthAdvisory('Moderate', false);
    const vulnerableAdvisory = getHealthAdvisory('Moderate', true);

    expect(vulnerableAdvisory).toContain('Children and seniors');
    expect(generalAdvisory).toContain('moderate');

    const severeAdvisory = getHealthAdvisory('Severe', true);
    expect(severeAdvisory).toContain('Emergency Smog Advisory');
  });
});
