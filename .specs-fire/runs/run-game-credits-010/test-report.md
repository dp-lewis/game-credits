---
run: run-game-credits-010
work_item: seed-week-puzzles
intent: call-sheet
generated: 2026-06-13T11:48:00Z
status: passed
---

# Test Report: Seed a Week of Real Puzzles

## Summary

- Unit + component (Vitest): **144 passed**
- E2E (Playwright): 2 passed
- Lint / Format: clean · Build: clean (10 puzzles + manifest in `dist/`)
- Each generated puzzle independently re-verified: schema-valid + unique solution

## The week (all distinct trios, all unique, all with traps)

| Date | Films | Traps |
|------|-------|-------|
| 2026-06-15 | Oppenheimer / The Revenant / Django Unchained | 1 |
| 2026-06-16 | Inception / Oppenheimer / The Departed | 3 |
| 2026-06-17 | Oppenheimer / The Revenant / The Dark Knight | 1 |
| 2026-06-18 | Inglourious Basterds / The Wolf of Wall Street / Ocean's Eleven | 1 |
| 2026-06-19 | Inception / The Big Short / The Revenant | 3 |
| 2026-06-20 | Ocean's Eleven / The Revenant / Once Upon a Time in Hollywood | 2 |
| 2026-06-21 | Interstellar / Inception / The Big Short | 1 |

## Acceptance Criteria Validation

- ✅ **Pool expanded** — `scripts/lib/tmdb-films.json` now 12 cross-cast films (TMDB ids looked up via the API)
- ✅ **`--salt` for distinct trios** — batch picks smallest salt yielding an unused trio (06-17 used salt 1)
- ✅ **7 puzzles, distinct trios** — verified above
- ✅ **Schema-valid + uniquely solvable, recognizable casts, ≥1 trap each** — re-checked with `validatePuzzle` + `countPartitions`; sample 06-18 = Pitt, Waltz, DiCaprio, Robbie, Clooney, Damon, Roberts…
- ✅ **Manifest updated; build copies all; suite + e2e green**

## Ready for Completion

- [x] All 7 puzzles unique + recognizable
- [x] Suite + e2e green
- [x] No secrets committed (key stayed in `.env`)
