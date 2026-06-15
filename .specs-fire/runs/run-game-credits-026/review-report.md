# Code Review Report

**Run**: run-game-credits-026 (wide) · **Intent**: archive-preview-fixes
**Reviewed**: 2026-06-15T09:31:00Z

| Category | Auto-Fixed | Applied | Skipped |
|----------|------------|---------|---------|
| Format (prettier) | 1 | 0 | 0 |

## Files Reviewed

- `src/components/call-sheet-archive.js` — `.preview` background → flipping `--cs-card`
- `src/lib/puzzle-schedule.js` — drop the upcoming-puzzle fallback (return null)
- `src/components/call-sheet-app.js` — guard `id > today` in `_load`
- `tests/unit/puzzle-schedule.test.js`, `tests/e2e/archive.spec.js`, `tests/e2e/dark-mode.spec.js`

## Notes

- `npm run check`'s format:check caught an unformatted edit locally (the gate doing its
  job); fixed via `prettier --write`.
- The future-guard e2e uses a far-future date (`2099-01-01`) so it fires before any
  fetch and won't rot as the calendar advances.
- No security surface; `.env`/TMDB key not involved.
