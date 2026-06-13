import { isValidDateKey } from './date-key.js';

/**
 * The puzzles the archive can offer: every manifest date on or before today,
 * newest first. Future dates are excluded so upcoming puzzles aren't spoiled.
 * (Status decoration — played/won/lost — is applied by the view via the progress
 * store, not here.)
 *
 * `YYYY-MM-DD` keys sort chronologically, so a lexicographic sort suffices.
 *
 * @param {string[]} manifestIds
 * @param {string} todayKey
 * @returns {string[]} date ids `<= todayKey`, descending
 */
export function listArchivePuzzles(manifestIds, todayKey) {
  return (Array.isArray(manifestIds) ? manifestIds : [])
    .filter(isValidDateKey)
    .filter((id) => id <= todayKey)
    .sort()
    .reverse();
}
