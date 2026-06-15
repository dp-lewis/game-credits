---
id: block-future-puzzles
title: Block Playing Future Puzzles
intent: archive-preview-fixes
complexity: medium
mode: autopilot
status: completed
depends_on: []
created: 2026-06-15T09:00:00Z
run_id: run-game-credits-026
completed_at: 2026-06-15T08:42:09.743Z
---

# Work Item: Block Playing Future Puzzles

## Description

A future-dated puzzle can be loaded by editing `?puzzle=<date>` (or moving the clock).
Refuse to load any puzzle whose id is after today, on both the `?puzzle=` override and
the daily-resolve paths; show an "isn't available yet" message instead. Today and past
play normally.

## Acceptance Criteria

- [ ] `?puzzle=<future date>` does **not** load/play — shows a clear "this puzzle isn't
      available yet" status (no board)
- [ ] Today and past `?puzzle=` replays still work; the daily still loads today/most
      recent past
- [ ] `resolvePuzzleId` returns null instead of the earliest **upcoming** puzzle when
      nothing is on/before today (no future fallback)
- [ ] Tomorrow's date (the teaser) is covered by the same guard (it's `> today`)
- [ ] Unit tests for the no-future-fallback resolve + the future-id guard; e2e asserts
      `?puzzle=<future>` shows the unavailable message
- [ ] `npm run check` passes

## Technical Notes

`src/lib/puzzle-schedule.js` — drop the `return valid[0]` upcoming fallback (return
null when no id `<= todayKey`). `src/components/call-sheet-app.js` `_load()` — after
resolving `id`, if `id > todayKey()` set the error/unavailable state and return before
`loadPuzzle`. Note in code that the local clock isn't trustworthy on a static client;
this closes the `?puzzle=` tampering path, not clock manipulation. Update
`tests/unit/puzzle-schedule.test.js` for the removed fallback; add an e2e
(`?puzzle=<future>` → unavailable). Today's puzzle id comes from `todayKey()`.

## Dependencies

(none)
