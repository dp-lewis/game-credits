---
run: run-game-credits-030
work_item: preview-gallery
intent: curator-preview
mode: autopilot
checkpoint: none
approved_at:
---

# Implementation Plan: Curator Preview Gallery

(Wide run — item 1 of 2. Item 2 `preview-reveal-detail` appended after.)

## Approach

A new `/preview.html` curator page that lists every scheduled date + theme from
`index.json` (future included), and reveals any selected puzzle (board `reveal` mode)
with a trap/metadata panel.

## Files to Create

| File | Purpose |
|------|---------|
| `preview.html` | Vite entry (mirrors `archive.html`); hosts `<call-sheet-preview>` |
| `src/preview-main.js` | Fetch `puzzles/index.json`, pass entries to the component |
| `src/components/call-sheet-preview.js` | Gallery (all dates+themes) + on-select reveal board + trap panel |
| `tests/e2e/preview.spec.js` | Load /preview.html, select a date, assert reveal board + a trap |

## Files to Modify

| File | Changes |
|------|---------|
| `vite.config.js` | Add `preview: resolve(root, 'preview.html')` to `rollupOptions.input` |

## Technical Details

`preview-main.js` fetches `puzzles/index.json` (`[{date, theme}]`, all dates) and sets
`el.entries`. `<call-sheet-preview>` renders a "Curator preview — spoilers ahead"
banner + a chronological list of date · theme rows (buttons). Selecting a row calls
`loadPuzzle(date)` (from puzzle-loader — fetch + validate, no play-guard) and renders
`<call-sheet-board .puzzle .reveal>` plus a panel: theme, each film + its 4 actors, and
the traps = `actors.filter(a => a.alsoIn?.length)` (name → solution film + overlap
films) with a trap count. Light/dark via existing tokens; unlinked from the game nav.
The page ships in `dist/` (deployed) but isn't linked anywhere.

---
*Autopilot mode — plan recorded; no checkpoint.*
