---
id: column-board-redesign
title: Column Board Redesign
intent: call-sheet-board-redesign
complexity: high
mode: confirm
status: completed
depends_on: []
created: 2026-06-13T22:01:01Z
run_id: run-game-credits-014
completed_at: 2026-06-14T02:03:22.498Z
---

# Work Item: Column Board Redesign

## Description

Replace the brush board (3 group buttons + a pool grid) with a **3-column grid**
where each column is a group. The 12 actors start shuffled across the columns and
the grid is **always full**. The player **selects an actor, then taps another
cell to swap** the two — animated. Arranging actors into columns is the
assignment; submit when each column holds the right four. Marked `confirm` so the
animation approach and accessibility are checkpointed before build.

## Acceptance Criteria

- [ ] Board renders a 3-column grid (one column per group), columns labelled (Group 1/2/3 with colour), 4 rows
- [ ] The 12 actors begin shuffled, evenly across the three columns (4 each)
- [ ] Tap an actor → it's selected (clear visual); tap another cell → the two **swap** positions; tap the selected one again → deselect
- [ ] The swap is **animated** (FLIP via the Web Animations API — no animation dependency)
- [ ] `prefers-reduced-motion` is honoured (instant swap, no motion)
- [ ] **Keyboard accessible**: select + swap via keyboard; cells are focusable with clear roles/labels
- [ ] Submit is gated until valid (each column has 4 — always true with the swap model) and grades via `gradeGroups` over the columns (unchanged logic)
- [ ] Solved groups lock; lives/win/lose unchanged; locked actors can't be moved
- [ ] Component + e2e tests updated for the new interaction (select → swap → submit → win/lose)

## Technical Notes

`src/components/call-sheet-board.js` + `call-sheet-actor.js`. Keep the assignment
model `actorId → groupIndex` (now derived from column); `gradeGroups` is reused
unchanged. Track a display order of cells (the 12 grid positions); a swap exchanges
two actors' positions and group membership. Animate with FLIP: measure cell rects
before, reorder, then `element.animate()` from the delta. Existing `play.spec.js`
and `call-sheet-board.test.js` interactions change (no more "active group" tap)
and must be updated.

## Checkpoint

Confirm: swap-and-FLIP animation approach (Web Animations API), the
reduced-motion + keyboard a11y plan, and how solved/locked columns behave during
swaps.

## Dependencies

(none)
