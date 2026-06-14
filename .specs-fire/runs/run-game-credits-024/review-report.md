# Code Review Report

**Run**: run-game-credits-024 (wide)
**Intent**: themed-puzzle-variety
**Reviewed**: 2026-06-14T08:41:00Z

## Work Item: themed-film-catalogue

| Category | Auto-Fixed | Applied | Skipped |
|----------|------------|---------|---------|
| **Total** | 0 | 0 | 0 |

### Files Reviewed

- `scripts/lib/tmdb-themes.json` (new) — 8 verified clusters, 49 films
- `scripts/lib/tmdb-films.json` (regenerated flat list)
- `scripts/build-theme-catalogue.mjs` (new dev tool — resolve ids, fetch casts, verify assembly)

### Notes

- Genre-cluster risk realised and handled at build time (heist 0-traps → Apatow 3-traps),
  exactly as flagged at the checkpoint.
- The verifier reuses the production `assemblePuzzle` / `countPartitions`, so "it assembles"
  means the real engine accepts it.
- No client code touched; catalogue is build-time only and key-free.

(Lint/format on the new script is verified by the run's final `npm run check`.)

---

## Work Item: theme-schema-and-generator

| Category | Auto-Fixed | Applied | Skipped |
|----------|------------|---------|---------|
| **Total** | 0 | 0 | 0 |

### Files Reviewed

- `src/lib/puzzle-loader.js` — optional `theme` validation + passthrough
- `src/lib/theme-select.js` (new, pure) — cluster selection (themeId / seed / avoid)
- `scripts/build-puzzles.js` — cluster-aware `loadPool`, `--theme`/`--avoid`, theme stamping + preview
- `tests/unit/theme-select.test.js`, `tests/unit/puzzle-loader.test.js`

### Notes

- Cluster selection is a pure, tested lib; the CLI stays a thin driver.
- Assembly engine untouched — restricting the pool to a cluster preserves all
  uniqueness/recognizability/trap guarantees.
- TMDB key stays in `.env`; only public metadata written.

---

## Work Item: theme-in-ui

| Category | Auto-Fixed | Applied | Skipped |
|----------|------------|---------|---------|
| **Total** | 0 | 0 | 0 |

### Files Reviewed

- `src/components/call-sheet-app.js` — `this._puzzle?.theme` label + `.theme` styles.

### Notes

- Optional chaining means theme-less puzzles render nothing — backward compatible.
- Muted styling consistent with `.tagline`; emphasised name uses `--cs-fg`.

---

## Work Item: regenerate-themed-puzzles

| Category | Auto-Fixed | Applied | Skipped |
|----------|------------|---------|---------|
| Format (prettier) | 1 | 0 | 0 |
| Lint (.mjs→.js) | 1 | 0 | 0 |
| Test decoupling | 1 | 0 | 0 |

### Notes

- Generated puzzle JSON + new scripts weren't Prettier-clean; `npm run check` caught it
  locally (the gate working). Fixed via `prettier --write`.
- `build-theme-catalogue.mjs` → `.js` so it matches the `scripts/**/*.js` Node-globals
  ESLint override (consistent with `build-puzzles.js`).
- Brittle coupling removed: `multi-film-schema.test.js` and `play.spec.js` no longer
  assert against the live, regenerable `2026-06-14.json` — they use a committed fixture
  / derive from the file. Future regenerations won't break the suite.
- No security surface; TMDB key in `.env`, only public metadata written.
