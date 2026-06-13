---
run: run-game-credits-005
work_item: tmdb-curation-script
intent: call-sheet
mode: confirm
---

# Implementation Plan: tmdb-curation-script (offline-engine-first)

## Approach

Split the pipeline into a **pure, testable engine** (`src/lib/curation.js`) and a
**build-time CLI** (`scripts/build-puzzles.js`). Build and fully test the engine
now against cached/sample cast data; wire live TMDB fetch as a **guarded** step
that activates only when an API key is present. The engine's job is to assemble a
crossover puzzle and **prove it has exactly one solution** before anything is
written.

### The uniqueness problem

From a pool of films (each with a cast list), pick N films and build a membership
graph (each actor → the subset of those N films they appeared in). A puzzle is a
selection of `groupSize × N` actors with one *solution* film each such that the
**only** valid partition — placing every actor in a film they were really in, with
each film getting `groupSize` — is the intended one.

### Algorithm (anchor + greedy-trap, with a uniqueness oracle)

1. **Anchors:** for each film, take `groupSize` actors that appear in *only* that
   film (among the N). The all-anchor puzzle is trivially unique (no actor has an
   alternative) — a guaranteed fallback.
2. **Inject traps:** opportunistically swap a few anchors for **crossover** actors
   (in this film *plus* another), re-running the oracle and keeping a swap only if
   the solution stays unique. This adds ambiguity without breaking solvability.
3. **Oracle:** `countPartitions(actors, filmIds, groupSize, capAt=2)` —
   backtracking partition counter, early-exits at 2 (we only need unique vs not).

Result: always a unique puzzle (worst case all-anchors), with real `alsoIn` traps
when the data allows.

## Files to Create

| File | Purpose |
|------|---------|
| `src/lib/curation.js` | Pure: `countPartitions`, `assemblePuzzle({films,casts},opts)` → schema-valid puzzle with verified-unique solution |
| `scripts/build-puzzles.js` | CLI: source data (TMDB live *or* cache/offline), assemble, preview, approve, write `public/puzzles/<date>.json`, append to `manifest.json` |
| `scripts/lib/tmdb.js` | Guarded TMDB client (`fetchFilmCast`) — used only when `TMDB_API_KEY` is set |
| `scripts/fixtures/sample-casts.json` | A few films + cast lists for `--offline` runs and tests (no key needed) |
| `tests/unit/curation.test.js` | Oracle + assembly: unique/multiple/zero counts; schema-valid output; counts; crossovers present; deterministic with seed |

## Files to Modify

| File | Purpose |
|------|---------|
| `docs/puzzle-schema.md` | Document the curation CLI usage + offline mode |
| `README.md` | "Generating puzzles" section (env key, offline, approval) |

## CLI interface

```bash
# Offline (no key) — uses scripts/fixtures/sample-casts.json
node scripts/build-puzzles.js --date 2026-06-15 --films 3 --group-size 4 --offline

# Live (needs key) — never written to disk/output
TMDB_API_KEY=… node scripts/build-puzzles.js --date 2026-06-15 --films 3 --group-size 4

# --yes skips the approval prompt; default prints a preview and asks
```

Defaults: `--films 3 --group-size 4` (your current preference). Output validates
against `validatePuzzle` before writing; the date id is appended to the manifest.

## Security

- `TMDB_API_KEY` is read from the env only, used at build time, and **never**
  written into output, cache, or client code (a test/assert guards this).
- Live fetch responses cache under `scripts/.tmdb-cache/` (already gitignored).

## Deferred (needs a TMDB key, not in this run)

- A real live end-to-end fetch + a committed real puzzle. The live path is built
  and guarded but exercised with the offline fixture here; flip it on with a key.

---
*Plan recorded. `tmdb-curation-script` is confirm — awaiting approval before implementation.*
