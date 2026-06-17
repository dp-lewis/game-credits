import { LitElement, html, css } from 'lit';
import { formatDateKey } from '../lib/date-key.js';
import { loadPuzzle } from '../lib/puzzle-loader.js';
import './call-sheet-board.js';

/**
 * `<call-sheet-preview>` — curator-only QA gallery (the `/preview.html` page).
 *
 * Lists every scheduled date + theme (future included) and, when one is picked,
 * shows the **revealed** board for that puzzle plus a panel of its films, cast, and
 * traps (the crossover gotchas). Read-only; spoilers; not linked from the game.
 *
 * Property `entries`: `{ date, theme }[]` (from `puzzles/index.json`).
 */
export class CallSheetPreview extends LitElement {
  static properties = {
    entries: { attribute: false },
    _selected: { state: true },
    _puzzle: { state: true },
    _error: { state: true },
  };

  static styles = css`
    :host {
      display: block;
      max-width: 36rem;
      margin: 0 auto;
      padding: 1.5rem 1rem 2rem;
    }

    .banner {
      background: var(--cs-group-0, #ffc6c2);
      color: var(--cs-tile-fg, #1a1a1a);
      border-radius: 0.5rem;
      padding: 0.6rem 0.9rem;
      font-weight: 600;
      font-size: 0.9rem;
      margin-bottom: 1rem;
    }

    h1 {
      margin: 0 0 1rem;
      font-size: clamp(1.4rem, 6vw, 2rem);
    }

    .list {
      list-style: none;
      margin: 0 0 1.5rem;
      padding: 0;
      display: grid;
      gap: 0.35rem;
    }
    .row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      width: 100%;
      font: inherit;
      text-align: left;
      padding: 0.55rem 0.8rem;
      border: 1px solid var(--cs-border, #ddd);
      border-radius: 0.5rem;
      background: var(--cs-card, #fff);
      color: inherit;
      cursor: pointer;
    }
    .row:hover {
      border-color: var(--cs-accent, #6b5b95);
    }
    .row.active {
      border-color: var(--cs-accent, #6b5b95);
      outline: 2px solid var(--cs-accent, #6b5b95);
    }
    .date {
      font-weight: 600;
    }
    .theme {
      color: var(--cs-muted, #555);
      font-size: 0.9rem;
    }

    .detail {
      border-top: 2px solid var(--cs-border, #ddd);
      padding-top: 1rem;
    }
    .detail h2 {
      margin: 0 0 0.75rem;
      font-size: 1.1rem;
    }

    .meta {
      margin: 1rem 0 0;
      font-size: 0.9rem;
    }
    .meta h3 {
      margin: 0.75rem 0 0.25rem;
      font-size: 0.95rem;
    }
    .films {
      list-style: none;
      margin: 0;
      padding: 0;
      display: grid;
      gap: 0.4rem;
    }
    .films li {
      padding: 0.4rem 0.6rem;
      border-radius: 0.4rem;
      background: var(--cs-card, #fff);
      border: 1px solid var(--cs-border, #ddd);
    }
    .films .cast {
      color: var(--cs-muted, #555);
    }
    .traps {
      list-style: none;
      margin: 0;
      padding: 0;
    }
    .traps li {
      padding: 0.15rem 0;
    }
    .trap-name {
      font-weight: 600;
    }
    .count {
      color: var(--cs-muted, #555);
    }
    .error {
      color: var(--cs-wrong, #c53030);
    }
  `;

  constructor() {
    super();
    this.entries = [];
    this._selected = null;
    this._puzzle = null;
    this._error = '';
  }

  async _select(date) {
    this._selected = date;
    this._puzzle = null;
    this._error = '';
    try {
      this._puzzle = await loadPuzzle(date);
    } catch (err) {
      this._error = `Couldn't load ${date}.`;
      console.error(err);
    }
  }

  _filmTitles(p) {
    return Object.fromEntries(p.films.map((f) => [f.id, f.title]));
  }

  render() {
    const entries = [...(this.entries || [])].sort((a, b) =>
      a.date < b.date ? -1 : 1
    );
    return html`
      <p class="banner">⚠️ Curator preview — full spoilers ahead.</p>
      <h1>Preview — ${entries.length} scheduled</h1>

      <ul class="list">
        ${entries.map(
          (e) =>
            html`<li>
              <button
                class="row ${this._selected === e.date ? 'active' : ''}"
                @click=${() => this._select(e.date)}
              >
                <span class="date">${formatDateKey(e.date)}</span>
                <span class="theme">${e.theme}</span>
              </button>
            </li>`
        )}
      </ul>

      ${this._error ? html`<p class="error">${this._error}</p>` : ''}
      ${this._puzzle ? this._renderDetail(this._puzzle) : ''}
    `;
  }

  _renderDetail(p) {
    const titles = this._filmTitles(p);
    const traps = p.actors.filter((a) => a.alsoIn?.length);
    return html`
      <section class="detail">
        <h2>${formatDateKey(p.id)} — ${p.theme ?? '(no theme)'}</h2>

        <call-sheet-board .puzzle=${p} .reveal=${true}></call-sheet-board>

        <div class="meta">
          <h3>Films &amp; cast</h3>
          <ul class="films">
            ${p.films.map(
              (f) =>
                html`<li>
                  <strong>${f.title}${f.year ? ` (${f.year})` : ''}</strong>
                  <div class="cast">
                    ${p.actors
                      .filter((a) => a.filmId === f.id)
                      .map((a) => a.name)
                      .join(', ')}
                  </div>
                </li>`
            )}
          </ul>

          <h3>Traps <span class="count">(${traps.length})</span></h3>
          ${traps.length === 0
            ? html`<p class="count">No crossover traps.</p>`
            : html`<ul class="traps">
                ${traps.map(
                  (a) =>
                    html`<li>
                      <span class="trap-name">${a.name}</span> —
                      ${titles[a.filmId]}, also in
                      ${a.alsoIn.map((id) => titles[id]).join(', ')}
                    </li>`
                )}
              </ul>`}
        </div>
      </section>
    `;
  }
}

customElements.define('call-sheet-preview', CallSheetPreview);
