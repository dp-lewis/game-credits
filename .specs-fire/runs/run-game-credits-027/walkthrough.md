---
run: run-game-credits-027
work_items: predictable-tab-order, arrow-key-grid-nav
intent: keyboard-grid-navigation
generated: 2026-06-15T09:50:00Z
mode: wide (autopilot + confirm/skipped)
---

# Implementation Walkthrough: Keyboard Grid Navigation

## Summary

Two work items that fix keyboard UX on the cast grid:

1. **Predictable tab order** — Chips now render in column-major DOM order so Tab moves
   top-to-bottom through Movie 1's actors, then Movie 2's, then Movie 3's. Tabbing into
   the board always lands on the top-left chip, not a random one.
2. **Arrow-key grid navigation** — The grid is now a single tab stop (roving tabindex).
   Tab in once; ↑↓←→ move between cells; Tab again leaves to Submit. Enter/Space still
   selects then swaps. Solved (locked) columns are skipped during left/right navigation.
   Focus stays at the active *position* after a swap, not on the moved actor.

## What Changed

### `src/components/call-sheet-board.js`

- `_renderCells()` now iterates `_columns.flat()` (column-major) instead of
  `this.puzzle.actors`. Removed explicit `grid-column`/`grid-row` inline styles and the
  `_placement()` helper — the grid now auto-places items via `grid-auto-flow: column`.
- `.cells` CSS: replaced `grid-auto-rows: 1fr` with
  `grid-template-rows: repeat(var(--rows, 4), 1fr); grid-auto-flow: column`.
  Added `--rows: ${this._groupSize}` to the section's inline style.
- `<ul class="cells">` gets `role="grid"`, `aria-label`, `aria-colcount`,
  `aria-rowcount`, and `@keydown` handler.
- `<li class="cell">` gets `role="gridcell"`, `aria-rowindex`, `aria-colindex`.
- New `_activeCell { col, row }` reactive state (initialised to `{0,0}` on puzzle load).
- `?active=${isActive}` passed to `call-sheet-actor` for the active cell only.
- `_onGridKeydown(e)` — handles ArrowUp/Down/Left/Right: clamps at edges, skips solved
  columns on horizontal moves, updates `_activeCell`, schedules `_focusActiveChip` post-render.
- `_focusActiveChip()` — resolves actor at `_activeCell` position and calls `host.focus()`.
- `_resolveActiveCell()` — moves `_activeCell` to nearest unlocked column if current
  column just solved; called from `_submit()` after updating `_solved`.
- `_swap()` — calls `_focusActiveChip()` after the FLIP so focus stays at the position.

### `src/components/call-sheet-actor.js`

- `static shadowRootOptions = { ...LitElement.shadowRootOptions, delegatesFocus: true }` —
  `host.focus()` delegates to the inner button.
- New `active: { type: Boolean }` prop.
- Button now renders `tabindex=${this.active ? '0' : '-1'}` — exactly one tab stop in
  the grid at any time.

## Files

- `src/components/call-sheet-board.js` — column-major render, keyboard nav, ARIA, focus mgmt
- `src/components/call-sheet-actor.js` — delegateFocus, `active` prop, roving tabindex
- `tests/component/call-sheet-board.test.js` — 11 new keyboard-nav tests
- `tests/e2e/keyboard-nav.spec.js` — new e2e covering active-cell init, arrows, Enter, tab-stop count

## How to Verify

```bash
npm run dev
# Open /?puzzle=2026-06-14
# Tab → lands on top-left chip (Movie 1, row 1)
# ↓ → moves down the column; ↑ back up
# → → jumps to Movie 2's first row; ← back
# Enter → selects (blue ring); navigate to another cell → Enter → swap + FLIP
# Tab from grid → focus jumps to Submit (one grid tab stop)
# Submit a correct column → focus moves off the locked column automatically
npm run check   # format, lint, 214 tests, build, 11 e2e — green
```

## Intent Status

Both work items of **Keyboard Grid Navigation** complete.
