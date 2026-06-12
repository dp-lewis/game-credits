---
run: run-game-credits-002
scope: wide
work_items: [puzzle-schema-and-loader, game-logic-lib, game-board-ui, result-and-share]
intent: call-sheet
---

# Implementation Plan: Finish the MVP (run-game-credits-002)

Wide run, 4 items executed sequentially in dependency order. Item sections are
appended as each item is reached. `game-board-ui` (confirm) pauses for approval.

---

## Work Item: puzzle-schema-and-loader

### Approach

Define the canonical puzzle JSON schema (the contract between the future TMDB
pipeline and the client), hand-author one fixture puzzle so the game is playable
now, and build a pure validating loader. The loader is the only thing that reads
puzzle files; everything downstream trusts its validated output.

**Schema shape** (one puzzle = two films + a scrambled, single-film-each cast):

```jsonc
{
  "id": "2026-06-12",          // puzzle/date key
  "date": "2026-06-12",        // ISO date (optional alias of id)
  "maxMistakes": 4,            // optional; defaults to 4
  "films": [                   // EXACTLY two
    { "id": "film-a", "title": "Ocean's Eleven", "year": 2001 },
    { "id": "film-b", "title": "The Devil Wears Prada", "year": 2006 }
  ],
  "actors": [                  // each belongs to exactly ONE film (the answer)
    { "id": "a1", "name": "George Clooney", "filmId": "film-a" }
    // ...
  ]
}
```

The answer key lives in `actors[].filmId` (inherent to a no-backend game — like
Wordle's word being client-side). The board shuffles display order and hides
correctness until grading.

### Files to Create

| File | Purpose |
|------|---------|
| `src/lib/puzzle-schema.js` | JSDoc typedefs + constants (`DEFAULT_MAX_MISTAKES`) |
| `src/lib/puzzle-loader.js` | `validatePuzzle()`, `loadPuzzle()`, `PuzzleValidationError` |
| `public/puzzles/2026-06-12.json` | Hand-made fixture puzzle (2 films / 8 actors) |
| `tests/fixtures/sample-puzzle.json` | Deterministic fixture for tests |
| `tests/unit/puzzle-loader.test.js` | Validation + load tests |
| `docs/puzzle-schema.md` | Schema documentation (target for TMDB pipeline) |

### Files to Modify

| File | Changes |
|------|---------|
| (none) | |

### Tests

| Test File | Coverage |
|-----------|----------|
| `tests/unit/puzzle-loader.test.js` | valid load; missing/empty fields; wrong film count; bad filmId ref; duplicate ids; maxMistakes default; fetch path |

### Validation rules

- top-level object; `films` array length **exactly 2**, unique ids, non-empty titles
- `actors` non-empty; each has `id`, `name`, `filmId`; `filmId` must reference one of the two films; actor ids unique
- `maxMistakes` positive integer when present, else default 4
- descriptive `PuzzleValidationError` on any violation

---

## Work Item: game-logic-lib

### Approach

Pure, framework-free game rules in `src/lib/game-logic.js`. Decoupled from the
puzzle shape via a small answer-key helper, so the board and share-grid consume
plain primitives:

- `buildAnswerKey(puzzle)` → `{ [actorId]: filmId }`, preserving actor order.
- `gradeSubmission(assignment, answerKey, maxMistakes)` → `{ total, correct,
  wrong, solved, lost, results[] }`. `solved = wrong === 0`; `lost = wrong >
  maxMistakes`. `results[]` is per-actor `{ actorId, assignedFilmId,
  correctFilmId, correct }` in answer-key order (feeds the share grid).
- `isComplete(assignment, answerKey)` → every actor assigned (board enables submit).

**Mistake-budget semantics**: one submission is evaluated as a whole. Zero wrong
→ win; more than `maxMistakes` wrong → loss; in between is neither (the board may
let the player adjust within budget — exact loop confirmed in `game-board-ui`).

### Files to Create

| File | Purpose |
|------|---------|
| `src/lib/game-logic.js` | `buildAnswerKey`, `gradeSubmission`, `isComplete` |
| `tests/unit/game-logic.test.js` | Exhaustive grading/boundary tests |

### Tests

| Test File | Coverage |
|-----------|----------|
| `tests/unit/game-logic.test.js` | all-correct (win), all-wrong, exactly-at-limit vs over-limit (loss boundary), unassigned actors, extra keys ignored, per-actor results, isComplete |

---

## Work Item: game-board-ui  *(confirm — checkpoint)*

### Approach

The core playable experience as Lit Web Components, wiring the loader (#1) and
game logic (#2) into a sort → submit loop. Mobile-first.

**Interaction model (recommended): per-actor segmented toggle.**
Each actor is a chip with two film buttons (Film A | Film B); tap to assign or
reassign. A two-film toggle is more discoverable and accessible on touch than
drag-and-drop or a hidden tap-cycle. Films are colour-coded in a legend header.

**Game loop (recommended): submit, lock correct, limited lives.**
1. Assign every actor (Submit disabled until `isComplete`).
2. On Submit, grade via `gradeSubmission`: correctly-placed actors **lock**
   (green, immovable); misplaced actors are flagged and stay editable.
3. All locked → **win**. Otherwise a wrong submit costs one life; `maxMistakes`
   (4) lives shown as dots. Run out of lives → **loss**, reveal the answers.
   (Lives are submit-level, tracked in the component; `gradeSubmission` supplies
   per-actor correctness for locking.)

### Files to Create

| File | Purpose |
|------|---------|
| `src/components/call-sheet-board.js` | Board: legend, actor list, lives indicator, submit, status banner |
| `src/components/call-sheet-actor.js` | Single actor chip with Film A/B segmented control + state styling |
| `src/lib/shuffle.js` | Small pure Fisher–Yates shuffle (seedable) for display order |
| `tests/component/call-sheet-board.test.js` | happy-dom: assign→submit→win, and wrong-submits→loss |
| `tests/e2e/play.spec.js` | Real play-through of `2026-06-12`: assign correctly → win |

### Files to Modify

| File | Changes |
|------|---------|
| `src/components/call-sheet-app.js` | Load today's puzzle via `loadPuzzle`, render `<call-sheet-board>`, handle loading/error states |

### Tests

| Test File | Coverage |
|-----------|----------|
| `tests/component/call-sheet-board.test.js` | win path, loss path (lives exhausted), submit-gating, locking |
| `tests/e2e/play.spec.js` | full sort-and-submit play-through in chromium |
| `tests/unit/shuffle.test.js` | shuffle keeps members, seed is deterministic |

### Key decisions for your approval

1. **Interaction**: per-actor A/B segmented toggle (vs drag-and-drop).
2. **Loop**: submit → lock-correct → 4 lives → reveal on loss (vs one-shot grade).

---

## Work Item: result-and-share

### Approach

Close the loop: when the board emits `game-over`, the app shows a result view
with a spoiler-free, copyable emoji grid. The grid encodes only the mistake
count (lives used) — never which actor went where.

- `src/lib/share-grid.js` — pure `generateShareText({ id, status, mistakes,
  maxMistakes })` → e.g. `Call Sheet 2026-06-12\nSolved with 1 mistake ✅\n🟥🟩🟩🟩`.
- `<call-sheet-result>` — renders win/lose heading, the share preview, and a
  "Copy result" button (clipboard with graceful fallback + "Copied!" feedback).
- `<call-sheet-app>` listens for `game-over` and renders the result.

### Files to Create

| File | Purpose |
|------|---------|
| `src/lib/share-grid.js` | Pure spoiler-free share-text generator |
| `src/components/call-sheet-result.js` | Result view + copy-to-clipboard |
| `tests/unit/share-grid.test.js` | Win/lose generation, spoiler-free assertions |
| `tests/component/call-sheet-result.test.js` | Renders share text; copy uses clipboard |

### Files to Modify

| File | Changes |
|------|---------|
| `src/components/call-sheet-app.js` | Listen for `game-over`, render `<call-sheet-result>` |
| `tests/e2e/play.spec.js` | After win, assert the result view + Copy button appear |

---
*Plan recorded (autopilot — no checkpoint). Execution follows.*
