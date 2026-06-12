import { describe, it, expect } from 'vitest';
import { generateShareText } from '../../src/lib/share-grid.js';

describe('generateShareText', () => {
  it('renders a win with zero mistakes (all lives remaining)', () => {
    const text = generateShareText({
      id: '2026-06-12',
      status: 'won',
      mistakes: 0,
      maxMistakes: 4,
    });
    expect(text).toContain('Call Sheet 2026-06-12');
    expect(text).toContain('Solved with 0 mistakes ✅');
    expect(text).toContain('🟩🟩🟩🟩');
    expect(text).not.toContain('🟥');
  });

  it('uses singular "mistake" for exactly one', () => {
    const text = generateShareText({
      id: 'x',
      status: 'won',
      mistakes: 1,
      maxMistakes: 4,
    });
    expect(text).toContain('1 mistake ✅');
    expect(text).toContain('🟥🟩🟩🟩');
  });

  it('renders a loss with all lives used', () => {
    const text = generateShareText({
      id: '2026-06-12',
      status: 'lost',
      mistakes: 4,
      maxMistakes: 4,
    });
    expect(text).toContain('Did not solve ❌');
    expect(text).toContain('🟥🟥🟥🟥');
    expect(text).not.toContain('🟩');
  });

  it('clamps mistakes to the number of lives', () => {
    const text = generateShareText({
      id: 'x',
      status: 'lost',
      mistakes: 99,
      maxMistakes: 4,
    });
    expect(text).toContain('🟥🟥🟥🟥');
  });

  it('is spoiler-free — contains no actor or film identifiers', () => {
    const text = generateShareText({
      id: '2026-06-12',
      status: 'won',
      mistakes: 2,
      maxMistakes: 4,
    });
    // Only the header, outcome line, and pips — no names.
    expect(text.split('\n')).toHaveLength(3);
    expect(text).not.toMatch(/film|actor|clooney|prada/i);
  });
});
