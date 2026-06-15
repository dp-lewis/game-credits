---
id: predictable-tab-order
title: Predictable Tab Order
intent: keyboard-grid-navigation
complexity: medium
mode: autopilot
status: pending
depends_on: []
created: 2026-06-15T10:30:00Z
---

# Work Item: Predictable Tab Order

## Description

Render the chips in **visual (column-major) order** so the DOM/tab order matches the
layout — tabbing in lands top-left and moves down each movie column, then to the next.
Keep the FLIP swap/reveal animation working.

## Acceptance Criteria

- [ ] Chips render in column-major order (`_columns.flat()`): Movie 1's four (top→
      bottom), then Movie 2's, then Movie 3's — so Tab follows that sequence
- [ ] Tabbing into the board lands on the top-left cell (Movie 1, row 1)
- [ ] The grid still shows columns = movies (visual layout unchanged)
- [ ] The swap **and** reveal FLIP animations still play (chips keep identity across the
      reorder); `prefers-reduced-motion` still instant
- [ ] Equal-height chips preserved (grid-layout regression stays green)
- [ ] e2e asserts Tab visits chips in column-major order; `npm run check` passes

## Technical Notes

`src/components/call-sheet-board.js`: render `_renderCells` from `_columns.flat()`
(keyed by actor id) instead of `this.puzzle.actors`, and drop the inline
`grid-column`/`grid-row`. Switch `.cells` to a column-flow grid:
`grid-template-rows: repeat(groupSize, 1fr); grid-auto-flow: column` (keep
`grid-template-columns: repeat(var(--cols), 1fr)`), so column-major DOM order fills
each movie column top→bottom. Lit's keyed `repeat` **moves** existing nodes on reorder,
so FLIP still animates the swapped chips (capture rects → set `_columns` → await update
→ `_flip`). Verify the reveal (`_revealLoss`) FLIP too. Add a keyboard e2e
(`Tab`/`page.keyboard`) asserting the focus sequence is column-major.

## Dependencies

(none)
