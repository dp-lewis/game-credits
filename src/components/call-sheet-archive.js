import { LitElement, html, css } from 'lit';
import { formatDateKey } from '../lib/date-key.js';

/**
 * `<call-sheet-archive>` — the puzzle index. Renders `entries` (newest first) as
 * real `<a>` links so navigation and the back button are native browser
 * behaviour. Today's row links to the official daily game; past rows link to a
 * practice replay.
 *
 * Property `entries`: `{ id, theme: string|null, status: 'won'|'lost'|null, mistakes?, isToday }[]`.
 * Property `preview`: `{ date: string, theme: string } | null` — tomorrow's locked teaser.
 */
export class CallSheetArchive extends LitElement {
  static properties = {
    entries: { attribute: false },
    preview: { attribute: false },
  };

  static styles = css`
    :host {
      display: block;
      max-width: 32rem;
      margin: 0 auto;
      padding: 2rem 1rem;
    }

    .head {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      gap: 1rem;
      margin-bottom: 1rem;
    }
    h1 {
      margin: 0;
      font-size: clamp(1.5rem, 6vw, 2.25rem);
    }
    .today-link {
      color: var(--cs-accent, #2b6cb0);
      font-weight: 600;
      white-space: nowrap;
    }

    .list {
      list-style: none;
      margin: 0;
      padding: 0;
      display: grid;
      gap: 0.5rem;
    }

    .row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      padding: 0.75rem 1rem;
      border: 1px solid var(--cs-border, #ddd);
      border-radius: 0.6rem;
      background: var(--cs-card, #fff);
      color: inherit;
      text-decoration: none;
    }
    .row:hover {
      border-color: var(--cs-accent, #2b6cb0);
    }

    .preview {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      padding: 0.75rem 1rem;
      border: 1px dashed var(--cs-border, #ddd);
      border-radius: 0.6rem;
      /* A flipping token so the teaser stays legible in dark mode (was an
         undefined --cs-surface, which fell back to a hardcoded light colour). */
      background: var(--cs-card, #fff);
      color: var(--cs-muted, #555);
      opacity: 0.85;
      cursor: default;
    }

    .info {
      display: flex;
      flex-direction: column;
      gap: 0.15rem;
    }

    .date {
      font-weight: 600;
    }
    .today {
      color: var(--cs-muted, #555);
      font-weight: 400;
    }
    .theme {
      font-size: 0.82rem;
      color: var(--cs-muted, #555);
      font-style: italic;
    }

    .state {
      color: var(--cs-muted, #555);
      white-space: nowrap;
    }
    .icon {
      font-weight: 700;
    }
    .won .icon {
      color: var(--cs-correct, #2f855a);
    }
    .lost .icon {
      color: var(--cs-wrong, #c53030);
    }

    .lock {
      font-size: 1rem;
    }

    .empty {
      color: var(--cs-muted, #555);
    }
  `;

  _href(entry) {
    return entry.isToday
      ? 'index.html'
      : `index.html?puzzle=${encodeURIComponent(entry.id)}`;
  }

  _status(entry) {
    if (entry.status === 'won') {
      const n = entry.mistakes ?? 0;
      return {
        cls: 'won',
        icon: '✓',
        text: `solved, ${n} mistake${n === 1 ? '' : 's'}`,
      };
    }
    if (entry.status === 'lost') {
      return { cls: 'lost', icon: '✗', text: 'out of lives' };
    }
    return { cls: 'unplayed', icon: '▢', text: 'play' };
  }

  _renderPreview() {
    const p = this.preview;
    if (!p) return '';
    return html`<li>
      <div class="preview" aria-label="Tomorrow's puzzle — not yet available">
        <div class="info">
          <span class="date"
            >${formatDateKey(p.date)}
            <span class="today">· tomorrow</span></span
          >
          ${p.theme ? html`<span class="theme">${p.theme}</span>` : ''}
        </div>
        <span class="lock" aria-hidden="true">🔒</span>
      </div>
    </li>`;
  }

  render() {
    const entries = this.entries || [];
    return html`
      <header class="head">
        <h1>Call Sheet — Archive</h1>
        <a class="today-link" href="index.html">Play today ▸</a>
      </header>

      ${entries.length === 0 && !this.preview
        ? html`<p class="empty">No puzzles available yet.</p>`
        : html`<ul class="list">
            ${this._renderPreview()}
            ${entries.map((entry) => {
              const s = this._status(entry);
              return html`<li>
                <a class="row ${s.cls}" href=${this._href(entry)}>
                  <div class="info">
                    <span class="date"
                      >${formatDateKey(entry.id)}${entry.isToday
                        ? html`<span class="today"> · today</span>`
                        : ''}</span
                    >
                    ${entry.theme
                      ? html`<span class="theme">${entry.theme}</span>`
                      : ''}
                  </div>
                  <span class="state"
                    ><span class="icon">${s.icon}</span> ${s.text}</span
                  >
                </a>
              </li>`;
            })}
          </ul>`}
    `;
  }
}

customElements.define('call-sheet-archive', CallSheetArchive);
