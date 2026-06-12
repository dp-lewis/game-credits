import { describe, it, expect } from 'vitest';
import { generateGroupShareText } from '../../src/lib/share-grid.js';

describe('generateGroupShareText', () => {
  it('renders a clean win (all groups, zero mistakes)', () => {
    const text = generateGroupShareText({
      id: '2026-06-13',
      status: 'won',
      groupsSolved: 4,
      totalGroups: 4,
      mistakes: 0,
    });
    expect(text).toContain('Call Sheet 2026-06-13');
    expect(text).toContain('Solved 4/4 with 0 mistakes ✅');
    expect(text).toContain('🟩🟩🟩🟩');
    expect(text).not.toContain('⬜');
  });

  it('uses singular "mistake" for exactly one', () => {
    const text = generateGroupShareText({
      id: 'x',
      status: 'won',
      groupsSolved: 4,
      totalGroups: 4,
      mistakes: 1,
    });
    expect(text).toContain('with 1 mistake ✅');
  });

  it('renders a loss with partial groups and the right pips', () => {
    const text = generateGroupShareText({
      id: '2026-06-13',
      status: 'lost',
      groupsSolved: 2,
      totalGroups: 4,
      mistakes: 4,
    });
    expect(text).toContain('2/4 groups ❌');
    expect(text).toContain('🟩🟩⬜⬜');
  });

  it('clamps groupsSolved to totalGroups', () => {
    const text = generateGroupShareText({
      id: 'x',
      status: 'won',
      groupsSolved: 99,
      totalGroups: 4,
      mistakes: 0,
    });
    expect(text).toContain('🟩🟩🟩🟩');
    expect(text).not.toContain('⬜');
  });

  it('is spoiler-free — three lines, no actor/film identifiers', () => {
    const text = generateGroupShareText({
      id: '2026-06-13',
      status: 'won',
      groupsSolved: 3,
      totalGroups: 4,
      mistakes: 2,
    });
    expect(text.split('\n')).toHaveLength(3);
    expect(text).not.toMatch(/film|actor|clooney|inception|prada/i);
  });
});
