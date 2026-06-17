---
run: run-game-credits-029
work_items: expand-cluster-roster, rebuild-tmdb-catalogue, generate-90-day-schedule
intent: catalogue-expansion
generated: 2026-06-17T08:05:00Z
mode: wide (autopilot)
---

# Implementation Walkthrough: Catalogue Expansion — 3-Month Variety

## Summary

Grew the themed catalogue from **8 clusters to 30** (176 films) and generated a fresh
**90-day schedule** (2026-06-17 … 09-14), so daily play stays varied for a season.

## What changed

- **Roster (expand-cluster-roster, committed earlier):** 22 new clusters across all
  four styles — director troupes (Spielberg, Fincher, PTA, Ridley Scott, Villeneuve,
  Tim Burton), franchises (Star Wars, Harry Potter, LOTR, M:I, Bond, Ocean's), genres
  (Horror, 80s Action, Heist, Sci-Fi, Rom-Com) and shared-actor (Hanks, S.L. Jackson,
  Streep, Denzel, Pitt).
- **Catalogue (rebuild-tmdb-catalogue):** `node scripts/build-theme-catalogue.js
  --write` resolved TMDB ids, fetched casts, and verified all **30 clusters report OK**
  (≥4/12 trios assemble with ≥1 trap) → `tmdb-themes.json` (30) + `tmdb-films.json`
  (176).
- **Schedule (generate-90-day-schedule):** new `scripts/generate-schedule.js` fetches
  each cluster once, then assembles 90 days with an **interleaved style rotation**
  (`order[i % 30]`) and a distinct-trio salt-retry. Result: 0 consecutive-day theme
  repeats, each theme 3× in the window, all 3-film/valid/themed. Manifest → 100 dates;
  `index.json` rebuilt.

## Verify

```bash
node scripts/build-theme-catalogue.js          # re-verify all clusters vs TMDB
node scripts/generate-schedule.js --start <d> --days <n>   # (re)build a schedule
npm run check                                  # format, lint, coverage, build, 11 e2e
```

## Known limitation

**Ocean's** is a 3-sequel franchise with effectively one cross-cast trio (11/12/13;
Ocean's 8 doesn't share cast), so its 3 uses repeat a trio twice. Kept because the
brief requested it; everything else has distinct trios.

## Intent status

All three work items of **Catalogue Expansion** complete.
