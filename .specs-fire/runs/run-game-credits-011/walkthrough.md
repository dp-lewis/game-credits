---
run: run-game-credits-011
work_items: [fix-dark-mode-contrast, fix-grid-wrap-layout, enforce-three-film-rotation]
intent: call-sheet-fixes
generated: 2026-06-13T12:13:00Z
mode: wide (autopilot ×2 + confirm ×1)
---

# Implementation Walkthrough: Call Sheet — Fixes

## Summary

Fixed the three reported issues — dark-mode contrast, desktop grid wrapping, and
the four-film puzzle in rotation — each with a regression guard. 153 unit/
component tests + 4 e2e.

## 1. Dark-mode contrast

**Cause:** the dark-mode block overrode `--cs-bg/fg/muted` but not the *surface*
tokens, so group buttons rendered `var(--cs-card)` = white with near-white text;
the gold group colour failed AA; disabled Submit was white-on-light-grey.
**Fix:** dark-mode overrides for `--cs-card` (#1e1e1e) + `--cs-border` (#444);
darkened the four group colours to clear AA with white text; disabled Submit uses
muted text. Removed a now-redundant per-component dark override.
**Guard:** `dark-mode.spec.js` asserts group + Submit surfaces are dark.

## 2. Grid wrap layout

**Cause:** grid rows sized to content and chips didn't fill their cells, so a
wrapped (2-line) name made its row taller while siblings stayed short — ragged.
**Fix:** `.grid { grid-auto-rows: 1fr }` + chip `:host`/`button` `height: 100%`,
so every chip is the same height regardless of wrapping.
**Guard:** `grid-layout.spec.js` measures all 12 chips and asserts equal height.

## 3. Three-film rotation

**Cause:** the manifest still listed the 2-film MVP (`2026-06-12`) and 4-film v2
(`2026-06-13`) fixtures; today resolved to the 4-film one.
**Fix:** removed both from the manifest; relocated the 4-film fixture to
`tests/fixtures/four-film-puzzle.json` (3 imports updated) and deleted the unused
2-film file. Today now falls through to `2026-06-14` (3 films).
**Guard:** `manifest-three-films.test.js` loads every live puzzle and asserts
exactly 3 films — a non-3-film puzzle in the manifest fails CI.

## Decisions Made

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Dark-mode fix layer | Token-level (`global.css`) | Fixes all surfaces at once |
| Group colours | Darkened for AA white-on-colour | Accessibility |
| Grid | `grid-auto-rows: 1fr` + fill cell | Pure CSS, equal heights |
| 3-film constraint | Manifest + guard test, not schema | Keep N-film generality for tests |
| 2-film file | Deleted (unused) | `sample-puzzle.json` already covers it |

## Deviations from Plan

None.

## How to Verify

```bash
npm test && npm run test:e2e   # 153 + 4, incl. the three new guards
npm run dev                    # dark mode + long-name desktop look correct; today is 3-film
```

## Ready for Review

- [x] All 3 issues fixed
- [x] Each has a regression guard
- [x] Suite + e2e green
- [x] No secrets committed
