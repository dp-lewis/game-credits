import { describe, it, expect } from 'vitest';
import { fetchFilmCast } from '../../scripts/lib/tmdb.js';

const film = { id: 'm', title: 'M', year: 2000, tmdbId: 1 };
const okFetch = (body) => async () => ({
  ok: true,
  status: 200,
  json: async () => body,
});

describe('fetchFilmCast', () => {
  it('maps cast keeping billing order, capped at the limit', async () => {
    const fetchImpl = okFetch({
      cast: [
        { id: 1, name: 'Lead', order: 0 },
        { id: 2, name: 'Second', order: 1 },
        { id: 3, name: 'Deep Cut', order: 2 },
      ],
    });
    const out = await fetchFilmCast(film, { apiKey: 'k', limit: 2, fetchImpl });
    expect(out.cast).toEqual([
      { id: 'tmdb-1', name: 'Lead', order: 0 },
      { id: 'tmdb-2', name: 'Second', order: 1 },
    ]);
    expect(out.title).toBe('M');
    expect(out.year).toBe(2000);
  });

  it('falls back to index order when TMDB omits it', async () => {
    const fetchImpl = okFetch({ cast: [{ id: 9, name: 'X' }] });
    const out = await fetchFilmCast(film, { apiKey: 'k', fetchImpl });
    expect(out.cast[0]).toEqual({ id: 'tmdb-9', name: 'X', order: 0 });
  });

  it('throws without an API key', async () => {
    await expect(
      fetchFilmCast(film, { apiKey: '', fetchImpl: okFetch({ cast: [] }) })
    ).rejects.toThrow(/TMDB_API_KEY/);
  });

  it('throws on a non-ok response', async () => {
    const fetchImpl = async () => ({ ok: false, status: 401 });
    await expect(
      fetchFilmCast(film, { apiKey: 'k', fetchImpl })
    ).rejects.toThrow(/401/);
  });
});
