import { LitElement, html, css } from 'lit';

/**
 * `<call-sheet-app>` — root application shell.
 *
 * Placeholder for the scaffold: it proves the Lit + Vite pipeline renders.
 * The game board, result view, and daily wiring replace its contents in
 * later work items.
 */
export class CallSheetApp extends LitElement {
  static styles = css`
    :host {
      display: block;
      max-width: 32rem;
      margin: 0 auto;
      padding: 2rem 1rem;
      text-align: center;
    }

    h1 {
      margin: 0 0 0.5rem;
      font-size: clamp(2rem, 8vw, 3rem);
      letter-spacing: 0.02em;
    }

    p {
      margin: 0;
      color: var(--cs-muted, #555);
      font-size: 1rem;
    }
  `;

  render() {
    return html`
      <h1>Call Sheet</h1>
      <p>
        Sort the scrambled cast back into their two films. New puzzle daily.
      </p>
    `;
  }
}

customElements.define('call-sheet-app', CallSheetApp);
