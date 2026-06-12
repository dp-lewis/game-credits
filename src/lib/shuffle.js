/**
 * Pure shuffle helpers. Used to scramble the display order of the cast so the
 * board doesn't reveal the answer by grouping. Logic only — no DOM.
 */

/**
 * Small seedable PRNG (mulberry32). Deterministic for a given seed, which keeps
 * shuffles reproducible in tests.
 *
 * @param {number} seed
 * @returns {() => number} A function returning floats in [0, 1).
 */
export function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Return a new array with the same members in shuffled order (Fisher–Yates).
 * Does not mutate the input.
 *
 * @template T
 * @param {T[]} array
 * @param {() => number} [rng=Math.random] Random source in [0, 1).
 * @returns {T[]}
 */
export function shuffle(array, rng = Math.random) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
