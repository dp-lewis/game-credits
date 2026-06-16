---
run: run-game-credits-028
work_item: rename-submit-check-answer
intent: board-visual-tweaks
mode: autopilot
checkpoint: none
approved_at:
---

# Implementation Plan: Board Visual Tweaks

(Wide run — 3 low-complexity work items, all autopilot. Back-fill: implemented and
verified from the Figma design sync before the plan was recorded.)

## Work Item 1: Rename Submit to Check Answer

### Approach

Change the playing-state action button label in `_renderBanner`'s sibling — the
`<button class="submit">` in `render()` — from "Submit" to "Check Answer". The `.submit`
class is unchanged, so component tests that select `button.submit` need no edit; only
the three e2e specs that find the button by accessible name change.

### Files Modified

| File | Changes |
|------|---------|
| `src/components/call-sheet-board.js` | Button text "Submit" → "Check Answer" |
| `tests/e2e/play.spec.js` | `getByRole('button', { name: 'Submit' })` → `'Check Answer'` (×3) |
| `tests/e2e/dark-mode.spec.js` | Same selector update (×1) |
| `tests/e2e/archive.spec.js` | Same selector update (×1) |

---

## Work Item 2: Move Lives Below the Grid

### Approach

Reorder the `render()` template so the lives block is emitted after `_renderCells()`
and before the submit button. The `_status === 'revealed' ? ''` guard and the `.lives`
CSS are unchanged — only DOM position moves.

### Files Modified

| File | Changes |
|------|---------|
| `src/components/call-sheet-board.js` | `render()` order → a11y-status, headers, cells, lives, submit, banner |

---

## Work Item 3: Taller Actor Tiles

### Approach

Bump the chip `button` rule's `min-height` from `3rem` to `5rem` in
`call-sheet-actor.js`. Grid rows are `1fr` and follow chip min-height; headers and the
Submit button have their own heights and are untouched.

### Files Modified

| File | Changes |
|------|---------|
| `src/components/call-sheet-actor.js` | `min-height: 3rem` → `5rem` |

### Tests

No new tests. The `grid-layout` e2e (equal-height chips) and the static-reveal
component test (`.lives` hidden) continue to pass unchanged.

`npm run check` green: format + lint + 214 unit/component + build + 11 e2e.

---
*Autopilot mode — plan recorded (back-fill).*
