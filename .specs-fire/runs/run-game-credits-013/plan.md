---
run: run-game-credits-013
work_item: backfill-past-puzzles
intent: call-sheet-archive
mode: autopilot
---

# Implementation Plan: Backfill Past Puzzles

## Approach

Generate 3-film puzzles for the previous week (`2026-06-07` … `2026-06-13`) and add
them to the manifest, so the archive shows playable history now. Reuse the
curation CLI with salt-dedup, **seeded with the existing manifest puzzles' trios**
so backfilled days don't repeat a scheduled day's films. Re-verify each file.

## Files to Create

| File | Purpose |
|------|---------|
| `public/puzzles/2026-06-07.json … 2026-06-13.json` | 7 backfilled puzzles |

## Files to Modify

| File | Change |
|------|--------|
| `public/puzzles/manifest.json` | Add the 7 past dates |

## Verification

- Each puzzle: `validatePuzzle` + `countPartitions == 1` (unique), 3 films, ≥1 trap.
- Distinct trios across the backfill and vs. the scheduled week.
- 3-film guard test passes; archive lists the new past days; suite + e2e green.

---
*Plan recorded (autopilot).*
