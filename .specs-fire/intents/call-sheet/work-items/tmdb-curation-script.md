---
id: tmdb-curation-script
title: TMDB Curation Script
intent: call-sheet
complexity: high
mode: confirm
status: pending
depends_on: [puzzle-schema-and-loader]
created: 2026-06-11T21:10:53Z
---

# Work Item: TMDB Curation Script

## Description

Build the offline content pipeline: a Node build script that queries the TMDB API
to source film/cast data, selects good two-film puzzles with appropriately
overlapping/ambiguous ensembles, caches TMDB responses, and emits schema-valid
puzzle JSON for a chosen date — with a human approval step before a puzzle is
locked in. Runs at build time only; the TMDB key never reaches the client. Marked
`confirm` because it involves external-API, data-quality, and architecture decisions.

## Acceptance Criteria

- [ ] `scripts/build-puzzles.js` (Node 20+) queries TMDB using a key from an environment variable
- [ ] It produces puzzle JSON that validates against the #2 schema and plays correctly in the client
- [ ] Candidate selection picks two films with a sensible ensemble (configurable cast size, default ~8 / 4 per film)
- [ ] TMDB responses are cached to avoid redundant calls and rate-limit issues
- [ ] A human approval/confirmation step gates writing the final dated puzzle file
- [ ] The TMDB key is never written into output or client code (verified)
- [ ] Documented usage: how to generate and approve a puzzle for a given date

## Technical Notes

Define what makes a "good" puzzle (overlap/ambiguity heuristic) at the checkpoint.
Use native `fetch` in Node 20+. Cache under a build-only directory (gitignored or
committed deliberately). Output targets `public/puzzles/<date>.json`. Keep
selection parameters configurable. This unblocks scaling beyond hand-made fixtures.

## Dependencies

- puzzle-schema-and-loader
