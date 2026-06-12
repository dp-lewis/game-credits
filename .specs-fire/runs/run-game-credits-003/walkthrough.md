---
run: run-game-credits-003
work_items: [multi-film-schema, multi-film-board, multi-film-result-share]
intent: call-sheet
generated: 2026-06-12T10:03:00Z
mode: wide (autopilot ×2 + confirm ×1)
---

# Implementation Walkthrough: Call Sheet v2 — 4-film crossover

## Summary

Evolved Call Sheet from a 2-film sort into a **4-film, hidden-groups Connections-
style deduction puzzle**. Players arrange 16 actors into four hidden films (4
each); a group is graded by *membership* (not by a label), so solving it reveals
its film and locks the row. Crossover actors are traps; there are 4 lives, a "One
away…" hint, and a spoiler-free group share grid. 87 unit/component tests + 2 e2e,
`src/lib` at 99%.

## Structure Overview

```
src/lib/                       # pure logic (99% covered)
├── puzzle-schema.js           # N-film + alsoIn typedefs/constants
├── puzzle-loader.js           # N films, group-balance + alsoIn validation
├── game-logic.js              # buildAnswerKey (reused), v1 gradeSubmission
├── group-logic.js   ← new     # gradeGroups: partition grader + one-away
├── shuffle.js
└── share-grid.js              # + generateGroupShareText (v2, spoiler-free)
src/components/
├── call-sheet-board.js  ← rewritten   # hidden-films bucket board
├── call-sheet-actor.js  ← rewritten   # selectable chip
├── call-sheet-result.js ← group-aware
└── call-sheet-app.js    ← default 4-film puzzle
public/puzzles/2026-06-13.json ← new   # 4×4 unique-solution fixture
```

## Key Implementation Details

### 1. Hidden-films, membership grading

The board never shows film titles during play. The player fills four colour-coded
buckets; `gradeGroups(buckets, answerKey, groupSize)` marks a bucket correct when
its members all share one solution film — **independent of which bucket** it is.
Solving reveals that film and locks the row. This is what makes "which bucket"
irrelevant and the grouping the thing being judged.

### 2. Schema generalised, backward compatible

`puzzle-loader` now accepts N films (≥2), enforces **group balance** (each film is
the solution for `actors/films` actors), and validates optional **`alsoIn`**
overlap metadata (declared films, ≠ solution, no dups). The v1 2-film puzzles
still validate; `buildAnswerKey`/`gradeSubmission` are untouched.

### 3. Verified-unique fixture

`2026-06-13.json` (Ocean's Eleven / The Departed / Inception / Once Upon a Time in
Hollywood) was checked by counting capacity-respecting partitions over each
actor's real memberships (`filmId ∪ alsoIn`) → **exactly one** solution. Anchors
fill Inception & OUATIH and 3/4 of The Departed, forcing the crossovers
(Pitt, Damon → Ocean's; DiCaprio → Departed).

### 4. Crossover traps stay silent

`alsoIn` is metadata only — never surfaced in the UI and never used by grading.
Placing Damon in The Departed (where he really appeared) is still wrong; his
solution is Ocean's. The trap is player knowledge.

## Decisions Made

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Mechanic | Hidden films, guess-by-grouping (Connections) | User preference; deeper than labelled sort |
| Grading | By membership, bucket-index-independent | Films are unnamed during play |
| One-away hint | Yes (3 of one film) | Connections-familiar tension |
| Reveal | Per solved group + all on loss | User preference |
| New grader | `group-logic.js`, separate from v1 `gradeSubmission` | Different model; keep v1 intact |
| Default puzzle | `2026-06-13` (4-film) | Showcase v2 on `npm run dev` |

## Deviations from Plan

- The interaction was confirmed at the checkpoint as **labelled-but-hidden groups
  with guess-by-grouping** (the user steered away from both the original labelled-
  film brush and full one-group-at-a-time Connections). Plan updated before build.
- Two test updates were required by the evolution (a stale "exactly 2 films"
  assertion; an unused import) — corrected, not defects.

## Dependencies Added

| Package | Why |
|---------|-----|
| (none) | Built on existing deps |

## How to Verify

1. **Play v2**
   ```bash
   npm run dev   # http://localhost:5173 — 4 hidden groups, 16 actors
   ```
   Pick a group, tap four actors you think share a film, Submit. Correct → the
   film is revealed and locks; wrong → lose a life; "One away…" on a near-miss.

2. **Tests + coverage**
   ```bash
   npm run test:coverage   # 87 passing; src/lib ~99%
   npm run test:e2e        # 2 passing (incl. 4-film play-through)
   ```

3. **Build**
   ```bash
   npm run build           # static dist/ (JS ~11 kB gzip)
   ```

## Test Coverage

- Tests added: 89 (87 unit/component + 2 e2e)
- `src/lib/` coverage: 99.34% stmts / 100% funcs
- Status: passing

## Ready for Review

- [x] All acceptance criteria met (3 work items)
- [x] Tests passing
- [x] No critical issues
- [x] Documentation updated (schema docs)
- [x] Developer notes captured

## Developer Notes

`completedFilms` from the original plan was unnecessary — the board derives solved
groups directly from `gradeGroups`. The board's `game-over` detail now carries
`groupsSolved`/`totalGroups`/`grade`, which `streak-tracking` (#7) and any richer
Connections-style share history can consume later. The TMDB curation item now
depends on `multi-film-schema` and must reproduce the uniqueness guarantee the
hand-made fixture was verified against.
