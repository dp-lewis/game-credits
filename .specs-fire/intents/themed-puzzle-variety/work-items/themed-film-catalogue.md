---
id: themed-film-catalogue
title: Themed Film Catalogue
intent: themed-puzzle-variety
complexity: high
mode: confirm
status: completed
depends_on: []
created: 2026-06-14T08:20:00Z
run_id: run-game-credits-024
completed_at: 2026-06-14T09:13:00.664Z
---

# Work Item: Themed Film Catalogue

## Description

Replace the flat 12-film pool with a **diverse catalogue of themed cross-cast
clusters** — each a `{ id, theme, films[] }` group whose films genuinely share cast
(so the trio has crossover traps). Span all four theme styles. Verify each cluster
actually cross-casts via TMDB before committing. Marked `confirm` so the theme roster
is signed off before the build.

## Acceptance Criteria

- [ ] `scripts/lib/tmdb-films.json` (or a new `tmdb-themes.json`) becomes a list of
      clusters: `{ id, theme, style, films: [{id,title,year,tmdbId}, …] }`
- [ ] ~8–12 clusters across the four styles (director troupes, franchises, genre/era,
      shared-actor), each with ≥4 films and verified internal cross-cast
- [ ] The old Nolan/DiCaprio films are folded into 1–2 clusters (e.g. "Christopher
      Nolan", "Leonardo DiCaprio"), not the whole catalogue
- [ ] A small verification step confirms every cluster can yield a uniquely-solvable
      3×4 trio with ≥1 trap (reuse `countPartitions` / curation helpers)
- [ ] No recognizability regressions (billing-order prominence still applies)
- [ ] Tests/build green; TMDB key stays in `.env`

## Technical Notes

`scripts/lib/`, `scripts/build-puzzles.js`, `scripts/lib/tmdb.js`, `src/lib/curation.js`.
Keep each cluster's films known to share actors (troupes/franchises do this; for
genre/era pick ensemble-heavy titles). The loader/pool code reads clusters instead of
a flat list. Verify cross-cast by fetching casts and checking shared actors per
cluster.

**Proposed starting roster (for the confirm checkpoint — adjust freely):**
- *Troupes:* Wes Anderson · Coen Brothers · Tarantino · Scorsese (De Niro/DiCaprio)
- *Franchises:* The MCU · Lord of the Rings/Hobbit · Harry Potter · James Bond (Craig)
- *Genre/era:* Heist crews (Ocean's-style ensembles) · Awards-season epics
- *Shared-actor:* Christopher Nolan regulars · Brad Pitt · Florence Pugh

## Checkpoint

Confirm the theme roster (which clusters/styles, ~how many) and the catalogue data
shape before building and verifying all clusters.

## Dependencies

(none)
