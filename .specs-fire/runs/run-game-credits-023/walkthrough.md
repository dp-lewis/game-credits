---
run: run-game-credits-023
work_item: lock-completed-replays
intent: pastel-layout-refresh
generated: 2026-06-14T07:16:00Z
mode: autopilot
---

# Implementation Walkthrough: Lock Completed Replays

## Summary

Any puzzle you've already completed now locks to the revealed board when you open it
again — whether it's today's daily or a past puzzle replayed from the archive /
`?puzzle=`. Unplayed puzzles still load a fresh, playable board (practice, no streak).

## What changed

- `src/components/call-sheet-app.js`
  - `_load()`: the restore check is no longer gated by `!_isReplay` — if
    `getDay(id)` has a stored result, `_played = true` for any path.
  - `render()`: the "Practice mode" note is gated with `&& !this._played`; the
    already-played message is conditional — replay → "You've already completed this
    puzzle."; daily → "You've already played today's puzzle. Come back tomorrow…".
  - `_onGameOver` is unchanged: `_isReplay` still gates the streak, so locking and
    streak stay independent.

## Why

It was inconsistent that a finished daily locked but a finished puzzle replayed from
the archive started over. Now "already done" behaves the same everywhere.

## How to Verify

```bash
npm run dev
#   Finish today's puzzle, reload → revealed board + "already played today".
#   Open a past puzzle from the Archive, finish it, revisit → revealed board +
#     "already completed". An unfinished past puzzle is still playable (practice).
npm run check   # format, lint, coverage, build, e2e — green
```

## Ready for Review

- [x] Completed puzzles lock on replay; unplayed stay playable
- [x] Streak logic unchanged; messaging tidied
- [x] `npm run check` green

## Intent status

`pastel-layout-refresh` — all four work items complete.
