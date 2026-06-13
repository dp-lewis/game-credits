---
run: run-game-credits-013
work_item: backfill-past-puzzles
intent: call-sheet-archive
generated: 2026-06-13T21:42:00Z
status: passed
---

# Test Report: Backfill Past Puzzles

## Summary

- Unit + component (Vitest): **177 passed** (3-film guard now spans 15 puzzles)
- E2E (Playwright): **6 passed**
- Lint/Format: clean · Build: 15 puzzles copied to `dist/`
- Each backfilled file independently re-verified: valid + unique solution + 3 films

## The backfilled week (distinct trios, all unique, all with traps)

| Date | Films | Traps |
|------|-------|-------|
| 2026-06-07 | Inception / Interstellar / Ocean's Eleven | 3 |
| 2026-06-08 | Inglourious Basterds / Interstellar / The Wolf of Wall Street | 1 |
| 2026-06-09 | Interstellar / Once Upon a Time in Hollywood / The Dark Knight | 1 |
| 2026-06-10 | Django Unchained / Inception / Ocean's Eleven | 1 |
| 2026-06-11 | Once Upon a Time in Hollywood / The Big Short / The Departed | 2 |
| 2026-06-12 | Django Unchained / The Dark Knight / The Wolf of Wall Street | 1 |
| 2026-06-13 | Inglourious Basterds / Ocean's Eleven / Oppenheimer | 3 |

## Acceptance Criteria Validation

- ✅ **7 puzzles `2026-06-07` … `2026-06-13`, all 3 films**
- ✅ **Schema-valid + uniquely solvable, recognizable casts, ≥1 trap each** — re-checked with `validatePuzzle` + `countPartitions`
- ✅ **Distinct trios across the backfill *and* vs. the scheduled week** — salt-dedup seeded with existing manifest trios
- ✅ **Manifest updated; 3-film guard passes; archive lists the new past days** — manifest now `06-07 … 06-21`; archive shows `06-07 … 06-14`
- ✅ **Suite + e2e green; key stayed in `.env`**

## Ready for Completion

- [x] 7 puzzles unique + recognizable + distinct
- [x] Suite + e2e green
- [x] No secrets committed
