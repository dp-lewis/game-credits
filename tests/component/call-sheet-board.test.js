import { describe, it, expect, afterEach } from 'vitest';
import '../../src/components/call-sheet-board.js';
import { validatePuzzle } from '../../src/lib/puzzle-loader.js';
import fourFilm from '../../public/puzzles/2026-06-13.json';

const puzzle = validatePuzzle(fourFilm);

const GROUPS = [
  ['clooney', 'roberts', 'pitt', 'damon'], // Ocean's Eleven
  ['nicholson', 'wahlberg', 'farmiga', 'dicaprio'], // The Departed
  ['hardy', 'gordon-levitt', 'page', 'watanabe'], // Inception
  ['robbie', 'pacino', 'russell', 'olyphant'], // OUATIH
];

async function mountBoard() {
  const el = document.createElement('call-sheet-board');
  el.puzzle = puzzle;
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

const submitBtn = (b) => b.shadowRoot.querySelector('button.submit');

function bucketBtn(board, idx) {
  return [...board.shadowRoot.querySelectorAll('.bucket')].find((b) =>
    b.textContent.includes(`Group ${idx + 1}`)
  );
}

function actorEl(board, id) {
  return [...board.shadowRoot.querySelectorAll('call-sheet-actor')].find(
    (a) => a.actor.id === id
  );
}

async function clickActor(board, id) {
  const el = actorEl(board, id);
  await el.updateComplete;
  el.shadowRoot.querySelector('button').click();
  await board.updateComplete;
}

async function assignGroup(board, bucketIdx, actorIds) {
  bucketBtn(board, bucketIdx).click();
  await board.updateComplete;
  for (const id of actorIds) await clickActor(board, id);
}

async function assignAll(board, layout) {
  for (let b = 0; b < layout.length; b++)
    await assignGroup(board, b, layout[b]);
}

afterEach(() => {
  document.body.innerHTML = '';
});

describe('<call-sheet-board> v2 (hidden-films groups)', () => {
  it('disables submit until all buckets are full', async () => {
    const board = await mountBoard();
    expect(submitBtn(board).disabled).toBe(true);
    await assignAll(board, GROUPS);
    expect(submitBtn(board).disabled).toBe(false);
  });

  it('wins when every group is correct (any bucket order)', async () => {
    const board = await mountBoard();
    // Put the correct groups in shuffled buckets — grading is by membership.
    await assignAll(board, [GROUPS[2], GROUPS[0], GROUPS[3], GROUPS[1]]);
    submitBtn(board).click();
    await board.updateComplete;
    expect(board._status).toBe('won');
    expect(board._solved.size).toBe(4);
  });

  it('emits game-over with status "won" and zero mistakes on a clean solve', async () => {
    const board = await mountBoard();
    const events = [];
    board.addEventListener('game-over', (e) => events.push(e.detail));
    await assignAll(board, GROUPS);
    submitBtn(board).click();
    await board.updateComplete;
    expect(events).toHaveLength(1);
    expect(events[0]).toMatchObject({
      status: 'won',
      mistakes: 0,
      groupsSolved: 4,
      totalGroups: 4,
    });
  });

  it('locks a correct group, reveals its film, and keeps playing', async () => {
    const board = await mountBoard();
    await assignAll(board, [
      GROUPS[0], // Ocean's — correct
      ['nicholson', 'hardy', 'robbie', 'dicaprio'],
      ['wahlberg', 'gordon-levitt', 'pacino', 'watanabe'],
      ['farmiga', 'page', 'russell', 'olyphant'],
    ]);
    submitBtn(board).click();
    await board.updateComplete;

    expect(board._solved.has(0)).toBe(true);
    expect(board._status).toBe('playing');
    expect(board._lives).toBe(puzzle.maxMistakes - 1);
    expect(board.shadowRoot.querySelector('.solved').textContent).toContain(
      "Ocean's Eleven"
    );
  });

  it('shows "One away…" on a near-miss', async () => {
    const board = await mountBoard();
    await assignAll(board, [
      ['nicholson', 'wahlberg', 'farmiga', 'damon'], // 3 Departed + Damon (trap)
      ['clooney', 'roberts', 'pitt', 'dicaprio'], // 3 Ocean's + DiCaprio
      ['hardy', 'gordon-levitt', 'page', 'robbie'], // 3 Inception + Robbie
      ['watanabe', 'pacino', 'russell', 'olyphant'], // 3 OUATIH + Watanabe
    ]);
    submitBtn(board).click();
    await board.updateComplete;

    expect(board._status).toBe('playing');
    expect(board._lives).toBe(puzzle.maxMistakes - 1);
    expect(board._oneAway.size).toBeGreaterThan(0);
    expect(board.shadowRoot.querySelector('.hint').textContent).toContain(
      'One away'
    );
  });

  it('loses after exhausting all lives', async () => {
    const board = await mountBoard();
    // Four 2+2 buckets: never correct, never one-away.
    await assignAll(board, [
      ['clooney', 'roberts', 'nicholson', 'wahlberg'],
      ['pitt', 'damon', 'farmiga', 'dicaprio'],
      ['hardy', 'gordon-levitt', 'robbie', 'pacino'],
      ['page', 'watanabe', 'russell', 'olyphant'],
    ]);
    for (let i = 0; i < puzzle.maxMistakes; i++) {
      submitBtn(board).click();
      await board.updateComplete;
    }
    expect(board._status).toBe('lost');
    expect(board._lives).toBe(0);
  });
});
