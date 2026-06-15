import { LitElement, html, css } from 'lit';

/**
 * `<call-sheet-actor>` — one actor chip in the column board.
 *
 * Tapping the chip emits `actor-pick` `{ actorId }`; the board runs select-then-
 * swap (first tap selects, second tap swaps the two). The chip always shows its
 * column colour via `bucketIndex`, a `selected` ring while it's the pending pick,
 * a `ticked` ✓ when it's in its correct movie, and a `locked` (disabled) state.
 *
 * Properties: `actor`, `bucketIndex` (number | null), `selected`, `ticked`, `locked`.
 */
export class CallSheetActor extends LitElement {
  static shadowRootOptions = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true,
  };

  static properties = {
    actor: { attribute: false },
    bucketIndex: { attribute: false },
    selected: { type: Boolean },
    ticked: { type: Boolean },
    locked: { type: Boolean },
    // True for the grid's active cell — gives tabindex=0 (roving tabindex).
    active: { type: Boolean },
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
      border: none;
      border-radius: 0.6rem;
      background: var(--cs-card, #fff);
      /* Constant dark text — stays legible on the light pastels in any scheme. */
      color: var(--cs-tile-fg, #1a1a1a);
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

    /* Assigned-column colour — solid pastel fill. */
    button.g0 {
      background: var(--cs-group-0);
    }
    button.g1 {
      background: var(--cs-group-1);
    }
    button.g2 {
      background: var(--cs-group-2);
    }
    button.g3 {
      background: var(--cs-group-3);
    }

    /* Pending swap pick — a clear ring on top of the pastel fill. */
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
        tabindex=${this.active ? '0' : '-1'}
        aria-pressed=${this.selected ? 'true' : 'false'}
        aria-label=${this.actor.name}
        ?disabled=${this.locked}
        @click=${this._pick}
      >
        <span class="name">${this.actor.name}</span>
        ${this.ticked
          ? html`<span class="lock" aria-label="correct">✓</span>`
          : ''}
      </button>
    `;
  }
}

customElements.define('call-sheet-actor', CallSheetActor);
