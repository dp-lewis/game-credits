import { describe, it, expect } from 'vitest';
import { listArchivePuzzles } from '../../src/lib/archive.js';

const MANIFEST = [
  '2026-06-14',
  '2026-06-15',
  '2026-06-16',
  '2026-06-12',
  '2026-06-13',
];

describe('listArchivePuzzles', () => {
  it('returns dates on or before today, newest first', () => {
    expect(listArchivePuzzles(MANIFEST, '2026-06-14')).toEqual([
      '2026-06-14',
      '2026-06-13',
      '2026-06-12',
    ]);
  });

  it('excludes future dates (no spoilers)', () => {
    expect(listArchivePuzzles(MANIFEST, '2026-06-14')).not.toContain(
      '2026-06-15'
    );
  });

  it('includes today when present', () => {
    expect(listArchivePuzzles(MANIFEST, '2026-06-16')[0]).toBe('2026-06-16');
  });

  it('ignores malformed ids', () => {
    expect(
      listArchivePuzzles(['nope', '2026-13-99', '2026-06-13'], '2026-06-14')
    ).toEqual(['2026-06-13']);
  });

  it('returns [] for empty or non-array input', () => {
    expect(listArchivePuzzles([], '2026-06-14')).toEqual([]);
    expect(listArchivePuzzles(null, '2026-06-14')).toEqual([]);
  });
});
