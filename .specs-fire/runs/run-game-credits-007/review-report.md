# Code Review Report — run-game-credits-007

**Run**: run-game-credits-007 · **Intent**: call-sheet
**Reviewed**: 2026-06-13T11:28:00Z · **Work item**: curation-actor-prominence

## Summary

| Category | Auto-Fixed | Applied | Skipped |
|----------|------------|---------|---------|
| Code Quality | 0 | 0 | 0 |
| Security | 0 | 0 | 0 |
| Architecture | 0 | 0 | 1 |

**Tests Status**: Passing (144 unit + live dry-run)

## Files Reviewed

- `src/lib/curation.js` (modified) — `byProminence` helper; prominence-ranked anchors + traps; least-prominent drop
- `scripts/lib/tmdb.js` (modified) — keep `order`, deeper pool
- `tests/unit/curation.test.js` (extended), `tests/unit/tmdb.test.js` (created)

## Findings

`eslint`/`prettier` clean. No issues.

- ✅ **Quality**: the live before/after is the proof — character-actor soup → all
  leads with strong crossover traps. The fix targets the root cause (random
  anchor choice), not a band-aid.
- ✅ **Architecture**: prominence lives in the pure `src/lib` engine; `order` is
  an assembly-only signal and never reaches the puzzle JSON (output shape
  unchanged — the no-leak field test still passes).
- ✅ **Backward compatibility**: `byProminence` falls back to the existing
  deterministic shuffle when billing data is absent, so the offline sample and
  every prior test stay green and deterministic.
- ✅ **Correctness**: uniqueness is still enforced by the oracle on every swap;
  dropping the least-prominent anchor keeps each film star-led.
- ⏭️ **Skipped**: a couple of defensive/unreachable branches in `curation.js`
  remain uncovered (final-safety null, etc.) — `src/lib` stays ~97%.

No auto-fixes, no suggestions requiring approval.

## Process note

This work was implemented as a direct edit and **retrofitted** into FIRE as this
run for a complete audit trail. The checkpoint (billing order vs. popularity) was
made with the user before coding; the run record was created afterward.
