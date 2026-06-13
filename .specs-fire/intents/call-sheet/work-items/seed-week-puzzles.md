---
id: seed-week-puzzles
title: Seed a Week of Real Puzzles
intent: call-sheet
complexity: medium
mode: autopilot
status: completed
depends_on:
  - curation-actor-prominence
created: 2026-06-13T11:47:36Z
run_id: run-game-credits-010
completed_at: 2026-06-13T11:49:21.358Z
---

# Work Item: Seed a Week of Real Puzzles

## Description

Generate seven real, TMDB-sourced puzzles (2026-06-15 … 2026-06-21) for the live
site. Surfaced two content needs and addressed both: the candidate film pool was
too small (5 Nolan films → repetitive, duplicate trios), and a batch had no way to
guarantee distinct film trios across days.

## Acceptance Criteria

- [ ] Candidate film pool expanded with a varied, cross-cast set (real TMDB ids)
- [ ] A `--salt` knob lets a batch force distinct trios for different dates
- [ ] Seven puzzles generated for 2026-06-15 … 2026-06-21, each a **distinct** film trio
- [ ] Every puzzle is schema-valid and **uniquely solvable**, with recognizable (top-billed) casts and at least one crossover trap
- [ ] Manifest updated; build copies all puzzles; full suite + e2e green

## Technical Notes

Expanded `scripts/lib/tmdb-films.json` to 12 heavily cross-cast films (Nolan +
Scorsese/DiCaprio + Tarantino + heist/ensemble) with TMDB ids looked up via the
API. Added `--salt` to `scripts/build-puzzles.js` (mixed into the date seed) so a
dedup batch can pick the smallest salt yielding an unused trio. Generated, then
verified each file with `validatePuzzle` + `countPartitions` (== 1).

## Dependencies

- curation-actor-prominence
