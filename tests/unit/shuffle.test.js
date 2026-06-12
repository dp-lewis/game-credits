import { describe, it, expect } from 'vitest';
import { shuffle, mulberry32 } from '../../src/lib/shuffle.js';

describe('shuffle', () => {
  it('keeps the same members', () => {
    const input = [1, 2, 3, 4, 5];
    const out = shuffle(input, mulberry32(42));
    expect([...out].sort()).toEqual([1, 2, 3, 4, 5]);
  });

  it('does not mutate the input', () => {
    const input = [1, 2, 3, 4, 5];
    const snapshot = [...input];
    shuffle(input, mulberry32(1));
    expect(input).toEqual(snapshot);
  });

  it('is deterministic for a given seed', () => {
    const a = shuffle([1, 2, 3, 4, 5, 6, 7, 8], mulberry32(123));
    const b = shuffle([1, 2, 3, 4, 5, 6, 7, 8], mulberry32(123));
    expect(a).toEqual(b);
  });

  it('handles empty and single-element arrays', () => {
    expect(shuffle([], mulberry32(1))).toEqual([]);
    expect(shuffle([9], mulberry32(1))).toEqual([9]);
  });

  it('defaults to Math.random when no rng is given', () => {
    const out = shuffle([1, 2, 3]);
    expect([...out].sort()).toEqual([1, 2, 3]);
  });
});

describe('mulberry32', () => {
  it('returns values in [0, 1)', () => {
    const rng = mulberry32(7);
    for (let i = 0; i < 50; i++) {
      const v = rng();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });
});
