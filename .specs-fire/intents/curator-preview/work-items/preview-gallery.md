---
id: preview-gallery
title: Preview Page and Gallery
intent: curator-preview
complexity: medium
mode: autopilot
status: completed
depends_on: []
created: 2026-06-17T11:00:00Z
run_id: run-game-credits-030
completed_at: 2026-06-17T10:21:23.843Z
---

# Work Item: Preview Page and Gallery

## Description

Add a new `/preview.html` curator page (Vite multi-page entry) that lists **every**
scheduled date + theme from `index.json` — future dates included — as a gallery. A
spoiler banner; unlinked from the game.

## Acceptance Criteria

- [ ] `preview.html` added as a Vite input alongside `index`/`archive` (builds into `dist/`)
- [ ] `src/preview-main.js` loads `index.json` and renders a `<call-sheet-preview>`
      gallery: one row per date with its theme (newest or chronological order — pick
      one), **including future dates** (not filtered like the archive)
- [ ] A clear "Curator preview — spoilers ahead" banner; no link to it from the game nav
- [ ] Each row is selectable (sets the chosen date for the detail view in the next item)
- [ ] Reads only static files (`index.json`); no backend, no schema change
- [ ] Legible in light + dark mode; `npm run check` passes

## Technical Notes

`vite.config.js` (add `preview: resolve(root, 'preview.html')` to `rollupOptions.input`);
new `preview.html` (mirror `archive.html`'s shell) + `src/preview-main.js` +
`src/components/call-sheet-preview.js`. `index.json` is `[{date, theme}]` for all
manifest dates — use it directly (no per-puzzle fetch for the list). Keep styling
consistent with `call-sheet-archive.js`. The detail/reveal lives in the next work item;
here a row selection just needs to expose the chosen date (state/event).

## Dependencies

(none)
