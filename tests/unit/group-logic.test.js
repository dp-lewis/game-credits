import { describe, it, expect } from 'vitest';
import { gradeGroups } from '../../src/lib/group-logic.js';
import { buildAnswerKey } from '../../src/lib/game-logic.js';
import { validatePuzzle } from '../../src/lib/puzzle-loader.js';
import fourFilm from '../fixtures/four-film-puzzle.json';

const puzzle = validatePuzzle(fourFilm);
const answerKey = buildAnswerKey(puzzle);

// Correct groups from the fixture.
const OCEANS = ['clooney', 'roberts', 'pitt', 'damon'];
const DEPARTED = ['nicholson', 'wahlberg', 'farmiga', 'dicaprio'];
const INCEPTION = ['hardy', 'gordon-levitt', 'page', 'watanabe'];
const OUATH = ['robbie', 'pacino', 'russell', 'olyphant'];

describe('gradeGroups', () => {
  it('marks a correct group and reveals its film', () => {
    const { groups } = gradeGroups([OCEANS], answerKey, 4);
    expect(groups[0]).toMatchObject({
      correct: true,
      oneAway: false,
      filmId: 'oceans-eleven',
    });
  });

  it('solves the whole puzzle when all four groups are right', () => {
    const grade = gradeGroups(
      [OCEANS, DEPARTED, INCEPTION, OUATH],
      answerKey,
      4
    );
    expect(grade.allSolved).toBe(true);
    expect(grade.groups.map((g) => g.filmId)).toEqual([
      'oceans-eleven',
      'the-departed',
      'inception',
      'ouath',
    ]);
  });

  it('grading is independent of bucket order', () => {
    const grade = gradeGroups(
      [INCEPTION, OUATH, OCEANS, DEPARTED],
      answerKey,
      4
    );
    expect(grade.allSolved).toBe(true);
  });

  it('flags a near-miss as one-away (3 of one film + 1 crossover trap)', () => {
    // Damon's solution is Ocean's, not The Departed — classic trap.
    const trap = ['nicholson', 'wahlberg', 'farmiga', 'damon'];
    const { groups } = gradeGroups([trap], answerKey, 4);
    expect(groups[0]).toMatchObject({
      correct: false,
      oneAway: true,
      filmId: null,
    });
  });

  it('does not flag a 2+2 split as one-away', () => {
    const split = ['clooney', 'roberts', 'nicholson', 'wahlberg'];
    const { groups } = gradeGroups([split], answerKey, 4);
    expect(groups[0]).toMatchObject({ correct: false, oneAway: false });
  });

  it('treats an under-filled bucket as not correct and not one-away', () => {
    const { groups } = gradeGroups(
      [['clooney', 'roberts', 'pitt']],
      answerKey,
      4
    );
    expect(groups[0]).toMatchObject({ correct: false, oneAway: false });
  });

  it('handles a mix of solved, one-away, and unsolved buckets', () => {
    const grade = gradeGroups(
      [
        OCEANS, // correct
        ['nicholson', 'wahlberg', 'farmiga', 'damon'], // one away
        ['hardy', 'gordon-levitt', 'robbie', 'pacino'], // 2+2
        ['page', 'watanabe', 'russell', 'olyphant'], // 2+2
      ],
      answerKey,
      4
    );
    expect(grade.allSolved).toBe(false);
    expect(grade.groups[0].correct).toBe(true);
    expect(grade.groups[1].oneAway).toBe(true);
    expect(grade.groups[2]).toMatchObject({ correct: false, oneAway: false });
  });

  it('returns allSolved=false for no buckets', () => {
    expect(gradeGroups([], answerKey, 4).allSolved).toBe(false);
  });
});
