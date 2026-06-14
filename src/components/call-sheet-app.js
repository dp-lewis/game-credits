import { LitElement, html, css } from 'lit';
import { loadPuzzle, loadManifest } from '../lib/puzzle-loader.js';
import { todayKey } from '../lib/date-key.js';
import { resolvePuzzleId } from '../lib/puzzle-schedule.js';
import { createProgressStore } from '../lib/progress-store.js';
import { safeStorage } from '../lib/safe-storage.js';
import './call-sheet-board.js';

/**
 * `<call-sheet-app>` — root application shell. Loads today's puzzle and renders
 * the board, with loading and error states. A `?puzzle=<id>` override plays a
 * specific puzzle as a practice replay (fresh board, no streak effect).
 */
export class CallSheetApp extends LitElement {
  static properties = {
    _puzzle: { state: true },
    _error: { state: true },
    _loading: { state: true },
    _played: { state: true },
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

    .nav {
      text-align: center;
      margin: 0 0 1.5rem;
    }
    .nav a {
      color: var(--cs-accent, #2b6cb0);
      font-weight: 600;
    }

    .practice {
      text-align: center;
      color: var(--cs-muted, #555);
      font-size: 0.9rem;
      margin: 0 0 1rem;
    }
  `;

  constructor() {
    super();
    this._puzzle = null;
    this._error = '';
    this._loading = true;
    this._played = false;
    this._isReplay = false;
    this._store = createProgressStore(safeStorage());
  }

  _onGameOver(event) {
    const detail = event.detail;
    // The board reveals the result itself; the app only records the outcome.
    // Only the official daily play moves the streak; a `?puzzle=` replay is practice.
    const updateStreak = !this._isReplay && this._puzzle.id === todayKey();
    this._store.recordResult(
      this._puzzle.id,
      {
        status: detail.status,
        mistakes: detail.mistakes,
        groupsSolved: detail.groupsSolved,
        totalGroups: detail.totalGroups,
      },
      { updateStreak }
    );
  }

  connectedCallback() {
    super.connectedCallback();
    this._load();
  }

  /** Today's puzzle id from the manifest + local date. */
  async _resolveTodayId() {
    const ids = await loadManifest();
    return resolvePuzzleId(todayKey(), ids);
  }

  async _load() {
    try {
      const override = new URLSearchParams(window.location.search).get(
        'puzzle'
      );
      this._isReplay = !!override;
      const id = override || (await this._resolveTodayId());
      if (!id) {
        this._error = 'No puzzle is scheduled today. Check back tomorrow.';
        this._loading = false;
        return;
      }
      this._puzzle = await loadPuzzle(id);
      this._loading = false;

      // Restore a finished day on the official daily path only; a `?puzzle=`
      // replay always starts on a fresh board.
      if (!this._isReplay) {
        const prior = this._store.getDay(this._puzzle.id);
        if (prior) {
          this._played = true;
        }
      }
    } catch (err) {
      this._error = "Couldn't load today's puzzle. Please try again later.";
      this._loading = false;
      console.error(err);
    }
  }

  render() {
    return html`
      <h1>Call Sheet</h1>
      <p class="tagline">Sort the scrambled cast back into their films.</p>
      <p class="nav"><a href="archive.html">Archive ▸</a></p>
      ${this._isReplay && this._puzzle
        ? html`<p class="practice">
            Practice mode — this play won't affect your streak.
          </p>`
        : ''}
      ${this._loading
        ? html`<p class="status">Loading today's puzzle…</p>`
        : ''}
      ${this._error ? html`<p class="status error">${this._error}</p>` : ''}
      ${this._puzzle && this._played
        ? html`<p class="status">
              You've already played this puzzle. Come back tomorrow for a new one.
            </p>
            <call-sheet-board
              .puzzle=${this._puzzle}
              .reveal=${true}
            ></call-sheet-board>`
        : ''}
      ${this._puzzle && !this._played
        ? html`<call-sheet-board
            .puzzle=${this._puzzle}
            @game-over=${this._onGameOver}
          ></call-sheet-board>`
        : ''}
    `;
  }
}

customElements.define('call-sheet-app', CallSheetApp);
