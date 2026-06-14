---
id: regenerate-themed-puzzles
title: Regenerate Themed Puzzles
intent: themed-puzzle-variety
complexity: medium
mode: autopilot
status: completed
depends_on:
  - theme-schema-and-generator
created: 2026-06-14T08:20:00Z
run_id: run-game-credits-024
completed_at: 2026-06-14T09:23:51.544Z
---

# Work Item: Regenerate Themed Puzzles

## Description

Regenerate the scheduled puzzles (and backfill) using the themed catalogue, so the
live schedule is varied and themed instead of Nolan-heavy. Each day gets a distinct
theme; no theme repeats on consecutive days.

## Acceptance Criteria

- [ ] Regenerate the upcoming week (and refresh the backfilled past week) as themed,
      3-film puzzles, each with a `theme`
- [ ] No two consecutive days share a theme; the set spans multiple theme styles
- [ ] Each puzzle is schema-valid, uniquely solvable, recognizable, ≥1 trap
- [ ] `public/puzzles/manifest.json` updated; the 3-film guard still passes
- [ ] Archive lists the themed days; full suite + e2e green; TMDB key stays in `.env`

## Technical Notes

Reuse the cluster-aware CLI: `npm run build:puzzle -- --date <d> --films 3 [--theme <id>]
--yes`, iterating dates with theme rotation. Re-verify each generated file
(`validatePuzzle` + `countPartitions == 1`). Replace the current `public/puzzles/*.json`
schedule with the themed set and update the manifest. Keep today playable.

## Dependencies

- theme-schema-and-generator
