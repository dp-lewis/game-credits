---
run: run-game-credits-007
work_item: curation-actor-prominence
intent: call-sheet
generated: 2026-06-13T11:29:00Z
mode: confirm
---

# Implementation Walkthrough: Curation — Actor Prominence

## Summary

Made generated puzzles *fun* by biasing actor selection toward recognizable,
top-billed leads instead of random cast members. The engine still guarantees a
unique solution; it just now fills the board with names players actually know.

> Retrofit: implemented as a direct change, then captured as this FIRE run
> (work item + plan/test/review/walkthrough) for a complete audit trail.

## The problem

Live TMDB generation produced valid-but-unfun puzzles — half the cast were
deep-cut character actors (Ron Dean, Monique Gabriela Curnen, Dileep Rao) —
because the assembler chose anchor actors **at random** from each film's cast.

## The change

| File | Change |
|------|--------|
| `scripts/lib/tmdb.js` | Keep each cast member's billing `order` (was discarded); fetch a deeper pool (top 20) |
| `src/lib/curation.js` | New `byProminence` helper: anchors and traps ranked by billing order (leads first); when injecting a trap, drop the **least** prominent anchor; fall back to the deterministic shuffle when no billing data exists |

Prominence is an **assembly-only** signal — `order` never reaches the puzzle JSON,
so the schema and the "no-leak fields" guarantee are unchanged.

## Decision (checkpoint)

Rank by **billing order**, not popularity — era-stable recognizability. Accepted
trade-off: less within-trio variety, but variety comes from date-seeded film
selection.

## Result — before vs. after (live `--dry-run`)

- **Before:** Topher Grace, Ron Dean, Nestor Carbonell, Monique Gabriela Curnen…
- **After:** McConaughey, Chastain, Hathaway, DiCaprio, Tom Hardy, Cillian Murphy,
  Michael Caine, Mark Rylance… — with 3 crossover traps.

## Decisions Made

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Prominence metric | TMDB billing `order` | Recognizable leads, era-stable |
| Trap selection | Most prominent crossovers | Famous traps are the fun |
| Anchor drop on trap | Least prominent | Never lose a lead to a trap |
| No-data behavior | Deterministic shuffle | Keeps offline sample + tests stable |

## Deviations from Plan

None. (The plan itself was written as part of the retrofit.)

## Dependencies Added

| Package | Why |
|---------|-----|
| (none) | — |

## How to Verify

```bash
npm run test:coverage   # 144 passing; src/lib ~97%
npm run build:puzzle -- --date 2026-06-25 --films 3 --dry-run   # recognizable casts
```

## Test Coverage

- Tests added: prominence anchor/trap (curation) + TMDB `order` mapping
- `src/lib/` coverage: ~97% stmts / 100% funcs
- Status: passing (144)

## Ready for Review

- [x] All acceptance criteria met
- [x] Tests passing
- [x] No critical issues
- [x] Developer notes captured

## Developer Notes

Variety lever if puzzles ever feel samey: expand `scripts/lib/tmdb-films.json`
with more candidate films so the date-seeded selection has more trios to draw
from. Popularity could be added later as a tiebreak on near-equal billing.
