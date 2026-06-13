---
id: call-sheet-archive
title: Call Sheet — Archive
status: completed
created: 2026-06-13T20:46:22Z
completed_at: 2026-06-13T21:32:42.729Z
---

# Intent: Call Sheet — Archive

## Goal

Let players browse and play **past puzzles** (and today's) from an archive,
showing per-day completion status, without disturbing the daily-streak ritual.

## Users

Returning players who missed days or want to replay, plus newcomers who want to
try previous puzzles. The daily streak stays meaningful for regulars.

## Problem

Today the game only surfaces the current day's puzzle (past ones are reachable
only via a manual `?puzzle=` URL). There's no way to discover or pick a previous
day, and no completion history view.

## Success Criteria

- An Archive view lists available puzzle dates **≤ today**, newest first, each with status (✓ won / ✗ lost / ▢ unplayed).
- Future dates are never shown (no spoilers).
- Selecting a date plays it on a fresh board (replay allowed); the existing daily restore-on-reload is preserved for today.
- A completion updates the streak **only** when it is today's puzzle played today; archive/past plays record completion but never change the streak.
- Navigation is shareable and back-button friendly (`?archive`, `?puzzle=<id>`).
- No existing tests broken; full suite + e2e green.

## Constraints

- Web-platform-first / static; no backend. Reuse the manifest, `loadPuzzle`, the
  `?puzzle=` override, and the `localStorage` progress store.
- Streak integrity: replaying never overwrites a recorded result.

## Notes

Confirmed decisions: past plays are *practice* (no streak effect); finished
puzzles are replayable from the archive; presentation is a reverse-chronological
list. Decomposed into `practice-mode-streaks`, `archive-list`, `archive-view`.
