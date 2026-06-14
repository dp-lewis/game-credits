---
run: run-game-credits-020
work_item: pastel-tile-theme
intent: pastel-layout-refresh
mode: autopilot
checkpoint: none
approved_at:
---

# Implementation Plan: Pastel Solid Tiles

## Approach

Recolour to the pastel palette and make chips + Movie headers solid, borderless, with
one constant dark text colour (kept in both light and dark mode).

## Files to Modify

| File | Changes |
|------|---------|
| `src/styles/global.css` | `--cs-group-0/1/2` → `#FFC6C2`/`#FAE9DA`/`#C3E0DD`; `--cs-group-3` → a 4th pastel (fixture only); add `--cs-tile-fg: #1a1a1a` (NOT overridden in the dark block) |
| `src/components/call-sheet-actor.js` | Solid pastel background per `g0..g3`, no border, `color: var(--cs-tile-fg)`; keep the `.selected` ring + `.lock` ✓ visible |
| `src/components/call-sheet-board.js` | `.head` solid pastel for all columns (solved + unsolved), borderless, dark text; drop the `.head.solved` white-text rule |
| `tests/e2e/dark-mode.spec.js` | Flip the assertion: in dark mode a Movie header has **dark text on a light pastel** (legible), instead of "surface is dark" |

## Tests

`npm run check` (format:check, lint, coverage, build, e2e). Component tests for the
board/actor are colour-agnostic and should stay green.

## Technical Details

Group colours flip from dark-for-white-text to light pastel-for-dark-text. A dedicated
`--cs-tile-fg` keeps tile text dark in both schemes (the pastels are light, so tiles
look identical light/dark; only page bg/fg/muted flip). Contrast verified: `#1a1a1a`
on each pastel ≈ 9:1 (AAA), so the given pastels are used unchanged. 4th pastel for
`--cs-group-3` (four-film fixture): a light lavender (e.g. `#E7D9F2`). Actor: replace
the white `--cs-card` background + 2px border + inset box-shadow accent with a solid
`var(--cs-group-N)` fill and `var(--cs-tile-fg)` text; selected = a dark/accent ring;
✓ stays. Header: same fill, dark text, no border. Submit button, lives, banners
unchanged.

---
*Autopilot mode — plan recorded; no checkpoint.*
