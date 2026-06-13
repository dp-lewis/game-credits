import { describe, it, expect } from 'vitest';
import {
  todayKey,
  isValidDateKey,
  daysBetween,
  formatDateKey,
} from '../../src/lib/date-key.js';

describe('todayKey', () => {
  it('formats a local date as YYYY-MM-DD', () => {
    expect(todayKey(new Date(2026, 5, 13))).toBe('2026-06-13');
  });

  it('zero-pads month and day', () => {
    expect(todayKey(new Date(2026, 0, 5))).toBe('2026-01-05');
  });
});

describe('isValidDateKey', () => {
  it('accepts a well-formed key', () => {
    expect(isValidDateKey('2026-06-13')).toBe(true);
  });

  it.each(['2026-13-01', '2026-02-30', '26-6-1', 'nope', '', null, 42])(
    'rejects invalid key: %s',
    (bad) => {
      expect(isValidDateKey(bad)).toBe(false);
    }
  );
});

describe('daysBetween', () => {
  it('is 0 for the same day', () => {
    expect(daysBetween('2026-06-13', '2026-06-13')).toBe(0);
  });

  it('is 1 for consecutive days', () => {
    expect(daysBetween('2026-06-13', '2026-06-14')).toBe(1);
  });

  it('counts a multi-day gap', () => {
    expect(daysBetween('2026-06-10', '2026-06-13')).toBe(3);
  });

  it('is negative when b precedes a', () => {
    expect(daysBetween('2026-06-14', '2026-06-13')).toBe(-1);
  });

  it('spans month boundaries', () => {
    expect(daysBetween('2026-06-30', '2026-07-01')).toBe(1);
  });
});

describe('formatDateKey', () => {
  it('formats a key as "Mon D, YYYY"', () => {
    expect(formatDateKey('2026-06-14')).toBe('Jun 14, 2026');
    expect(formatDateKey('2026-01-05')).toBe('Jan 5, 2026');
    expect(formatDateKey('2026-12-31')).toBe('Dec 31, 2026');
  });
});
