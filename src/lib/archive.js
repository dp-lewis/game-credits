import { isValidDateKey, nextDateKey } from './date-key.js';

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

/**
 * Enrich an array of date-id strings with theme data from the index.
 * Dates with no matching index entry get `theme: null`.
 *
 * @param {string[]} ids            Date-id strings
 * @param {{ date: string, theme: string }[]} indexEntries
 * @returns {{ id: string, theme: string|null }[]}
 */
export function enrichWithThemes(ids, indexEntries) {
  const byDate = Object.fromEntries(
    (Array.isArray(indexEntries) ? indexEntries : []).map((e) => [
      e.date,
      e.theme,
    ])
  );
  return ids.map((id) => ({ id, theme: byDate[id] ?? null }));
}

/**
 * The locked tomorrow teaser: the index entry for today+1, or null if it
 * doesn't exist or has no theme.
 *
 * @param {{ date: string, theme: string }[]} indexEntries
 * @param {string} todayKey
 * @returns {{ date: string, theme: string } | null}
 */
export function tomorrowEntry(indexEntries, todayKey) {
  const tomorrowKey = nextDateKey(todayKey);
  const entry = (Array.isArray(indexEntries) ? indexEntries : []).find(
    (e) => e.date === tomorrowKey
  );
  if (!entry || !entry.theme) return null;
  return { date: tomorrowKey, theme: entry.theme };
}
