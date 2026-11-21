/**
 * Utility functions for input sanitization and XSS prevention.
 */

/**
 * Escapes potentially dangerous HTML characters.
 * @param str - The raw user input string
 * @returns Escaped, safe string
 */
export function sanitizeString(str: string): string {
  if (!str || typeof str !== 'string') return '';
  
  return str
    .trim()
    // Remove script tags and html tags completely
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]+>/g, '')
    // Escape residual HTML entities
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Sanitizes and validates a city name input.
 * Allows letters, spaces, hyphens, and standard apostrophes.
 * @param input - Raw city name
 * @returns Sanitized clean city name
 */
export function sanitizeCityName(input: string): string {
  if (!input) return '';
  // Strip dangerous tags first before character filtering
  const cleanHtml = sanitizeString(input);
  const stripped = cleanHtml.replace(/[^a-zA-Z0-9\s,\.-]/g, '');
  return stripped.trim().slice(0, 50);
}
