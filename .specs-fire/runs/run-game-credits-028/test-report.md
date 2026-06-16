---
run: run-game-credits-028
generated: 2026-06-16T09:46:09Z
---

# Test Report: run-game-credits-028

## Summary

| Suite | Before | After | Delta |
|-------|--------|-------|-------|
| Component/unit | 214 | 214 | 0 |
| E2E | 11 | 11 | 0 |
| **Total** | **225** | **225** | **0** |

Coverage: **97.55%** statements. No tests added — this run updated three e2e
accessible-name selectors to match the renamed button.

## Updated Tests

| File | Change | Result |
|------|--------|--------|
| `tests/e2e/play.spec.js` | button selector `'Submit'` → `'Check Answer'` (×3) | ✓ |
| `tests/e2e/dark-mode.spec.js` | button selector `'Submit'` → `'Check Answer'` | ✓ |
| `tests/e2e/archive.spec.js` | button selector `'Submit'` → `'Check Answer'` | ✓ |

## Unchanged-but-relevant Tests

| Test | Why it still passes | Result |
|------|--------------------|--------|
| `grid-layout` e2e — chips equal height when names wrap | Asserts equality, not an absolute height; taller tiles stay uniform | ✓ |
| component — static reveal hides `.lives` | Lives kept behind the `_status === 'revealed'` guard; only position moved | ✓ |
| component — `button.submit` selectors | Button kept its `.submit` class | ✓ |

## Regressions

None — all 214 component/unit and 11 e2e tests pass.

## `npm run check` output

```
format:check  ✓ (all files)
lint          ✓ (0 errors)
test:coverage ✓ 214 passed, 97.55% coverage
build         ✓ (vite production build)
test:e2e      ✓ 11 passed
```
