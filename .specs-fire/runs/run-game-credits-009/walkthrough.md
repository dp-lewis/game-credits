---
run: run-game-credits-009
work_item: tmdb-key-dotenv
intent: call-sheet
generated: 2026-06-13T11:34:00Z
mode: autopilot
---

# Implementation Walkthrough: Load TMDB Key from .env

## Summary

DX tweak: the puzzle build script now reads `TMDB_API_KEY` from a gitignored
`.env` as a fallback, so live mode doesn't need the key prefixed each time.

> Retrofitted into FIRE (original commit `f641258`).

## Files Changed

- **Modified** `scripts/build-puzzles.js` — `process.loadEnvFile('.env')` guarded
  by `!process.env.TMDB_API_KEY` + try/catch (explicit env var wins; missing
  `.env` is fine).
- **Created** `.env.example` — documents the variable (committed).
- **Modified** `README.md` — `.env` workflow note.

## Verify

```bash
npm run build:puzzle -- --date 2026-06-25 --films 3 --dry-run   # picks up .env, no prefix
git check-ignore .env                                            # confirms it's ignored
```

## Ready for Review

- [x] Verified (keyless dry-run + ignore checks)
- [x] No secrets committed
