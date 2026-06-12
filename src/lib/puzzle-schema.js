/**
 * Call Sheet puzzle schema — the contract between the puzzle source (a hand-made
 * fixture today, the TMDB curation pipeline later) and the client.
 *
 * A puzzle presents two films and a scrambled ensemble cast. Every actor belongs
 * to exactly one of the two films; `actors[].filmId` IS the answer key.
 *
 * @typedef {Object} Film
 * @property {string} id     Stable film identifier (referenced by actors).
 * @property {string} title Display title.
 * @property {number} [year] Release year (optional).
 *
 * @typedef {Object} Actor
 * @property {string} id     Stable actor identifier (unique within a puzzle).
 * @property {string} name   Display name.
 * @property {string} filmId The film this actor belongs to — the answer.
 *
 * @typedef {Object} Puzzle
 * @property {string} id            Puzzle/date key (e.g. "2026-06-12").
 * @property {string} [date]        ISO date; defaults to `id` when absent.
 * @property {number} maxMistakes   Allowed wrong assignments before a loss.
 * @property {[Film, Film]} films   Exactly two films.
 * @property {Actor[]} actors       The scrambled cast (>= 1, each in one film).
 */

/** Default Connections-style mistake budget when a puzzle omits `maxMistakes`. */
export const DEFAULT_MAX_MISTAKES = 4;

/** A puzzle has exactly this many films. */
export const FILMS_PER_PUZZLE = 2;
