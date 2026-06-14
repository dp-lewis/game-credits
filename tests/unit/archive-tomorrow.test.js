import { describe, it, expect } from 'vitest';
import { nextDateKey } from '../../src/lib/date-key.js';
import { tomorrowEntry, enrichWithThemes } from '../../src/lib/archive.js';

const INDEX = [
  { date: '2026-06-13', theme: 'Apatow comedies' },
  { date: '2026-06-14', theme: 'The Coen Brothers' },
  { date: '2026-06-15', theme: 'Christopher Nolan' },
];

describe('nextDateKey', () => {
  it('adds one calendar day', () => {
    expect(nextDateKey('2026-06-14')).toBe('2026-06-15');
  });

  it('crosses month boundary', () => {
    expect(nextDateKey('2026-06-30')).toBe('2026-07-01');
  });

  it('crosses year boundary', () => {
    expect(nextDateKey('2026-12-31')).toBe('2027-01-01');
  });
});

describe('tomorrowEntry', () => {
  it('returns the next-day entry when it exists', () => {
    expect(tomorrowEntry(INDEX, '2026-06-14')).toEqual({
      date: '2026-06-15',
      theme: 'Christopher Nolan',
    });
  });

  it('returns null when tomorrow has no index entry', () => {
    expect(tomorrowEntry(INDEX, '2026-06-15')).toBeNull();
  });

  it('returns null when index is empty', () => {
    expect(tomorrowEntry([], '2026-06-14')).toBeNull();
  });

  it('returns null for a non-array index', () => {
    expect(tomorrowEntry(null, '2026-06-14')).toBeNull();
  });
});

describe('enrichWithThemes', () => {
  it('joins theme onto each id from the index', () => {
    const result = enrichWithThemes(['2026-06-14', '2026-06-13'], INDEX);
    expect(result).toEqual([
      { id: '2026-06-14', theme: 'The Coen Brothers' },
      { id: '2026-06-13', theme: 'Apatow comedies' },
    ]);
  });

  it('sets theme to null when date not in index', () => {
    const result = enrichWithThemes(['2026-06-01'], INDEX);
    expect(result[0].theme).toBeNull();
  });

  it('handles empty ids array', () => {
    expect(enrichWithThemes([], INDEX)).toEqual([]);
  });
});
