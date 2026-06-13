---
id: enforce-three-film-rotation
title: Enforce Three-Film Rotation
intent: call-sheet-fixes
complexity: medium
mode: confirm
status: completed
depends_on: []
created: 2026-06-13T11:58:54Z
run_id: run-game-credits-011
completed_at: 2026-06-13T20:37:40.873Z
---

# Work Item: Enforce Three-Film Rotation

## Symptom

Today's puzzle shows **four films**; the game should **always be three**.

## Root Cause

The manifest still lists the original `2026-06-12` (2-film MVP fixture) and
`2026-06-13` (4-film v2 fixture). Today (06-13) resolves to the 4-film puzzle.

## Acceptance Criteria

- [ ] The live manifest contains **only 3-film puzzles**; `2026-06-12` and `2026-06-13` removed from rotation
- [ ] Those fixtures relocated to `tests/fixtures/` (2-film + 4-film) with all test imports updated — no test loses coverage
- [ ] Today resolves to a 3-film puzzle (falls through to `2026-06-14`)
- [ ] **Guard test**: a test loads every puzzle in the manifest and asserts each has exactly 3 films — fails before this change, passes after
- [ ] Full suite + e2e green

## Technical Notes

`2026-06-13.json` (4-film) is imported by `tests/unit/multi-film-schema.test.js`,
`tests/unit/group-logic.test.js`, and `tests/component/call-sheet-board.test.js`;
`2026-06-12.json` (2-film) by the e2e/other tests if any. Move both into
`tests/fixtures/` (e.g. `four-film-puzzle.json`, `two-film-puzzle.json`), update
imports, delete from `public/puzzles/`, and drop both ids from
`public/puzzles/manifest.json`. The schema still *permits* N films (by design) —
the constraint is on the live rotation, enforced by the guard test.

## Checkpoint

Confirm: hard guard test (yes), keep fixtures for tests (yes) — already approved.

## Dependencies

(none)
