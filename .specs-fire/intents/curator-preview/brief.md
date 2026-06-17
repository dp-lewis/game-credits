---
id: curator-preview
title: Curator Preview Gallery
status: completed
created: 2026-06-17T11:00:00Z
completed_at: 2026-06-17T10:21:46.163Z
---

# Intent: Curator Preview Gallery

## Goal

A curator-only `/preview.html` page to QA scheduled puzzles before they go live —
browse every scheduled day (including future), and for any day see the **revealed
board** plus the films, cast, theme, and **traps** (the crossover gotchas). It's for
you, not players; unlinked from the game.

## Users

The curator (you) — sanity-check the season: recognizable casts, sensible traps,
themes that aren't too revealing, no weak/duplicate puzzles — without playing.

## Problem

The 90-day schedule is generated and committed, but there's no quick way to eyeball
what's coming. The play app deliberately hides/blocks future puzzles, and reviewing
raw JSON is tedious.

## Success Criteria

- A new `/preview.html` page (Vite multi-page entry, like `archive.html`) listing
  **every** manifest date + theme, future dates included.
- Selecting a day shows the **revealed board** (reuse the board's static `reveal`
  mode) plus a curator panel: theme, the three films, each film's cast, and the traps
  (actors with `alsoIn`) with a trap count.
- It bypasses the play app's future-guard by being its own page (never goes through
  `_load`).
- Unlinked from the game's nav, with a "Curator preview — spoilers" banner; no auth
  gate (puzzle JSON is already public, so it adds no exposure).
- Full suite + e2e green; `npm run check` passes.

## Constraints

- Web-platform-first, Lit, static multi-page (no backend). Reuse `index.json` (date →
  theme, all dates) for the list and the board's `reveal` mode for the visual.
- No puzzle-schema or play-flow changes; the preview is read-only.
- It ships in `dist/` (deployed) but is intentionally unlinked.

## Notes

Decided with the user: curator QA, **gated web page**, unlinked/no auth. Decomposed
into `preview-gallery` (the page + list of all dates/themes) and `preview-reveal-detail`
(reveal board + traps/metadata panel). Separate from the in-flight catalogue PR (#13).
