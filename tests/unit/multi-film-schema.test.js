import { describe, it, expect } from 'vitest';
import { validatePuzzle } from '../../src/lib/puzzle-loader.js';
import fourFilm from '../../public/puzzles/2026-06-13.json';
import threeFilm from '../../public/puzzles/2026-06-14.json';
import twoFilm from '../fixtures/sample-puzzle.json';

const clone = (o) => JSON.parse(JSON.stringify(o));

describe('multi-film schema (v2)', () => {
  it('validates the 4-film / 16-actor fixture', () => {
    const puzzle = validatePuzzle(clone(fourFilm));
    expect(puzzle.films).toHaveLength(4);
    expect(puzzle.actors).toHaveLength(16);
  });

  it('preserves alsoIn overlap metadata in the normalized output', () => {
    const puzzle = validatePuzzle(clone(fourFilm));
    const pitt = puzzle.actors.find((a) => a.id === 'pitt');
    expect(pitt.alsoIn).toEqual(['ouath']);
    const leo = puzzle.actors.find((a) => a.id === 'dicaprio');
    expect(leo.alsoIn).toEqual(['inception', 'ouath']);
    // Single-film actors carry no alsoIn.
    expect(
      puzzle.actors.find((a) => a.id === 'clooney').alsoIn
    ).toBeUndefined();
  });

  it('validates the 3-film / 12-actor fixture (4 per film)', () => {
    const puzzle = validatePuzzle(clone(threeFilm));
    expect(puzzle.films).toHaveLength(3);
    expect(puzzle.actors).toHaveLength(12);
    // Michael Caine is the all-three crossover.
    expect(puzzle.actors.find((a) => a.id === 'caine').alsoIn).toEqual([
      'inception',
      'the-dark-knight',
    ]);
  });

  it('still validates a 2-film puzzle (backward compatible)', () => {
    expect(() => validatePuzzle(clone(twoFilm))).not.toThrow();
  });

  it('rejects fewer than two films', () => {
    const data = clone(fourFilm);
    data.films = [data.films[0]];
    expect(() => validatePuzzle(data)).toThrow(/at least 2 films/);
  });

  it('rejects unbalanced groups', () => {
    const data = clone(fourFilm);
    // Move one Ocean's Eleven actor to Inception → 3 vs 5.
    data.actors.find((a) => a.id === 'pitt').filmId = 'inception';
    expect(() => validatePuzzle(data)).toThrow(/balanced/);
  });

  it('rejects an actor count not divisible by the film count', () => {
    const data = clone(fourFilm);
    data.actors.push({ id: 'extra', name: 'Extra', filmId: 'inception' });
    expect(() => validatePuzzle(data)).toThrow(/divisible/);
  });

  describe('alsoIn validation', () => {
    it('rejects alsoIn referencing an unknown film', () => {
      const data = clone(fourFilm);
      data.actors.find((a) => a.id === 'pitt').alsoIn = ['nope'];
      expect(() => validatePuzzle(data)).toThrow(/unknown film/);
    });

    it('rejects alsoIn that includes the solution film', () => {
      const data = clone(fourFilm);
      data.actors.find((a) => a.id === 'pitt').alsoIn = ['oceans-eleven'];
      expect(() => validatePuzzle(data)).toThrow(
        /must not include the solution/
      );
    });

    it('rejects duplicate films within alsoIn', () => {
      const data = clone(fourFilm);
      data.actors.find((a) => a.id === 'dicaprio').alsoIn = [
        'inception',
        'inception',
      ];
      expect(() => validatePuzzle(data)).toThrow(/duplicate film/);
    });

    it('rejects a non-array alsoIn', () => {
      const data = clone(fourFilm);
      data.actors.find((a) => a.id === 'pitt').alsoIn = 'ouath';
      expect(() => validatePuzzle(data)).toThrow(/must be an array/);
    });
  });
});
