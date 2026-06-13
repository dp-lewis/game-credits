---
id: three-film-default
title: Three-Film Default Puzzle
intent: call-sheet
complexity: low
mode: autopilot
status: completed
depends_on:
  - multi-film-board
created: 2026-06-13T11:31:10Z
run_id: run-game-credits-008
completed_at: 2026-06-13T11:33:02.341Z
---

# Work Item: Three-Film Default Puzzle

# Description

Tune the game's default puzzle size to **3 films × 4 actors (12)** — lighter and
quicker than the 4-film board — and ship a hand-crafted, verified-unique fixture
for it. The v2 engine already generalised over film count, so this is content +
a default change, not new logic.

> Retrofitted into FIRE after the fact: implemented as a direct change (committed
> in `a6cfb71`), then captured as this work item + run for a complete trail.

## Acceptance Criteria

- [ ] A 3-film / 12-actor fixture exists with real crossovers and a verified unique solution
- [ ] The app defaults to that puzzle
- [ ] Schema/board/result/share all work at 3 films with no code changes (generality already in place)
- [ ] Tests cover the fixture's validity; e2e plays the 3-film puzzle to a win

## Technical Notes

Fixture `public/puzzles/2026-06-14.json`: Inception / The Dark Knight /
Interstellar, with Michael Caine (all three) and Cillian Murphy (two) as the
crossover traps; uniqueness verified by counting capacity-respecting partitions.
The 4-film puzzle (`2026-06-13.json`) remains a valid puzzle file.

## Dependencies

- multi-film-board
