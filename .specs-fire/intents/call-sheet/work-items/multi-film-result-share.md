---
id: multi-film-result-share
title: Multi-Film Result & Share (v2)
intent: call-sheet
complexity: medium
mode: autopilot
status: completed
depends_on:
  - multi-film-board
  - result-and-share
created: 2026-06-12T09:34:28Z
run_id: run-game-credits-003
completed_at: 2026-06-12T10:02:09.814Z
---

# Work Item: Multi-Film Result & Share (v2)

## Description

Update the result view and share grid for the 4-group puzzle. The share text
stays spoiler-free (no actor/film identifiers) but should reflect the richer
4-film outcome — e.g. groups solved and lives used — in a recognizable,
Connections-like grid.

## Acceptance Criteria

- [ ] Result view shows win/lose for the 4-film puzzle, including how many of the four groups were completed
- [ ] Share text remains spoiler-free (outcome + lives/groups only; no names) and reads well when pasted
- [ ] "Copy result" continues to work with graceful clipboard fallback
- [ ] Share generation is pure (`src/lib`) and unit-tested for win and loss across 4 groups
- [ ] Backward-compatible with the v1 (2-film) result, or cleanly superseded

## Technical Notes

Extend `generateShareText` (or add a v2 variant) keeping the pure-function +
component split. Consider per-group pips/rows for the share grid. Consume the
existing `game-over` event detail (`status`, `mistakes`, `maxMistakes`, plus any
group info added by `multi-film-board`). Coordinate with future `streak-tracking`,
which appends streak info via the same composition point.

## Dependencies

- multi-film-board
- result-and-share
