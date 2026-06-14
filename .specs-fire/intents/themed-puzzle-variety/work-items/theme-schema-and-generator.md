---
id: theme-schema-and-generator
title: Theme Schema and Generator
intent: themed-puzzle-variety
complexity: medium
mode: autopilot
status: completed
depends_on:
  - themed-film-catalogue
created: 2026-06-14T08:20:00Z
run_id: run-game-credits-024
completed_at: 2026-06-14T09:16:45.131Z
---

# Work Item: Theme Schema and Generator

## Description

Teach the puzzle format and the generator about themes: add a `theme` field to the
puzzle schema, and make `build-puzzles.js` cluster-aware — pick a theme, draw a trio
from that cluster, and record the theme. Rotate themes so consecutive generated days
differ.

## Acceptance Criteria

- [ ] Puzzle schema/loader accepts an optional `theme` (non-empty string) and exposes
      it on the loaded puzzle; existing theme-less puzzles still validate
- [ ] `build-puzzles.js` selects a cluster (deterministic by date seed), draws the trio
      from it, and writes `theme` into the puzzle JSON
- [ ] A `--theme <id>` flag forces a specific cluster; batch generation avoids
      repeating a theme on consecutive days (extends the existing salt/dedup logic)
- [ ] Uniqueness, recognizability, and ≥1-trap guarantees are preserved
- [ ] Unit tests cover the schema `theme` field and the cluster-selection/dedup logic
- [ ] `npm run check` passes

## Technical Notes

`src/lib/puzzle-loader.js` (schema + `toPuzzle`), `scripts/build-puzzles.js`,
`src/lib/curation.js`. The trio assembly already shuffles + verifies; restrict the
candidate films to the chosen cluster, then keep the existing anchor/greedy-trap +
`countPartitions == 1` checks. Theme rotation: seed cluster choice by date and skip a
cluster used by the immediately-preceding day(s), mirroring how `--salt` already
de-dupes trios.

## Dependencies

- themed-film-catalogue
