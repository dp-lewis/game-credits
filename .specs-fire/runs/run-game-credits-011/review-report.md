# Code Review Report — run-game-credits-011

**Intent**: call-sheet-fixes · **Scope**: wide (3 fixes)
Per-item sections appended as each fix completes.

---

## Work Item: fix-dark-mode-contrast

**Reviewed**: 2026-06-13T12:05:00Z · **Files**: 1 created, 3 modified

| Category | Auto-Fixed | Applied | Skipped |
|----------|------------|---------|---------|
| All | 0 | 0 | 0 |

**Tests Status**: Passing (144 + 3 e2e)

### Findings

`eslint`/`prettier` clean.

- ✅ **Root cause fixed at the token layer**: surfaces (`--cs-card`/`--cs-border`) now flip in dark mode, so every component using them (board buttons, chips, share box) is corrected at once — not a per-component patch.
- ✅ **AA group colours**: darkened the four group colours so active group buttons (white-on-colour) clear 4.5:1 — the gold `#b7791f` (~2.6:1) was the worst offender.
- ✅ **Disabled Submit**: muted-but-legible text instead of white-on-light-grey (fixes both modes).
- ✅ **De-duplication**: removed the now-redundant local dark override in the actor chip — single source of truth in `global.css`.
- ✅ **Guarded**: the dark-mode e2e directly checks the surfaces aren't light, so the regression can't silently return.

No auto-fixes, no suggestions requiring approval.

---

## Work Item: fix-grid-wrap-layout

**Reviewed**: 2026-06-13T12:08:00Z · **Files**: 1 created, 2 modified

| Category | Auto-Fixed | Applied | Skipped |
|----------|------------|---------|---------|
| All | 0 | 0 | 0 |

**Tests Status**: Passing (144 + 4 e2e)

### Findings

`eslint`/`prettier` clean.

- ✅ **Correct mechanism**: `grid-auto-rows: 1fr` equalises row heights and the
  chip fills its cell (`height: 100%`), so wrapping can't make the grid ragged —
  a pure CSS fix, no JS.
- ✅ **Guarded**: the e2e measures all 12 chip heights and asserts they're equal,
  which directly catches the raggedness if it returns.
- ✅ **No mobile regression**: the same rules apply to the 2-col layout.

No auto-fixes, no suggestions requiring approval.

---

## Work Item: enforce-three-film-rotation

**Reviewed**: 2026-06-13T12:12:00Z · **Files**: 1 created, 1 moved, 1 deleted, 4 modified

| Category | Auto-Fixed | Applied | Skipped |
|----------|------------|---------|---------|
| All | 0 | 0 | 0 |

**Tests Status**: Passing (153 + 4 e2e)

### Findings

`eslint`/`prettier` clean.

- ✅ **Right boundary**: the constraint lives in the *rotation* (manifest + guard
  test), not the schema — the schema's N-film generality is intentional and still
  exercised by the relocated fixture.
- ✅ **No lost coverage**: the 4-film fixture moved to `tests/fixtures/` with all 3
  imports updated; the unused 2-film file was safely deleted (verified no imports;
  `sample-puzzle.json` covers 2-film).
- ✅ **Durable guard**: `manifest-three-films.test.js` loads every live puzzle and
  asserts 3 films — a future non-3-film puzzle in the manifest fails CI.
- ✅ **User-facing fix verified**: today resolves to `2026-06-14` (3 films).

No auto-fixes, no suggestions requiring approval.

---

## Review Summary

All 3 fixes reviewed; zero auto-fixes, zero suggestions requiring approval. Each
ships a regression guard (2 e2e + 1 unit). Suite green throughout.
