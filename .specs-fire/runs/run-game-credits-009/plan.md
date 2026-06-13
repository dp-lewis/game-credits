---
run: run-game-credits-009
work_item: tmdb-key-dotenv
intent: call-sheet
mode: autopilot
checkpoint: none
approved_at: n/a (autopilot)
---

# Implementation Plan: Load TMDB Key from .env

> Retrofit: implemented as a direct change (committed in `f641258`), captured here
> for a complete FIRE trail.

## Approach

Let the build script read `TMDB_API_KEY` from a gitignored `.env` as a fallback,
so it needn't be exported each time. An explicit env var still wins.

## Files to Create

| File | Purpose |
|------|---------|
| `.env.example` | Documents the variable (committed) |

## Files to Modify

| File | Changes |
|------|---------|
| `scripts/build-puzzles.js` | `process.loadEnvFile('.env')` guarded by `!process.env.TMDB_API_KEY` + try/catch |
| `README.md` | Note the `.env` workflow |

## Verification

- Keyless `--dry-run` picks up the key from `.env` (live fetch).
- `.env` stays gitignored; `.env.example` tracked.
- Lint/format clean; suite green.

---
*Plan recorded (autopilot — no checkpoint).*
