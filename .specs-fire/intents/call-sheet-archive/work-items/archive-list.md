---
id: archive-list
title: Archive List Helper
intent: call-sheet-archive
complexity: low
mode: autopilot
status: completed
depends_on: []
created: 2026-06-13T20:46:22Z
run_id: run-game-credits-012
completed_at: 2026-06-13T20:53:45.803Z
---

# Work Item: Archive List Helper

## Description

A pure helper that produces the list of puzzles the archive can show: every
manifest date **on or before today**, sorted **newest first**. Future dates are
excluded so upcoming puzzles aren't spoiled. This is the data layer the archive
view renders (it pairs each id with status from the progress store at render time).

## Acceptance Criteria

- [ ] `listArchivePuzzles(manifestIds, todayKey)` returns valid date ids `<= todayKey`, sorted descending (newest first)
- [ ] Future ids (`> todayKey`) are excluded
- [ ] Invalid ids are ignored; empty/garbage input returns `[]`
- [ ] Pure (no DOM/storage); fully unit-tested

## Technical Notes

Add to `src/lib/` (e.g. `archive.js`), reusing `isValidDateKey` from
`date-key.js`. Lexicographic sort works for `YYYY-MM-DD`. Status decoration
(✓/✗/▢) is applied by the view using the progress store, not here.

## Dependencies

(none)
