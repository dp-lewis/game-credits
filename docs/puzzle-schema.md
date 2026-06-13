# Puzzle Schema

The contract between a puzzle source and the Call Sheet client. Today puzzles are
hand-authored under `public/puzzles/<id>.json`; later the TMDB curation pipeline
(`scripts/build-puzzles.js`) emits files conforming to this same schema.

Each puzzle presents **N films** (≥ 2; v2 uses 4) and a **scrambled ensemble
cast** split into equal groups. Every actor has a single **solution** film
(`filmId`) — the only correct placement. Some actors genuinely appeared in other
films in the same puzzle too (`alsoIn`); those overlaps are **traps**, never the
correct answer. As with any no-backend daily game, the answer ships in the client;
the UI shuffles display order and only reveals correctness at grading time.

## Shape

```jsonc
{
  "id": "2026-06-13", // required: puzzle / date key (matches filename)
  "date": "2026-06-13", // optional: ISO date; defaults to `id`
  "maxMistakes": 4, // optional: positive integer; defaults to 4
  "films": [
    // required: N films (>= 2); v2 uses 4
    { "id": "oceans-eleven", "title": "Ocean's Eleven", "year": 2001 },
    { "id": "the-departed", "title": "The Departed", "year": 2006 },
    { "id": "inception", "title": "Inception", "year": 2010 },
    { "id": "ouath", "title": "Once Upon a Time in Hollywood", "year": 2019 },
  ],
  "actors": [
    // required: split evenly across films by solution
    { "id": "clooney", "name": "George Clooney", "filmId": "oceans-eleven" },
    {
      "id": "pitt",
      "name": "Brad Pitt",
      "filmId": "oceans-eleven",
      "alsoIn": ["ouath"], // trap: really in OUATIH, but the answer is Ocean's Eleven
    },
    // ...16 total, 4 per film
  ],
}
```

## Fields

| Field             | Type     | Required | Notes                                                                                                                                       |
| ----------------- | -------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`              | string   | yes      | Non-empty. Matches the JSON filename (`<id>.json`).                                                                                         |
| `date`            | string   | no       | ISO date; defaults to `id`.                                                                                                                 |
| `maxMistakes`     | integer  | no       | Positive. Defaults to `4`.                                                                                                                  |
| `films`           | array    | yes      | **≥ 2 films**. Unique `id`s, non-empty `title`s; optional `year`.                                                                           |
| `actors`          | array    | yes      | Non-empty. Unique `id`s; `filmId` (solution) must reference a declared film.                                                                |
| `actors[].alsoIn` | string[] | no       | Other films in this puzzle the actor appeared in (traps). Each references a declared film, none equal the solution `filmId`, no duplicates. |

## Validation rules (enforced by `src/lib/puzzle-loader.js`)

- Top level is an object; `films` has at least 2 entries with unique non-empty ids/titles.
- `actors` is non-empty; each has non-empty `id`/`name` and a `filmId` referencing a declared film; actor ids are unique.
- **Group balance**: `actors.length` is divisible by `films.length`, and each film is the solution for exactly `groupSize = actors.length / films.length` actors.
- `alsoIn` (when present) is an array of declared film ids, none equal to the actor's solution, with no duplicates.
- `maxMistakes`, if present, is a positive integer; otherwise defaults to `4`.

Any violation throws a `PuzzleValidationError` with a descriptive message.

> **Note:** the loader validates _structure_, not _solvability_. The guarantee
> that a puzzle has exactly **one** valid partition (given actors' real
> memberships = `filmId` ∪ `alsoIn`) is the responsibility of the curation
> pipeline (`tmdb-curation-script`). Hand-made fixtures are verified for
> uniqueness before commit.

## Loading

```js
import { loadPuzzle } from '../lib/puzzle-loader.js';

const puzzle = await loadPuzzle('2026-06-13'); // fetches puzzles/2026-06-13.json
```

`loadPuzzle(id, { basePath = 'puzzles/', fetchImpl = fetch })` fetches and
validates, returning a normalized `Puzzle`. `validatePuzzle(data)` can be used
directly on already-loaded data.

## Daily rotation

Static hosting can't list a directory, so a **manifest** is the registry of
available puzzles:

```jsonc
// public/puzzles/manifest.json
["2026-06-12", "2026-06-13", "2026-06-14"]
```

The app resolves which puzzle to show via `resolvePuzzleId(todayKey, ids)`
(`src/lib/puzzle-schedule.js`): the exact date if present, else the most recent
puzzle on or before today, else the earliest. **Timezone:** "today" is the
player's _local_ calendar date (`todayKey`, `src/lib/date-key.js`) — the puzzle
rolls at local midnight.

A `?puzzle=<id>` query override forces a specific puzzle (used for deterministic
tests and replay/share links), bypassing date resolution.

## Generating puzzles (curation)

`scripts/build-puzzles.js` assembles a crossover puzzle and **verifies it has a
unique solution** before writing it, then appends the date to the manifest. The
uniqueness engine (`src/lib/curation.js`) fills each film with single-film
"anchor" actors, then greedily swaps in crossover actors as traps — keeping a
swap only while the solution stays unique (checked by `countPartitions`).

```bash
# Offline — uses scripts/fixtures/sample-casts.json (no API key needed)
npm run build:puzzle -- --date 2026-06-20 --films 3 --group-size 4 --offline

# Live — sources casts from TMDB (key via env, never written anywhere)
TMDB_API_KEY=… npm run build:puzzle -- --date 2026-06-20 --films 3

# --dry-run previews without writing; --yes skips the approval prompt
```

The output is validated against this schema before writing. Live mode reads the
candidate film list from `scripts/lib/tmdb-films.json` (slug → TMDB movie id).

## Recommended puzzle design (v2)

- **4 films, 16 actors, 4 per film** (tunable via the schema's group-balance rule).
- Include genuine crossovers (`alsoIn`) so the board is ambiguous — but ensure a
  **unique** solution: only one assignment puts every actor in a film they were
  in while giving each film its group of four. The `2026-06-13.json` fixture is a
  worked example (single-film "anchor" actors fill films to capacity, forcing the
  crossovers to their solution film).
