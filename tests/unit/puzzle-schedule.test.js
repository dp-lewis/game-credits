import { describe, it, expect } from 'vitest';
import { resolvePuzzleId } from '../../src/lib/puzzle-schedule.js';

const IDS = ['2026-06-12', '2026-06-13', '2026-06-14'];

describe('resolvePuzzleId', () => {
  it('returns the exact puzzle for today when present', () => {
    expect(resolvePuzzleId('2026-06-13', IDS)).toBe('2026-06-13');
  });

  it('falls back to the most recent puzzle on or before today', () => {
    expect(resolvePuzzleId('2026-06-20', IDS)).toBe('2026-06-14');
  });

  it('returns null when every puzzle is in the future (no early release)', () => {
    expect(resolvePuzzleId('2026-06-01', IDS)).toBeNull();
  });

  it('returns null when there are no puzzles', () => {
    expect(resolvePuzzleId('2026-06-13', [])).toBeNull();
  });

  it('ignores malformed ids', () => {
    // today (06-13) absent → latest valid on or before → 06-12.
    expect(
      resolvePuzzleId('2026-06-13', ['nope', '2026-06-14', '2026-06-12'])
    ).toBe('2026-06-12');
  });

  it('picks today even when ids are unsorted', () => {
    expect(
      resolvePuzzleId('2026-06-13', ['2026-06-14', '2026-06-13', '2026-06-12'])
    ).toBe('2026-06-13');
  });
});
