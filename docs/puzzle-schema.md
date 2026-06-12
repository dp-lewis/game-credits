# Puzzle Schema

The contract between a puzzle source and the Call Sheet client. Today puzzles are
hand-authored under `public/puzzles/<id>.json`; later the TMDB curation pipeline
(`scripts/build-puzzles.js`) emits files conforming to this same schema.

Each puzzle presents **two films** and a **scrambled ensemble cast**. Every actor
belongs to exactly one of the two films — `actors[].filmId` is the answer key. As
with any no-backend daily game, the answer ships in the client; the UI shuffles
display order and only reveals correctness at grading time.

## Shape

```jsonc
{
  "id": "2026-06-12", // required: puzzle / date key (matches filename)
  "date": "2026-06-12", // optional: ISO date; defaults to `id`
  "maxMistakes": 4, // optional: positive integer; defaults to 4
  "films": [
    // required: EXACTLY two films
    { "id": "oceans-eleven", "title": "Ocean's Eleven", "year": 2001 },
    {
      "id": "devil-wears-prada",
      "title": "The Devil Wears Prada",
      "year": 2006,
    },
  ],
  "actors": [
    // required: >= 1, each belongs to one film
    { "id": "clooney", "name": "George Clooney", "filmId": "oceans-eleven" },
    // ...
  ],
}
```

## Fields

| Field         | Type    | Required | Notes                                                                  |
| ------------- | ------- | -------- | ---------------------------------------------------------------------- |
| `id`          | string  | yes      | Non-empty. Matches the JSON filename (`<id>.json`).                    |
| `date`        | string  | no       | ISO date; defaults to `id`.                                            |
| `maxMistakes` | integer | no       | Positive. Defaults to `4` (Connections convention).                    |
| `films`       | array   | yes      | **Exactly 2**. Unique `id`s, non-empty `title`s; optional `year`.      |
| `actors`      | array   | yes      | Non-empty. Unique `id`s; `filmId` must reference one of the two films. |

## Validation rules (enforced by `src/lib/puzzle-loader.js`)

- Top level is an object.
- `films` is an array of exactly two objects with unique, non-empty `id` and non-empty `title`.
- `actors` is a non-empty array; each actor has non-empty `id` and `name`, and a `filmId` matching a declared film. Actor `id`s are unique.
- `maxMistakes`, if present, is a positive integer; otherwise it defaults to `4`.

Any violation throws a `PuzzleValidationError` with a descriptive message.

## Loading

```js
import { loadPuzzle } from '../lib/puzzle-loader.js';

const puzzle = await loadPuzzle('2026-06-12'); // fetches puzzles/2026-06-12.json
```

`loadPuzzle(id, { basePath = 'puzzles/', fetchImpl = fetch })` fetches and
validates, returning a normalized `Puzzle`. `validatePuzzle(data)` can be used
directly on already-loaded data.

## Recommended puzzle design

- ~8 actors, 4 per film, for a balanced board (tunable).
- Pick two films with **distinct** casts so each actor maps unambiguously to one
  film. (An actor appearing in both films is out of scope for this schema — each
  actor has a single `filmId`.)
