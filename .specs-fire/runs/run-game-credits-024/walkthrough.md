---
run: run-game-credits-024
work_items: themed-film-catalogue, theme-schema-and-generator, theme-in-ui, regenerate-themed-puzzles
intent: themed-puzzle-variety
generated: 2026-06-14T09:25:00Z
mode: wide (confirm + autopilot)
---

# Implementation Walkthrough: Themed Puzzle Variety

## Summary

Puzzles are now drawn from a **diverse, themed catalogue** and each carries a theme
shown up-front. The old 12-film, Nolan-heavy pool is replaced by **8 cross-cast
clusters / 49 films**, and the live schedule rotates through eight themes with no
two consecutive days alike.

## The catalogue (item 1)

`scripts/lib/tmdb-themes.json` — clusters across all four styles, each verified to
assemble a unique 3×4 trio with traps:

| Style | Themes |
|-------|--------|
| Director troupes | Christopher Nolan · Wes Anderson · Quentin Tarantino · Martin Scorsese · The Coen Brothers |
| Franchise | The MCU |
| Genre | Apatow comedies |
| Shared-actor | Leonardo DiCaprio |

Built/verified by `scripts/build-theme-catalogue.js`, which resolves TMDB ids, fetches
casts, and runs the **production** `assemblePuzzle` over random trios. The proposed
"Heist crews" cluster verified at **0 traps** (the genre-risk flagged at the
checkpoint) and was swapped for **Apatow comedies** (3 traps). Nolan and DiCaprio now
occupy one cluster each instead of the whole pool.

## Schema + generator (item 2)

- `src/lib/puzzle-loader.js` — optional `theme` (non-empty string), validated and
  passed through; theme-less puzzles still validate.
- `src/lib/theme-select.js` (new, pure, tested) — picks a cluster: explicit `themeId`
  wins, else a seeded rotation that skips `avoid`ed themes.
- `scripts/build-puzzles.js` — restricts the pool to the chosen cluster, stamps the
  `theme`, and adds `--theme` / `--avoid`. Uniqueness/recognizability/trap guarantees
  are untouched (only the candidate films change).

## UI (item 3)

`src/components/call-sheet-app.js` — a muted "Theme: **<name>**" label above the
board when the puzzle has a theme; nothing when it doesn't.

## Regeneration (item 4)

All 15 manifest dates regenerated with an 8-theme rotation (no consecutive repeats);
a whole-manifest check confirms **15/15: 3 films, unique, themed**. Today (06-14) is
The Coen Brothers. The schema guard now requires a theme; `multi-film-schema.test.js`
and `play.spec.js` were decoupled from the live `2026-06-14.json` (committed fixture /
derive-from-file) so future regenerations don't break the suite.

## How to Verify

```bash
npm run dev    # each day shows its theme up-front; films vary day to day
npm run check  # format, lint, coverage, build, e2e — all green
node scripts/build-theme-catalogue.js   # re-verify the catalogue against TMDB
```

## Ready for Review

- [x] 8 themed cross-cast clusters (49 films); each verified to assemble
- [x] `theme` in the schema + generator; up-front theme label
- [x] 15 regenerated puzzles, 8-theme rotation, no consecutive repeats, all unique
- [x] Suite decoupled from regenerable content; `npm run check` green
- [x] TMDB key stayed in `.env`

## Intent status

All four work items of **Themed Puzzle Variety** are complete.
