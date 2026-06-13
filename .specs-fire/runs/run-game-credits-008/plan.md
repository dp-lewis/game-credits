---
run: run-game-credits-008
work_item: three-film-default
intent: call-sheet
mode: autopilot
checkpoint: none
approved_at: n/a (autopilot)
---

# Implementation Plan: Three-Film Default Puzzle

> Retrofit: implemented as a direct change (committed in `a6cfb71`), captured here
> for a complete FIRE trail.

## Approach

Default the game to a lighter **3 films × 4 actors** board and ship a verified-
unique fixture. The v2 engine already generalises over film count, so no logic
changes — just content + the default puzzle id.

## Files to Create

| File | Purpose |
|------|---------|
| `public/puzzles/2026-06-14.json` | 3-film / 12-actor fixture, verified-unique |

## Files to Modify

| File | Changes |
|------|---------|
| `src/components/call-sheet-app.js` | `DEFAULT_PUZZLE_ID` → `2026-06-14` |
| `tests/unit/multi-film-schema.test.js` | Validate the 3-film fixture (4 per film, Caine all-three crossover) |
| `tests/e2e/play.spec.js` | Play the 3-film puzzle to a win |

## Verification

- Fixture uniqueness counted (capacity-respecting partitions) = 1.
- Fixture validates against `validatePuzzle`.
- e2e plays the 3-film puzzle to a win; full suite green.

---
*Plan recorded (autopilot — no checkpoint).*
