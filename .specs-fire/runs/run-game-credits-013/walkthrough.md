---
run: run-game-credits-013
work_item: backfill-past-puzzles
intent: call-sheet-archive
generated: 2026-06-13T21:44:00Z
mode: autopilot
---

# Implementation Walkthrough: Backfill Past Puzzles

## Summary

Populated the archive with playable history — seven 3-film puzzles for the
previous week (`2026-06-07` … `2026-06-13`), each unique, recognizable, and with
crossover traps. The archive now lists `06-07 … 06-14` instead of just today.

## Why

The earlier "week" was the *upcoming* week (`06-15 … 06-21`) — future dates the
archive hides to avoid spoilers — and the original 2-/4-film puzzles were removed
in the three-film fix. So there was no history. This backfills it.

## What it took

Reused the curation CLI: `npm run build:puzzle -- --date <d> --films 3 --salt N
--yes`, with the salt-dedup **seeded with the existing manifest puzzles' trios**
so no backfilled day repeats a scheduled day's films. Each generated file was
re-verified independently (`validatePuzzle` + `countPartitions == 1`).

## The week

| Date | Films |
|------|-------|
| 06-07 | Inception / Interstellar / Ocean's Eleven |
| 06-08 | Inglourious Basterds / Interstellar / The Wolf of Wall Street |
| 06-09 | Interstellar / Once Upon a Time in Hollywood / The Dark Knight |
| 06-10 | Django Unchained / Inception / Ocean's Eleven |
| 06-11 | Once Upon a Time in Hollywood / The Big Short / The Departed |
| 06-12 | Django Unchained / The Dark Knight / The Wolf of Wall Street |
| 06-13 | Inglourious Basterds / Ocean's Eleven / Oppenheimer |

## How to Verify

```bash
npm run dev    # Archive ▸ now lists 06-07 … 06-14; tap a past day to play it
npm test && npm run test:e2e   # 177 + 6; the 3-film guard spans all 15 puzzles
```

## Ready for Review

- [x] 7 distinct, unique, recognizable past puzzles
- [x] Manifest updated; guard passes; archive populated
- [x] Suite + e2e green; key never committed
