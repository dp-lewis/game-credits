import { isValidDateKey } from './date-key.js';

/**
 * Choose which puzzle to show for a given day from the available date-keyed
 * puzzles. Preference: the exact day, else the most recent puzzle on or before
 * today, else the earliest upcoming puzzle. Returns null when none are valid.
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

  if (valid.length === 0) return null;
  if (valid.includes(todayKey)) return todayKey;

  const past = valid.filter((id) => id <= todayKey);
  if (past.length > 0) return past[past.length - 1];

  return valid[0];
}
