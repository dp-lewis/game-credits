import { describe, it, expect, afterEach } from 'vitest';
import '../../src/components/call-sheet-board.js';
import { validatePuzzle } from '../../src/lib/puzzle-loader.js';
import { buildAnswerKey } from '../../src/lib/game-logic.js';
import sample from '../fixtures/sample-puzzle.json';

const puzzle = validatePuzzle(sample);
const answerKey = buildAnswerKey(puzzle);

async function mountBoard() {
  const el = document.createElement('call-sheet-board');
  el.puzzle = puzzle;
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

/** Find the rendered <call-sheet-actor> for a given actor id. */
function actorEl(board, actorId) {
  return [...board.shadowRoot.querySelectorAll('call-sheet-actor')].find(
    (a) => a.actor.id === actorId
  );
}

/** Click the film button (by film index) inside an actor chip. */
async function assign(board, actorId, filmId) {
  const el = actorEl(board, actorId);
  await el.updateComplete;
  const idx = puzzle.films.findIndex((f) => f.id === filmId);
  el.shadowRoot.querySelectorAll('button')[idx].click();
  await board.updateComplete;
}

function submitBtn(board) {
  return board.shadowRoot.querySelector('button.submit');
}

afterEach(() => {
  document.body.innerHTML = '';
});

describe('<call-sheet-board>', () => {
  it('disables submit until every actor is assigned', async () => {
    const board = await mountBoard();
    expect(submitBtn(board).disabled).toBe(true);

    for (const actor of puzzle.actors) {
      await assign(board, actor.id, answerKey[actor.id]);
    }
    expect(submitBtn(board).disabled).toBe(false);
  });

  it('wins when all actors are assigned correctly and submitted', async () => {
    const board = await mountBoard();
    for (const actor of puzzle.actors) {
      await assign(board, actor.id, answerKey[actor.id]);
    }
    submitBtn(board).click();
    await board.updateComplete;

    expect(board._status).toBe('won');
    // Every actor locked.
    expect(board._locked.size).toBe(puzzle.actors.length);
  });

  it('emits game-over with status "won" on a correct submission', async () => {
    const board = await mountBoard();
    const events = [];
    board.addEventListener('game-over', (e) => events.push(e.detail));

    for (const actor of puzzle.actors) {
      await assign(board, actor.id, answerKey[actor.id]);
    }
    submitBtn(board).click();
    await board.updateComplete;

    expect(events).toHaveLength(1);
    expect(events[0]).toMatchObject({ status: 'won', mistakes: 0 });
  });

  it('locks correct actors after a partially-correct submit', async () => {
    const board = await mountBoard();
    // a1 correct, the rest wrong.
    for (const actor of puzzle.actors) {
      const film =
        actor.id === 'a1'
          ? answerKey[actor.id]
          : puzzle.films.find((f) => f.id !== answerKey[actor.id]).id;
      await assign(board, actor.id, film);
    }
    submitBtn(board).click();
    await board.updateComplete;

    expect(board._status).toBe('playing');
    expect(board._locked.has('a1')).toBe(true);
    expect(board._lives).toBe(puzzle.maxMistakes - 1);
  });

  it('loses after exhausting all lives on wrong submits', async () => {
    const board = await mountBoard();
    for (const actor of puzzle.actors) {
      const wrong = puzzle.films.find((f) => f.id !== answerKey[actor.id]).id;
      await assign(board, actor.id, wrong);
    }
    for (let i = 0; i < puzzle.maxMistakes; i++) {
      submitBtn(board).click();
      await board.updateComplete;
    }

    expect(board._status).toBe('lost');
    expect(board._lives).toBe(0);
    expect(board._revealed).toBe(true);
  });
});
