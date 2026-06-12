import { describe, it, expect } from 'vitest';

// Scaffold sanity checks: prove the Vitest runner, the happy-dom environment,
// and the Lit component pipeline all load. Real game-logic tests arrive with
// the game-logic-lib work item.
describe('scaffold sanity', () => {
  it('runs the test runner', () => {
    expect(1 + 1).toBe(2);
  });

  it('registers the <call-sheet-app> custom element', async () => {
    await import('../../src/components/call-sheet-app.js');
    expect(customElements.get('call-sheet-app')).toBeTypeOf('function');
  });
});
