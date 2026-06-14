import { LitElement, html, css } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import { buildAnswerKey } from '../lib/game-logic.js';
import { gradeGroups } from '../lib/group-logic.js';
import { shuffle } from '../lib/shuffle.js';
import './call-sheet-actor.js';

/**
 * `<call-sheet-board>` — the column group board.
 *
 * The cast is laid out in an N-column grid, one column per (hidden) film. The
 * grid is always full: the actors start shuffled, `groupSize` per column, and a
 * column *is* a group. The player rearranges by **select-then-swap** — tap an
 * actor to select it, tap another cell to swap the two (animated). Submitting
 * grades each column by membership (`gradeGroups`): a column whose members share
 * a film locks and reveals that film's title; a wrong/partial submit costs a
 * life and shows per-group progress (e.g. `Grp1 4/4 ✓ · Grp2 3/4 · Grp3 1/4`);
 * out of lives reveals the full solution. Emits `game-over` for the result/share
 * layer.
 *
 * Property: `puzzle` (a validated Puzzle).
 */
export class CallSheetBoard extends LitElement {
  static properties = {
    puzzle: { attribute: false },
    _columns: { state: true },
    _selected: { state: true },
    _solved: { state: true },
    _bucketFilm: { state: true },
    _lives: { state: true },
    _status: { state: true },
    _progress: { state: true },
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
      color: var(--cs-wrong, #c53030);
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
      grid-auto-rows: 1fr;
    }

    .head {
      font-weight: 700;
      text-align: center;
      padding: 0.4rem 0.3rem;
      border-radius: 0.5rem;
      border: 2px solid var(--cs-border, #ccc);
      background: var(--cs-card, #fff);
      color: inherit;
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
      border-color: var(--cs-group-0);
    }
    .head.g1 {
      border-color: var(--cs-group-1);
    }
    .head.g2 {
      border-color: var(--cs-group-2);
    }
    .head.g3 {
      border-color: var(--cs-group-3);
    }
    .head.solved {
      color: #fff;
    }
    .head.solved.g0 {
      background: var(--cs-group-0);
    }
    .head.solved.g1 {
      background: var(--cs-group-1);
    }
    .head.solved.g2 {
      background: var(--cs-group-2);
    }
    .head.solved.g3 {
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

    .solution {
      list-style: none;
      margin: 1rem 0 0;
      padding: 0;
      display: grid;
      gap: 0.4rem;
    }
    .solution li {
      padding: 0.5rem 0.75rem;
      border-radius: 0.6rem;
      color: #fff;
    }
    .solution .g0 {
      background: var(--cs-group-0);
    }
    .solution .g1 {
      background: var(--cs-group-1);
    }
    .solution .g2 {
      background: var(--cs-group-2);
    }
    .solution .g3 {
      background: var(--cs-group-3);
    }
    .solution .title {
      font-weight: 700;
    }
    .solution .cast {
      font-size: 0.9rem;
      opacity: 0.95;
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
    this._answerKey = {};
    this._filmTitle = {};
    this._numGroups = 0;
    this._groupSize = 0;
    this._announce = '';
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
      this._announce = '';
    }
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

  // Map actorId → { col, row } for grid placement.
  _placement() {
    const map = {};
    this._columns.forEach((col, c) =>
      col.forEach((id, r) => {
        map[id] = { col: c, row: r };
      })
    );
    return map;
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
  _flip(before) {
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
        { duration: 180, easing: 'ease' }
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
      return;
    }

    this._lives -= 1;
    if (this._lives <= 0) {
      this._lives = 0;
      this._status = 'lost';
      this._emitGameOver(grade);
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
        style="--cols: ${this._numGroups}"
      >
        <div class="lives" aria-label="Lives remaining">
          ${Array.from(
            { length: this.puzzle.maxMistakes },
            (_, i) =>
              html`<span class="life ${i < this._lives ? 'on' : 'off'}"
                >●</span
              >`
          )}
        </div>

        <p class="a11y-status" role="status" aria-live="polite">
          ${this._announce}
        </p>

        ${this._renderHeaders()} ${this._renderCells()}

        <button
          class="submit"
          ?disabled=${this._status !== 'playing'}
          @click=${this._submit}
        >
          Submit
        </button>

        ${this._renderBanner()} ${this._renderSolution()}
      </section>
    `;
  }

  _renderHeaders() {
    // The header row carries the per-group feedback, so it is the live region.
    return html`<div
      class="headers"
      role="status"
      aria-live="polite"
    >
      ${Array.from({ length: this._numGroups }, (_, c) => {
        const solved = this._solved.has(c);
        if (solved) {
          return html`<div class="head g${c} solved">
            <span class="title">${this._filmTitle[this._bucketFilm[c]]}</span>
            <span class="tick" aria-label="solved">✓</span>
          </div>`;
        }
        const progress = this._progress?.[c];
        return html`<div class="head g${c}">
          <span class="label">Movie ${c + 1}</span>
          ${progress
            ? html`<span class="count">${progress.count}/${progress.total}</span>`
            : ''}
        </div>`;
      })}
    </div>`;
  }

  _renderCells() {
    const place = this._placement();
    // Render from the stable puzzle order so each chip keeps DOM identity across
    // swaps (only its grid placement changes) — that's what makes FLIP smooth.
    return html`<ul class="cells">
      ${repeat(
        this.puzzle.actors,
        (actor) => actor.id,
        (actor) => {
          const pos = place[actor.id];
          const locked = this._solved.has(pos.col);
          return html`<li
            class="cell"
            style="grid-column: ${pos.col + 1}; grid-row: ${pos.row + 1};"
          >
            <call-sheet-actor
              data-actor=${actor.id}
              .actor=${actor}
              .bucketIndex=${pos.col}
              ?selected=${this._selected === actor.id}
              ?locked=${locked || this._status !== 'playing'}
            ></call-sheet-actor>
          </li>`;
        }
      )}
    </ul>`;
  }

  _renderBanner() {
    if (this._status === 'won') {
      return html`<p class="banner won" role="status">
        Solved! You found every group. 🎬
      </p>`;
    }
    if (this._status === 'lost') {
      return html`<p class="banner lost" role="status">
        Out of lives — here's the full call sheet.
      </p>`;
    }
    return '';
  }

  _renderSolution() {
    if (this._status !== 'lost') return '';
    return html`<ul class="solution">
      ${this.puzzle.films.map((film, i) => {
        const names = this.puzzle.actors
          .filter((a) => a.filmId === film.id)
          .map((a) => a.name)
          .join(', ');
        return html`<li class="g${i}">
          <span class="title">${film.title}</span>
          <span class="cast"> — ${names}</span>
        </li>`;
      })}
    </ul>`;
  }
}

customElements.define('call-sheet-board', CallSheetBoard);
