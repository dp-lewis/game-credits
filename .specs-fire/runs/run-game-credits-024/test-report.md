---
run: run-game-credits-024
work_item: themed-film-catalogue
intent: themed-puzzle-variety
generated: 2026-06-14T08:40:00Z
status: passing
---

# Test Report: Themed Puzzle Variety (wide run)

## Work Item: themed-film-catalogue

### Verification (the cluster build proves assembly)

`node scripts/build-theme-catalogue.mjs` resolved TMDB ids, fetched casts, and ran
`assemblePuzzle` over 12 random trios per cluster. Every cluster assembles:

| Theme | Style | Trios OK | Sample traps |
|-------|-------|----------|--------------|
| Christopher Nolan | troupe | 12/12 | 3 |
| Wes Anderson | troupe | 12/12 | 3 |
| Quentin Tarantino | troupe | 12/12 | 3 |
| Martin Scorsese | troupe | 12/12 | 3 |
| The Coen Brothers | troupe | 12/12 | 3 |
| The MCU | franchise | 12/12 | 3 |
| Apatow comedies | genre | 12/12 | 3 |
| Leonardo DiCaprio | shared-actor | 12/12 | 1 |

### Acceptance Criteria Validation

- ✅ Catalogue is a list of clusters `{ id, theme, style, films:[{id,title,year,tmdbId}] }` (`scripts/lib/tmdb-themes.json`)
- ✅ 8 clusters across all four styles; **49 films** total (was 12, all one ecosystem)
- ✅ Nolan and DiCaprio are now **one cluster each**, not the whole catalogue
- ✅ Every cluster verified to yield a uniquely-solvable 3×4 trio with ≥1 trap (DiCaprio min 1; the rest 3)
- ✅ "Heist crews" (genre, 0 traps) was swapped for "Apatow comedies" (genre, 3 traps) — exactly the genre-risk called out at the checkpoint
- ✅ TMDB key stayed in `.env`; catalogue contains only public film/id metadata (no key)

### Notes

`scripts/build-theme-catalogue.mjs` is retained as a dev tool to re-verify / extend the
catalogue. `scripts/lib/tmdb-films.json` is kept as a flat list (all cluster films) for
back-compat until the generator reads clusters (item 2).

---

## Work Item: theme-schema-and-generator

### Tests

`npx vitest run` — 42 passed for the two touched specs:
- `tests/unit/puzzle-loader.test.js` — optional `theme` kept; omitted when absent; non-string rejected.
- `tests/unit/theme-select.test.js` — explicit themeId; deterministic seeded pick; `avoid` skips; unknown theme throws; empty → null.

Generator smoke (live TMDB, dry-run):
- `--theme wes-anderson` → Wes Anderson trio (Life Aquatic / Royal Tenenbaums / French Dispatch), traps on Huston / Wilson / Murray; `theme` stamped.
- seeded default (2026-06-23) → "The Coen Brothers".

### Acceptance Criteria Validation

- ✅ Schema/loader accept optional `theme` (non-empty string), exposed on the puzzle; theme-less puzzles still validate
- ✅ `build-puzzles.js` selects a cluster (seeded by date), draws the trio from it, writes `theme`
- ✅ `--theme <id>` forces a cluster; `--avoid <ids>` + the seeded rotation skip recent themes (consecutive-dedup driven by the batch in item 4)
- ✅ Uniqueness / recognizability / ≥1-trap preserved (assembly unchanged; pool restricted to the cluster)
- ✅ Unit tests cover the schema field and cluster-selection/dedup logic

---

## Work Item: theme-in-ui

### Acceptance Criteria Validation

- ✅ When the puzzle has a `theme`, a muted "Theme: **<name>**" label renders above the board
- ✅ No theme → nothing rendered (older theme-less puzzles unaffected; existing e2e still green)
- ✅ Styled to the pastel layout (muted, tight, sits under the tagline), light + dark
- ✅ Shows across playing / locked-reveal states (rendered from `this._puzzle.theme`, above both board branches)

The positive theme-label e2e assertion is added in `regenerate-themed-puzzles` (once
today's puzzle carries a theme); graceful absence is covered by the current suite.

---

## Work Item: regenerate-themed-puzzles

### Result

Regenerated all 15 manifest dates (2026-06-07 … 06-21) with an 8-theme rotation
(Nolan · Wes Anderson · MCU · Tarantino · DiCaprio · Scorsese · Apatow · Coen):

- **No two consecutive days share a theme**; spans all four styles.
- A whole-manifest check confirms every puzzle: **3 films, unique solution, themed** (15/15 ✓).
- Today (06-14) → The Coen Brothers (Big Lebowski / O Brother / Hail, Caesar!).

### Acceptance Criteria Validation

- ✅ Upcoming week + backfill regenerated as themed 3-film puzzles, each with `theme`
- ✅ No consecutive-day theme repeats; multiple styles represented
- ✅ Each schema-valid, uniquely solvable (`countPartitions == 1`), ≥1 trap
- ✅ Manifest unchanged (dates); guard test strengthened to require a theme
- ✅ Archive lists the themed days; full suite + e2e green; TMDB key in `.env`

### Tests

- `tests/unit/manifest-three-films.test.js` — every live puzzle is 3-film **and themed**.
- `tests/unit/multi-film-schema.test.js` — decoupled from the live `2026-06-14.json`
  (which now regenerates) onto a stable `tests/fixtures/three-film-puzzle.json` with
  generic 4-per-film + crossover assertions.
- `tests/e2e/play.spec.js` — derives groups from `2026-06-14.json` (regeneration-proof)
  and asserts the theme label is shown up-front.

### Final gate

`npm run check` green: format, lint, coverage (97%+), build, e2e 6/6.
