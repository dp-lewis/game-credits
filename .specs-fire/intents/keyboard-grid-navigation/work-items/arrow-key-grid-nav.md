---
id: arrow-key-grid-nav
title: Arrow-Key Grid Navigation
intent: keyboard-grid-navigation
complexity: high
mode: confirm
status: pending
depends_on:
  - predictable-tab-order
created: 2026-06-15T10:30:00Z
---

# Work Item: Arrow-Key Grid Navigation

## Description

Make the cast grid a single tab stop with arrow-key movement (WAI-ARIA grid /
roving-tabindex): Tab into the grid once, then ↑↓←→ move focus between cells; Enter/
Space select then swap (unchanged). Marked `confirm` so the keyboard model is signed
off before build.

## Acceptance Criteria

- [ ] The grid is **one tab stop** — exactly one cell has `tabindex="0"`, the rest
      `tabindex="-1"` (roving); Tab focuses the active cell, Tab again leaves to Submit
- [ ] ↑↓←→ move the active cell (←→ across movies, ↑↓ within a movie), focus follows;
      define edge behaviour (clamp vs wrap) — confirm at checkpoint
- [ ] Arrow nav **skips locked** (solved/disabled) cells; the active cell stays valid
      when a column solves
- [ ] Enter/Space on a cell selects, then swaps (existing select-then-swap), with the
      `aria-live` announcement unchanged; focus stays sensible after a swap
- [ ] Grid semantics: `role="grid"` + `role="gridcell"` (and rows as needed); chips
      remain operable buttons
- [ ] Reduced-motion + the FLIP animation still behave; full suite + e2e (keyboard
      arrow navigation + activate) green; `npm run check` passes

## Technical Notes

`src/components/call-sheet-board.js` + `call-sheet-actor.js`. Track `_activeCell`
`{col,row}`; render gives the chip at the active cell `tabindex=0`, others `-1` (add a
`tabindex`/`active` prop to `call-sheet-actor`, or set it on the inner button; consider
`shadowRootOptions = { delegatesFocus: true }` so focusing the host focuses the
button). Add a `keydown` handler on the grid for the arrows that recomputes
`_activeCell` (skipping locked cells) and focuses the new chip
(`_chipEl(id).focus()`). Enter/Space already activate the button → existing
`actor-pick`; track the active cell as a **position** so focus stays put across a swap.
Keep selection (`_selected`) and the announcement as-is. e2e: `page.keyboard.press`
Tab → ArrowRight/Down → Enter to drive a select/swap.

## Checkpoint

Confirm: the roving-tabindex model, arrow edge behaviour (clamp vs wrap), how locked
cells are skipped, the ARIA grid structure, and where focus lands after a swap / after
a column locks.

## Dependencies

- predictable-tab-order
