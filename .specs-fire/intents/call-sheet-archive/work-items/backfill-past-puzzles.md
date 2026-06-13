---
id: backfill-past-puzzles
title: Backfill Past Puzzles
intent: call-sheet-archive
complexity: medium
mode: autopilot
status: completed
depends_on:
  - archive-view
created: 2026-06-13T21:40:58Z
run_id: run-game-credits-013
completed_at: 2026-06-13T21:43:44.704Z
---

# Work Item: Backfill Past Puzzles

## Description

Populate the archive with playable history: generate seven TMDB-sourced puzzles
for the **previous week** (2026-06-07 … 2026-06-13) and add them to the manifest,
so the archive shows past days now rather than waiting for the scheduled future
week to roll into the past.

## Acceptance Criteria

- [ ] Seven puzzles generated for `2026-06-07` … `2026-06-13`, each a 3-film puzzle
- [ ] Each is schema-valid and **uniquely solvable**, recognizable casts, ≥1 trap
- [ ] **Distinct film trios** across the backfill *and* vs. the already-scheduled puzzles (no two days share a trio)
- [ ] Manifest updated; the 3-film guard test still passes; the archive lists the new past days
- [ ] Full suite + e2e green; TMDB key stays in `.env`

## Technical Notes

Reuse `npm run build:puzzle -- --date <d> --films 3 --salt N --yes`. Seed the
salt-dedup with the existing manifest puzzles' trios (read their film titles) so
backfilled days don't repeat a scheduled day's films. Re-verify each generated
file with `validatePuzzle` + `countPartitions == 1`. Today (06-14) is unaffected;
06-12/06-13 get fresh 3-film puzzles (the old 2-/4-film files were removed
earlier).

## Dependencies

- archive-view
