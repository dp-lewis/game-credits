import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { validatePuzzle } from '../../src/lib/puzzle-loader.js';

// Guard: the LIVE rotation must only ever serve 3-film puzzles. (The schema still
// permits N films by design — this constrains what's in the manifest.)
const manifest = JSON.parse(
  readFileSync('public/puzzles/manifest.json', 'utf8')
);

describe('live puzzle rotation', () => {
  it('the manifest is non-empty', () => {
    expect(Array.isArray(manifest)).toBe(true);
    expect(manifest.length).toBeGreaterThan(0);
  });

  it.each(manifest)('puzzle %s is valid and has exactly 3 films', (id) => {
    const puzzle = validatePuzzle(
      JSON.parse(readFileSync(`public/puzzles/${id}.json`, 'utf8'))
    );
    expect(puzzle.films).toHaveLength(3);
  });
});
