---
run: run-game-credits-007
work_item: curation-actor-prominence
intent: call-sheet
generated: 2026-06-13T11:28:00Z
status: passed
---

# Test Report: Curation — Actor Prominence

## Summary

| Category | Passed | Failed | Skipped | Coverage |
|----------|--------|--------|---------|----------|
| Unit (Vitest) | 144 | 0 | 0 | src/lib 97% |
| Live dry-run (manual) | 1 | 0 | 0 | n/a |
| **Total** | **145** | **0** | **0** | — |

- Lint: clean · Format: clean
- Coverage (`src/lib/`): **97.17% stmts / 100% funcs** (`curation.js` 94.8%; remaining branches defensive)

## Acceptance Criteria Validation

- ✅ **TMDB client keeps billing `order`, deeper pool (top 20)** — `scripts/lib/tmdb.js`
- ✅ **Assembler picks most-prominent anchors per film** — `byProminence` sorts by `order` asc; test asserts top-4 chosen, deep cuts excluded
- ✅ **Prominent crossover traps; least-prominent anchor dropped** — test asserts the star crossover is included and the lowest-billed anchor is removed
- ✅ **Falls back to shuffle without billing data** — offline sample + prior 144 tests unaffected/deterministic
- ✅ **Output stays schema-valid and uniquely solvable** — engine guarantee + existing assembly tests
- ✅ **Tests cover prominence selection, trap injection, `order` mapping** — see below
- ✅ **Live dry-run shows recognizable casts** — see comparison

## Tests Written

- `tests/unit/curation.test.js` (extended) — "prefers the most prominent anchors", "uses a prominent crossover as a trap and drops the least-prominent anchor"
- `tests/unit/tmdb.test.js` (created) — `order` mapping, limit cap, index fallback, no-key + non-ok errors

## Live dry-run — before vs. after

Same films (Inception / Dark Knight / Interstellar / Dunkirk pool), `--dry-run`:

- **Before:** Topher Grace, Ron Dean, Nestor Carbonell, Monique Gabriela Curnen, Dileep Rao …
- **After:** McConaughey, Chastain, Hathaway, DiCaprio, Tom Hardy, Cillian Murphy, Michael Caine, Mark Rylance … (3 crossover traps)

## Ready for Completion

- [x] All tests passing (144 unit + live dry-run)
- [x] Coverage target met (src/lib 97%)
- [x] All acceptance criteria validated
- [x] No critical issues open
