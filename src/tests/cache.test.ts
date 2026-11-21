import { describe, it, expect, beforeEach } from 'vitest';
import { setCachedData, getCachedData, clearCache } from '../utils/cache';

describe('Cache Utility with 15-Minute TTL', () => {
  beforeEach(() => {
    clearCache();
  });

  it('stores and retrieves data before TTL expiry', () => {
    setCachedData('test_item', { score: 99 }, 10000);
    const retrieved = getCachedData<{ score: number }>('test_item');
    expect(retrieved).not.toBeNull();
    expect(retrieved?.score).toBe(99);
  });

  it('returns null and cleans expired item', () => {
    // Write item with negative TTL (already expired)
    setCachedData('expired_item', { valid: false }, -100);
    const result = getCachedData('expired_item');
    expect(result).toBeNull();
  });

  it('clears specific prefix or all keys correctly', () => {
    setCachedData('key_a', 'valA');
    setCachedData('key_b', 'valB');
    clearCache('key_a');
    expect(getCachedData('key_a')).toBeNull();
    expect(getCachedData('key_b')).toBe('valB');
    clearCache();
    expect(getCachedData('key_b')).toBeNull();
  });
});
