---
run: run-game-credits-022
work_item: tighten-page-layout
intent: pastel-layout-refresh
mode: autopilot
checkpoint: none
approved_at:
---

# Implementation Plan: Tighten Page Layout

## Approach

Remove the big title (keep the tagline), move the Archive link to the bottom, and
trim top spacing so the board leads.

## Files to Modify

| File | Changes |
|------|---------|
| `src/components/call-sheet-app.js` | Drop the `<h1>`; keep `.tagline`; move the `.nav` Archive link to the end of `render()`; remove the now-dead `h1` CSS; give `.nav` top margin for bottom placement; trim host top padding |
| `tests/e2e/smoke.spec.js` | Retarget off the removed `Call Sheet` heading to the tagline text |

## Tests

`npm run check`. `archive.spec.js` still finds the Archive link (now at the bottom) —
no change needed there.

## Technical Details

`render()`: remove `<h1>Call Sheet</h1>`; the `.tagline` becomes the top element; the
`.nav` block moves below the board branches. CSS: delete the `h1` rule; change `.nav`
margin from `0 0 1.5rem` to `1.5rem 0 0`; reduce `:host` padding top a touch. The
smoke test currently asserts `getByRole('heading', { name: 'Call Sheet' })` — retarget
to the tagline ("Sort the scrambled cast…").

---
*Autopilot mode — plan recorded; no checkpoint.*
