---
run: run-game-credits-030
work_item: preview-gallery
intent: curator-preview
generated: 2026-06-17T11:30:00Z
status: passing
---

# Test Report: Curator Preview Gallery (wide run)

`npm run check` green: format, lint, coverage, build (emits preview.html), **12 e2e**.

## Work Item: preview-gallery

- ✅ `preview.html` added as a Vite input (builds into `dist/`)
- ✅ `src/preview-main.js` fetches `puzzles/index.json` → `<call-sheet-preview>`
- ✅ Gallery lists **all** dates + themes (future included), chronological; spoiler banner; unlinked
- ✅ Rows are selectable buttons (drive the detail view)

## Work Item: preview-reveal-detail

- ✅ Selecting a date `loadPuzzle(date)`s and mounts `<call-sheet-board .reveal>` (solved board)
- ✅ Curator panel: theme, each film + its cast, and the traps (`alsoIn`) with a count
- ✅ Works for far-future dates (no play-guard); e2e selects **Sep 14, 2026** and asserts the revealed board + Films/Traps panel
- ✅ Legible light/dark via existing tokens

## Tests

- `tests/e2e/preview.spec.js` — loads `/preview.html`, selects a future date, asserts the reveal board + traps panel.
