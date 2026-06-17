---
id: rebuild-tmdb-catalogue
title: Rebuild TMDB Catalogue
intent: catalogue-expansion
complexity: medium
mode: autopilot
status: in_progress
depends_on:
  - expand-cluster-roster
created: 2026-06-17T00:00:00Z
---

# Work Item: Rebuild TMDB Catalogue

## Description

Run `node scripts/build-theme-catalogue.js --write` to resolve TMDB IDs for every new film via the TMDB search API, fetch casts, verify each cluster assembles valid puzzles, and write the updated `scripts/lib/tmdb-themes.json`. Fix any cluster that fails the ≥4/12 trios threshold.

## Acceptance Criteria

- [ ] `node scripts/build-theme-catalogue.js --write` runs to completion without errors
- [ ] All 28 clusters report `OK` (≥4/12 trios assemble with ≥1 trap) — clusters reporting `~~` (1–3/12) are investigated and either fixed or replaced
- [ ] No cluster reports `XX` (0/12) in the final output
- [ ] `scripts/lib/tmdb-themes.json` updated with all new clusters including resolved `tmdbId` fields
- [ ] `scripts/lib/tmdb-films.json` updated (flat list, written alongside themes)

## Technical Notes

If a cluster fails verification:
1. Check whether the films actually share cast — genre clusters are most at risk (less guaranteed overlap)
2. Swap in a film with more ensemble overlap, or tighten the cluster to films with a known shared actor
3. Re-run until all clusters pass

The `verifyCluster` function tries 12 random trios — a score of ≥4/12 means the cluster is productive. Director troupes and franchises almost always pass; genre/costar clusters may need tuning.

## Dependencies

- expand-cluster-roster
