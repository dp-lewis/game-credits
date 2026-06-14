---
id: lock-completed-replays
title: Lock Completed Replays
intent: pastel-layout-refresh
complexity: medium
mode: autopilot
status: completed
depends_on:
  - tighten-page-layout
created: 2026-06-14T04:10:00Z
run_id: run-game-credits-023
completed_at: 2026-06-14T08:09:42.358Z
---

# Work Item: Lock Completed Replays

## Description

Make any **already-completed** puzzle lock on replay — archive or `?puzzle=` — and
show the revealed board, the same as today's finished puzzle. An unplayed puzzle is
still fully playable (practice, no streak effect).

## Acceptance Criteria

- [ ] On load, if the puzzle has a stored result (`getDay(id)`), show the locked
      static-reveal board, **regardless of replay/daily**
- [ ] An unplayed puzzle still loads a fresh, playable board (practice when it's a
      `?puzzle=` replay)
- [ ] The "already played" note reads sensibly for both daily and replay (drop the
      "come back tomorrow" wording, or make it conditional) — e.g. "You've already
      completed this puzzle."
- [ ] Streak behaviour unchanged — only daily-today non-replay play moves the streak
- [ ] `tests/e2e/play.spec.js` updated: after winning `?puzzle=2026-06-14`, a reload
      now shows the **locked/revealed** board (it was completed), not a fresh board
- [ ] Suite + e2e green; `npm run check` passes

## Technical Notes

`src/components/call-sheet-app.js` `_load()`: move the restore check out of the
`if (!this._isReplay)` guard so `getDay(id)` drives `_played` for any path; keep the
`_isReplay` flag only for streak gating in `_onGameOver` and the practice note. Adjust
the already-played message wording. In `play.spec.js`, the post-win reload assertions
flip from "fresh board / no already-played" to "already-played / revealed board".
`archive.spec.js` (`?puzzle=2026-06-15`, unplayed) stays a fresh practice board — its
context starts with empty storage, so no change needed.

## Dependencies

- tighten-page-layout
