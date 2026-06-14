---
run: run-game-credits-024
work_item: themed-film-catalogue
intent: themed-puzzle-variety
mode: confirm
checkpoint: plan
approved_at:
---

# Implementation Plan: Themed Film Catalogue

(Wide run — item 1 of 4. Items 2–4 run autopilot after this is approved; their plan
sections are appended then.)

## Approach

Replace the flat 12-film pool with a **catalogue of themed clusters**, each a
`{ id, theme, style, films[] }` whose films share cast (crossovers) yet each keeps ≥4
within-trio anchors. Fetch every cluster's casts from TMDB and **verify** each can
assemble a unique 3×4 trio with ≥1 trap; drop/adjust any that can't.

## Why this shape

`assemblePuzzle` needs, per film, ≥`groupSize` (4) actors that are in *only that film*
within the trio (anchors) plus actors shared across films (traps). So:
- **Director troupes / collaborator circles** are ideal — standalone films, recurring
  troupe → reliable anchors + crossovers.
- **Pure sequel franchises** (LOTR trilogy, Craig-era Bond, Ocean's 11–13) are risky —
  near-identical casts mean almost everyone is a crossover and anchors run out.
- So franchises are represented by **origin/standalone entries** that overlap only
  partially (e.g. MCU solo films), and shared-actor themes pick films where more than
  the star recurs.

## Files to Modify

| File | Changes |
|------|---------|
| `scripts/lib/tmdb-themes.json` (new) | The clustered catalogue: `[{ id, theme, style, films:[{id,title,year,tmdbId}] }]` |
| `scripts/lib/tmdb-films.json` | Kept or derived (flat list = all cluster films) for back-compat / fetching |
| `scripts/build-puzzles.js` (light, here) | `loadPool` understands clusters (full build in item 2) |
| `scripts/verify-themes.mjs` (new, throwaway/dev) | Fetch casts + run `assemblePuzzle` per cluster to confirm each yields a unique trio |

## Proposed roster (CHECKPOINT — approve / edit)

Mostly director troupes (reliable), plus a franchise, a genre/era, and a shared-actor
to cover all four styles. ~5 films each; I'll verify and swap any that won't assemble.

| Style | Theme | Films (start set) |
|-------|-------|-------------------|
| Troupe | **Christopher Nolan** | Inception · The Dark Knight · Interstellar · Oppenheimer · The Prestige · Dunkirk |
| Troupe | **Wes Anderson** | Grand Budapest Hotel · Royal Tenenbaums · Moonrise Kingdom · The Life Aquatic · Asteroid City |
| Troupe | **Quentin Tarantino** | Pulp Fiction · Django Unchained · Inglourious Basterds · Once Upon a Time in Hollywood · The Hateful Eight |
| Troupe | **Martin Scorsese** | Goodfellas · The Departed · Wolf of Wall Street · Casino · The Irishman |
| Troupe | **The Coen Brothers** | Fargo · The Big Lebowski · No Country for Old Men · Burn After Reading · Hail, Caesar! |
| Franchise | **The MCU** | Iron Man · Thor · Captain America: The First Avenger · Doctor Strange · Guardians of the Galaxy |
| Genre/era | **Heist crews** | Ocean's Eleven · The Italian Job (2003) · Now You See Me · Baby Driver · Logan Lucky |
| Shared-actor | **Leonardo DiCaprio** | The Revenant · Shutter Island · Catch Me If You Can · Blood Diamond · The Aviator |

Nolan + DiCaprio now occupy **one cluster each** instead of the whole catalogue.

## Checkpoint — please confirm

1. The **theme roster** above (clusters/styles; add, drop, or rename any).
2. The **catalogue data shape** (`tmdb-themes.json` with `{id, theme, style, films}`).
3. That I should **verify against TMDB and quietly swap** any film/cluster that can't
   assemble a unique trio (so the final catalogue may differ slightly from the start
   sets above).

---
*Plan approved at checkpoint. Execution follows.*
