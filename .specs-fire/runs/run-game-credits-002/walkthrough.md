---
run: run-game-credits-002
work_items: [puzzle-schema-and-loader, game-logic-lib, game-board-ui, result-and-share]
intent: call-sheet
generated: 2026-06-12T09:27:00Z
mode: wide (autopilot ×3 + confirm ×1)
---

# Implementation Walkthrough: Finish the MVP

## Summary

Built the complete Call Sheet MVP in one wide run: a playable daily puzzle that
loads a validated puzzle, lets the player sort a scrambled ensemble cast into two
films, grades the submission with a Connections-style lives loop, and produces a
spoiler-free shareable result. All logic is pure and in `src/lib`; the UI is thin
Lit Web Components. 63 unit/component tests + 2 e2e, `src/lib` at 99% coverage.

## Structure Overview

```
src/
├── lib/                      # pure, framework-free (100%/99% covered)
│   ├── puzzle-schema.js      # typedefs + constants (DEFAULT_MAX_MISTAKES)
│   ├── puzzle-loader.js      # validatePuzzle + loadPuzzle + PuzzleValidationError
│   ├── game-logic.js         # buildAnswerKey, gradeSubmission, isComplete
│   ├── shuffle.js            # Fisher–Yates + seedable PRNG
│   └── share-grid.js         # spoiler-free share text
└── components/               # thin Lit views
    ├── call-sheet-app.js     # loads puzzle, wires game-over → result
    ├── call-sheet-board.js   # board: assign / submit / lives / win-lose
    ├── call-sheet-actor.js   # actor chip with Film A/B toggle
    └── call-sheet-result.js  # result view + copy-to-clipboard share
public/puzzles/2026-06-12.json # fixture puzzle
docs/puzzle-schema.md          # schema contract
```

## Architecture

### Pattern

Pure logic + thin view. Every rule (validation, grading, lives, share text) is a
deterministic `src/lib` function; components only render and dispatch events.
Data flows: `loadPuzzle` → `<call-sheet-board>` (assign → `gradeSubmission`) →
`game-over` event → `<call-sheet-result>` (`generateShareText`).

### Data flow

```
app.connectedCallback → loadPuzzle('2026-06-12') → validated Puzzle
  → <call-sheet-board .puzzle>
       actor toggle → actor-assign → assignment map
       Submit → gradeSubmission(assignment, answerKey, maxMistakes)
              → lock correct; win (all locked) or spend a life; lose at 0
              → game-over { status, mistakes, maxMistakes, result }
  → <call-sheet-result> → generateShareText → clipboard
```

## Files Changed

### Created (18)

| File | Purpose |
|------|---------|
| `src/lib/puzzle-schema.js` | Puzzle typedefs + constants |
| `src/lib/puzzle-loader.js` | Validate + fetch puzzles; descriptive errors |
| `src/lib/game-logic.js` | Answer key, grading, completeness |
| `src/lib/shuffle.js` | Pure shuffle + seedable PRNG |
| `src/lib/share-grid.js` | Spoiler-free share text |
| `src/components/call-sheet-board.js` | Playable board |
| `src/components/call-sheet-actor.js` | Actor chip (Film A/B toggle) |
| `src/components/call-sheet-result.js` | Result + share/clipboard |
| `public/puzzles/2026-06-12.json` | Fixture puzzle |
| `docs/puzzle-schema.md` | Schema docs |
| `tests/fixtures/sample-puzzle.json` | Test fixture |
| `tests/unit/puzzle-loader.test.js` | Loader/validation tests |
| `tests/unit/game-logic.test.js` | Grading/boundary tests |
| `tests/unit/shuffle.test.js` | Shuffle tests |
| `tests/unit/share-grid.test.js` | Share-text tests |
| `tests/component/call-sheet-board.test.js` | Board interaction tests |
| `tests/component/call-sheet-result.test.js` | Result + clipboard tests |
| `tests/e2e/play.spec.js` | Full play-through to a win |

### Modified (2)

| File | Changes |
|------|---------|
| `src/components/call-sheet-app.js` | Load puzzle; render board; wire `game-over` → result; loading/error states |
| `vite.config.js` | Vitest `include` now covers `tests/component/` |

## Key Implementation Details

### 1. The answer ships in the client (by design)

No backend means the answer key is in the puzzle JSON. The loader returns it; the
board shuffles display order and reveals correctness only on submit. Documented
in `docs/puzzle-schema.md`.

### 2. Lives loop composed from pure primitives

`gradeSubmission` returns per-actor correctness; the board composes the
Connections-style loop on top — lock correct actors, spend one of `maxMistakes`
lives per imperfect submit, reveal answers at zero. This kept the rules unit-test-
exhaustive while the loop stays in the (e2e/component-tested) view.

### 3. Spoiler-free sharing

`generateShareText` emits only `Call Sheet <id>`, an outcome line, and lives-used
pips (🟥/🟩) — a test asserts it contains no actor/film identifiers.

## Decisions Made

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Interaction model | Per-actor Film A/B toggle | Discoverable, touch-friendly (approved at checkpoint) |
| Game loop | Submit → lock correct → 4 lives → reveal | Maps "limited guesses" onto sorting (approved) |
| Answer-key coupling | `buildAnswerKey(puzzle)` helper | Decouples grading from puzzle shape |
| Share format | Outcome + lives pips, 3 lines | Recognizable, spoiler-free, paste-friendly |

## Deviations from Plan

Tightened one e2e assertion: `/solved/i` matched both the board banner and the
result heading (strict-mode violation), so the play-through now asserts the
unique share-grid text instead. No behavioral change.

## Dependencies Added

| Package | Why Needed |
|---------|------------|
| (none) | All built on the existing scaffold deps |

## How to Verify

1. **Play it**
   ```bash
   npm run dev
   ```
   Open http://localhost:5173 — sort the 8 actors into the two films, Submit,
   and you'll get win/lose plus a "Copy result" share grid.

2. **Unit + component tests with coverage**
   ```bash
   npm run test:coverage
   ```
   Expected: 63 passing; `src/lib` ~99%.

3. **End-to-end**
   ```bash
   npm run test:e2e
   ```
   Expected: 2 passing (smoke + full play-through to a win).

4. **Build**
   ```bash
   npm run build
   ```
   Expected: static `dist/` (JS ~9.9 kB gzip).

## Test Coverage

- Tests added: 65 (63 unit/component + 2 e2e)
- `src/lib/` coverage: 99.02% stmts / 96.1% branch / 100% funcs
- Status: passing

## Ready for Review

- [x] All acceptance criteria met (4 work items)
- [x] Tests passing
- [x] No critical issues
- [x] Documentation updated (schema docs)
- [x] Developer notes captured

## Developer Notes

The board's lives loop is intentionally separate from `gradeSubmission` (which is
a stateless evaluator). When `daily-puzzle-rotation` (#6) lands, replace the
hardcoded `DEFAULT_PUZZLE_ID` in `call-sheet-app.js` with date resolution and add
more `public/puzzles/<date>.json` files. `streak-tracking` (#7) can consume the
`game-over` event detail (`status`, `mistakes`) and append streak info to the
share text via the existing `generateShareText` composition point.
