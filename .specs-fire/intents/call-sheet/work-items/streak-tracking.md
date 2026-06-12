---
id: streak-tracking
title: Streak Tracking
intent: call-sheet
complexity: medium
mode: autopilot
status: completed
depends_on:
  - result-and-share
  - daily-puzzle-rotation
created: 2026-06-11T21:10:53Z
run_id: run-game-credits-004
completed_at: 2026-06-12T22:03:49.192Z
---

# Work Item: Streak Tracking

## Description

Persist player progress across days in `localStorage`: current streak, longest
streak, per-day completion/outcome history, and restore-on-reload so a finished
day shows its result. Feeds streak info into the share text. No backend — state is
per-device.

## Acceptance Criteria

- [ ] A progress store in `src/lib/` reads/writes streak and history to `localStorage`
- [ ] Current streak increments on consecutive solved days and resets on a gap/loss (rule documented)
- [ ] Longest streak is tracked
- [ ] Reloading a finished day restores its result instead of replaying
- [ ] Share text can include streak info via the #5 generator
- [ ] Tests cover increment, reset-on-gap, restore-on-reload (localStorage stubbed)

## Technical Notes

Keep the store as a thin, testable module wrapping `localStorage`; guard against
malformed/absent stored data. Define the streak rule precisely (does a loss break
the streak? does a skipped day?). Coordinate the date key with #6 so "consecutive
days" is consistent. Never store secrets or full answers.

## Dependencies

- result-and-share
- daily-puzzle-rotation
