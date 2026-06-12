import { daysBetween } from './date-key.js';

/**
 * Per-device player progress, persisted in `localStorage`. Records each day's
 * outcome and tracks streaks. No backend; only outcome metadata is stored —
 * never puzzle answers.
 *
 * Streak rule: a day counts only when **won**. The current streak increments on
 * a win the day immediately after the last play; a missed day (gap) or a loss
 * resets it to 0 (a fresh win then starts at 1). Longest is the max reached.
 *
 * @typedef {Object} DayResult
 * @property {'won'|'lost'} status
 * @property {number} mistakes
 * @property {number} groupsSolved
 * @property {number} totalGroups
 */

const STORAGE_KEY = 'call-sheet:progress:v1';

const freshState = () => ({
  version: 1,
  days: {},
  current: 0,
  longest: 0,
  lastPlayedKey: null,
});

/**
 * @param {Pick<Storage, 'getItem' | 'setItem'>} storage
 */
export function createProgressStore(storage) {
  function read() {
    try {
      const raw = storage.getItem(STORAGE_KEY);
      if (!raw) return freshState();
      const data = JSON.parse(raw);
      if (!data || typeof data !== 'object' || typeof data.days !== 'object') {
        return freshState();
      }
      return {
        version: 1,
        days: data.days || {},
        current: Number.isInteger(data.current) ? data.current : 0,
        longest: Number.isInteger(data.longest) ? data.longest : 0,
        lastPlayedKey:
          typeof data.lastPlayedKey === 'string' ? data.lastPlayedKey : null,
      };
    } catch {
      return freshState();
    }
  }

  function write(state) {
    storage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  return {
    /** @param {string} dateKey @returns {DayResult|null} */
    getDay(dateKey) {
      return read().days[dateKey] || null;
    },

    /** @returns {{current: number, longest: number}} */
    getStreaks() {
      const s = read();
      return { current: s.current, longest: s.longest };
    },

    /**
     * Record a finished day. Idempotent per day (a day is never double-counted).
     *
     * @param {string} dateKey
     * @param {DayResult} result
     * @returns {{day: DayResult, current: number, longest: number}}
     */
    recordResult(dateKey, result) {
      const s = read();
      if (s.days[dateKey]) {
        return { day: s.days[dateKey], current: s.current, longest: s.longest };
      }

      const day = {
        status: result.status,
        mistakes: result.mistakes,
        groupsSolved: result.groupsSolved,
        totalGroups: result.totalGroups,
      };
      s.days[dateKey] = day;

      if (result.status === 'won') {
        const consecutive =
          s.current > 0 &&
          s.lastPlayedKey &&
          daysBetween(s.lastPlayedKey, dateKey) === 1;
        s.current = consecutive ? s.current + 1 : 1;
        if (s.current > s.longest) s.longest = s.current;
      } else {
        s.current = 0;
      }
      s.lastPlayedKey = dateKey;

      write(s);
      return { day, current: s.current, longest: s.longest };
    },
  };
}
