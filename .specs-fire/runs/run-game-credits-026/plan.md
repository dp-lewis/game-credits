---
run: run-game-credits-026
work_item: fix-preview-dark-mode
intent: archive-preview-fixes
mode: autopilot
checkpoint: none
approved_at:
---

# Implementation Plan: Fix Tomorrow Teaser Dark-Mode Contrast

(Wide run — item 1 of 2. Item 2 `block-future-puzzles` runs after; its plan section is
appended then.)

## Approach

The `.preview` row's background uses the **undefined** `--cs-surface` token, so it
always renders the light `#f9f9f9` fallback — light-on-light in dark mode. Switch it to
`--cs-card`, which flips to a dark surface in dark mode (the playable rows already use
it). Keep the dashed border + muted text + 🔒 so it still reads as "locked / coming".

## Files to Modify

| File | Changes |
|------|---------|
| `src/components/call-sheet-archive.js` | `.preview` background `var(--cs-surface,#f9f9f9)` → `var(--cs-card,#fff)` |
| `tests/e2e/dark-mode.spec.js` | Add an archive check: in dark mode the `.preview` surface is dark (legible) |

## Tests

`npm run check`. The dark-mode spec already runs with `colorScheme: 'dark'`; the new
case loads `archive.html` and asserts the teaser's background is dark.

## Technical Details

`--cs-card` is `#fff` in light and `#1e1e1e` in dark (global.css). `--cs-muted` text
already flips (#555 → #aaa). So muted text on `--cs-card` is legible in both. Tomorrow
(today+1) is in the manifest, so the teaser renders for the test.

---
*Autopilot mode — plan recorded; no checkpoint.*
