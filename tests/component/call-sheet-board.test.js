import { describe, it, expect, afterEach } from 'vitest';
import '../../src/components/call-sheet-board.js';
import { validatePuzzle } from '../../src/lib/puzzle-loader.js';
import fourFilm from '../fixtures/four-film-puzzle.json';

const puzzle = validatePuzzle(fourFilm);

const GROUPS = [
  ['clooney', 'roberts', 'pitt', 'damon'], // Ocean's Eleven
  ['nicholson', 'wahlberg', 'farmiga', 'dicaprio'], // The Departed
  ['hardy', 'gordon-levitt', 'page', 'watanabe'], // Inception
  ['robbie', 'pacino', 'russell', 'olyphant'], // OUATIH
];

async function mountBoard() {
  const el = document.createElement('call-sheet-board');
  el.revealDelayMs = 0; // no end-game beat in tests
  el.puzzle = puzzle;
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

const chip = (b, id) => b.shadowRoot.querySelector(`call-sheet-actor[data-actor="${id}"]`);
const isTicked = (b, id) => chip(b, id).ticked === true;

const submitBtn = (b) => b.shadowRoot.querySelector('button.submit');
const headers = (b) => [...b.shadowRoot.querySelectorAll('.head')];

function actorEl(board, id) {
  return board.shadowRoot.querySelector(`call-sheet-actor[data-actor="${id}"]`);
}

async function clickActor(board, id) {
  const el = actorEl(board, id);
  await el.updateComplete;
  el.shadowRoot.querySelector('button').click();
  await board.updateComplete;
}

// Deterministic arrangement: the initial board is shuffled, so tests set the
// columns directly (same private-state style as the assertions below).
async function setColumns(board, layout) {
  board._columns = layout.map((col) => [...col]);
  board._selected = null;
  board.requestUpdate();
  await board.updateComplete;
}

afterEach(() => {
  document.body.innerHTML = '';
});

describe('<call-sheet-board> column board', () => {
  it('starts full, so Submit is enabled while playing', async () => {
    const board = await mountBoard();
    // 4 columns × 4 actors, every cell occupied.
    expect(board._columns.length).toBe(4);
    expect(board._columns.flat()).toHaveLength(16);
    expect(submitBtn(board).disabled).toBe(false);
  });

  it('wins when every column is correct (any column order)', async () => {
    const board = await mountBoard();
    // Grading is by membership, so column order doesn't matter.
    await setColumns(board, [GROUPS[2], GROUPS[0], GROUPS[3], GROUPS[1]]);
    submitBtn(board).click();
    await board.updateComplete;
    expect(board._status).toBe('won');
    expect(board._solved.size).toBe(4);
  });

  it('emits game-over with status "won" and zero mistakes on a clean solve', async () => {
    const board = await mountBoard();
    const events = [];
    board.addEventListener('game-over', (e) => events.push(e.detail));
    await setColumns(board, GROUPS);
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

  it('locks a correct column, reveals its film + tick in the header, and keeps playing', async () => {
    const board = await mountBoard();
    await setColumns(board, [
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
    const solvedHead = headers(board)[0];
    expect(solvedHead.textContent).toContain("Ocean's Eleven");
    expect(solvedHead.querySelector('.tick')).not.toBeNull();
  });

  it('shows per-group progress (n/4) inside the headers after a submit', async () => {
    const board = await mountBoard();
    await setColumns(board, [
      GROUPS[0], // 4/4 — Ocean's, correct
      ['nicholson', 'wahlberg', 'farmiga', 'hardy'], // 3/4 — 3 Departed + trap
      ['dicaprio', 'gordon-levitt', 'robbie', 'pacino'], // 2/4 — 2 OUATIH modal
      ['page', 'watanabe', 'russell', 'olyphant'], // 2/4 — split
    ]);
    submitBtn(board).click();
    await board.updateComplete;

    expect(board._status).toBe('playing');
    expect(board._lives).toBe(puzzle.maxMistakes - 1);
    // State carries the per-group counts...
    expect(board._progress.map((p) => p.count)).toEqual([4, 3, 2, 2]);
    expect(board._progress[0].solved).toBe(true);

    // ...and each header shows its own count (or the title + tick when solved).
    const heads = headers(board);
    expect(heads[0].textContent).toContain("Ocean's Eleven");
    expect(heads[0].querySelector('.tick')).not.toBeNull();
    expect(heads[1].textContent).toContain('Movie 2');
    expect(heads[1].querySelector('.count').textContent).toBe('3/4');
    expect(heads[2].querySelector('.count').textContent).toBe('2/4');
  });

  it('headers read "Movie n" with no count before the first submit', async () => {
    const board = await mountBoard();
    expect(board._progress).toBe(null);
    const heads = headers(board);
    expect(heads[0].textContent).toContain('Movie 1');
    expect(heads[0].querySelector('.count')).toBeNull();
    expect(heads.every((h) => !h.textContent.includes('/'))).toBe(true);
  });

  it('loses after exhausting all lives', async () => {
    const board = await mountBoard();
    // Four 2+2 columns: never correct, never one-away.
    await setColumns(board, [
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

  describe('select-then-swap', () => {
    it('selecting one actor then tapping another swaps their columns', async () => {
      const board = await mountBoard();
      await setColumns(board, GROUPS);
      expect(board._columnOf('clooney')).toBe(0);
      expect(board._columnOf('nicholson')).toBe(1);

      await clickActor(board, 'clooney'); // select (col 0)
      expect(board._selected).toBe('clooney');
      await clickActor(board, 'nicholson'); // swap target (col 1)

      expect(board._selected).toBe(null);
      expect(board._columnOf('clooney')).toBe(1);
      expect(board._columnOf('nicholson')).toBe(0);
    });

    it('tapping the selected actor again deselects it', async () => {
      const board = await mountBoard();
      await setColumns(board, GROUPS);
      await clickActor(board, 'clooney');
      expect(board._selected).toBe('clooney');
      await clickActor(board, 'clooney');
      expect(board._selected).toBe(null);
      // No movement occurred.
      expect(board._columnOf('clooney')).toBe(0);
    });

    it('locked actors in a solved column cannot be selected or moved', async () => {
      const board = await mountBoard();
      await setColumns(board, [
        GROUPS[0], // solve column 0
        ['nicholson', 'hardy', 'robbie', 'dicaprio'],
        ['wahlberg', 'gordon-levitt', 'pacino', 'watanabe'],
        ['farmiga', 'page', 'russell', 'olyphant'],
      ]);
      submitBtn(board).click();
      await board.updateComplete;
      expect(board._solved.has(0)).toBe(true);

      // Locked actor's chip is disabled and emits nothing → no selection.
      await clickActor(board, 'clooney');
      expect(board._selected).toBe(null);

      // It also can't be used as a swap target: select an unlocked actor,
      // then tap the locked one — nothing moves.
      await clickActor(board, 'nicholson');
      expect(board._selected).toBe('nicholson');
      await clickActor(board, 'clooney');
      expect(board._selected).toBe('nicholson'); // unchanged
      expect(board._columnOf('clooney')).toBe(0); // still locked in place
    });
  });

  describe('game-over reveal', () => {
    it('win: ticks every chip and reveals every movie title', async () => {
      const board = await mountBoard();
      await setColumns(board, GROUPS);
      submitBtn(board).click();
      await board._revealDone;
      await board.updateComplete;

      expect(board._status).toBe('won');
      expect(board._revealed).toBe(true);
      expect(puzzle.actors.every((a) => isTicked(board, a.id))).toBe(true);
      expect(headers(board).every((h) => h.querySelector('.title'))).toBe(true);
    });

    it('loss: moves misplaced actors into their correct movies, ticking only the right picks', async () => {
      const board = await mountBoard();
      await setColumns(board, [
        GROUPS[0], // Ocean's — solved, stays
        ['nicholson', 'wahlberg', 'farmiga', 'hardy'], // 3 Departed + Inception trap
        ['dicaprio', 'gordon-levitt', 'robbie', 'pacino'], // modal OUATIH
        ['page', 'watanabe', 'russell', 'olyphant'], // modal Inception
      ]);
      board._lives = 1; // next wrong submit ends the game
      submitBtn(board).click();
      await board._revealDone;
      await board.updateComplete;

      expect(board._status).toBe('lost');
      expect(board._revealed).toBe(true);

      // Every actor now sits in its correct movie column.
      for (const a of puzzle.actors) {
        expect(board._bucketFilm[board._columnOf(a.id)]).toBe(a.filmId);
      }

      // Ticks only on the picks the player had in the right movie.
      for (const id of [
        'clooney',
        'nicholson',
        'farmiga',
        'robbie',
        'pacino',
        'page',
        'watanabe',
      ]) {
        expect(isTicked(board, id)).toBe(true);
      }
      for (const id of [
        'hardy',
        'dicaprio',
        'gordon-levitt',
        'russell',
        'olyphant',
      ]) {
        expect(isTicked(board, id)).toBe(false);
      }

      // All movies revealed in the headers.
      expect(headers(board).every((h) => h.querySelector('.title'))).toBe(true);
    });

    it('static reveal renders the solved board — titles, no ticks, no submit/lives', async () => {
      const el = document.createElement('call-sheet-board');
      el.puzzle = puzzle;
      el.reveal = true;
      document.body.appendChild(el);
      await el.updateComplete;

      expect(el._status).toBe('revealed');
      for (const a of puzzle.actors) {
        expect(el._bucketFilm[el._columnOf(a.id)]).toBe(a.filmId);
      }
      expect(puzzle.actors.every((a) => isTicked(el, a.id) === false)).toBe(
        true
      );
      expect(el.shadowRoot.querySelector('button.submit')).toBeNull();
      expect(el.shadowRoot.querySelector('.lives')).toBeNull();
      expect(headers(el).every((h) => h.querySelector('.title'))).toBe(true);
    });
  });
});
