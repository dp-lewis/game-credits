---
id: tmdb-curation-script
title: TMDB Curation Script
intent: call-sheet
complexity: high
mode: confirm
status: pending
depends_on:
  - multi-film-schema
created: 2026-06-11T21:10:53Z
---

# Work Item: TMDB Curation Script

## Description

Build the offline content pipeline: a Node build script that queries the TMDB API
to source film/cast data and assembles **v2 four-film crossover puzzles** — 4
films / 16 actors with deliberate cross-cast overlaps — then **verifies a unique
valid solution partition** before emitting schema-valid puzzle JSON for a chosen
date. Caches TMDB responses; a human approval step gates the final puzzle. Runs at
build time only; the TMDB key never reaches the client. `confirm` because of
external-API, data-quality, uniqueness-verification, and architecture decisions.

## Acceptance Criteria

- [ ] `scripts/build-puzzles.js` (Node 20+) queries TMDB using a key from an environment variable
- [ ] Assembles 4 films + 16 actors (4 per solution film) with genuine crossovers (actors in 2+ of the four films) recorded as `alsoIn`
- [ ] **Uniqueness check**: verifies exactly one valid partition assigns every actor to a film they were in with each film getting its group size — rejects/re-rolls puzzles with zero or multiple solutions
- [ ] Output validates against the `multi-film-schema` and plays correctly in the client
- [ ] TMDB responses cached to avoid redundant calls and rate limits
- [ ] Human approval/confirmation step gates writing the final dated puzzle file
- [ ] The TMDB key is never written into output or client code (verified)
- [ ] Documented usage: generate, verify uniqueness, and approve a puzzle for a date

## Technical Notes

The hard part is **uniqueness**: model puzzle assembly as a constraint problem —
given actors' real film memberships among the 4 chosen films, count valid
partitions (each film gets exactly `groupSize` actors, each actor placed in a film
they were in). Accept only puzzles with exactly one solution; that solution
becomes each actor's `filmId`, and other real memberships become `alsoIn` traps.
Define the "good puzzle" heuristic (enough overlap to be interesting, still
unique) at the checkpoint. Use native `fetch` (Node 20+); cache under a build-only
dir; output to `public/puzzles/<date>.json`. Keep film/cast-size parameters
configurable. Unblocks scaling beyond hand-made fixtures.

## Dependencies

- multi-film-schema
