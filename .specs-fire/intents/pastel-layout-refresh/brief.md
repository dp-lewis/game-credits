---
id: pastel-layout-refresh
title: Pastel Layout Refresh
status: in_progress
created: 2026-06-14T04:10:00Z
---

# Intent: Pastel Layout Refresh

## Goal

A softer, tighter look:

1. **Pastel palette** — `#FFC6C2` / `#FAE9DA` / `#C3E0DD` for Movie 1 / 2 / 3.
2. **Solid, borderless tiles** — actor chips *and* the Movie headers (including the
   unsolved "Movie 1") fill with their solid pastel; no borders.
3. **Constant dark text** — the same dark text colour on every tile. If a pastel
   ever fails contrast, **darken the pastel**, never the text. (Verified: dark text
   on all three clears WCAG AAA, so the given pastels are used unchanged.)
4. **Tighter layout** — remove the "Call Sheet" title (keep the tagline); move the
   Archive link to the bottom.
5. **Lock completed replays** — replaying a puzzle you've already completed (archive
   or `?puzzle=`) shows the revealed/locked board, like today's finished puzzle —
   not a fresh practice board.

## Users

Players — a calmer, more cohesive board and a cleaner page, with consistent
"already done" behaviour for any finished puzzle.

## Problem

The current tiles are white cards with coloured borders/accents and dark "group"
colours tuned for white text; the page leads with a big title; and a completed
puzzle can still be replayed from scratch, which is inconsistent with the daily.

## Success Criteria

- Movie 1/2/3 use the three pastels; chips and headers are solid pastel, no borders.
- One dark text colour across all tiles, legible in light **and** dark mode; pastels
  unchanged (they pass) — and if tuning is ever needed, the pastel moves, not the text.
- Title removed, tagline kept, Archive at the bottom.
- A completed puzzle locks (reveals) on replay; an unplayed one is still playable.
- Full suite + e2e green (dark-mode and play e2e updated for the new model).

## Constraints

- Web-platform-first, Lit components; colours live in `src/styles/global.css`
  (`--cs-group-*`) + each component's `static styles`.
- Tiles keep their pastel + dark text in **both** colour schemes (the pastels are
  light, so they don't flip in dark mode); only page chrome (bg/fg) flips.
- Streak logic unchanged — only daily-today play moves the streak; locking is
  separate from streak.

## Notes

A 4th pastel is added only for the four-film test fixture (live game is 3-film).
Decomposed into `pastel-tile-theme` (colours + solid borderless tiles + dark-mode
test), `tighten-page-layout` (remove title, archive to bottom), and
`lock-completed-replays` (restore any completed puzzle on replay).
