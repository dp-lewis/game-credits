---
run: run-game-credits-029
work_item: expand-cluster-roster / rebuild-tmdb-catalogue / generate-90-day-schedule
intent: catalogue-expansion
mode: autopilot
checkpoint: none
approved_at: n/a (autopilot)
---

# Implementation Plan: Catalogue Expansion — 3-Month Variety

Wide run (3 items, all autopilot). Items execute sequentially.

---

## Work Item 1: expand-cluster-roster

### Approach

Expand the `CLUSTERS` array in `scripts/build-theme-catalogue.js` from 8 to 28 entries by adding 20 new themed clusters across all four styles. Films chosen for genuine cross-cast overlap. No other files change.

### Files to Modify

| File | Changes |
|------|---------|
| `scripts/build-theme-catalogue.js` | Add 20 new clusters to the CLUSTERS array (directors ×6, franchises ×6, genre ×5, costars ×5) |

### Tests

| Test File | Coverage |
|-----------|----------|
| `tests/unit/curation.test.js` | Existing tests unchanged — curation engine not modified |

---

## Work Item 2: rebuild-tmdb-catalogue

### Approach

Run `node scripts/build-theme-catalogue.js --write` to resolve TMDB IDs for all new films and verify each cluster. The script fetches casts and runs `verifyCluster` on 12 random trios per cluster. Fix any cluster reporting `XX` (0/12). Write updated `scripts/lib/tmdb-themes.json`.

### Files to Modify

| File | Changes |
|------|---------|
| `scripts/lib/tmdb-themes.json` | Regenerated with all 28 clusters |
| `scripts/lib/tmdb-films.json` | Regenerated flat film list |

---

## Work Item 3: generate-90-day-schedule

### Approach

Write a one-off Node batch script that loops Jun 17 – Sep 14, 2026 (90 days), calling `build-puzzles.js --yes` for each date. Tracks previous theme to pass as `--avoid` so no two consecutive days share a cluster. Skips dates that already have a puzzle file. Commit all new puzzle JSON files.

### Files to Create

| File | Purpose |
|------|---------|
| `scripts/batch-generate.js` | One-off batch driver (can be deleted after use) |
| `public/puzzles/2026-06-17.json` … `public/puzzles/2026-09-14.json` | 90 puzzle files |

### Files to Modify

| File | Changes |
|------|---------|
| `public/puzzles/manifest.json` | Extended to include all 90 new dates |
| `public/puzzles/index.json` | Extended with theme entries for all new dates |

---
*Plan approved at checkpoint. Execution follows.*
