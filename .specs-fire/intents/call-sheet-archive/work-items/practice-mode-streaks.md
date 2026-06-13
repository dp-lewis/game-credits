---
id: practice-mode-streaks
title: Practice-Mode Streaks
intent: call-sheet-archive
complexity: medium
mode: autopilot
status: completed
depends_on: []
created: 2026-06-13T20:46:22Z
run_id: run-game-credits-012
completed_at: 2026-06-13T20:52:09.884Z
---

# Work Item: Practice-Mode Streaks

## Description

Make the progress store distinguish a **streak-counting** daily play from a
**practice** play. Today's puzzle played today advances the streak; any other
completion (a past/archive puzzle) is recorded for the archive's ✓ but leaves the
streak untouched. Replaying never overwrites a recorded result.

## Acceptance Criteria

- [ ] `recordResult(dateKey, result, { updateStreak })` — when `updateStreak` is false, the day is recorded (for status display) but `current`/`longest`/`lastPlayedKey` are unchanged
- [ ] Existing same-day behaviour preserved when `updateStreak` is true (increment/gap/loss rules unchanged)
- [ ] Idempotent: re-recording an already-recorded day never overwrites it or re-touches the streak (replay-safe)
- [ ] A way to read a day's recorded status (existing `getDay`) drives the archive list
- [ ] Tests cover: practice play records day but not streak; today play still updates streak; replay no-op; backward compatibility (default `updateStreak: true`)

## Technical Notes

In `src/lib/progress-store.js`, add an options arg to `recordResult` defaulting to
`{ updateStreak: true }` (backward compatible — existing callers unaffected). The
app passes `updateStreak: dateKey === todayKey()`. Keep streak math in
`date-key.js`/the store; never store answers.

## Dependencies

(none)
