import { describe, it, expect } from 'vitest';
import {
  buildAnswerKey,
  gradeSubmission,
  isComplete,
} from '../../src/lib/game-logic.js';
import { validatePuzzle } from '../../src/lib/puzzle-loader.js';
import sample from '../fixtures/sample-puzzle.json';

const puzzle = validatePuzzle(sample);
const answerKey = buildAnswerKey(puzzle);
// sample: a1,a2 -> film-a ; b1,b2 -> film-b
const allCorrect = { a1: 'film-a', a2: 'film-a', b1: 'film-b', b2: 'film-b' };
const allWrong = { a1: 'film-b', a2: 'film-b', b1: 'film-a', b2: 'film-a' };

describe('buildAnswerKey', () => {
  it('maps every actor to its correct film, preserving order', () => {
    expect(answerKey).toEqual({
      a1: 'film-a',
      a2: 'film-a',
      b1: 'film-b',
      b2: 'film-b',
    });
    expect(Object.keys(answerKey)).toEqual(['a1', 'a2', 'b1', 'b2']);
  });
});

describe('isComplete', () => {
  it('is true when every actor is assigned', () => {
    expect(isComplete(allCorrect, answerKey)).toBe(true);
  });

  it('is false when an actor is missing', () => {
    const { a1, ...partial } = allCorrect;
    void a1;
    expect(isComplete(partial, answerKey)).toBe(false);
  });

  it('is false when an actor is explicitly null', () => {
    expect(isComplete({ ...allCorrect, b2: null }, answerKey)).toBe(false);
  });
});

describe('gradeSubmission', () => {
  it('wins on an all-correct assignment (zero wrong)', () => {
    const r = gradeSubmission(allCorrect, answerKey, 4);
    expect(r).toMatchObject({
      total: 4,
      correct: 4,
      wrong: 0,
      solved: true,
      lost: false,
    });
    expect(r.results.every((x) => x.correct)).toBe(true);
  });

  it('counts all wrong on a fully inverted assignment', () => {
    const r = gradeSubmission(allWrong, answerKey, 4);
    expect(r).toMatchObject({ correct: 0, wrong: 4, solved: false });
  });

  it('does NOT lose when wrong is exactly at the limit', () => {
    // 4 wrong, budget 4 → at limit, not over
    const r = gradeSubmission(allWrong, answerKey, 4);
    expect(r.wrong).toBe(4);
    expect(r.lost).toBe(false);
  });

  it('loses when wrong exceeds the limit', () => {
    // 4 wrong, budget 3 → over
    const r = gradeSubmission(allWrong, answerKey, 3);
    expect(r.lost).toBe(true);
  });

  it('treats an unassigned actor as wrong', () => {
    const { b2, ...partial } = allCorrect;
    void b2;
    const r = gradeSubmission(partial, answerKey, 4);
    expect(r.correct).toBe(3);
    expect(r.wrong).toBe(1);
    const b2Result = r.results.find((x) => x.actorId === 'b2');
    expect(b2Result).toMatchObject({ assignedFilmId: null, correct: false });
  });

  it('ignores assignment keys not in the answer key', () => {
    const r = gradeSubmission({ ...allCorrect, ghost: 'film-a' }, answerKey, 4);
    expect(r.total).toBe(4);
    expect(r.solved).toBe(true);
  });

  it('returns per-actor results in answer-key order', () => {
    const r = gradeSubmission(allCorrect, answerKey, 4);
    expect(r.results.map((x) => x.actorId)).toEqual(['a1', 'a2', 'b1', 'b2']);
  });

  it('handles a missing/empty assignment without throwing', () => {
    const r = gradeSubmission(undefined, answerKey, 4);
    expect(r).toMatchObject({ correct: 0, wrong: 4, solved: false });
  });

  it('reports a single mistake correctly', () => {
    const oneWrong = { ...allCorrect, a2: 'film-b' };
    const r = gradeSubmission(oneWrong, answerKey, 4);
    expect(r).toMatchObject({
      correct: 3,
      wrong: 1,
      solved: false,
      lost: false,
    });
  });
});
