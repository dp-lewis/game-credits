/**
 * Date-key helpers. A "date key" is an ISO calendar day, `YYYY-MM-DD`, used to
 * name puzzles and track daily progress.
 *
 * Timezone policy: "today" is the player's **local** calendar date — the puzzle
 * rolls at local midnight. Day-gap math (for streaks) treats keys as UTC
 * midnights so it is DST-proof and independent of the player's zone.
 */

/**
 * The local calendar date of `date` as a `YYYY-MM-DD` key.
 *
 * @param {Date} [date=new Date()]
 * @returns {string}
 */
export function todayKey(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Is `key` a well-formed `YYYY-MM-DD` calendar date?
 *
 * @param {unknown} key
 * @returns {boolean}
 */
export function isValidDateKey(key) {
  if (typeof key !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(key)) return false;
  const ms = Date.parse(`${key}T00:00:00Z`);
  if (Number.isNaN(ms)) return false;
  // Reject overflow like 2026-02-30 that Date may normalise.
  return todayKeyUTC(new Date(ms)) === key;
}

/** UTC variant, used only to validate round-tripping. */
function todayKeyUTC(date) {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, '0');
  const d = String(date.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Whole days from `aKey` to `bKey` (`b - a`). Positive when `b` is later.
 *
 * @param {string} aKey
 * @param {string} bKey
 * @returns {number}
 */
export function daysBetween(aKey, bKey) {
  const a = Date.parse(`${aKey}T00:00:00Z`);
  const b = Date.parse(`${bKey}T00:00:00Z`);
  return Math.round((b - a) / 86_400_000);
}

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

/**
 * Human label for a date key, e.g. `2026-06-14` → `Jun 14, 2026`. Locale-free so
 * it's deterministic across environments.
 *
 * @param {string} key
 * @returns {string}
 */
export function formatDateKey(key) {
  const [y, m, d] = key.split('-').map(Number);
  return `${MONTHS[m - 1]} ${d}, ${y}`;
}
