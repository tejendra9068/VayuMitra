/**
 * LocalStorage caching utility with Time-To-Live (TTL).
 * Default TTL is 15 minutes (900,000 ms) to avoid redundant API calls.
 */

const DEFAULT_TTL_MS = 15 * 60 * 1000; // 15 minutes

interface CachedItem<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

export function setCachedData<T>(key: string, data: T, ttlMs: number = DEFAULT_TTL_MS): void {
  try {
    const item: CachedItem<T> = {
      data,
      timestamp: Date.now(),
      ttl: ttlMs,
    };
    localStorage.setItem(`vayumitra_${key}`, JSON.stringify(item));
  } catch (error) {
    console.warn(`[VayuMitra Cache] Failed to write cache for key "${key}":`, error);
  }
}

export function getCachedData<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(`vayumitra_${key}`);
    if (!raw) return null;

    const item: CachedItem<T> = JSON.parse(raw);
    const isExpired = Date.now() - item.timestamp > item.ttl;

    if (isExpired) {
      localStorage.removeItem(`vayumitra_${key}`);
      return null;
    }

    return item.data;
  } catch (error) {
    console.warn(`[VayuMitra Cache] Failed to read cache for key "${key}":`, error);
    return null;
  }
}

export function clearCache(keyPrefix?: string): void {
  try {
    if (!keyPrefix) {
      Object.keys(localStorage)
        .filter(k => k.startsWith('vayumitra_'))
        .forEach(k => localStorage.removeItem(k));
    } else {
      localStorage.removeItem(`vayumitra_${keyPrefix}`);
    }
  } catch (error) {
    console.warn('[VayuMitra Cache] Failed to clear cache:', error);
  }
}
