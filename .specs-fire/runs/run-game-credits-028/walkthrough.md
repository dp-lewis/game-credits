---
run: run-game-credits-028
work_items: rename-submit-check-answer, lives-below-grid, taller-actor-tiles
intent: board-visual-tweaks
generated: 2026-06-16T09:46:09Z
mode: wide (autopilot)
---

# Implementation Walkthrough: Board Visual Tweaks

## Summary

Three small board refinements synced from the *Call Sheet — Game UI* Figma file:

1. **Check Answer** — the primary action button now reads "Check Answer" instead of
   "Submit", naming what it does (grade the board).
2. **Lives below the grid** — the lives indicator moved from the top of the board to
   just above the action button, next to the action it gates.
3. **Taller tiles** — actor chips grew from 48px to 80px min-height for a more tactile,
   legible grid (comfortable even when names wrap to two lines).

Back-fill: implemented and verified as a direct Figma → code sync, then recorded here
so the FIRE ledger stays consistent.

## What Changed

### `src/components/call-sheet-board.js`

- **Button label** — the playing-state `<button class="submit">` text changed from
  `Submit` to `Check Answer`. The `.submit` class is unchanged.
- **Render order** — the lives block now renders after `_renderCells()` and before the
  action button. New sequence: `a11y-status` → headers → cells → **lives** → submit →
  banner. The `_status === 'revealed' ? ''` guard around lives is unchanged, so the
  already-played / static-reveal view still hides lives.

### `src/components/call-sheet-actor.js`

- Chip `button` rule: `min-height: 3rem` → `min-height: 5rem` (48px → 80px). Grid rows
  are `1fr` and follow the chip min-height, so the columns grow uniformly.

### Tests

- `tests/e2e/play.spec.js`, `tests/e2e/dark-mode.spec.js`, `tests/e2e/archive.spec.js` —
  `getByRole('button', { name: 'Submit' })` → `{ name: 'Check Answer' }`. No new tests;
  the `grid-layout` (equal-height) and static-reveal (`.lives` hidden) tests pass
  unchanged.

## Files

- `src/components/call-sheet-board.js` — button label + lives render position
- `src/components/call-sheet-actor.js` — chip min-height 3rem → 5rem
- `tests/e2e/play.spec.js`, `tests/e2e/dark-mode.spec.js`, `tests/e2e/archive.spec.js` —
  button accessible-name selector

## How to Verify

```bash
npm run dev
# Open the board:
# - the action button reads "Check Answer"
# - the four life dots sit directly above the button (below the grid)
# - actor tiles are noticeably taller (80px), names still centred and equal-height
npm run check   # format, lint, 214 tests, build, 11 e2e — green
```

## Intent Status

All three work items of **Board Visual Tweaks** complete → intent complete.
