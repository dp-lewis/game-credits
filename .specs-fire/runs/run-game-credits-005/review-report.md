# Code Review Report — run-game-credits-005

**Run**: run-game-credits-005 · **Intent**: call-sheet
**Reviewed**: 2026-06-13T09:46:00Z · **Work item**: tmdb-curation-script

## Summary

| Category | Auto-Fixed | Applied | Skipped |
|----------|------------|---------|---------|
| Code Quality | 2 | 0 | 0 |
| Security | 0 | 0 | 0 |
| Architecture | 0 | 0 | 0 |
| Testing | 0 | 0 | 1 |

**Tests Status**: Passing (138 unit + CLI smoke)

## Files Reviewed

- `src/lib/curation.js` (created) — pure oracle + assembler
- `scripts/build-puzzles.js` (created) — CLI
- `scripts/lib/tmdb.js` (created) — guarded TMDB client
- `scripts/lib/tmdb-films.json`, `scripts/fixtures/sample-casts.json` (created) — data
- `tests/unit/curation.test.js` (created)
- `package.json`, `README.md`, `docs/puzzle-schema.md` (modified)

## Findings

Lint surfaced two mechanical issues, both fixed: a useless `ids` initialiser in
`writeManifest` (also hardened with an `Array.isArray` guard), and a `!=` →
strict-equality nit in the TMDB id helper. Final `eslint`/`prettier` clean.

- ✅ **Architecture**: the hard logic (uniqueness oracle + assembler) is pure and
  in `src/lib`, fully unit-tested and reused by the CLI. Build-time-only — never
  imported by the app, so it stays out of the client bundle. IO/network live in
  `scripts/`.
- ✅ **Correctness**: every assembly is gated by `countPartitions` (unique-or-
  reject), and the CLI re-validates output with the runtime `validatePuzzle`
  before writing. The generated puzzle was independently re-checked unique.
- ✅ **Security**: `TMDB_API_KEY` is read from env only, sent only to TMDB, and
  never written to output, cache, or client; a test asserts actor objects carry
  no extra fields. No secrets in the repo.
- ✅ **Safety**: human approval gates writes (`--dry-run`/`--yes` for automation);
  manifest update is idempotent and sorted.
- ⏭️ **Skipped**: a few defensive/unreachable branches in `curation.js`
  (already-selected crossover, no-droppable, final-safety null) — `src/lib`
  overall stays at 97%.

No auto-fixes beyond the two lint corrections; no suggestions requiring approval.
