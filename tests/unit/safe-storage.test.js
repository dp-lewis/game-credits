import { describe, it, expect } from 'vitest';
import { safeStorage } from '../../src/lib/safe-storage.js';

describe('safeStorage', () => {
  it('uses localStorage when it is available', () => {
    const s = safeStorage();
    s.setItem('cs-test', 'hi');
    expect(s.getItem('cs-test')).toBe('hi');
  });

  it('falls back to in-memory storage when localStorage is unavailable', () => {
    const original = Object.getOwnPropertyDescriptor(window, 'localStorage');
    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      get() {
        throw new Error('blocked');
      },
    });
    try {
      const s = safeStorage();
      s.setItem('x', '1');
      expect(s.getItem('x')).toBe('1');
      expect(s.getItem('missing')).toBeNull();
    } finally {
      Object.defineProperty(window, 'localStorage', original);
    }
  });
});
