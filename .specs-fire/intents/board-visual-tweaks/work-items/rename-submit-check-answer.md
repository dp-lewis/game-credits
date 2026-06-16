---
id: rename-submit-check-answer
title: Rename Submit to Check Answer
intent: board-visual-tweaks
complexity: low
mode: autopilot
status: completed
depends_on: []
created: 2026-06-16T09:30:00Z
run_id: run-game-credits-028
completed_at: 2026-06-16T09:46:09Z
---

# Work Item: Rename Submit to Check Answer

## Description

Rename the board's primary action button label from "Submit" to "Check Answer" so
the call-to-action names what it does — grade the current board.

## Acceptance Criteria

- [x] The playing-state action button reads "Check Answer"
- [x] The `button.submit` class selector is unchanged (component tests still pass)
- [x] e2e selectors that find the button by accessible name are updated to
      "Check Answer" in `play.spec.js`, `dark-mode.spec.js`, and `archive.spec.js`
- [x] Full suite + e2e green

## Technical Notes

`src/components/call-sheet-board.js` `render()`: the playing-state
`<button class="submit">` label text. The button keeps its `.submit` class, so
`tests/component/call-sheet-board.test.js` (which selects `button.submit`) needs no
change. Updated `getByRole('button', { name: 'Submit' })` →
`{ name: 'Check Answer' }` in `tests/e2e/play.spec.js`, `tests/e2e/dark-mode.spec.js`,
and `tests/e2e/archive.spec.js`. The `keyboard-nav.spec.js` reference to "Submit" is
a comment (no selector) and was left as-is.

## Dependencies

(none)
