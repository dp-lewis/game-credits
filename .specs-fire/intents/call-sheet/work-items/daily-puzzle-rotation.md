---
id: daily-puzzle-rotation
title: Daily Puzzle Rotation
intent: call-sheet
complexity: medium
mode: autopilot
status: completed
depends_on:
  - puzzle-schema-and-loader
  - game-board-ui
created: 2026-06-11T21:10:53Z
run_id: run-game-credits-004
completed_at: 2026-06-12T21:58:30.497Z
---

# Work Item: Daily Puzzle Rotation

## Description

Turn the single-puzzle MVP into a daily game: resolve the current date to a date
key, load that day's puzzle JSON from `public/puzzles/`, and handle the "already
played today" / "no puzzle for today" states. Supports many puzzle files served
statically — one puzzle per day, the same for everyone on a given date.

## Acceptance Criteria

- [ ] The app resolves today's date to a date key and loads `public/puzzles/<date>.json`
- [ ] Multiple puzzle files can coexist; the correct one loads by date
- [ ] Graceful fallback when no puzzle exists for the current date
- [ ] "Already played today" state is detected and shown (no replay of a finished day)
- [ ] Timezone behavior is defined and documented (which clock determines "today")
- [ ] Tests cover date→key resolution and missing-puzzle fallback

## Technical Notes

Decide the "daily reset" timezone (e.g. local midnight vs a fixed zone) and
document it. Reuse the loader/validator from #2. Completion-for-today is read from
the progress store (#7) once it exists; until then a minimal localStorage flag is
acceptable. Keep everything client-side and static-hosting friendly.

## Dependencies

- puzzle-schema-and-loader
- game-board-ui
