---
id: catalogue-expansion
title: Catalogue Expansion — 3-Month Variety
status: pending
created: 2026-06-17T00:00:00Z
---

# Intent: Catalogue Expansion — 3-Month Variety

## Goal

Grow the themed puzzle catalogue from 8 clusters to ~25–30, spanning all four cluster styles (director troupes, franchises, genre/era, shared-actor), with 6–8 films per cluster, so 90 days of puzzles can run without a theme repeating more than ~3 times or the same film trio ever repeating within a theme.

## Users

Daily players — the game should feel fresh every day for a whole season, not cycle through the same Nolan/DiCaprio/Apatow rotation every two weeks.

## Problem

Only 8 themes cycle in the current catalogue. With 15+ puzzles already generated, every theme has appeared twice and within-theme film pools are small enough that identical trios recur (e.g. Superbad / Pineapple Express / This Is the End on both Jun 13 and Jun 21). Three months of daily play requires roughly 3× more themes and deeper per-cluster film pools.

## Success Criteria

- ~25–30 clusters total across all four styles (director, franchise, genre, shared-actor)
- Existing 8 clusters retained and optionally deepened
- New director clusters include at least: Spielberg, Fincher, P.T. Anderson, Ridley Scott, Denis Villeneuve, Tim Burton
- New franchise clusters include at least: Star Wars, Harry Potter, Lord of the Rings, Mission: Impossible, James Bond, Ocean's
- New genre clusters include at least: Horror, 80s Action, Heist, Sci-Fi, Rom-Com
- New shared-actor clusters include at least: Tom Hanks, Samuel L. Jackson, Meryl Streep, Denzel Washington, Brad Pitt
- Each cluster has 6–8 films verified by the existing `assemblePuzzle` oracle (unique 3×4 puzzle with ≥1 trap)
- A fresh 90-day puzzle schedule generated, committing JSON files to `public/puzzles/`
- `npm run check` passes green

## Constraints

- TMDB API for cast resolution and data (key stays in `.env`)
- 3 films × 4 actors format unchanged
- Theme labels are flavour, not spoilers (name the cluster, not the hidden films)
- Cluster must produce cross-cast puzzles — films must genuinely share actors to enable traps

## Notes

Expand `CLUSTERS` array in `scripts/build-theme-catalogue.js`, re-run with `--write` to regenerate `scripts/lib/tmdb-themes.json`, then re-run `scripts/build-puzzles.js` to generate the 90-day schedule. Existing puzzle dates from Jun 7–21 should be preserved or regenerated consistently.
