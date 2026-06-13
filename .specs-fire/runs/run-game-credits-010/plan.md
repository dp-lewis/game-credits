---
run: run-game-credits-010
work_item: seed-week-puzzles
intent: call-sheet
mode: autopilot
checkpoint: none
---

# Implementation Plan: Seed a Week of Real Puzzles

## Approach

Generate 7 TMDB-sourced puzzles (2026-06-15 … 2026-06-21) for the live site. A
trial run exposed two gaps: the 5-Nolan candidate pool yields repetitive,
duplicate trios; and a batch can't guarantee distinct trios per day. Fix both,
then generate and verify.

## Files to Create

| File | Purpose |
|------|---------|
| `public/puzzles/2026-06-15.json … 2026-06-21.json` | 7 generated puzzles |

## Files to Modify

| File | Changes |
|------|---------|
| `scripts/lib/tmdb-films.json` | Expand to 12 cross-cast films (real TMDB ids) |
| `scripts/build-puzzles.js` | Add `--salt` (mixed into the date seed) for batch-distinct trios |
| `public/puzzles/manifest.json` | Add the 7 dates |

## Verification

- Each puzzle: `validatePuzzle` passes and `countPartitions == 1` (unique).
- Distinct film trios across the 7 days (salt-dedup).
- Recognizable, top-billed casts; ≥1 crossover trap each.
- Full suite + e2e green; build copies all puzzles.

---
*Plan recorded (autopilot — no checkpoint).*
