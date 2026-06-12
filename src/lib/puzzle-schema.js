/**
 * Call Sheet puzzle schema — the contract between the puzzle source (a hand-made
 * fixture today, the TMDB curation pipeline later) and the client.
 *
 * A puzzle presents N films (>= 2; v2 uses 4) and a scrambled ensemble cast
 * partitioned into equal groups — `actors[].filmId` is the single answer (the
 * solution film). Some actors genuinely appeared in other films in the puzzle
 * too (`alsoIn`); those overlaps are traps, never correct answers.
 *
 * @typedef {Object} Film
 * @property {string} id     Stable film identifier (referenced by actors).
 * @property {string} title Display title.
 * @property {number} [year] Release year (optional).
 *
 * @typedef {Object} Actor
 * @property {string} id        Stable actor identifier (unique within a puzzle).
 * @property {string} name      Display name.
 * @property {string} filmId    The solution film — the only correct placement.
 * @property {string[]} [alsoIn] Other films in this puzzle the actor appeared in
 *                               (traps; never the correct answer). Excludes `filmId`.
 *
 * @typedef {Object} Puzzle
 * @property {string} id            Puzzle/date key (e.g. "2026-06-12").
 * @property {string} [date]        ISO date; defaults to `id` when absent.
 * @property {number} maxMistakes   Allowed wrong assignments before a loss.
 * @property {Film[]} films         N films (>= 2).
 * @property {Actor[]} actors       The scrambled cast; equal groups per film.
 */

/** Default Connections-style mistake budget when a puzzle omits `maxMistakes`. */
export const DEFAULT_MAX_MISTAKES = 4;

/** A puzzle must declare at least this many films. */
export const MIN_FILMS_PER_PUZZLE = 2;
