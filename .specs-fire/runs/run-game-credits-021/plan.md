---
run: run-game-credits-021
work_item: complement-accent-colours
intent: pastel-layout-refresh
mode: autopilot
checkpoint: none
approved_at:
---

# Implementation Plan: Complement Submit and Lives Colours

## Approach

Retune the two clashing accents to complement the pastels: a muted plum for the
Submit/accent, a dusty rose for the lives dots.

## Files to Modify

| File | Changes |
|------|---------|
| `src/styles/global.css` | `--cs-accent: #6b5b95` (muted plum); add `--cs-lives: #d9756e` (dusty rose, constant) |
| `src/components/call-sheet-board.js` | `.life.on` colour → `var(--cs-lives)` (was `--cs-wrong`) |

## Tests

`npm run check`. The dark-mode e2e asserts the submit surface RGB sum < 500; plum
`#6B5B95` = 347, so it still passes.

## Technical Details

Submit, the selected-swap ring, and the Archive nav link already read `--cs-accent`,
so they all move to plum together. White text on `#6B5B95` ≈ 5.6:1 (AA). `--cs-wrong`
stays for the lost banner / error text; only the lives "on" dots move to the dusty
rose, which stays distinct from the error red. Both tokens are constant (not flipped
in dark mode).

---
*Autopilot mode — plan recorded; no checkpoint.*
