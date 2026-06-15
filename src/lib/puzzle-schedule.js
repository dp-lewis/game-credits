import { isValidDateKey } from './date-key.js';

/**
 * Choose which puzzle to show for a given day from the available date-keyed
 * puzzles. Preference: the exact day, else the most recent puzzle on or before
 * today. Never returns a future puzzle — returns null when nothing is on or
 * before today (upcoming puzzles aren't released early).
 *
 * Because keys are `YYYY-MM-DD`, lexicographic sort is chronological.
 *
 * @param {string} todayKey
 * @param {string[]} availableIds
 * @returns {string|null}
 */
export function resolvePuzzleId(todayKey, availableIds) {
  const valid = (Array.isArray(availableIds) ? availableIds : [])
    .filter(isValidDateKey)
    .sort();

  if (valid.includes(todayKey)) return todayKey;

  const past = valid.filter((id) => id <= todayKey);
  if (past.length > 0) return past[past.length - 1];

  // No puzzle on or before today — don't surface an upcoming one.
  return null;
}
