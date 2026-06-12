/**
 * Spoiler-free share text generation. Encodes only the outcome and the number
 * of mistakes (lives used) — never which actor belongs to which film — so a
 * result can be pasted into chat/social without revealing the puzzle.
 */

const REMAINING = '🟩';
const USED = '🟥';

/**
 * @param {Object} params
 * @param {string} params.id Puzzle id / date key (e.g. "2026-06-12").
 * @param {'won'|'lost'} params.status
 * @param {number} params.mistakes Wrong submits used.
 * @param {number} params.maxMistakes Total lives.
 * @returns {string} Multi-line share text.
 */
export function generateShareText({ id, status, mistakes, maxMistakes }) {
  const used = Math.max(0, Math.min(mistakes, maxMistakes));
  const pips = Array.from({ length: maxMistakes }, (_, i) =>
    i < used ? USED : REMAINING
  ).join('');

  const header = `Call Sheet ${id}`;

  if (status === 'won') {
    const plural = used === 1 ? '' : 's';
    return `${header}\nSolved with ${used} mistake${plural} ✅\n${pips}`;
  }
  return `${header}\nDid not solve ❌\n${pips}`;
}
