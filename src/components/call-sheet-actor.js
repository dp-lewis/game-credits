import { LitElement, html, css } from 'lit';

/**
 * `<call-sheet-actor>` — one actor chip in the column board.
 *
 * Tapping the chip emits `actor-pick` `{ actorId }`; the board runs select-then-
 * swap (first tap selects, second tap swaps the two). The chip always shows its
 * column colour via `bucketIndex`, a `selected` ring while it's the pending pick,
 * and a locked state once its column (group) is solved.
 *
 * Properties: `actor`, `bucketIndex` (number | null), `selected`, `locked`.
 */
export class CallSheetActor extends LitElement {
  static properties = {
    actor: { attribute: false },
    bucketIndex: { attribute: false },
    selected: { type: Boolean },
    locked: { type: Boolean },
  };

  static styles = css`
    :host {
      display: block;
      height: 100%;
    }

    button {
      width: 100%;
      height: 100%;
      font: inherit;
      min-height: 3rem;
      padding: 0.5rem;
      border: 2px solid var(--cs-border, #ddd);
      border-radius: 0.6rem;
      background: var(--cs-card, #fff);
      color: inherit;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.35rem;
      text-align: center;
      line-height: 1.15;
    }

    button:disabled {
      cursor: default;
    }

    /* Assigned-bucket colours (left accent + tint). */
    button.g0 {
      border-color: var(--cs-group-0);
      box-shadow: inset 0.35rem 0 0 var(--cs-group-0);
    }
    button.g1 {
      border-color: var(--cs-group-1);
      box-shadow: inset 0.35rem 0 0 var(--cs-group-1);
    }
    button.g2 {
      border-color: var(--cs-group-2);
      box-shadow: inset 0.35rem 0 0 var(--cs-group-2);
    }
    button.g3 {
      border-color: var(--cs-group-3);
      box-shadow: inset 0.35rem 0 0 var(--cs-group-3);
    }

    /* Pending swap pick — a clear ring independent of the column colour. */
    button.selected {
      outline: 3px solid var(--cs-accent, #2b6cb0);
      outline-offset: 1px;
    }

    button.locked {
      opacity: 0.85;
      cursor: default;
    }

    .lock {
      color: var(--cs-correct, #2f855a);
      font-weight: 700;
    }
  `;

  _pick() {
    if (this.locked) return;
    this.dispatchEvent(
      new CustomEvent('actor-pick', {
        detail: { actorId: this.actor.id },
        bubbles: true,
        composed: true,
      })
    );
  }

  render() {
    const inBucket =
      this.bucketIndex !== null && this.bucketIndex !== undefined;
    const classes = [
      inBucket ? `g${this.bucketIndex}` : '',
      this.selected ? 'selected' : '',
      this.locked ? 'locked' : '',
    ]
      .filter(Boolean)
      .join(' ');

    return html`
      <button
        class=${classes}
        aria-pressed=${this.selected ? 'true' : 'false'}
        aria-label=${this.actor.name}
        ?disabled=${this.locked}
        @click=${this._pick}
      >
        <span class="name">${this.actor.name}</span>
        ${this.locked ? html`<span class="lock">✓</span>` : ''}
      </button>
    `;
  }
}

customElements.define('call-sheet-actor', CallSheetActor);
