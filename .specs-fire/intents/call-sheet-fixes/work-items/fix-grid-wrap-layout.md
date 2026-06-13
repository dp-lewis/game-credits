---
id: fix-grid-wrap-layout
title: Fix Grid Wrap Layout
intent: call-sheet-fixes
complexity: low
mode: autopilot
status: completed
depends_on: []
created: 2026-06-13T11:58:54Z
run_id: run-game-credits-011
completed_at: 2026-06-13T12:10:03.772Z
---

# Work Item: Fix Grid Wrap Layout

## Symptom

On desktop, the actor grid becomes **inconsistent when long names wrap** to two
lines — chip/row heights go uneven and the columns look ragged.

## Acceptance Criteria

- [ ] Actor chips render at a **consistent height** regardless of name length / wrapping
- [ ] The desktop grid stays aligned (even rows/columns) with a mix of short and long names
- [ ] Mobile (2-col) layout still works
- [ ] No existing tests broken

## Technical Notes

In `call-sheet-board.js` `.grid` (CSS grid) + `call-sheet-actor.js` button. Give
chips a consistent min-height and center content vertically so wrapping doesn't
change cell height (e.g. equal-height grid cells with `align-items: stretch` and
the button filling its cell). A genuinely long name (the live pool has some) is
the test case.

## Regression Check

Playwright (desktop viewport) on a puzzle with a long actor name, asserting the
grid renders without overflow and chips are present/aligned (render guard).

## Dependencies

(none)
