import { LitElement, html, css } from 'lit';
import { buildAnswerKey } from '../lib/game-logic.js';
import { gradeGroups } from '../lib/group-logic.js';
import { shuffle } from '../lib/shuffle.js';
import './call-sheet-actor.js';

/**
 * `<call-sheet-board>` — the v2 hidden-films group board.
 *
 * Films' titles are hidden. The player arranges the cast into N colour-coded
 * buckets (group size = actors / films) by picking an active bucket and tapping
 * actors. Submitting grades each bucket by membership (`gradeGroups`): a bucket
 * whose members share a film locks and reveals that film's title; a wrong/partial
 * submit costs a life; a near-miss shows "One away…"; out of lives reveals the
 * full solution. Emits `game-over` for the result/share layer.
 *
 * Property: `puzzle` (a validated Puzzle).
 */
export class CallSheetBoard extends LitElement {
  static properties = {
    puzzle: { attribute: false },
    _assignment: { state: true },
    _active: { state: true },
    _solved: { state: true },
    _bucketFilm: { state: true },
    _lives: { state: true },
    _status: { state: true },
    _oneAway: { state: true },
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

    .solved {
      list-style: none;
      margin: 0 0 0.75rem;
      padding: 0;
      display: grid;
      gap: 0.4rem;
    }
    .solved li {
      padding: 0.5rem 0.75rem;
      border-radius: 0.6rem;
      color: #fff;
    }
    .solved .g0 {
      background: var(--cs-group-0);
    }
    .solved .g1 {
      background: var(--cs-group-1);
    }
    .solved .g2 {
      background: var(--cs-group-2);
    }
    .solved .g3 {
      background: var(--cs-group-3);
    }
    .solved .title {
      font-weight: 700;
    }
    .solved .cast {
      font-size: 0.9rem;
      opacity: 0.95;
    }

    .buckets {
      display: flex;
      flex-wrap: wrap;
      gap: 0.4rem;
      margin-bottom: 0.75rem;
    }
    .bucket {
      flex: 1 1 6rem;
      font: inherit;
      font-weight: 600;
      padding: 0.5rem;
      border: 2px solid var(--cs-border, #ccc);
      border-radius: 0.6rem;
      background: var(--cs-card, #fff);
      color: inherit;
      cursor: pointer;
      min-height: 3rem;
    }
    .bucket.active {
      color: #fff;
    }
    .bucket.g0.active {
      background: var(--cs-group-0);
      border-color: var(--cs-group-0);
    }
    .bucket.g1.active {
      background: var(--cs-group-1);
      border-color: var(--cs-group-1);
    }
    .bucket.g2.active {
      background: var(--cs-group-2);
      border-color: var(--cs-group-2);
    }
    .bucket.g3.active {
      background: var(--cs-group-3);
      border-color: var(--cs-group-3);
    }
    .bucket .count {
      display: block;
      font-weight: 400;
      font-size: 0.85rem;
    }
    .bucket.oneaway {
      outline: 2px dashed var(--cs-wrong, #c53030);
    }

    .grid {
      list-style: none;
      margin: 0 0 1rem;
      padding: 0;
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 0.5rem;
    }
    @media (min-width: 30rem) {
      .grid {
        grid-template-columns: repeat(4, 1fr);
      }
    }

    .hint {
      text-align: center;
      min-height: 1.25rem;
      margin: 0 0 0.5rem;
      color: var(--cs-wrong, #c53030);
      font-weight: 600;
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
    this._assignment = {};
    this._active = 0;
    this._solved = new Set();
    this._bucketFilm = {};
    this._lives = 0;
    this._status = 'playing';
    this._oneAway = new Set();
    this._answerKey = {};
    this._displayOrder = [];
    this._filmTitle = {};
    this._numBuckets = 0;
    this._groupSize = 0;
  }

  willUpdate(changed) {
    if (changed.has('puzzle') && this.puzzle) {
      this._answerKey = buildAnswerKey(this.puzzle);
      this._displayOrder = shuffle(this.puzzle.actors);
      this._filmTitle = Object.fromEntries(
        this.puzzle.films.map((f) => [f.id, f.title])
      );
      this._numBuckets = this.puzzle.films.length;
      this._groupSize = this.puzzle.actors.length / this.puzzle.films.length;
      this._assignment = {};
      this._active = 0;
      this._solved = new Set();
      this._bucketFilm = {};
      this._lives = this.puzzle.maxMistakes;
      this._status = 'playing';
      this._oneAway = new Set();
    }
  }

  _bucketActors(b) {
    return this._displayOrder
      .map((a) => a.id)
      .filter((id) => this._assignment[id] === b);
  }

  _count(b) {
    return this._bucketActors(b).length;
  }

  _isLocked(actorId) {
    const b = this._assignment[actorId];
    return b !== undefined && this._solved.has(b);
  }

  get _complete() {
    for (let b = 0; b < this._numBuckets; b++) {
      if (this._solved.has(b)) continue;
      if (this._count(b) !== this._groupSize) return false;
    }
    return true;
  }

  _selectBucket(b) {
    if (this._status !== 'playing' || this._solved.has(b)) return;
    this._active = b;
  }

  _onPick(event) {
    if (this._status !== 'playing') return;
    const { actorId } = event.detail;
    if (this._isLocked(actorId)) return;

    const current = this._assignment[actorId];
    if (current === this._active) {
      // Tap an actor already in the active bucket → remove it.
      const next = { ...this._assignment };
      delete next[actorId];
      this._assignment = next;
      return;
    }
    // Move into the active bucket if it has room.
    if (this._count(this._active) >= this._groupSize) return;
    this._assignment = { ...this._assignment, [actorId]: this._active };
  }

  _submit() {
    if (this._status !== 'playing' || !this._complete) return;

    const buckets = [];
    for (let b = 0; b < this._numBuckets; b++)
      buckets.push(this._bucketActors(b));
    const grade = gradeGroups(buckets, this._answerKey, this._groupSize);

    const solved = new Set(this._solved);
    const bucketFilm = { ...this._bucketFilm };
    const oneAway = new Set();
    grade.groups.forEach((group, b) => {
      if (group.correct) {
        solved.add(b);
        bucketFilm[b] = group.filmId;
      } else if (group.oneAway) {
        oneAway.add(b);
      }
    });
    this._solved = solved;
    this._bucketFilm = bucketFilm;
    this._oneAway = oneAway;

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
      return;
    }
    // Keep the active bucket pointing at an unsolved one.
    if (this._solved.has(this._active)) {
      this._active = this._firstUnsolvedBucket();
    }
  }

  _firstUnsolvedBucket() {
    for (let b = 0; b < this._numBuckets; b++) {
      if (!this._solved.has(b)) return b;
    }
    return 0;
  }

  _emitGameOver(grade) {
    this.dispatchEvent(
      new CustomEvent('game-over', {
        detail: {
          status: this._status,
          mistakes: this.puzzle.maxMistakes - this._lives,
          maxMistakes: this.puzzle.maxMistakes,
          groupsSolved: this._solved.size,
          totalGroups: this._numBuckets,
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
      <section @actor-pick=${this._onPick}>
        <div class="lives" aria-label="Lives remaining">
          ${Array.from(
            { length: this.puzzle.maxMistakes },
            (_, i) =>
              html`<span class="life ${i < this._lives ? 'on' : 'off'}"
                >●</span
              >`
          )}
        </div>

        ${this._renderSolved()} ${this._renderBuckets()}
        <p class="hint" role="status">${this._renderHint()}</p>
        ${this._renderGrid()}

        <button
          class="submit"
          ?disabled=${!this._complete || this._status !== 'playing'}
          @click=${this._submit}
        >
          Submit
        </button>

        ${this._renderBanner()} ${this._renderSolution()}
      </section>
    `;
  }

  _renderSolved() {
    const rows = [...this._solved].sort((a, b) => a - b);
    if (rows.length === 0) return '';
    return html`<ul class="solved">
      ${rows.map((b) => {
        const filmId = this._bucketFilm[b];
        const names = this._bucketActors(b)
          .map((id) => this.puzzle.actors.find((a) => a.id === id).name)
          .join(', ');
        return html`<li class="g${b}">
          <span class="title">${this._filmTitle[filmId]}</span>
          <span class="cast"> — ${names}</span>
        </li>`;
      })}
    </ul>`;
  }

  _renderBuckets() {
    if (this._status !== 'playing') return '';
    const indices = [];
    for (let b = 0; b < this._numBuckets; b++) {
      if (!this._solved.has(b)) indices.push(b);
    }
    return html`<div class="buckets" role="group" aria-label="Groups">
      ${indices.map(
        (b) =>
          html`<button
            class="bucket g${b} ${this._active === b
              ? 'active'
              : ''} ${this._oneAway.has(b) ? 'oneaway' : ''}"
            aria-pressed=${this._active === b ? 'true' : 'false'}
            @click=${() => this._selectBucket(b)}
          >
            Group ${b + 1}
            <span class="count">${this._count(b)}/${this._groupSize}</span>
          </button>`
      )}
    </div>`;
  }

  _renderHint() {
    if (this._status !== 'playing') return '';
    if (this._oneAway.size > 0) return 'One away…';
    return '';
  }

  _renderGrid() {
    if (this._status !== 'playing') return '';
    const unlocked = this._displayOrder.filter((a) => !this._isLocked(a.id));
    return html`<ul class="grid">
      ${unlocked.map(
        (actor) =>
          html`<li>
            <call-sheet-actor
              .actor=${actor}
              .bucketIndex=${this._assignment[actor.id] ?? null}
              ?locked=${false}
            ></call-sheet-actor>
          </li>`
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
    return html`<ul class="solved">
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
