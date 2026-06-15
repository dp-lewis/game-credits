---
run: run-game-credits-027
work_item: predictable-tab-order
intent: keyboard-grid-navigation
mode: autopilot
checkpoint: none
approved_at:
---

# Implementation Plan: Keyboard Grid Navigation

(Wide run — 2 work items: `predictable-tab-order` then `arrow-key-grid-nav`.)

## Work Item 1: Predictable Tab Order

### Approach

Switch `_renderCells()` from iterating `this.puzzle.actors` (stable puzzle-order with
explicit `grid-column`/`grid-row` placement) to iterating `_columns.flat()` (column-major
order, auto-placed by CSS). The grid becomes `grid-auto-flow: column` with
`grid-template-rows: repeat(var(--rows), 1fr)`, so the first N items fill movie-1 top→bottom,
the next N fill movie-2, etc. DOM order = visual order = tab order.

Lit's keyed `repeat` reorders DOM nodes on swap → FLIP still captures pre-swap rects and
animates the chips. `_revealLoss` captures all rects before updating `_columns` — same.

### Files Modified

| File | Changes |
|------|---------|
| `src/components/call-sheet-board.js` | Render from `_columns.flat()`, CSS column-flow, remove `_placement()`, add `--rows` CSS var |

---

## Work Item 2: Arrow-Key Grid Navigation

### Approach

Roving tabindex + `role="grid"` WAI-ARIA pattern. Track `_activeCell {col, row}` as state.
The chip at the active position gets `active=true` → `tabindex="0"`; all others get `-1`.
A `@keydown` on the `<ul>` handles arrows (clamping at edges, skipping solved columns).
`delegatesFocus: true` on `call-sheet-actor` so `host.focus()` delegates to the inner button.
After swap and after submit (column solves), `_activeCell` is kept valid by `_resolveActiveCell`.

### Files Modified

| File | Changes |
|------|---------|
| `src/components/call-sheet-board.js` | `_activeCell` state, `_onGridKeydown`, `_focusActiveChip`, `_resolveActiveCell`, ARIA attrs on grid/cells, `?active` on actors, `_focusActiveChip()` after swap, `_resolveActiveCell()` after submit |
| `src/components/call-sheet-actor.js` | `delegatesFocus: true`, `active` Boolean prop, `tabindex` on button |

### Tests

| File | Changes |
|------|---------|
| `tests/component/call-sheet-board.test.js` | 11 new keyboard-navigation tests |
| `tests/e2e/keyboard-nav.spec.js` | New file — e2e covering active-cell init, arrow navigation, Enter-to-select, single grid tab stop |

`npm run check` green: format + lint + 214 unit tests + build + 11 e2e.

---
*Autopilot mode (checkpoint skipped per async instruction) — plan recorded.*
