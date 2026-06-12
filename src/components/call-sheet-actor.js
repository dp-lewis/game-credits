import { LitElement, html, css } from 'lit';

/**
 * `<call-sheet-actor>` — one actor with a two-film segmented control.
 *
 * Tapping a film button assigns (or reassigns) the actor and emits an
 * `actor-assign` event `{ actorId, filmId }`. When `locked`, the buttons are
 * disabled. When `revealed` (game over), the correct film is highlighted.
 *
 * Properties (set by the board): `actor`, `films`, `assignedFilmId`,
 * `correctFilmId`, `locked`, `revealed`.
 */
export class CallSheetActor extends LitElement {
  static properties = {
    actor: { attribute: false },
    films: { attribute: false },
    assignedFilmId: { attribute: false },
    correctFilmId: { attribute: false },
    locked: { type: Boolean },
    revealed: { type: Boolean },
  };

  static styles = css`
    :host {
      display: block;
    }

    .chip {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 0.75rem;
      border: 1px solid var(--cs-border, #ddd);
      border-radius: 0.75rem;
      background: var(--cs-card, #fff);
    }

    .name {
      flex: 1 1 8rem;
      font-weight: 600;
    }

    .choices {
      display: flex;
      gap: 0.375rem;
    }

    button {
      font: inherit;
      padding: 0.4rem 0.7rem;
      border: 1px solid var(--cs-border, #ccc);
      border-radius: 999px;
      background: transparent;
      color: inherit;
      cursor: pointer;
      min-height: 2.25rem;
    }

    button:disabled {
      cursor: default;
      opacity: 0.8;
    }

    .film-0.selected {
      background: var(--cs-film-a, #2b6cb0);
      border-color: var(--cs-film-a, #2b6cb0);
      color: #fff;
    }

    .film-1.selected {
      background: var(--cs-film-b, #b7791f);
      border-color: var(--cs-film-b, #b7791f);
      color: #fff;
    }

    button.correct {
      outline: 2px dashed var(--cs-correct, #2f855a);
      outline-offset: 2px;
    }

    .lock {
      color: var(--cs-correct, #2f855a);
      font-weight: 700;
    }

    @media (prefers-color-scheme: dark) {
      .chip {
        --cs-card: #1e1e1e;
        --cs-border: #333;
      }
    }
  `;

  _select(filmId) {
    if (this.locked) return;
    this.dispatchEvent(
      new CustomEvent('actor-assign', {
        detail: { actorId: this.actor.id, filmId },
        bubbles: true,
        composed: true,
      })
    );
  }

  render() {
    const films = this.films || [];
    return html`
      <div class="chip" role="group" aria-label=${this.actor.name}>
        <span class="name">${this.actor.name}</span>
        <div class="choices">
          ${films.map((film, i) => {
            const selected = this.assignedFilmId === film.id;
            const showCorrect = this.revealed && this.correctFilmId === film.id;
            return html`<button
              class="film-${i} ${selected ? 'selected' : ''} ${showCorrect
                ? 'correct'
                : ''}"
              aria-pressed=${selected ? 'true' : 'false'}
              ?disabled=${this.locked}
              @click=${() => this._select(film.id)}
            >
              ${film.title}
            </button>`;
          })}
        </div>
        ${this.locked
          ? html`<span class="lock" aria-label="locked correct">✓</span>`
          : ''}
      </div>
    `;
  }
}

customElements.define('call-sheet-actor', CallSheetActor);
