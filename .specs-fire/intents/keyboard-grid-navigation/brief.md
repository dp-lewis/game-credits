---
id: keyboard-grid-navigation
title: Keyboard Grid Navigation
status: in_progress
created: 2026-06-15T10:30:00Z
---

# Intent: Keyboard Grid Navigation

## Goal

Make keyboard use of the board predictable and standard:

1. **Predictable tab order** — Tab moves through the chips in visual order (down each
   movie column: Movie 1's four, then Movie 2's, then Movie 3's). Tabbing in lands
   top-left; no more landing on a random chip or jumping around.
2. **Arrow-key grid navigation** — Tab into the grid **once**, then ↑↓←→ move focus
   between cells (WAI-ARIA grid / roving-tabindex pattern). Enter/Space still
   selects, then swaps (the existing select-then-swap).

## Users

Keyboard and assistive-tech players — orderly focus and arrow-key movement instead of
a scattered tab sequence.

## Problem

Chips render in a fixed DOM order (the original puzzle's actor list) and are placed
visually with CSS grid coordinates, so Tab (which follows DOM order) is decoupled from
the layout: focus lands on a visually-random chip and jumps around the grid. There's
also no arrow-key navigation — every chip is its own tab stop.

## Success Criteria

- Tab order follows the visual layout (column-major); tabbing in lands on the top-left
  cell.
- The grid is a single tab stop (roving tabindex); ↑↓←→ move focus between cells,
  skipping locked (solved) cells; Enter/Space select/swap as today.
- The swap/reveal **FLIP animation still works** (chips keep identity across reorder),
  and `prefers-reduced-motion` is still honoured.
- Proper grid semantics (`role="grid"`/`gridcell`) for assistive tech; existing
  `aria-live` selection announcements unchanged.
- Full suite + e2e green (incl. a keyboard-order/arrow test); `npm run check` passes.

## Constraints

- Web-platform-first, Lit. Keep the select-then-swap model and the FLIP animation.
- Locked chips are `disabled` (not focusable) — arrow navigation must skip them and
  keep the active cell valid when a column solves.

## Notes

Decided with the user: tab order **and** arrow keys. Decomposed into
`predictable-tab-order` (render column-major so DOM = visual order — this alone fixes
the reported jumpiness) and `arrow-key-grid-nav` (roving-tabindex + ARIA grid;
high/confirm — the keyboard model gets a checkpoint).
