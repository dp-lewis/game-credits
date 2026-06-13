---
run: run-game-credits-007
work_item: curation-actor-prominence
intent: call-sheet
mode: confirm
checkpoint: plan
approved_at: 2026-06-13T11:20:00Z
---

# Implementation Plan: Curation — Actor Prominence

> Retrofit note: this work was implemented as a direct change first, then captured
> as this FIRE run so the project history is complete. The plan and reports
> describe what was built and verified.

## Approach

Bias actor selection toward recognizable, top-billed leads. Live TMDB generation
produced valid-but-unfun puzzles full of deep-cut character actors because the
assembler chose anchors at random. Rank by **billing order** (TMDB `order`,
lower = more prominent) so leads are chosen; fall back to the existing
deterministic shuffle when no billing data is present (offline sample/tests).

## Checkpoint decision (approved)

Rank by **billing order**, not popularity — for era-stable recognizability. Trade-
off accepted: prominence ordering reduces within-trio variety, but variety comes
from date-seeded film selection; recognizability is the priority.

## Files to Modify

| File | Changes |
|------|---------|
| `scripts/lib/tmdb.js` | Keep each cast member's billing `order`; widen the pool (top 20) |
| `src/lib/curation.js` | Pick the most prominent anchors; prefer prominent crossover traps; drop the *least* prominent anchor when injecting a trap; fall back to shuffle without billing data |

## Files to Create

| File | Purpose |
|------|---------|
| `tests/unit/tmdb.test.js` | TMDB client: `order` mapping, limit, error paths |
| (extend) `tests/unit/curation.test.js` | Prominence anchor selection + prominent-trap injection |

## Tests

| Test File | Coverage |
|-----------|----------|
| `tests/unit/curation.test.js` | top-billed anchors chosen; prominent crossover used as trap, least-prominent anchor dropped |
| `tests/unit/tmdb.test.js` | maps `order`, caps at limit, index fallback, no-key + non-ok errors |

## Verification

- Output stays schema-valid and uniquely solvable (engine guarantee + tests).
- Live dry-run shows recognizable casts.
- Lint/format clean; full suite green.

---
*Checkpoint approved (billing order). Execution followed.*
