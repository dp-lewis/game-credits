import { LitElement, html, css } from 'lit';
import { loadPuzzle } from '../lib/puzzle-loader.js';
import './call-sheet-board.js';
import './call-sheet-result.js';

/**
 * Fixed puzzle id for the MVP. The `daily-puzzle-rotation` work item replaces
 * this with date-based resolution.
 */
const DEFAULT_PUZZLE_ID = '2026-06-14';

/**
 * `<call-sheet-app>` — root application shell. Loads today's puzzle and renders
 * the board, with loading and error states.
 */
export class CallSheetApp extends LitElement {
  static properties = {
    _puzzle: { state: true },
    _error: { state: true },
    _loading: { state: true },
    _gameOver: { state: true },
  };

  static styles = css`
    :host {
      display: block;
      max-width: 32rem;
      margin: 0 auto;
      padding: 2rem 1rem;
    }

    h1 {
      margin: 0 0 0.25rem;
      font-size: clamp(2rem, 8vw, 3rem);
      letter-spacing: 0.02em;
      text-align: center;
    }

    .tagline {
      margin: 0 0 1.5rem;
      color: var(--cs-muted, #555);
      text-align: center;
    }

    .status {
      text-align: center;
      color: var(--cs-muted, #555);
    }

    .status.error {
      color: var(--cs-wrong, #c53030);
    }
  `;

  constructor() {
    super();
    this._puzzle = null;
    this._error = '';
    this._loading = true;
    this._gameOver = null;
  }

  _onGameOver(event) {
    this._gameOver = event.detail;
  }

  connectedCallback() {
    super.connectedCallback();
    this._load();
  }

  async _load() {
    try {
      this._puzzle = await loadPuzzle(DEFAULT_PUZZLE_ID);
      this._loading = false;
    } catch (err) {
      this._error = "Couldn't load today's puzzle. Please try again later.";
      this._loading = false;
      console.error(err);
    }
  }

  render() {
    return html`
      <h1>Call Sheet</h1>
      <p class="tagline">Sort the scrambled cast back into their two films.</p>
      ${this._loading
        ? html`<p class="status">Loading today's puzzle…</p>`
        : ''}
      ${this._error ? html`<p class="status error">${this._error}</p>` : ''}
      ${this._puzzle
        ? html`<call-sheet-board
            .puzzle=${this._puzzle}
            @game-over=${this._onGameOver}
          ></call-sheet-board>`
        : ''}
      ${this._gameOver
        ? html`<call-sheet-result
            .puzzleId=${this._puzzle.id}
            .status=${this._gameOver.status}
            .mistakes=${this._gameOver.mistakes}
            .maxMistakes=${this._gameOver.maxMistakes}
            .groupsSolved=${this._gameOver.groupsSolved}
            .totalGroups=${this._gameOver.totalGroups}
          ></call-sheet-result>`
        : ''}
    `;
  }
}

customElements.define('call-sheet-app', CallSheetApp);
