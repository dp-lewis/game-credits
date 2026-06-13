---
run: run-game-credits-011
scope: wide
work_items: [fix-dark-mode-contrast, fix-grid-wrap-layout, enforce-three-film-rotation]
intent: call-sheet-fixes
---

# Implementation Plan: Call Sheet — Fixes (run-game-credits-011)

Wide run, 3 fixes. `enforce-three-film-rotation` (confirm) pauses for approval.

---

## Work Item: fix-dark-mode-contrast

### Root cause

`src/styles/global.css` dark-mode block overrides `--cs-bg/fg/muted` only. The
board's group buttons (`.bucket`) use `background: var(--cs-card)` (#fff, never
overridden) with inherited light text → near-white-on-white in dark mode. The
gold group colour `--cs-group-1` (#b7791f) fails AA with white text. Disabled
Submit is white-on-`--cs-border` (light grey).

### Fix

| File | Change |
|------|--------|
| `src/styles/global.css` | Dark-mode override for `--cs-card` (#1e1e1e) + `--cs-border` (#444); darken `--cs-group-0..3` to pass AA (≥4.5:1) with white text |
| `src/components/call-sheet-board.js` | Disabled `.submit` uses a muted-but-legible text colour (not white) |
| `src/components/call-sheet-actor.js` | Drop the now-redundant local dark override (global handles it) |

### Tests

- `tests/e2e/dark-mode.spec.js` — load with `colorScheme: 'dark'`, assert the
  Submit + a group button render visibly (render/visibility guard).

---

## Work Item: fix-grid-wrap-layout

### Root cause

The actor grid sizes rows by content, and the chip button doesn't fill its grid
cell. A wrapped (2-line) name makes its row taller, but sibling chips in the row
stay short → ragged, uneven layout on desktop.

### Fix

| File | Change |
|------|--------|
| `src/components/call-sheet-board.js` | `.grid { grid-auto-rows: 1fr }` — equalise all row heights |
| `src/components/call-sheet-actor.js` | `:host { height: 100% }` + `button { height: 100% }` — chip fills its cell |

Net: every chip becomes the same height (the tallest needed), so wrapping never
breaks alignment.

### Tests

- `tests/e2e/grid-layout.spec.js` — desktop viewport, a puzzle with a long actor
  name; assert all actor chips share the same height (consistent grid).

---

## Work Item: enforce-three-film-rotation  *(confirm — checkpoint)*

### Root cause

The manifest lists `2026-06-12` (2-film MVP fixture) and `2026-06-13` (4-film v2
fixture). Today (06-13) resolves to the 4-film puzzle.

### Investigation

- `2026-06-13.json` (4-film) is imported as a JSON fixture by 3 tests:
  `multi-film-schema.test.js`, `group-logic.test.js`, `call-sheet-board.test.js`.
- `2026-06-12.json` (2-film) is **not imported** anywhere; `tests/fixtures/sample-puzzle.json` already covers 2-film testing.

### Fix (proposed)

| Action | Detail |
|--------|--------|
| Relocate 4-film | `public/puzzles/2026-06-13.json` → `tests/fixtures/four-film-puzzle.json`; update the 3 imports |
| Remove 2-film | Delete `public/puzzles/2026-06-12.json` (unused, redundant with `sample-puzzle.json`) — *vs. relocate; see checkpoint* |
| Manifest | Drop `2026-06-12` and `2026-06-13` |
| Guard test | `tests/unit/manifest-three-films.test.js` — load every manifest puzzle, assert exactly 3 films (fails before, passes after) |

After: manifest = `2026-06-14 … 2026-06-21` (all 3-film); today (06-13) falls
through to the earliest, `2026-06-14`.

### Checkpoint decision

Confirm: **delete** the unused 2-film file (vs. relocate it as a dead fixture). I
recommend delete since `sample-puzzle.json` already exercises 2-film.

---
*Plan recorded. `enforce-three-film-rotation` is confirm — awaiting approval.*
