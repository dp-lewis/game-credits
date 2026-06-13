---
id: tmdb-key-dotenv
title: Load TMDB Key from .env
intent: call-sheet
complexity: low
mode: autopilot
status: completed
depends_on:
  - tmdb-curation-script
created: 2026-06-13T11:31:10Z
run_id: run-game-credits-009
completed_at: 2026-06-13T11:34:25.759Z
---

# Work Item: Load TMDB Key from .env

## Description

Developer-experience tweak: let the puzzle build script read `TMDB_API_KEY` from
a gitignored `.env` so it needn't be exported or prefixed on every command, with
an explicit environment variable still taking precedence.

> Retrofitted into FIRE after the fact: implemented as a direct change (committed
> in `f641258`), then captured as this work item + run for a complete trail.

## Acceptance Criteria

- [ ] `scripts/build-puzzles.js` loads a gitignored `.env` as a fallback (explicit env var wins)
- [ ] A committed `.env.example` documents the variable
- [ ] The key is never committed (`.env` is gitignored) and never shipped to the client
- [ ] README documents the `.env` workflow

## Technical Notes

Uses Node's `process.loadEnvFile()` guarded by `!process.env.TMDB_API_KEY` and a
try/catch (no `.env` → offline still works). `.gitignore` already excludes
`.env`/`.env.*` and allows `!.env.example`.

## Dependencies

- tmdb-curation-script
