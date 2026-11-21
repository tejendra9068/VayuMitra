import { describe, it, expect } from 'vitest';
import { sanitizeString, sanitizeCityName } from '../utils/sanitizer';

describe('Sanitizer & XSS Prevention Utility', () => {
  it('should strip malicious script tags completely', () => {
    const malicious = '<script>alert("hacked")</script>Hello World';
    const clean = sanitizeString(malicious);
    expect(clean).not.toContain('<script>');
    expect(clean).not.toContain('alert');
    expect(clean).toContain('Hello World');
  });

  it('should encode raw HTML angle brackets and entities', () => {
    const raw = '<b>Bold</b> & "Quotes"';
    const clean = sanitizeString(raw);
    expect(clean).toContain('&amp;');
    expect(clean).toContain('&quot;');
    expect(clean).not.toContain('<b>');
  });

  it('should sanitize custom city name inputs', () => {
    const rawCity = '<script>bad()</script>New Delhi-NCR, #12!';
    const cleanCity = sanitizeCityName(rawCity);
    expect(cleanCity).toBe('New Delhi-NCR, 12');
  });

  it('should handle empty or null values gracefully', () => {
    expect(sanitizeString('')).toBe('');
    // @ts-expect-error test invalid type
    expect(sanitizeString(null)).toBe('');
    expect(sanitizeCityName('')).toBe('');
  });
});
