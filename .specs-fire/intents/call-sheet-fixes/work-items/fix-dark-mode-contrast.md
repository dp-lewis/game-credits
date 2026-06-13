---
id: fix-dark-mode-contrast
title: Fix Dark-Mode Contrast
intent: call-sheet-fixes
complexity: low
mode: autopilot
status: completed
depends_on: []
created: 2026-06-13T11:58:54Z
run_id: run-game-credits-011
completed_at: 2026-06-13T12:07:19.000Z
---

# Work Item: Fix Dark-Mode Contrast

## Symptom

In dark mode (`prefers-color-scheme: dark`), the **group (bucket) selector
buttons** and the **Submit button** have poor colour contrast — text/background
is hard to read.

## Acceptance Criteria

- [ ] Group buttons (active + inactive) and Submit meet **WCAG AA** contrast (≥ 4.5:1 for text) in dark mode
- [ ] Light mode unchanged / still passes
- [ ] Disabled Submit is still legible in dark mode
- [ ] An e2e check under `prefers-color-scheme: dark` confirms the controls render and are visible
- [ ] No existing tests broken

## Technical Notes

Likely the group/submit colours use fixed light-mode values (`--cs-accent`,
`--cs-group-*`, `--cs-border`) without dark-mode overrides. Add dark-mode token
overrides (in `src/styles/global.css` and/or the component `:host` media queries)
so foreground/background pairs clear AA. Check `call-sheet-board.js` (`.bucket`,
`.submit`) and the group colour tokens.

## Regression Check

Playwright test with `colorScheme: 'dark'` asserting the Submit + a group button
are visible and styled (not a pixel test — a render/visibility guard).

## Dependencies

(none)
