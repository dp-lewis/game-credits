---
run: run-game-credits-005
work_item: tmdb-curation-script
intent: call-sheet
generated: 2026-06-13T09:47:00Z
mode: confirm
---

# Implementation Walkthrough: tmdb-curation-script (offline-engine-first)

## Summary

Built the puzzle **content engine** — a build-time pipeline that assembles a
crossover puzzle and *proves* it has a unique solution before writing it. The
hard, valuable logic is pure and fully tested; the live TMDB fetch is built and
guarded, ready to flip on with an API key. Runs entirely offline today against
sample cast data. 138 unit tests + CLI smoke; `src/lib` ~97%.

## Architecture

```
src/lib/curation.js        ← pure: countPartitions (uniqueness oracle) + assemblePuzzle
scripts/build-puzzles.js   ← CLI: source → assemble → preview → approve → write + manifest
scripts/lib/tmdb.js        ← guarded TMDB client (only used when TMDB_API_KEY is set)
scripts/lib/tmdb-films.json← candidate films (slug → TMDB movie id) for live mode
scripts/fixtures/sample-casts.json ← offline cast data (no key needed)
```

The engine is build-time-only — never imported by the app, so it stays out of the
client bundle, while still living in `src/lib` for testing + coverage.

## Key Implementation Details

### 1. The uniqueness oracle

`countPartitions(actors, filmIds, groupSize, capAt=2)` counts valid partitions
(each actor placed in a film they appear in; each film gets `groupSize`) with a
most-constrained-first ordering and an early-exit at 2 — we only need "unique vs
not". This is the same check used to verify the hand-made fixtures, now codified.

### 2. Anchor + greedy-trap assembly

`assemblePuzzle` fills each film with `groupSize` single-film **anchors** (a
trivially unique baseline that always exists), then greedily swaps anchors for
**crossover** actors, keeping a swap only while `hasUniqueSolution` stays true.
Result: always a solvable puzzle, with real `alsoIn` traps when the data allows.
The smoke run produced a 3-film puzzle (Dark Knight / Dunkirk / Oppenheimer) with
Cillian Murphy — in all three — as the forced trap.

### 3. Offline-first, key-safe

`--offline` uses `sample-casts.json`; live mode fetches from TMDB only when
`TMDB_API_KEY` is set. The key is read from the env, sent only to TMDB, and never
written to output, cache, or client (a test asserts actor objects carry only
`id/name/filmId/alsoIn`). The CLI re-validates output with the runtime
`validatePuzzle` before writing, previews the puzzle, and asks for approval
(`--dry-run`/`--yes` for automation). The manifest update is idempotent + sorted.

## Decisions Made

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Where the logic lives | pure `src/lib/curation.js` | Testable + coverage; tree-shaken from client |
| Uniqueness | oracle gates every assembly; cap at 2 | Correctness guarantee, fast |
| Assembly | anchors + greedy traps | Always solvable; real traps opportunistically |
| Offline-first | sample casts + `--offline` | Full value without a key today |
| Approval | preview + prompt (`--dry-run`/`--yes`) | Human-in-the-loop curation |

## Deviations from Plan

None of substance. The `completedFilms`-style helper wasn't needed; the engine
derives everything from `countPartitions`.

## Dependencies Added

| Package | Why |
|---------|-----|
| (none) | Node built-ins only (fs, path, readline, fetch) |

## How to Verify

```bash
# Preview an offline puzzle (no key)
npm run build:puzzle -- --date 2026-06-20 --films 3 --group-size 4 --offline --dry-run

# Unit tests
npm run test:coverage   # 138 passing; src/lib ~97%
```

Live mode (with a key) is the same command minus `--offline`.

## Test Coverage

- Tests added: 138 (unit) + CLI smoke
- `src/lib/` coverage: 97% stmts / 100% funcs
- Status: passing

## Ready for Review

- [x] All in-scope acceptance criteria met
- [x] Tests passing
- [x] No critical issues
- [x] Documentation updated (README + schema docs)
- [x] Developer notes captured

## Developer Notes

To go live: set `TMDB_API_KEY`, optionally expand `scripts/lib/tmdb-films.json`
with more candidate films (more films + overlap → richer traps), and run without
`--offline`. The script appends each generated date to the manifest, which daily
rotation already consumes. For larger pools the oracle stays fast thanks to the
cap-at-2 early exit and MRV ordering.
