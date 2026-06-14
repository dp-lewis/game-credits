---
id: archive-theme-index
title: Archive Theme Index
intent: archive-themes-preview
complexity: medium
mode: autopilot
status: completed
depends_on: []
created: 2026-06-14T10:00:00Z
run_id: run-game-credits-025
completed_at: 2026-06-14T14:28:59.443Z
---

# Work Item: Archive Theme Index

## Description

Add a build-time `public/puzzles/index.json` mapping each manifest date to its theme,
so the archive can read all themes (and tomorrow's) in one fetch. Keep it in sync:
the generator updates it on write, and a small script (re)builds it from all puzzles.

## Acceptance Criteria

- [ ] `public/puzzles/index.json` is `[{ "date": "YYYY-MM-DD", "theme": "..." }]`,
      sorted by date, covering every manifest puzzle
- [ ] `build-puzzles.js` updates the index entry for a date when it writes that puzzle
      (upsert by date, including the theme)
- [ ] A `scripts/build-archive-index.js` (re)builds the index from the manifest +
      puzzle files; run it to create the current index
- [ ] A guard unit test: the index includes **every** manifest date with a non-empty
      theme (catches drift)
- [ ] `manifest.json` shape unchanged; `npm run check` passes

## Technical Notes

`scripts/build-puzzles.js` (write step), new `scripts/build-archive-index.js`,
`public/puzzles/index.json`, a unit test under `tests/unit/`. The index is additive —
the main loader keeps reading `manifest.json` as a string array. Upsert: read existing
index (or []), set `{date, theme}` for the written date, sort, write. The guard test
reads `manifest.json` + `index.json` and asserts coverage + non-empty themes.

## Dependencies

(none)
