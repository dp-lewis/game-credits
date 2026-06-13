---
run: run-game-credits-010
work_item: seed-week-puzzles
intent: call-sheet
generated: 2026-06-13T11:49:00Z
mode: autopilot
---

# Implementation Walkthrough: Seed a Week of Real Puzzles

## Summary

Generated 7 real, TMDB-sourced puzzles (2026-06-15 … 2026-06-21) for the live
site — varied, recognizable, uniquely solvable, each with crossover traps.

## What it took

A trial run revealed two content gaps, both fixed:

1. **Pool too small** — 5 Nolan films gave repetitive, sometimes *duplicate*
   trios. Expanded `scripts/lib/tmdb-films.json` to **12 cross-cast films** (Nolan
   + Scorsese/DiCaprio + Tarantino + heist/ensemble), with TMDB ids looked up via
   the API.
2. **No batch distinctness** — added a `--salt` knob to `build-puzzles.js` (mixed
   into the date seed). A dedup batch picks the smallest salt yielding an unused
   trio, so every day is a different set of films.

## The week

| Date | Films | Traps |
|------|-------|-------|
| 06-15 | Oppenheimer / Revenant / Django Unchained | 1 |
| 06-16 | Inception / Oppenheimer / The Departed | 3 |
| 06-17 | Oppenheimer / Revenant / Dark Knight | 1 |
| 06-18 | Inglourious Basterds / Wolf of Wall Street / Ocean's Eleven | 1 |
| 06-19 | Inception / Big Short / Revenant | 3 |
| 06-20 | Ocean's Eleven / Revenant / Once Upon a Time in Hollywood | 2 |
| 06-21 | Interstellar / Inception / Big Short | 1 |

Every file independently re-verified (`validatePuzzle` + `countPartitions == 1`).

## Decisions Made

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Pool | 12 cross-cast films | Variety + reliable traps |
| Distinctness | `--salt` + dedup batch | No two days the same trio |
| Verification | Re-check each file, not just trust the generator | Belt-and-braces uniqueness |

## How to Verify

```bash
npm run build && ls dist/puzzles/        # all puzzles present
# spot-check a date in the app:
npm run dev   # /?puzzle=2026-06-18
```

## Next week

```bash
# Generate the following week the same way (salt-dedup handled by a batch loop):
for d in 2026-06-22 … ; do npm run build:puzzle -- --date "$d" --films 3 --salt N --yes; done
```

## Ready for Review

- [x] 7 puzzles, distinct + unique + recognizable
- [x] Suite + e2e green
- [x] Key never committed
