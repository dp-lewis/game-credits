---
id: puzzle-schema-and-loader
title: Puzzle Schema and Loader
intent: call-sheet
complexity: medium
mode: autopilot
status: pending
depends_on: [project-scaffold]
created: 2026-06-11T21:10:53Z
---

# Work Item: Puzzle Schema and Loader

## Description

Define the canonical puzzle JSON schema (the contract between the curation
pipeline and the client), hand-author one fixture puzzle (2 films, ~8 actors,
4 per film) so the game is playable before the TMDB pipeline exists, and build a
loader that fetches and validates puzzle JSON. The loader is the only thing that
reads puzzle files; everything downstream trusts its validated output.

## Acceptance Criteria

- [ ] A documented puzzle JSON schema exists (films[2], actors[], answer key mapping actor→film, optional metadata: date, mistake budget)
- [ ] One hand-made fixture puzzle conforms to the schema and is stored under `public/puzzles/`
- [ ] A `loadPuzzle(dateKey)` (or similar) function fetches the JSON and returns a validated object
- [ ] Loader validates shape and rejects malformed data with a clear error
- [ ] Schema is documented in the repo (README or schema doc) for the curation pipeline to target
- [ ] Unit tests cover: valid load, missing field rejection, wrong-shape rejection

## Technical Notes

Keep the schema minimal but forward-compatible with the TMDB pipeline (#8) and
daily rotation (#6). Include `maxMistakes` (default 4) and the two films plus a
scrambled actor list with a hidden answer key. Loader lives in `src/lib/`; no
framework dependency. Use a checked-in fixture under `tests/fixtures/` too for
deterministic tests.

## Dependencies

- project-scaffold
