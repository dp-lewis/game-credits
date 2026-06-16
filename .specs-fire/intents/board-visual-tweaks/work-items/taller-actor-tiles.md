---
id: taller-actor-tiles
title: Taller Actor Tiles
intent: board-visual-tweaks
complexity: low
mode: autopilot
status: completed
depends_on: []
created: 2026-06-16T09:30:00Z
run_id: run-game-credits-028
completed_at: 2026-06-16T09:46:09Z
---

# Work Item: Taller Actor Tiles

## Description

Increase the actor chip height for a more tactile, legible board — chip
`min-height` from `3rem` to `5rem` (48px → 80px).

## Acceptance Criteria

- [x] Actor chip `min-height` is `5rem` (80px)
- [x] Movie headers (`2.5rem` min-height) and the action button (`3rem`) are
      unchanged
- [x] Chips stay equal height when names wrap (the `grid-layout` e2e test passes)
- [x] Full suite + e2e green

## Technical Notes

`src/components/call-sheet-actor.js` `static styles`: the chip `button` rule's
`min-height: 3rem` → `min-height: 5rem`. The grid rows are `1fr` and driven by chip
min-height, so the column heights follow automatically; header and Submit button
heights are defined separately and untouched.

## Dependencies

(none)
