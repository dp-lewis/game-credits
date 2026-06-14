---
id: themed-puzzle-variety
title: Themed Puzzle Variety
status: completed
created: 2026-06-14T08:20:00Z
completed_at: 2026-06-14T09:23:51.555Z
---

# Intent: Themed Puzzle Variety

## Goal

More variety in the films, and a per-puzzle **theme** shown up-front. Replace the
single 12-film pool (almost all Nolan/DiCaprio-sphere) with a diverse set of
**themed cross-cast clusters**; each puzzle draws from one cluster, carries its theme,
and the themes rotate day-to-day so the catalogue feels broad.

## Users

Players — fresher, more varied puzzles each day, each with a flavour hook ("Today's
theme: Heist crews").

## Problem

Every puzzle is sourced from one hand-curated pool of 12 films that all share cast
because they're the same ecosystem (four Nolan films alone), so the same titles —
especially Nolan's — keep recurring and there's no theme.

## Success Criteria

- The curation catalogue is a set of **themed clusters** spanning all four styles:
  director troupes, franchises/sagas, genre/era vibes, and shared-actor ensembles.
- Each generated puzzle belongs to one cluster and stores its **theme** (a display
  label); the puzzle schema carries it.
- The day's theme is shown **up-front** above the board as flavour.
- Generation rotates themes so consecutive days differ; trios stay uniquely solvable,
  recognizable, and trap-bearing (existing guarantees preserved).
- A fresh, varied, themed week (+ backfill) is generated; Nolan no longer dominates.
- Full suite + e2e green; `npm run check` passes.

## Constraints

- The mechanic needs **cross-cast** films (shared actors → crossover traps), so themes
  are built as clusters whose films genuinely share cast (troupes/franchises do this
  naturally; genre/era themes lean on ensemble-heavy examples). Uniqueness verified
  via the existing `countPartitions` oracle.
- Web-platform-first; build-time TMDB curation (key stays in `.env`). 3 films × 4
  actors unchanged.
- Theme is flavour, not a spoiler: it names the cluster, never the three hidden films.

## Notes

Decided with the user: themes are **per puzzle, any of the four styles**, shown
**up-front**. Decomposed into `themed-film-catalogue` (the diverse clustered pool —
confirm the roster), `theme-schema-and-generator` (puzzle `theme` field + cluster-aware
generation), `theme-in-ui` (up-front theme label), and `regenerate-themed-puzzles`
(seed a varied themed week + backfill). A proposed starting roster is in the catalogue
work item for sign-off.
