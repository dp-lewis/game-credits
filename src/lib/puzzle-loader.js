import { DEFAULT_MAX_MISTAKES, MIN_FILMS_PER_PUZZLE } from './puzzle-schema.js';

/**
 * Thrown when puzzle data does not conform to the schema. The loader rejects
 * malformed data loudly so nothing downstream has to second-guess its input.
 */
export class PuzzleValidationError extends Error {
  /** @param {string} message */
  constructor(message) {
    super(message);
    this.name = 'PuzzleValidationError';
  }
}

const isNonEmptyString = (v) => typeof v === 'string' && v.trim() !== '';

/**
 * Validate and normalize raw puzzle data.
 *
 * Returns a new, normalized {@link import('./puzzle-schema.js').Puzzle} object
 * (e.g. `maxMistakes` defaulted, `date` filled from `id`). Never mutates input.
 *
 * @param {unknown} data
 * @returns {import('./puzzle-schema.js').Puzzle}
 * @throws {PuzzleValidationError}
 */
export function validatePuzzle(data) {
  if (data === null || typeof data !== 'object' || Array.isArray(data)) {
    throw new PuzzleValidationError('Puzzle must be an object.');
  }

  const { id, date, maxMistakes, theme, films, actors } = /** @type {any} */ (
    data
  );

  if (!isNonEmptyString(id)) {
    throw new PuzzleValidationError('Puzzle "id" must be a non-empty string.');
  }

  // Films: at least MIN_FILMS_PER_PUZZLE, unique ids, non-empty titles.
  if (!Array.isArray(films) || films.length < MIN_FILMS_PER_PUZZLE) {
    throw new PuzzleValidationError(
      `Puzzle "films" must be an array of at least ${MIN_FILMS_PER_PUZZLE} films.`
    );
  }
  const filmIds = new Set();
  films.forEach((film, i) => {
    if (film === null || typeof film !== 'object') {
      throw new PuzzleValidationError(`films[${i}] must be an object.`);
    }
    if (!isNonEmptyString(film.id)) {
      throw new PuzzleValidationError(
        `films[${i}].id must be a non-empty string.`
      );
    }
    if (!isNonEmptyString(film.title)) {
      throw new PuzzleValidationError(
        `films[${i}].title must be a non-empty string.`
      );
    }
    if (filmIds.has(film.id)) {
      throw new PuzzleValidationError(`Duplicate film id "${film.id}".`);
    }
    filmIds.add(film.id);
  });

  // Actors: at least one, unique ids, each referencing a known film.
  if (!Array.isArray(actors) || actors.length === 0) {
    throw new PuzzleValidationError(
      'Puzzle "actors" must be a non-empty array.'
    );
  }
  const actorIds = new Set();
  actors.forEach((actor, i) => {
    if (actor === null || typeof actor !== 'object') {
      throw new PuzzleValidationError(`actors[${i}] must be an object.`);
    }
    if (!isNonEmptyString(actor.id)) {
      throw new PuzzleValidationError(
        `actors[${i}].id must be a non-empty string.`
      );
    }
    if (!isNonEmptyString(actor.name)) {
      throw new PuzzleValidationError(
        `actors[${i}].name must be a non-empty string.`
      );
    }
    if (!filmIds.has(actor.filmId)) {
      throw new PuzzleValidationError(
        `actors[${i}].filmId "${actor.filmId}" does not match any film.`
      );
    }
    if (actorIds.has(actor.id)) {
      throw new PuzzleValidationError(`Duplicate actor id "${actor.id}".`);
    }
    actorIds.add(actor.id);

    // alsoIn (optional): other films in this puzzle the actor appeared in.
    // Traps — never the correct answer — so they must reference declared films
    // and must not include the solution film.
    if (actor.alsoIn !== undefined) {
      if (!Array.isArray(actor.alsoIn)) {
        throw new PuzzleValidationError(
          `actors[${i}].alsoIn must be an array when provided.`
        );
      }
      const seen = new Set();
      for (const filmId of actor.alsoIn) {
        if (!filmIds.has(filmId)) {
          throw new PuzzleValidationError(
            `actors[${i}].alsoIn references unknown film "${filmId}".`
          );
        }
        if (filmId === actor.filmId) {
          throw new PuzzleValidationError(
            `actors[${i}].alsoIn must not include the solution film "${filmId}".`
          );
        }
        if (seen.has(filmId)) {
          throw new PuzzleValidationError(
            `actors[${i}].alsoIn has duplicate film "${filmId}".`
          );
        }
        seen.add(filmId);
      }
    }
  });

  // Group balance: actors split evenly across all films by solution film, so
  // every film is the answer for exactly the same number of actors.
  if (actors.length % films.length !== 0) {
    throw new PuzzleValidationError(
      `Puzzle has ${actors.length} actors, not divisible by ${films.length} films.`
    );
  }
  const groupSize = actors.length / films.length;
  const counts = new Map(films.map((f) => [f.id, 0]));
  for (const actor of actors) {
    counts.set(actor.filmId, counts.get(actor.filmId) + 1);
  }
  for (const film of films) {
    if (counts.get(film.id) !== groupSize) {
      throw new PuzzleValidationError(
        `Film "${film.id}" has ${counts.get(film.id)} actors; expected ${groupSize} (groups must be balanced).`
      );
    }
  }

  // maxMistakes: positive integer when present, else default.
  let resolvedMaxMistakes = DEFAULT_MAX_MISTAKES;
  if (maxMistakes !== undefined) {
    if (!Number.isInteger(maxMistakes) || maxMistakes <= 0) {
      throw new PuzzleValidationError(
        'Puzzle "maxMistakes" must be a positive integer when provided.'
      );
    }
    resolvedMaxMistakes = maxMistakes;
  }

  // theme: optional flavour label; non-empty string when present.
  if (theme !== undefined && !isNonEmptyString(theme)) {
    throw new PuzzleValidationError(
      'Puzzle "theme" must be a non-empty string when provided.'
    );
  }

  return {
    id,
    date: isNonEmptyString(date) ? date : id,
    maxMistakes: resolvedMaxMistakes,
    ...(isNonEmptyString(theme) ? { theme } : {}),
    films: films.map((f) => ({
      id: f.id,
      title: f.title,
      ...(f.year !== undefined ? { year: f.year } : {}),
    })),
    actors: actors.map((a) => ({
      id: a.id,
      name: a.name,
      filmId: a.filmId,
      ...(a.alsoIn !== undefined ? { alsoIn: [...a.alsoIn] } : {}),
    })),
  };
}

/**
 * Fetch a puzzle by id from the static puzzles directory, then validate it.
 *
 * @param {string} id Puzzle id / date key (e.g. "2026-06-12").
 * @param {Object} [options]
 * @param {string} [options.basePath='puzzles/'] Directory the JSON lives in.
 * @param {typeof fetch} [options.fetchImpl] Injectable fetch (for tests).
 * @returns {Promise<import('./puzzle-schema.js').Puzzle>}
 * @throws {PuzzleValidationError} when the response is missing or malformed.
 */
export async function loadPuzzle(id, options = {}) {
  const { basePath = 'puzzles/', fetchImpl = fetch } = options;

  if (!isNonEmptyString(id)) {
    throw new PuzzleValidationError('loadPuzzle requires a non-empty id.');
  }

  const url = `${basePath}${id}.json`;
  let response;
  try {
    response = await fetchImpl(url);
  } catch (err) {
    throw new PuzzleValidationError(
      `Failed to fetch puzzle "${id}": ${err.message}`
    );
  }

  if (!response || !response.ok) {
    const status = response ? response.status : 'no response';
    throw new PuzzleValidationError(
      `Failed to load puzzle "${id}" (${status}).`
    );
  }

  let raw;
  try {
    raw = await response.json();
  } catch (err) {
    throw new PuzzleValidationError(
      `Puzzle "${id}" is not valid JSON: ${err.message}`
    );
  }

  return validatePuzzle(raw);
}

/**
 * Fetch the puzzle manifest — the list of available puzzle ids (date keys).
 * Static hosting can't list a directory, so the manifest is the registry.
 *
 * @param {Object} [options]
 * @param {string} [options.basePath='puzzles/']
 * @param {typeof fetch} [options.fetchImpl]
 * @returns {Promise<string[]>}
 * @throws {PuzzleValidationError} when missing or malformed.
 */
export async function loadManifest(options = {}) {
  const { basePath = 'puzzles/', fetchImpl = fetch } = options;
  const url = `${basePath}manifest.json`;

  let response;
  try {
    response = await fetchImpl(url);
  } catch (err) {
    throw new PuzzleValidationError(
      `Failed to fetch puzzle manifest: ${err.message}`
    );
  }
  if (!response || !response.ok) {
    const status = response ? response.status : 'no response';
    throw new PuzzleValidationError(
      `Failed to load puzzle manifest (${status}).`
    );
  }

  let raw;
  try {
    raw = await response.json();
  } catch (err) {
    throw new PuzzleValidationError(
      `Puzzle manifest is not valid JSON: ${err.message}`
    );
  }

  if (!Array.isArray(raw) || !raw.every((id) => isNonEmptyString(id))) {
    throw new PuzzleValidationError(
      'Puzzle manifest must be an array of non-empty id strings.'
    );
  }
  return raw;
}
