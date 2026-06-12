---
id: multi-film-schema
title: Multi-Film Schema (v2)
intent: call-sheet
complexity: medium
mode: autopilot
status: completed
depends_on:
  - puzzle-schema-and-loader
created: 2026-06-12T09:34:28Z
run_id: run-game-credits-003
completed_at: 2026-06-12T09:43:37.301Z
---

# Work Item: Multi-Film Schema (v2)

## Description

Evolve the puzzle schema and loader from exactly-two-films to **N films**
(default 4), supporting the v2 crossover mechanic. Each actor still has a single
**solution** `filmId` (the only correct placement), but a puzzle now groups 16
actors into 4 films (4 each) and may record which other films an actor genuinely
appeared in (overlap metadata) so curation/tooling can reason about traps and
uniqueness. Update the validator, hand-author a 4×4 fixture with a verified unique
solution, and refresh the docs.

## Acceptance Criteria

- [ ] Schema supports `films` of length N (default/expected 4); `FILMS_PER_PUZZLE` generalised (e.g. min 2)
- [ ] Group-balance validation: each film is the solution film for the same count of actors (e.g. 4), and total actors = films × groupSize
- [ ] Each actor keeps a single solution `filmId`; optional `alsoIn: string[]` records other films in this puzzle they appeared in (validated to reference declared films, excluding the solution)
- [ ] Loader still returns a normalized, validated puzzle; descriptive `PuzzleValidationError` on violations (bad film count, unbalanced groups, bad `alsoIn` ref)
- [ ] A hand-crafted fixture `public/puzzles/2026-06-13.json` has 4 films / 16 actors with real crossovers and a **unique** valid partition (documented reasoning)
- [ ] `docs/puzzle-schema.md` updated for N films, group balance, and `alsoIn`
- [ ] Tests cover N-film validation, group-balance rejection, `alsoIn` validation, and backward-compatibility with a 2-film puzzle

## Technical Notes

Keep `actors[].filmId` as the answer so `buildAnswerKey`/`gradeSubmission` keep
working unchanged. `alsoIn` is metadata (traps/curation), NOT used by grading —
placing an actor in an `alsoIn` film is still wrong (confirmed design). Consider a
`groupSize` (derive from films/actors) and validate balance. The v1 fixture
(`2026-06-12.json`, 2 films) should remain valid to avoid breaking existing tests;
gate the board on whatever film count the puzzle declares.

## Dependencies

- puzzle-schema-and-loader
