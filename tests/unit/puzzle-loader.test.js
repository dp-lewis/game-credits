import { describe, it, expect } from 'vitest';
import {
  validatePuzzle,
  loadPuzzle,
  loadManifest,
  PuzzleValidationError,
} from '../../src/lib/puzzle-loader.js';
import sample from '../fixtures/sample-puzzle.json';

/** Deep clone so each test can mutate a fresh copy of the fixture. */
const clone = (o) => JSON.parse(JSON.stringify(o));

describe('validatePuzzle', () => {
  it('accepts a well-formed puzzle and returns a normalized copy', () => {
    const puzzle = validatePuzzle(clone(sample));
    expect(puzzle.id).toBe('sample');
    expect(puzzle.films).toHaveLength(2);
    expect(puzzle.actors).toHaveLength(4);
    expect(puzzle.maxMistakes).toBe(4);
  });

  it('does not mutate the input', () => {
    const input = clone(sample);
    const snapshot = clone(input);
    validatePuzzle(input);
    expect(input).toEqual(snapshot);
  });

  it('defaults maxMistakes to 4 when omitted', () => {
    const data = clone(sample);
    delete data.maxMistakes;
    expect(validatePuzzle(data).maxMistakes).toBe(4);
  });

  it('defaults date to id when omitted', () => {
    const data = clone(sample);
    delete data.date;
    expect(validatePuzzle(data).date).toBe('sample');
  });

  it.each([null, undefined, 42, 'nope', []])(
    'rejects non-object input: %s',
    (bad) => {
      expect(() => validatePuzzle(bad)).toThrow(PuzzleValidationError);
    }
  );

  it('rejects a missing id', () => {
    const data = clone(sample);
    delete data.id;
    expect(() => validatePuzzle(data)).toThrow(/id/);
  });

  it('rejects fewer than two films', () => {
    const data = clone(sample);
    data.films = [data.films[0]];
    expect(() => validatePuzzle(data)).toThrow(/at least 2 films/);
  });

  it('rejects duplicate film ids', () => {
    const data = clone(sample);
    data.films[1].id = data.films[0].id;
    expect(() => validatePuzzle(data)).toThrow(/Duplicate film/);
  });

  it('rejects an actor referencing an unknown film', () => {
    const data = clone(sample);
    data.actors[0].filmId = 'does-not-exist';
    expect(() => validatePuzzle(data)).toThrow(/does not match any film/);
  });

  it('rejects duplicate actor ids', () => {
    const data = clone(sample);
    data.actors[1].id = data.actors[0].id;
    expect(() => validatePuzzle(data)).toThrow(/Duplicate actor/);
  });

  it('rejects an empty actors array', () => {
    const data = clone(sample);
    data.actors = [];
    expect(() => validatePuzzle(data)).toThrow(/non-empty array/);
  });

  it('rejects a non-positive maxMistakes', () => {
    const data = clone(sample);
    data.maxMistakes = 0;
    expect(() => validatePuzzle(data)).toThrow(/positive integer/);
  });
});

describe('loadPuzzle', () => {
  const okFetch = (body) => async () => ({
    ok: true,
    status: 200,
    json: async () => body,
  });

  it('fetches from the default puzzles path and validates', async () => {
    let requestedUrl = '';
    const fetchImpl = async (url) => {
      requestedUrl = url;
      return { ok: true, status: 200, json: async () => clone(sample) };
    };
    const puzzle = await loadPuzzle('sample', { fetchImpl });
    expect(requestedUrl).toBe('puzzles/sample.json');
    expect(puzzle.id).toBe('sample');
  });

  it('honors a custom basePath', async () => {
    let requestedUrl = '';
    const fetchImpl = async (url) => {
      requestedUrl = url;
      return { ok: true, status: 200, json: async () => clone(sample) };
    };
    await loadPuzzle('sample', { basePath: '/data/', fetchImpl });
    expect(requestedUrl).toBe('/data/sample.json');
  });

  it('throws on a non-ok response', async () => {
    const fetchImpl = async () => ({ ok: false, status: 404 });
    await expect(loadPuzzle('missing', { fetchImpl })).rejects.toThrow(/404/);
  });

  it('throws on a network failure', async () => {
    const fetchImpl = async () => {
      throw new Error('offline');
    };
    await expect(loadPuzzle('x', { fetchImpl })).rejects.toThrow(/offline/);
  });

  it('propagates validation errors for malformed JSON bodies', async () => {
    const fetchImpl = okFetch({ id: 'broken' }); // missing films/actors
    await expect(loadPuzzle('broken', { fetchImpl })).rejects.toThrow(
      PuzzleValidationError
    );
  });

  it('requires a non-empty id', async () => {
    await expect(loadPuzzle('')).rejects.toThrow(/non-empty id/);
  });

  it('throws when the body is not valid JSON', async () => {
    const fetchImpl = async () => ({
      ok: true,
      status: 200,
      json: async () => {
        throw new Error('Unexpected token');
      },
    });
    await expect(loadPuzzle('x', { fetchImpl })).rejects.toThrow(
      /not valid JSON/
    );
  });

  it('throws when fetch resolves to no response', async () => {
    const fetchImpl = async () => undefined;
    await expect(loadPuzzle('x', { fetchImpl })).rejects.toThrow(/no response/);
  });
});

describe('loadManifest', () => {
  const okFetch = (body) => async () => ({
    ok: true,
    status: 200,
    json: async () => body,
  });

  it('fetches and returns the array of ids', async () => {
    const ids = ['2026-06-12', '2026-06-13'];
    const out = await loadManifest({ fetchImpl: okFetch(ids) });
    expect(out).toEqual(ids);
  });

  it('requests manifest.json under the base path', async () => {
    let url = '';
    const fetchImpl = async (u) => {
      url = u;
      return { ok: true, status: 200, json: async () => [] };
    };
    await loadManifest({ basePath: '/data/', fetchImpl });
    expect(url).toBe('/data/manifest.json');
  });

  it('throws on a non-ok response', async () => {
    const fetchImpl = async () => ({ ok: false, status: 404 });
    await expect(loadManifest({ fetchImpl })).rejects.toThrow(/manifest/);
  });

  it('throws when the body is not an array of strings', async () => {
    await expect(
      loadManifest({ fetchImpl: okFetch({ nope: true }) })
    ).rejects.toThrow(/array of non-empty id strings/);
  });

  it('throws when an entry is empty', async () => {
    await expect(
      loadManifest({ fetchImpl: okFetch(['2026-06-12', '']) })
    ).rejects.toThrow(/array of non-empty id strings/);
  });
});

describe('validatePuzzle — remaining field guards', () => {
  it('rejects a non-string film title', () => {
    const data = clone(sample);
    data.films[0].title = 123;
    expect(() => validatePuzzle(data)).toThrow(/title/);
  });

  it('rejects a non-object actor entry', () => {
    const data = clone(sample);
    data.actors[0] = 'nope';
    expect(() => validatePuzzle(data)).toThrow(/must be an object/);
  });

  it('rejects a non-string actor id', () => {
    const data = clone(sample);
    data.actors[0].id = 7;
    expect(() => validatePuzzle(data)).toThrow(/id/);
  });

  it('rejects a non-string actor name', () => {
    const data = clone(sample);
    data.actors[0].name = null;
    expect(() => validatePuzzle(data)).toThrow(/name/);
  });

  it('rejects a non-object film entry', () => {
    const data = clone(sample);
    data.films[0] = 42;
    expect(() => validatePuzzle(data)).toThrow(/must be an object/);
  });
});
