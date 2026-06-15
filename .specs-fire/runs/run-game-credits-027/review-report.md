---
run: run-game-credits-027
generated: 2026-06-15T09:50:00Z
---

# Review Report: run-game-credits-027

## Overall: ✓ Approved

Both work items complete; no correctness issues found.

## call-sheet-board.js

**Column-major rendering** — `_columns.flat()` keyed by actor-id preserves Lit's node
identity across reorders so FLIP animates correctly. CSS `grid-auto-flow: column` with
`grid-template-rows: repeat(var(--rows), 1fr)` fills column-by-column, matching DOM order
to visual order.

**Arrow-key handler** — only runs when `_status === 'playing'`; calls `e.preventDefault()`
on arrow keys to suppress page scroll; ArrowLeft/Right skip solved columns via linear scan
(O(cols), negligible). `updateComplete.then(focus)` correctly schedules focus after the
Lit render cycle.

**`_resolveActiveCell`** — correctly moves active position off a newly-solved column by
searching outward (col±d). When all columns solve simultaneously the loop exhausts without
moving — acceptable since the game is already won and navigation stops.

**Focus after swap** — `_focusActiveChip()` at end of `_swap` keeps focus at the position,
not the actor, matching the intent.

## call-sheet-actor.js

**`delegatesFocus: true`** — shadow root delegate means `host.focus()` in the board lands
on the inner button, not the host. Correct for programmatic focus from `_focusActiveChip`.

**`tabindex` on button** — `active ? '0' : '-1'` gives exactly one tab stop in the grid
(the active cell). Locked (disabled) buttons ignore tabindex anyway, so the active-cell
tabindex is a non-issue in post-game state (all chips locked/disabled).

## ARIA

`role="grid"` on `<ul>`, `role="gridcell"` on `<li>`, `aria-rowindex`/`aria-colindex`
on each cell, `aria-rowcount`/`aria-colcount` on the grid — correct flat-grid ARIA
(without explicit row elements, per the trigger decision). `aria-label="Cast grid"` gives
the grid an accessible name.

## No Issues

- FLIP animation paths unchanged (both `_swap` and `_revealLoss` capture rects before
  mutating `_columns`; keyed repeat moves DOM nodes; FLIP animates from old to new rect).
- `prefers-reduced-motion` paths unchanged.
- Existing `aria-live` announcement strings unchanged.
- `_isLocked` / `_selected` / submit flow unchanged.
