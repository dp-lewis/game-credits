---
run: run-game-credits-026
work_item: fix-preview-dark-mode
intent: archive-preview-fixes
generated: 2026-06-15T09:30:00Z
status: passing
---

# Test Report: Archive Preview Fixes (wide run)

`npm run check` green: format, lint, coverage, build, **10 e2e** pass.

## Work Item: fix-preview-dark-mode

- ✅ `.preview` background → `var(--cs-card)` (flips dark) instead of the undefined
  `--cs-surface` light fallback; dashed border / muted text / 🔒 kept
- ✅ `tests/e2e/dark-mode.spec.js` — the archive teaser surface is dark in dark mode

## Work Item: block-future-puzzles

- ✅ `_load()` blocks `id > today` ("That puzzle isn't available yet…") before any
  fetch — closes `?puzzle=<future>`
- ✅ `resolvePuzzleId` returns null instead of the earliest upcoming puzzle when
  nothing is on/before today
- ✅ `tests/unit/puzzle-schedule.test.js` — updated for no-future-fallback (null)
- ✅ `tests/e2e/archive.spec.js` — `?puzzle=2099-01-01` → unavailable, no board/Submit
  (far-future date so the test won't rot)

Note (in code + brief): a static client can't fully trust the local clock; this guards
the id (URL tampering), not clock manipulation — a tamper-proof gate needs a backend.
