/**
 * Minimal, build-time-only TMDB client. Used by `build-puzzles.js` ONLY when a
 * `TMDB_API_KEY` is present — the key is read from the environment, sent only to
 * TMDB, and never written to disk or output.
 */

const TMDB_BASE = 'https://api.themoviedb.org/3';

/**
 * Fetch a film's top cast from TMDB and shape it as a `FilmWithCast`.
 *
 * @param {{id: string, title: string, year?: number, tmdbId: number}} film
 * Each cast member keeps its billing `order` (lower = more prominent) so the
 * assembler can prefer recognizable leads over deep-cut character actors.
 *
 * @param {Object} [options]
 * @param {string} [options.apiKey=process.env.TMDB_API_KEY]
 * @param {number} [options.limit=20]  Max cast members to keep (by billing).
 * @param {typeof fetch} [options.fetchImpl=fetch]
 * @returns {Promise<{id:string,title:string,year?:number,cast:{id:string,name:string,order:number}[]}>}
 */
export async function fetchFilmCast(film, options = {}) {
  const {
    apiKey = process.env.TMDB_API_KEY,
    limit = 20,
    fetchImpl = fetch,
  } = options;

  if (!apiKey) {
    throw new Error(
      'TMDB_API_KEY is not set. Provide it via the environment, or run with --offline.'
    );
  }

  const url = `${TMDB_BASE}/movie/${film.tmdbId}/credits?api_key=${encodeURIComponent(apiKey)}`;
  const res = await fetchImpl(url);
  if (!res || !res.ok) {
    throw new Error(
      `TMDB credits request failed for "${film.id}" (${res ? res.status : 'no response'}).`
    );
  }
  const data = await res.json();
  // TMDB returns cast in billing order; keep that order so prominence is known.
  const cast = (data.cast || []).slice(0, limit).map((c, i) => ({
    id: tmdbActorId(c),
    name: c.name,
    order: typeof c.order === 'number' ? c.order : i,
  }));

  return {
    id: film.id,
    title: film.title,
    ...(film.year !== undefined ? { year: film.year } : {}),
    cast,
  };
}

/** Stable slug id for a TMDB cast member (prefers the numeric TMDB person id). */
function tmdbActorId(castMember) {
  if (castMember.id !== undefined && castMember.id !== null) {
    return `tmdb-${castMember.id}`;
  }
  return String(castMember.name || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
