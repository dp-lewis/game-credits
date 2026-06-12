import { LitElement, html, css } from 'lit';
import { generateGroupShareText } from '../lib/share-grid.js';

/**
 * `<call-sheet-result>` — end-of-game result with a copyable, spoiler-free
 * share grid. Shown by the app when the board emits `game-over`.
 *
 * Properties: `puzzleId`, `status` ('won'|'lost'), `mistakes`, `maxMistakes`,
 * `groupsSolved`, `totalGroups`.
 */
export class CallSheetResult extends LitElement {
  static properties = {
    puzzleId: { attribute: false },
    status: { attribute: false },
    mistakes: { attribute: false },
    maxMistakes: { attribute: false },
    groupsSolved: { attribute: false },
    totalGroups: { attribute: false },
    streak: { attribute: false },
    _copied: { state: true },
  };

  static styles = css`
    :host {
      display: block;
      margin-top: 1.5rem;
    }

    .result {
      text-align: center;
      border-top: 1px solid var(--cs-border, #ddd);
      padding-top: 1rem;
    }

    h2 {
      margin: 0 0 0.75rem;
    }

    .share {
      display: inline-block;
      margin: 0 auto 1rem;
      padding: 0.75rem 1rem;
      background: var(--cs-card, #f3f3f3);
      border-radius: 0.5rem;
      font-family: inherit;
      white-space: pre-wrap;
      text-align: center;
    }

    .copy {
      font: inherit;
      font-weight: 600;
      padding: 0.6rem 1.2rem;
      border: none;
      border-radius: 999px;
      background: var(--cs-accent, #2b6cb0);
      color: #fff;
      cursor: pointer;
      min-height: 2.75rem;
    }

    @media (prefers-color-scheme: dark) {
      .share {
        --cs-card: #1e1e1e;
      }
    }
  `;

  constructor() {
    super();
    this._copied = false;
  }

  get _shareText() {
    return generateGroupShareText({
      id: this.puzzleId,
      status: this.status,
      groupsSolved: this.groupsSolved,
      totalGroups: this.totalGroups,
      mistakes: this.mistakes,
      maxMistakes: this.maxMistakes,
      streak: this.streak,
    });
  }

  async _copy() {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(this._shareText);
        this._copied = true;
        setTimeout(() => {
          this._copied = false;
        }, 2000);
      }
    } catch (err) {
      // Clipboard can be unavailable/denied; the text stays visible to copy by hand.
      this._copied = false;
      console.error(err);
    }
  }

  render() {
    const won = this.status === 'won';
    return html`
      <section class="result" role="status">
        <h2>${won ? 'Solved! 🎬' : 'Out of lives'}</h2>
        <p class="groups">
          ${this.groupsSolved}/${this.totalGroups} groups found
        </p>
        ${this.streak > 0
          ? html`<p class="streak">🔥 ${this.streak}-day streak</p>`
          : ''}
        <pre class="share">${this._shareText}</pre>
        <button class="copy" @click=${this._copy}>
          ${this._copied ? 'Copied!' : 'Copy result'}
        </button>
      </section>
    `;
  }
}

customElements.define('call-sheet-result', CallSheetResult);
