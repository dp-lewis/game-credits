---
id: archive-view
title: Archive View
intent: call-sheet-archive
complexity: high
mode: confirm
status: completed
depends_on:
  - practice-mode-streaks
  - archive-list
created: 2026-06-13T20:46:22Z
run_id: run-game-credits-012
completed_at: 2026-06-13T21:32:42.719Z
---

# Work Item: Archive View

## Description

The player-facing archive: a `<call-sheet-archive>` list of past+today puzzles
with completion status, an entry link from the app, shareable/back-button
navigation, and the restore-vs-replay logic. The main UX piece — `confirm` so the
navigation + replay model is checkpointed before build.

## Acceptance Criteria

- [ ] An **Archive** entry link is visible from the main screen
- [ ] `<call-sheet-archive>` renders the `listArchivePuzzles` dates newest-first, each row: formatted date + status (✓ won w/ mistakes, ✗ lost, ▢ unplayed) + "today" marker
- [ ] Selecting a row plays that puzzle on a **fresh board** (replay), via the `?puzzle=<id>` path; a "back / Today" control returns
- [ ] Navigation uses URL params (`?archive` list, `?puzzle=<id>` play) so links are shareable and the browser back button works (popstate)
- [ ] Today's default load still **restores** a finished result (unchanged); archive selections do not restore (they replay)
- [ ] On completing an archive (non-today) puzzle, completion is recorded with `updateStreak: false`; today's play still updates the streak
- [ ] Component + e2e tests: open archive → status shows → pick a past day → play to a win → back to today; streak unaffected by a past play

## Technical Notes

`src/components/call-sheet-app.js` gains a view router off the query string:
`?archive` → `<call-sheet-archive>`; `?puzzle=<id>` → play that id (fresh board);
else → today (resolve + restore). Listen for `popstate`; use `history.pushState`
for in-app nav. The archive component takes the list + a `getDay`-backed status
lookup and emits a "select" (navigates). Keep components thin; date formatting can
be a small `src/lib` helper. Reuse `loadPuzzle`, `resolvePuzzleId`, the store.

## Checkpoint

Confirm at the checkpoint: URL-param navigation model, the restore-vs-replay
rule, and the archive row design.

## Dependencies

- practice-mode-streaks
- archive-list
