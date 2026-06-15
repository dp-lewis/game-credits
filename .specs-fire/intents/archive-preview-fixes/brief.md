---
id: archive-preview-fixes
title: Archive Preview Fixes
status: completed
created: 2026-06-15T09:00:00Z
completed_at: 2026-06-15T08:42:09.756Z
---

# Intent: Archive Preview Fixes

## Goal

Fix two issues from the archive themes/preview work:

1. **Dark-mode contrast** on the tomorrow teaser — it renders light-on-light in dark
   mode (poor contrast); make it legible in both schemes.
2. **Future puzzles are playable** — editing the `?puzzle=` date (or moving the clock)
   loads and plays a future-dated puzzle. Block future dates so only today/past are
   playable.

## Users

Players — a readable "coming tomorrow" teaser in dark mode, and no way to jump ahead
to puzzles that aren't released yet.

## Problem

- `call-sheet-archive.js` styles the teaser with `background: var(--cs-surface, #f9f9f9)`
  — `--cs-surface` is undefined, so it's always the light fallback; in dark mode the
  (light) text sits on a light box.
- `call-sheet-app._load()` loads `?puzzle=<id>` (or the resolved id) with no check that
  the id is on or before today, and `resolvePuzzleId` falls back to the earliest
  *upcoming* puzzle — both can surface future content.

## Success Criteria

- The tomorrow teaser is legible in light **and** dark mode (uses tokens that flip),
  still visually distinct as a locked "coming soon" row.
- A future-dated puzzle (`id > today`) is **not** loaded/played — show an "isn't
  available yet" message; today and past still play normally.
- `resolvePuzzleId` no longer surfaces a future puzzle when none is on/before today.
- Full suite + e2e green; `npm run check` passes.

## Constraints

- Web-platform-first; this is a static client, so the local clock can't be fully
  trusted — the practical fix is to refuse future-dated *ids* (the `?puzzle=` / resolve
  paths), which closes the URL-tampering hole. (A truly tamper-proof gate would need a
  backend; out of scope.)

## Notes

Two independent bug fixes: `fix-preview-dark-mode` (low) and `block-future-puzzles`
(medium). No new behaviour beyond closing these gaps.
