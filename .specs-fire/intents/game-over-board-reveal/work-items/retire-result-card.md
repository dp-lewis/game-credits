---
id: retire-result-card
title: Retire Result Card and Wire App
intent: game-over-board-reveal
complexity: medium
mode: autopilot
status: completed
depends_on:
  - board-result-reveal
created: 2026-06-14T03:10:00Z
run_id: run-game-credits-017
completed_at: 2026-06-14T03:40:31.318Z
---

# Work Item: Retire Result Card and Wire App

## Description

Remove the separate end-game card now that the board reveals the result, and wire
the app to the board's reveal. Drop `<call-sheet-result>` from the app and delete
the component (+ its test). For the **already-played daily restore**, render the
board's static reveal (solved solution, no per-actor ticks) with a short "already
played" line, instead of the old card. Keep streak tracking intact (just not shown)
and update the affected tests.

## Acceptance Criteria

- [ ] `<call-sheet-result>` is removed from `call-sheet-app.js`; the component file
      and its component test are deleted
- [ ] Nothing renders below the board on game over — the board is the whole result
- [ ] Already-played daily restore shows the board's **static reveal** (titles + cast
      in correct columns, no ticks) plus a brief "already played — back tomorrow" line
- [ ] Streak is still recorded via `progress-store` on game over (no behavioural
      change to tracking); it's simply not displayed
- [ ] `tests/e2e/play.spec.js` updated to assert the **board reveal** on a win (ticks
      / revealed titles) instead of the removed "Copy result" / share grid
- [ ] Full unit/component suite + e2e green; coverage threshold held

## Technical Notes

`src/components/call-sheet-app.js`: remove the `call-sheet-result` import and its
render block; for the `_played` branch render `<call-sheet-board .puzzle .reveal>`
(static reveal) plus the existing "already played" note rather than the result card.
Keep `_onGameOver` recording results (streak + restore data) unchanged. Delete
`src/components/call-sheet-result.js` and `tests/component/call-sheet-result.test.js`.
`src/lib/share-grid.js` + its unit tests are **retained** (pure, tested) even though
the UI no longer calls them — leaves the door open to re-add sharing. Update
`tests/e2e/play.spec.js` to assert the on-board win reveal.

## Dependencies

- board-result-reveal
