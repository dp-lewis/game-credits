import { LitElement, html, css } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import { buildAnswerKey } from '../lib/game-logic.js';
import { gradeGroups } from '../lib/group-logic.js';
import { shuffle } from '../lib/shuffle.js';
import './call-sheet-actor.js';

// How long the end-game reveal takes to slide actors into their correct movies.
const REVEAL_MOVE_MS = 1000;

/**
 * `<call-sheet-board>` — the column group board.
 *
 * The cast is laid out in an N-column grid, one column per (hidden) film. The
 * grid is always full: the actors start shuffled, `groupSize` per column, and a
 * column *is* a group. The player rearranges by **select-then-swap** — tap an
 * actor to select it, tap another cell to swap the two (animated). Submitting
 * grades each column by membership (`gradeGroups`): a column whose members share
 * a film locks and reveals that film's title; a wrong/partial submit costs a
 * life and shows per-group progress (e.g. `Movie 1 4/4 ✓ · Movie 2 3/4`). At game
 * over the board reveals the result in place: a win ticks every chip; a loss pauses,
 * reveals every title, and animates the misplaced actors into their correct movies,
 * ticking the picks the player got right. Emits `game-over` for the app layer.
 *
 * Properties: `puzzle` (a validated Puzzle); `reveal` (show the solved solution
 * directly, for the already-played view).
 */
export class CallSheetBoard extends LitElement {
  static properties = {
    puzzle: { attribute: false },
    // When set, render the solved solution directly (no play) — used by the
    // already-played view to reveal the answer without a game.
    reveal: { attribute: false },
    _columns: { state: true },
    _selected: { state: true },
    _solved: { state: true },
    _bucketFilm: { state: true },
    _lives: { state: true },
    _status: { state: true },
    _progress: { state: true },
    _revealed: { state: true },
    _revealTicks: { state: true },
    _activeCell: { state: true },
  };

  static styles = css`
    :host {
      display: block;
    }

    .lives {
      text-align: center;
      letter-spacing: 0.2rem;
      font-size: 1.1rem;
      margin-bottom: 0.75rem;
    }
    .life.on {
      color: var(--cs-lives, #d9756e);
    }
    .life.off {
      color: var(--cs-border, #ccc);
    }

    .a11y-status {
      position: absolute;
      width: 1px;
      height: 1px;
      margin: -1px;
      padding: 0;
      overflow: hidden;
      clip: rect(0 0 0 0);
      white-space: nowrap;
      border: 0;
    }

    /* Column headers and the cell grid share the same column template so the
       header sits directly above its column. */
    .headers,
    .cells {
      display: grid;
      grid-template-columns: repeat(var(--cols, 3), 1fr);
      gap: 0.5rem;
    }
    .headers {
      margin-bottom: 0.5rem;
    }
    .cells {
      list-style: none;
      margin: 0 0 1rem;
      padding: 0;
      grid-template-rows: repeat(var(--rows, 4), 1fr);
      grid-auto-flow: column;
    }

    .head {
      font-weight: 700;
      text-align: center;
      padding: 0.4rem 0.3rem;
      border-radius: 0.5rem;
      border: none;
      /* Solid pastel fill (set per column below) + constant dark text. */
      background: var(--cs-card, #fff);
      color: var(--cs-tile-fg, #1a1a1a);
      font-size: 0.9rem;
      line-height: 1.15;
      min-height: 2.5rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 0.1rem;
    }
    .head .count {
      font-weight: 600;
      font-size: 0.8rem;
      opacity: 0.85;
    }
    .head .tick {
      font-weight: 700;
    }
    .head.g0 {
      background: var(--cs-group-0);
    }
    .head.g1 {
      background: var(--cs-group-1);
    }
    .head.g2 {
      background: var(--cs-group-2);
    }
    .head.g3 {
      background: var(--cs-group-3);
    }

    .cell {
      min-width: 0;
    }

    .submit {
      display: block;
      width: 100%;
      font: inherit;
      font-weight: 600;
      padding: 0.75rem;
      border: none;
      border-radius: 0.75rem;
      background: var(--cs-accent, #2b6cb0);
      color: #fff;
      cursor: pointer;
      min-height: 3rem;
    }
    .submit:disabled {
      background: var(--cs-border, #ccc);
      color: var(--cs-muted, #555);
      cursor: default;
    }

    .banner {
      text-align: center;
      margin: 1rem 0 0;
      font-weight: 600;
    }
    .banner.won {
      color: var(--cs-correct, #2f855a);
    }
    .banner.lost {
      color: var(--cs-wrong, #c53030);
    }
  `;

  constructor() {
    super();
    this._columns = [];
    this._selected = null;
    this._solved = new Set();
    this._bucketFilm = {};
    this._lives = 0;
    this._status = 'playing';
    this._progress = null;
    this._revealed = false;
    this._revealTicks = new Set();
    this._answerKey = {};
    this._filmTitle = {};
    this._numGroups = 0;
    this._groupSize = 0;
    this._announce = '';
    this._activeCell = { col: 0, row: 0 };
    // The beat before the loss reveal animates; overridable so tests run fast.
    this.revealDelayMs = 1000;
    // Resolves when an in-flight reveal finishes (for tests to await).
    this._revealDone = Promise.resolve();
  }

  willUpdate(changed) {
    if (changed.has('puzzle') && this.puzzle) {
      this._answerKey = buildAnswerKey(this.puzzle);
      this._filmTitle = Object.fromEntries(
        this.puzzle.films.map((f) => [f.id, f.title])
      );
      this._numGroups = this.puzzle.films.length;
      this._groupSize = this.puzzle.actors.length / this.puzzle.films.length;
      // Start full: shuffle the cast, then slice evenly into the columns.
      const ids = shuffle(this.puzzle.actors).map((a) => a.id);
      this._columns = Array.from({ length: this._numGroups }, (_, c) =>
        ids.slice(c * this._groupSize, (c + 1) * this._groupSize)
      );
      this._selected = null;
      this._solved = new Set();
      this._bucketFilm = {};
      this._lives = this.puzzle.maxMistakes;
      this._status = 'playing';
      this._progress = null;
      this._revealed = false;
      this._revealTicks = new Set();
      this._announce = '';
      this._activeCell = { col: 0, row: 0 };
    }
    // Static reveal: show the solved solution directly (no game played).
    if (
      (changed.has('reveal') || changed.has('puzzle')) &&
      this.reveal &&
      this.puzzle &&
      !this._revealed
    ) {
      this._showStaticReveal();
    }
  }

  /** Render the solution outright (titles + cast in place), no ticks, no play. */
  _showStaticReveal() {
    this._status = 'revealed';
    this._columns = this.puzzle.films.map((film) =>
      this.puzzle.actors.filter((a) => a.filmId === film.id).map((a) => a.id)
    );
    this._bucketFilm = Object.fromEntries(
      this.puzzle.films.map((film, c) => [c, film.id])
    );
    this._revealTicks = new Set();
    this._revealed = true;
    this._selected = null;
  }

  _actorById(id) {
    return this.puzzle.actors.find((a) => a.id === id);
  }

  _columnOf(actorId) {
    return this._columns.findIndex((col) => col.includes(actorId));
  }

  _isLocked(actorId) {
    return this._solved.has(this._columnOf(actorId));
  }

  _chipEl(actorId) {
    return this.shadowRoot.querySelector(
      `call-sheet-actor[data-actor="${actorId}"]`
    );
  }

  _onPick(event) {
    if (this._status !== 'playing') return;
    const { actorId } = event.detail;
    if (this._isLocked(actorId)) return;

    if (this._selected === null) {
      this._selected = actorId;
      const group = this._columnOf(actorId) + 1;
      this._announce = `Selected ${this._actorById(actorId).name} from Movie ${group}. Choose a cell to swap with.`;
      return;
    }
    if (this._selected === actorId) {
      this._selected = null;
      this._announce = 'Selection cleared.';
      return;
    }
    this._swap(this._selected, actorId);
  }

  async _swap(idA, idB) {
    const reduce =
      typeof matchMedia === 'function' &&
      matchMedia('(prefers-reduced-motion: reduce)').matches;
    const before =
      reduce || !this.shadowRoot
        ? null
        : {
            [idA]: this._rectOf(idA),
            [idB]: this._rectOf(idB),
          };

    // Exchange the two actors' slots (column + row).
    const a = this._locate(idA);
    const b = this._locate(idB);
    const next = this._columns.map((col) => [...col]);
    next[a.col][a.row] = idB;
    next[b.col][b.row] = idA;
    this._columns = next;
    this._selected = null;
    this._announce = `Swapped ${this._actorById(idA).name} and ${this._actorById(idB).name}.`;

    await this.updateComplete;
    if (before) this._flip(before);
    this._focusActiveChip();
  }

  _locate(actorId) {
    for (let c = 0; c < this._columns.length; c++) {
      const r = this._columns[c].indexOf(actorId);
      if (r !== -1) return { col: c, row: r };
    }
    return { col: 0, row: 0 };
  }

  _rectOf(actorId) {
    const el = this._chipEl(actorId);
    return el ? el.getBoundingClientRect() : null;
  }

  // FLIP: each moved chip starts at its old position and animates back to rest.
  // Snappy for in-play swaps; slowed for the end-game reveal move.
  _flip(before, duration = 180, easing = 'ease') {
    for (const id of Object.keys(before)) {
      const from = before[id];
      const el = this._chipEl(id);
      if (!from || !el || typeof el.animate !== 'function') continue;
      const now = el.getBoundingClientRect();
      const dx = from.left - now.left;
      const dy = from.top - now.top;
      if (dx === 0 && dy === 0) continue;
      el.animate(
        [{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'none' }],
        { duration, easing }
      );
    }
  }

  _submit() {
    if (this._status !== 'playing') return;

    const grade = gradeGroups(this._columns, this._answerKey, this._groupSize);

    const solved = new Set(this._solved);
    const bucketFilm = { ...this._bucketFilm };
    grade.groups.forEach((group, c) => {
      if (group.correct) {
        solved.add(c);
        bucketFilm[c] = group.filmId;
      }
    });
    this._solved = solved;
    this._bucketFilm = bucketFilm;
    this._resolveActiveCell();
    // Per-group progress: how many of each column belong to its closest film.
    this._progress = grade.groups.map((group, c) => ({
      count: group.correctCount,
      total: this._groupSize,
      solved: solved.has(c),
    }));
    // A locked actor can never stay selected.
    if (this._selected !== null && this._isLocked(this._selected)) {
      this._selected = null;
    }

    if (grade.allSolved) {
      this._status = 'won';
      this._emitGameOver(grade);
      this._revealDone = this._revealWin();
      return;
    }

    this._lives -= 1;
    if (this._lives <= 0) {
      this._lives = 0;
      this._status = 'lost';
      this._emitGameOver(grade);
      this._revealDone = this._revealLoss();
    }
  }

  _prefersReducedMotion() {
    return (
      typeof matchMedia === 'function' &&
      matchMedia('(prefers-reduced-motion: reduce)').matches
    );
  }

  /** Win: every chip is correct — tick them all (with a light cascade). */
  async _revealWin() {
    this._revealTicks = new Set(this.puzzle.actors.map((a) => a.id));
    this._revealed = true;
    await this.updateComplete;
    if (this._prefersReducedMotion()) return;
    this.puzzle.actors.forEach((actor, i) => {
      const el = this._chipEl(actor.id);
      if (!el || typeof el.animate !== 'function') return;
      el.animate(
        [
          { transform: 'scale(1)' },
          { transform: 'scale(1.06)' },
          { transform: 'scale(1)' },
        ],
        { duration: 260, delay: i * 45, easing: 'ease' }
      );
    });
  }

  /**
   * Loss/partial: pause, reveal every movie, then FLIP the misplaced actors into
   * their correct columns. Player-correct actors keep a tick; movers go blank.
   */
  async _revealLoss() {
    const reduce = this._prefersReducedMotion();
    if (!reduce && this.revealDelayMs > 0) {
      await new Promise((r) => setTimeout(r, this.revealDelayMs));
    }

    const columnFilm = this._resolveColumnFilms();
    // A pick was right when its film matches the film of the column it sat in.
    const ticks = new Set(
      this.puzzle.actors
        .map((a) => a.id)
        .filter((id) => this._answerKey[id] === columnFilm[this._columnOf(id)])
    );

    const before = reduce || !this.shadowRoot ? null : this._captureRects();

    // Target: each column holds its resolved film's cast, in stable order.
    const target = columnFilm.map((filmId) =>
      this.puzzle.actors.filter((a) => a.filmId === filmId).map((a) => a.id)
    );
    this._bucketFilm = Object.fromEntries(columnFilm.map((f, c) => [c, f]));
    this._revealTicks = ticks;
    this._revealed = true;
    this._columns = target;

    await this.updateComplete;
    if (before) this._flip(before, REVEAL_MOVE_MS, 'ease-in-out');
  }

  /**
   * Assign a film to every column for the reveal: solved columns keep theirs;
   * each remaining column takes its modal remaining film (matching the n/4 hint),
   * resolving ties greedily by descending count so it stays a bijection.
   */
  _resolveColumnFilms() {
    const filmsByCol = new Array(this._numGroups).fill(null);
    const takenFilms = new Set();
    for (let c = 0; c < this._numGroups; c++) {
      if (this._solved.has(c)) {
        filmsByCol[c] = this._bucketFilm[c];
        takenFilms.add(this._bucketFilm[c]);
      }
    }

    // Candidate (col, film, count) for every unsolved column, best first.
    const candidates = [];
    for (let c = 0; c < this._numGroups; c++) {
      if (filmsByCol[c]) continue;
      const counts = {};
      for (const id of this._columns[c]) {
        const film = this._answerKey[id];
        counts[film] = (counts[film] || 0) + 1;
      }
      for (const film of this.puzzle.films.map((f) => f.id)) {
        candidates.push({ col: c, film, count: counts[film] || 0 });
      }
    }
    candidates.sort((a, b) => b.count - a.count);

    const usedCols = new Set();
    for (const { col, film } of candidates) {
      if (filmsByCol[col] || usedCols.has(col) || takenFilms.has(film))
        continue;
      filmsByCol[col] = film;
      usedCols.add(col);
      takenFilms.add(film);
    }
    return filmsByCol;
  }

  _captureRects() {
    const rects = {};
    for (const actor of this.puzzle.actors) {
      const r = this._rectOf(actor.id);
      if (r) rects[actor.id] = r;
    }
    return rects;
  }

  _onGridKeydown(e) {
    if (this._status !== 'playing') return;
    const DIRS = {
      ArrowUp: 'up',
      ArrowDown: 'down',
      ArrowLeft: 'left',
      ArrowRight: 'right',
    };
    const dir = DIRS[e.key];
    if (!dir) return;
    e.preventDefault();
    const { col, row } = this._activeCell;
    let nextCol = col;
    let nextRow = row;
    if (dir === 'up') {
      nextRow = Math.max(0, row - 1);
    } else if (dir === 'down') {
      nextRow = Math.min(this._groupSize - 1, row + 1);
    } else if (dir === 'left') {
      for (let c = col - 1; c >= 0; c--) {
        if (!this._solved.has(c)) {
          nextCol = c;
          break;
        }
      }
    } else {
      for (let c = col + 1; c < this._numGroups; c++) {
        if (!this._solved.has(c)) {
          nextCol = c;
          break;
        }
      }
    }
    this._activeCell = { col: nextCol, row: nextRow };
    this.updateComplete.then(() => this._focusActiveChip());
  }

  _focusActiveChip() {
    const { col, row } = this._activeCell ?? { col: 0, row: 0 };
    const id = this._columns[col]?.[row];
    if (id === null || id === undefined) return;
    this._chipEl(id)?.focus();
  }

  _resolveActiveCell() {
    const { col, row } = this._activeCell;
    if (!this._solved.has(col)) return;
    for (let d = 1; d < this._numGroups; d++) {
      if (col + d < this._numGroups && !this._solved.has(col + d)) {
        this._activeCell = { col: col + d, row };
        return;
      }
      if (col - d >= 0 && !this._solved.has(col - d)) {
        this._activeCell = { col: col - d, row };
        return;
      }
    }
  }

  _emitGameOver(grade) {
    this.dispatchEvent(
      new CustomEvent('game-over', {
        detail: {
          status: this._status,
          mistakes: this.puzzle.maxMistakes - this._lives,
          maxMistakes: this.puzzle.maxMistakes,
          groupsSolved: this._solved.size,
          totalGroups: this._numGroups,
          grade,
        },
        bubbles: true,
        composed: true,
      })
    );
  }

  render() {
    if (!this.puzzle) return html``;
    return html`
      <section
        @actor-pick=${this._onPick}
        style="--cols: ${this._numGroups}; --rows: ${this._groupSize}"
      >
        ${this._status === 'revealed'
          ? ''
          : html`<div class="lives" aria-label="Lives remaining">
              ${Array.from(
                { length: this.puzzle.maxMistakes },
                (_, i) =>
                  html`<span class="life ${i < this._lives ? 'on' : 'off'}"
                    >●</span
                  >`
              )}
            </div>`}

        <p class="a11y-status" role="status" aria-live="polite">
          ${this._announce}
        </p>

        ${this._renderHeaders()} ${this._renderCells()}
        ${this._status === 'playing'
          ? html`<button class="submit" @click=${this._submit}>Submit</button>`
          : ''}
        ${this._renderBanner()}
      </section>
    `;
  }

  _renderHeaders() {
    // The header row carries the per-group feedback, so it is the live region.
    return html`<div class="headers" role="status" aria-live="polite">
      ${Array.from({ length: this._numGroups }, (_, c) => {
        // Reveal all titles at game over; during play only solved columns.
        const titled = this._revealed || this._solved.has(c);
        if (titled) {
          return html`<div class="head g${c} solved">
            <span class="title">${this._filmTitle[this._bucketFilm[c]]}</span>
            ${this._solved.has(c) || this._status === 'won'
              ? html`<span class="tick" aria-label="solved">✓</span>`
              : ''}
          </div>`;
        }
        const progress = this._progress?.[c];
        return html`<div class="head g${c}">
          <span class="label">Movie ${c + 1}</span>
          ${progress
            ? html`<span class="count"
                >${progress.count}/${progress.total}</span
              >`
            : ''}
        </div>`;
      })}
    </div>`;
  }

  _renderCells() {
    // Render column-major (_columns.flat()) so DOM order = visual order = tab order.
    // Lit's keyed repeat moves existing nodes on reorder → FLIP still animates.
    const flatIds = this._columns.flat();
    return html`<ul
      class="cells"
      role="grid"
      aria-label="Cast grid"
      aria-colcount="${this._numGroups}"
      aria-rowcount="${this._groupSize}"
      @keydown=${this._onGridKeydown}
    >
      ${repeat(
        flatIds,
        (id) => id,
        (id, i) => {
          const col = Math.floor(i / this._groupSize);
          const row = i % this._groupSize;
          const actor = this._actorById(id);
          const isLocked = this._solved.has(col) || this._status !== 'playing';
          const ticked = this._revealed
            ? this._revealTicks.has(id)
            : this._solved.has(col);
          const isActive =
            this._status === 'playing' &&
            this._activeCell?.col === col &&
            this._activeCell?.row === row;
          return html`<li
            class="cell"
            role="gridcell"
            aria-rowindex="${row + 1}"
            aria-colindex="${col + 1}"
          >
            <call-sheet-actor
              data-actor=${id}
              .actor=${actor}
              .bucketIndex=${col}
              ?selected=${this._selected === id}
              ?ticked=${ticked}
              ?locked=${isLocked}
              ?active=${isActive}
            ></call-sheet-actor>
          </li>`;
        }
      )}
    </ul>`;
  }

  _renderBanner() {
    if (this._status === 'won') {
      return html`<p class="banner won" role="status">
        Solved! You found every movie. 🎬
      </p>`;
    }
    if (this._status === 'lost') {
      return html`<p class="banner lost" role="status">
        Out of lives — here's the full call sheet.
      </p>`;
    }
    return '';
  }
}

customElements.define('call-sheet-board', CallSheetBoard);
