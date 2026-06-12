import { describe, it, expect, afterEach, vi } from 'vitest';
import '../../src/components/call-sheet-result.js';

async function mountResult(props) {
  const el = document.createElement('call-sheet-result');
  Object.assign(el, props);
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

describe('<call-sheet-result>', () => {
  it('renders the share text and a copy button for a win', async () => {
    const el = await mountResult({
      puzzleId: '2026-06-12',
      status: 'won',
      mistakes: 1,
      maxMistakes: 4,
    });
    const text = el.shadowRoot.textContent;
    expect(text).toContain('Solved!');
    expect(el.shadowRoot.querySelector('pre').textContent).toContain(
      'Call Sheet 2026-06-12'
    );
    expect(el.shadowRoot.querySelector('button.copy')).toBeTruthy();
  });

  it('shows a loss heading when not solved', async () => {
    const el = await mountResult({
      puzzleId: 'x',
      status: 'lost',
      mistakes: 4,
      maxMistakes: 4,
    });
    expect(el.shadowRoot.textContent).toContain('Out of lives');
  });

  it('copies the share text to the clipboard and shows feedback', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal('navigator', { clipboard: { writeText } });

    const el = await mountResult({
      puzzleId: '2026-06-12',
      status: 'won',
      mistakes: 0,
      maxMistakes: 4,
    });
    el.shadowRoot.querySelector('button.copy').click();
    await el.updateComplete;
    await Promise.resolve();
    await el.updateComplete;

    expect(writeText).toHaveBeenCalledOnce();
    expect(writeText.mock.calls[0][0]).toContain('Call Sheet 2026-06-12');
    expect(el.shadowRoot.querySelector('button.copy').textContent.trim()).toBe(
      'Copied!'
    );
  });
});
