---
id: tighten-page-layout
title: Tighten Page Layout
intent: pastel-layout-refresh
complexity: low
mode: autopilot
status: completed
depends_on: []
created: 2026-06-14T04:10:00Z
run_id: run-game-credits-022
completed_at: 2026-06-14T06:44:22.709Z
---

# Work Item: Tighten Page Layout

## Description

Trim the page chrome: remove the big "Call Sheet" title (keep the tagline) and move
the Archive link to the bottom of the page.

## Acceptance Criteria

- [ ] The `<h1>Call Sheet</h1>` title is removed
- [ ] The tagline ("Sort the scrambled cast back into their films.") is kept, leading
      the page
- [ ] The Archive link (`archive.html`) moves to the **bottom**, below the board
- [ ] Spacing tightened so the board leads; loading/error/practice states unaffected
- [ ] Suite + e2e green (the smoke test asserts the "Call Sheet" heading — update it
      to the new top element, e.g. the tagline)

## Technical Notes

`src/components/call-sheet-app.js` `render()`: drop the `<h1>`; keep `.tagline`; move
the `.nav` Archive link to render after the board blocks. `tests/e2e/smoke.spec.js`
currently asserts `getByRole('heading', { name: 'Call Sheet' })` — retarget it to the
tagline text (or the archive link) since the heading is gone. Keep `<title>` /
document head untouched.

## Dependencies

(none)
