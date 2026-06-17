---
id: generate-90-day-schedule
title: Generate 90-Day Schedule
intent: catalogue-expansion
complexity: medium
mode: autopilot
status: completed
depends_on:
  - rebuild-tmdb-catalogue
created: 2026-06-17T00:00:00Z
run_id: run-game-credits-029
completed_at: 2026-06-17T10:01:27.431Z
---

# Work Item: Generate 90-Day Schedule

## Description

Generate puzzle JSON files for Jun 17 → Sep 14, 2026 (90 days) using `build-puzzles.js --yes`. Existing files for Jun 7–16 are preserved. A helper script or loop drives the batch, using `--avoid` to prevent the same theme repeating on back-to-back days. Commit all new puzzle files.

## Acceptance Criteria

- [ ] Puzzle JSON files exist for every date Jun 17 – Sep 14, 2026 (90 files)
- [ ] Existing Jun 7–16 puzzles are preserved unchanged
- [ ] No two consecutive days share the same theme cluster
- [ ] Every puzzle has a `theme` field populated
- [ ] `public/puzzles/manifest.json` includes all dates Jun 7 – Sep 14
- [ ] `public/puzzles/index.json` updated with theme entries for all new dates
- [ ] `npm run check` passes green

## Technical Notes

Drive generation with a Node script or shell loop:

```js
// Example batch approach (Node)
const dates = /* array of YYYY-MM-DD strings from Jun 17 to Sep 14 */;
for (const date of dates) {
  // run: node scripts/build-puzzles.js --date <date> --yes
  // capture the theme used, pass as --avoid to next call to prevent back-to-back repeats
}
```

Or shell:
```sh
for date in $(seq 0 89 | xargs -I{} date -d "2026-06-17 + {} days" +%Y-%m-%d); do
  node scripts/build-puzzles.js --date $date --yes
done
```

The `--avoid` flag accepts comma-separated cluster IDs — use it to pass the previous day's cluster so the theme rotates.

## Dependencies

- rebuild-tmdb-catalogue
