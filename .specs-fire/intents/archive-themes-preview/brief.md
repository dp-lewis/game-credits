---
id: archive-themes-preview
title: Archive Themes and Tomorrow Preview
status: completed
created: 2026-06-14T10:00:00Z
completed_at: 2026-06-14T14:29:23.494Z
---

# Intent: Archive Themes and Tomorrow Preview

## Goal

Surface themes on the archive, and tease what's next:

1. **Theme on every archive row** — each past/today row shows its puzzle's theme
   alongside the date and play status.
2. **Tomorrow preview** — a single **locked theme teaser** at the top of the archive
   ("Tomorrow — Christopher Nolan 🔒"): shows tomorrow's date + theme, not playable
   until tomorrow. Spoiler-free; keeps the once-a-day cadence.

## Users

Players browsing the archive — they can see each day's theme at a glance and get a
spoiler-free tease of what's coming tomorrow.

## Problem

The archive lists dates + play status only; themes (now per puzzle) aren't visible,
and upcoming puzzles are entirely hidden, so there's nothing to look forward to.

## Success Criteria

- Each archive row shows its theme; rows still link to play (today → daily, past →
  practice replay) with native back-button behaviour preserved.
- A locked tomorrow teaser shows tomorrow's date + theme and is **not** a play link;
  only tomorrow (today+1) is previewed — later days stay hidden.
- Themes load in one fetch (a build-time index), scaling as the archive grows.
- Graceful when there's no tomorrow puzzle / no theme.
- Full suite + e2e green; `npm run check` passes.

## Constraints

- Web-platform-first; themes come from a build-time `public/puzzles/index.json`
  (`[{date, theme}]`) kept in sync with the manifest — not N per-puzzle fetches.
- The daily `manifest.json` shape is unchanged (the index is additive), so the main
  game loader is untouched.

## Notes

Decided with the user: tomorrow preview = **locked theme teaser** (not playable).
Decomposed into `archive-theme-index` (build the date→theme index + keep it in sync)
and `archive-themes-and-preview` (consume it: themed rows + the locked teaser).
