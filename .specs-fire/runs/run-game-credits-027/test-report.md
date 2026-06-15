---
run: run-game-credits-027
generated: 2026-06-15T09:50:00Z
---

# Test Report: run-game-credits-027

## Summary

| Suite | Before | After | Delta |
|-------|--------|-------|-------|
| Component/unit | 203 | 214 | +11 |
| E2E | 10 | 11 | +1 |
| **Total** | **213** | **225** | **+12** |

Coverage: **97.55%** statements (359/368).

## New Tests

### Component (`tests/component/call-sheet-board.test.js`)

| Test | Result |
|------|--------|
| initialises `_activeCell` at `{col:0, row:0}` | ✓ |
| renders chips in column-major DOM order matching `_columns.flat()` | ✓ |
| exactly one chip has `active=true` (tabindex 0 carrier) | ✓ |
| ArrowDown moves active row down, clamping at bottom | ✓ |
| ArrowUp moves active row up, clamping at top | ✓ |
| ArrowRight moves to next column | ✓ |
| ArrowLeft moves to previous column | ✓ |
| ArrowRight clamps at last column | ✓ |
| ArrowRight skips solved columns | ✓ |
| active cell moves to nearest unlocked column when its column solves | ✓ |
| arrow keys have no effect when not playing | ✓ |

### E2E (`tests/e2e/keyboard-nav.spec.js`)

| Test | Result |
|------|--------|
| keyboard: grid is one tab stop; arrow keys navigate column-major | ✓ |

## Regressions

None — all 203 pre-existing tests continue to pass.

## `npm run check` output

```
format:check  ✓ (all files)
lint          ✓ (0 errors)
test:coverage ✓ 214 passed, 97.55% coverage
build         ✓ (vite production build)
test:e2e      ✓ 11 passed (4.4s)
```
