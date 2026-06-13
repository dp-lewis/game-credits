import { describe, it, expect } from 'vitest';
import {
  countPartitions,
  hasUniqueSolution,
  assemblePuzzle,
} from '../../src/lib/curation.js';
import { validatePuzzle } from '../../src/lib/puzzle-loader.js';
import { mulberry32 } from '../../src/lib/shuffle.js';
import pool from '../../scripts/fixtures/sample-casts.json';

const oracleFor = (puzzle) =>
  puzzle.actors.map((a) => ({ films: [a.filmId, ...(a.alsoIn || [])] }));

describe('countPartitions', () => {
  it('counts a single solution for an all-anchor set', () => {
    const actors = [
      { films: ['f1'] },
      { films: ['f1'] },
      { films: ['f2'] },
      { films: ['f2'] },
    ];
    expect(countPartitions(actors, ['f1', 'f2'], 2)).toBe(1);
  });

  it('detects multiple solutions (capped at 2)', () => {
    const actors = [{ films: ['f1', 'f2'] }, { films: ['f1', 'f2'] }];
    expect(countPartitions(actors, ['f1', 'f2'], 1)).toBe(2);
  });

  it('returns 0 when a film cannot be filled', () => {
    const actors = [
      { films: ['f1'] },
      { films: ['f1'] },
      { films: ['f1'] },
      { films: ['f1'] },
    ];
    expect(countPartitions(actors, ['f1', 'f2'], 2)).toBe(0);
  });

  it('hasUniqueSolution reflects the count', () => {
    const unique = [{ films: ['f1'] }, { films: ['f2'] }];
    expect(hasUniqueSolution(unique, ['f1', 'f2'], 1)).toBe(true);
  });
});

describe('assemblePuzzle', () => {
  it('produces a schema-valid, uniquely-solvable 3-film puzzle', () => {
    const puzzle = assemblePuzzle(pool, {
      id: '2026-06-15',
      filmCount: 3,
      groupSize: 4,
      rng: mulberry32(7),
    });
    expect(puzzle).not.toBeNull();
    expect(() => validatePuzzle(puzzle)).not.toThrow();
    expect(puzzle.films).toHaveLength(3);
    expect(puzzle.actors).toHaveLength(12);
    // Exactly one valid partition over real memberships.
    expect(
      countPartitions(
        oracleFor(puzzle),
        puzzle.films.map((f) => f.id),
        4
      )
    ).toBe(1);
  });

  it('includes at least one crossover trap when the data allows', () => {
    const puzzle = assemblePuzzle(pool, {
      id: '2026-06-15',
      filmCount: 3,
      groupSize: 4,
      rng: mulberry32(7),
    });
    const traps = puzzle.actors.filter((a) => a.alsoIn?.length).length;
    expect(traps).toBeGreaterThan(0);
  });

  it('is deterministic for a given seed', () => {
    const a = assemblePuzzle(pool, {
      id: 'x',
      filmCount: 3,
      groupSize: 4,
      rng: mulberry32(3),
    });
    const b = assemblePuzzle(pool, {
      id: 'x',
      filmCount: 3,
      groupSize: 4,
      rng: mulberry32(3),
    });
    expect(a).toEqual(b);
  });

  it('assembles a 4-film puzzle too', () => {
    const puzzle = assemblePuzzle(pool, {
      id: '2026-06-16',
      filmCount: 4,
      groupSize: 4,
      rng: mulberry32(11),
    });
    expect(puzzle).not.toBeNull();
    expect(puzzle.films).toHaveLength(4);
    expect(puzzle.actors).toHaveLength(16);
    expect(
      countPartitions(
        oracleFor(puzzle),
        puzzle.films.map((f) => f.id),
        4
      )
    ).toBe(1);
  });

  it('emits only the expected actor fields (no leakage)', () => {
    const puzzle = assemblePuzzle(pool, {
      id: 'x',
      filmCount: 3,
      groupSize: 4,
      rng: mulberry32(1),
    });
    for (const a of puzzle.actors) {
      expect(Object.keys(a).sort()).toEqual(
        a.alsoIn ? ['alsoIn', 'filmId', 'id', 'name'] : ['filmId', 'id', 'name']
      );
    }
  });

  it('assembles an all-anchor puzzle (no crossovers, no year) when maxTraps is 0', () => {
    const plain = [
      {
        id: 'f1',
        title: 'F1',
        cast: 'abcd'.split('').map((c) => ({ id: `1${c}`, name: `1${c}` })),
      },
      {
        id: 'f2',
        title: 'F2',
        cast: 'abcd'.split('').map((c) => ({ id: `2${c}`, name: `2${c}` })),
      },
      {
        id: 'f3',
        title: 'F3',
        cast: 'abcd'.split('').map((c) => ({ id: `3${c}`, name: `3${c}` })),
      },
    ];
    const puzzle = assemblePuzzle(plain, {
      id: 'plain',
      filmCount: 3,
      groupSize: 4,
      maxTraps: 0,
      rng: mulberry32(2),
    });
    expect(puzzle).not.toBeNull();
    expect(puzzle.actors.every((a) => !a.alsoIn)).toBe(true);
    expect(puzzle.films.every((f) => f.year === undefined)).toBe(true);
    expect(() => validatePuzzle(puzzle)).not.toThrow();
  });

  it('returns null when the pool is too small', () => {
    expect(
      assemblePuzzle(pool.slice(0, 2), { id: 'x', filmCount: 3 })
    ).toBeNull();
  });

  it('returns null when a film lacks enough single-film anchors', () => {
    const tiny = [
      {
        id: 'f1',
        title: 'F1',
        cast: [
          { id: 'a', name: 'A' },
          { id: 'b', name: 'B' },
        ],
      },
      {
        id: 'f2',
        title: 'F2',
        cast: [
          { id: 'a', name: 'A' },
          { id: 'b', name: 'B' },
        ],
      },
    ];
    expect(
      assemblePuzzle(tiny, { id: 'x', filmCount: 2, groupSize: 2 })
    ).toBeNull();
  });
});
