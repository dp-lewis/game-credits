---
id: lives-below-grid
title: Move Lives Below the Grid
intent: board-visual-tweaks
complexity: low
mode: autopilot
status: completed
depends_on: []
created: 2026-06-16T09:30:00Z
run_id: run-game-credits-028
completed_at: 2026-06-16T09:46:09Z
---

# Work Item: Move Lives Below the Grid

## Description

Move the lives indicator from above the column headers to below the actor grid,
immediately above the action button, so the lives counter sits next to the action
it gates.

## Acceptance Criteria

- [x] Lives render after the cells grid and before the "Check Answer" button
- [x] The static-reveal view still hides lives (the `_status === 'revealed' ? ''`
      guard is unchanged)
- [x] The visually-hidden `a11y-status` live region is unaffected
- [x] Full suite + e2e green

## Technical Notes

`src/components/call-sheet-board.js` `render()`: reorder the returned template so the
sequence is `a11y-status` → headers → cells → **lives** → submit → banner (lives was
previously emitted before the `a11y-status`/headers). The `_status === 'revealed'`
guard around the lives block and the `.lives` CSS (including `margin-bottom`) are
unchanged. No game logic touched.

## Dependencies

(none)
