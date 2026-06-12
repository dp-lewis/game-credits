import { LitElement, html, css } from 'lit';
import {
  buildAnswerKey,
  gradeSubmission,
  isComplete,
} from '../lib/game-logic.js';
import { shuffle } from '../lib/shuffle.js';
import './call-sheet-actor.js';

/**
 * `<call-sheet-board>` — the playable board.
 *
 * Renders the two films, a scrambled cast, a lives indicator, and a submit
 * button. Assigning is delegated to `<call-sheet-actor>`; grading and win/lose
 * come from the pure logic in `src/lib`. Game loop: submit → lock correct →
 * spend a life on a wrong submit → win when all locked, lose at zero lives
 * (answers revealed). Emits a `game-over` event for the result/share layer.
 *
 * Property: `puzzle` (a validated Puzzle).
 */
export class CallSheetBoard extends LitElement {
  static properties = {
    puzzle: { attribute: false },
    _assignment: { state: true },
    _locked: { state: true },
    _lives: { state: true },
    _status: { state: true },
    _revealed: { state: true },
  };

  static styles = css`
    :host {
      display: block;
    }

    .legend {
      display: flex;
      justify-content: center;
      gap: 1rem;
      margin-bottom: 0.75rem;
      flex-wrap: wrap;
    }

    .legend-item {
      font-weight: 600;
      padding: 0.2rem 0.6rem;
      border-radius: 999px;
      color: #fff;
    }

    .legend-item.film-0 {
      background: var(--cs-film-a, #2b6cb0);
    }
    .legend-item.film-1 {
      background: var(--cs-film-b, #b7791f);
    }

    .lives {
      text-align: center;
      letter-spacing: 0.2rem;
      margin-bottom: 0.75rem;
      font-size: 1.1rem;
    }

    .life.on {
      color: var(--cs-accent, #2b6cb0);
    }
    .life.off {
      color: var(--cs-border, #ccc);
    }

    .actors {
      list-style: none;
      margin: 0 0 1rem;
      padding: 0;
      display: grid;
      gap: 0.5rem;
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
    this._locked = new Set();
    this._lives = 0;
    this._status = 'playing';
    this._revealed = false;
    /** @type {Record<string,string>} */
    this._answerKey = {};
    /** @type {import('../lib/puzzle-schema.js').Actor[]} */
    this._displayOrder = [];
  }

  willUpdate(changed) {
    if (changed.has('puzzle') && this.puzzle) {
      this._answerKey = buildAnswerKey(this.puzzle);
      this._displayOrder = shuffle(this.puzzle.actors);
      this._assignment = {};
      this._locked = new Set();
      this._lives = this.puzzle.maxMistakes;
      this._status = 'playing';
      this._revealed = false;
    }
  }

  get _complete() {
    return isComplete(this._assignment, this._answerKey);
  }

  _onAssign(event) {
    if (this._status !== 'playing') return;
    const { actorId, filmId } = event.detail;
    if (this._locked.has(actorId)) return;
    this._assignment = { ...this._assignment, [actorId]: filmId };
  }

  _submit() {
    if (this._status !== 'playing' || !this._complete) return;

    const result = gradeSubmission(
      this._assignment,
      this._answerKey,
      this.puzzle.maxMistakes
    );

    const locked = new Set(this._locked);
    for (const actorResult of result.results) {
      if (actorResult.correct) locked.add(actorResult.actorId);
    }
    this._locked = locked;

    if (result.solved) {
      this._status = 'won';
      this._emitGameOver(result);
      return;
    }

    this._lives -= 1;
    if (this._lives <= 0) {
      this._lives = 0;
      this._status = 'lost';
      this._revealed = true;
      this._emitGameOver(result);
    }
  }

  _emitGameOver(result) {
    this.dispatchEvent(
      new CustomEvent('game-over', {
        detail: {
          status: this._status,
          mistakes: this.puzzle.maxMistakes - this._lives,
          maxMistakes: this.puzzle.maxMistakes,
          result,
        },
        bubbles: true,
        composed: true,
      })
    );
  }

  render() {
    if (!this.puzzle) return html``;
    const films = this.puzzle.films;
    const lives = this.puzzle.maxMistakes;

    return html`
      <section class="board" @actor-assign=${this._onAssign}>
        <header class="legend">
          ${films.map(
            (film, i) =>
              html`<span class="legend-item film-${i}">${film.title}</span>`
          )}
        </header>

        <div class="lives" aria-label="Lives remaining">
          ${Array.from(
            { length: lives },
            (_, i) =>
              html`<span class="life ${i < this._lives ? 'on' : 'off'}"
                >●</span
              >`
          )}
        </div>

        <ul class="actors">
          ${this._displayOrder.map(
            (actor) =>
              html`<li>
                <call-sheet-actor
                  .actor=${actor}
                  .films=${films}
                  .assignedFilmId=${this._assignment[actor.id] ?? null}
                  .correctFilmId=${this._answerKey[actor.id]}
                  ?locked=${this._locked.has(actor.id)}
                  ?revealed=${this._revealed}
                ></call-sheet-actor>
              </li>`
          )}
        </ul>

        <button
          class="submit"
          ?disabled=${!this._complete || this._status !== 'playing'}
          @click=${this._submit}
        >
          Submit
        </button>

        ${this._renderBanner()}
      </section>
    `;
  }

  _renderBanner() {
    if (this._status === 'won') {
      return html`<p class="banner won" role="status">
        Solved! You sorted the whole cast. 🎬
      </p>`;
    }
    if (this._status === 'lost') {
      return html`<p class="banner lost" role="status">
        Out of lives — the correct films are revealed.
      </p>`;
    }
    return html`<p class="banner" role="status">
      Sort every actor into their film, then submit.
    </p>`;
  }
}

customElements.define('call-sheet-board', CallSheetBoard);
