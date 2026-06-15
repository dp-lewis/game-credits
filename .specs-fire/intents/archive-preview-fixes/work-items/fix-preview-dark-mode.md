---
id: fix-preview-dark-mode
title: Fix Tomorrow Teaser Dark-Mode Contrast
intent: archive-preview-fixes
complexity: low
mode: autopilot
status: completed
depends_on: []
created: 2026-06-15T09:00:00Z
run_id: run-game-credits-026
completed_at: 2026-06-15T08:41:53.100Z
---

# Work Item: Fix Tomorrow Teaser Dark-Mode Contrast

## Description

The archive's tomorrow teaser renders light-on-light in dark mode because it uses an
undefined `--cs-surface` token (always the light `#f9f9f9` fallback). Make it legible
in both schemes while keeping its distinct "locked / coming soon" look.

## Acceptance Criteria

- [ ] The `.preview` row uses theme tokens that flip in dark mode (e.g. `--cs-card`
      surface + `--cs-fg`/`--cs-muted` text), not a hardcoded light fallback
- [ ] Legible contrast in **both** light and dark mode (text clearly readable on the row)
- [ ] Still visually distinct from playable rows (locked look — e.g. dashed border /
      muted) and not a play link
- [ ] e2e (dark mode) asserts the teaser surface/text are a sensible contrast
- [ ] `npm run check` passes

## Technical Notes

`src/components/call-sheet-archive.js` `static styles` — replace
`background: var(--cs-surface, #f9f9f9)` with a defined, flipping token (`--cs-card`),
and confirm the text colour token flips too. Either drop `--cs-surface` or define it in
`global.css` for both schemes. Extend `tests/e2e/dark-mode.spec.js` (or add an archive
dark-mode check) to assert the preview row is dark-surfaced / legible in dark mode.

## Dependencies

(none)
