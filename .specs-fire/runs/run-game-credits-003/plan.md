---
run: run-game-credits-003
scope: wide
work_items: [multi-film-schema, multi-film-board, multi-film-result-share]
intent: call-sheet
---

# Implementation Plan: Call Sheet v2 — 4-film crossover (run-game-credits-003)

Wide run, 3 items in dependency order. `multi-film-board` (confirm) pauses for
approval. Sections appended as each item is reached.

---

## Work Item: multi-film-schema

### Approach

Generalise the schema/loader from exactly-2-films to **N films** (≥2; expected 4),
add **group-balance** validation and optional **`alsoIn`** overlap metadata, and
hand-author a 4×4 fixture with a verified **unique** solution. `actors[].filmId`
stays the single answer, so `buildAnswerKey`/`gradeSubmission` are untouched.

### Files to Modify

| File | Changes |
|------|---------|
| `src/lib/puzzle-schema.js` | `FILMS_PER_PUZZLE` → `MIN_FILMS_PER_PUZZLE = 2`; add `alsoIn` to typedefs |
| `src/lib/puzzle-loader.js` | Allow ≥2 films; validate group balance (each film = `actors/films` solution actors); validate optional `alsoIn` (refs declared films, ≠ solution, no dups) |
| `docs/puzzle-schema.md` | Document N films, group balance, `alsoIn`, uniqueness expectation |

### Files to Create

| File | Purpose |
|------|---------|
| `public/puzzles/2026-06-13.json` | 4-film / 16-actor fixture with real crossovers and a unique solution |
| `tests/unit/multi-film-schema.test.js` | N-film valid, group-balance rejection, `alsoIn` validation, fixture validates + is balanced |

### Fixture design (unique-solution, verified)

Films: Ocean's Eleven (A), The Departed (B), Inception (C), Once Upon a Time in
Hollywood (D). Single-film "anchor" actors fill C and D completely and B to 3/4;
crossovers Pitt {A,alsoIn D}, Damon {A,alsoIn B}, DiCaprio {B,alsoIn C,D} are
forced to their solution by capacity (C,D full; B's last slot taken by DiCaprio →
Damon→A; Pitt→A). Exactly one valid partition. Verified by counting capacity-
respecting perfect matchings before commit.

### Validation rules (additions)

- `films.length >= 2`
- `actors.length % films.length === 0`; each film is the solution for exactly `groupSize = actors.length / films.length` actors
- `alsoIn` (optional): array of declared film ids, none equal to the actor's `filmId`, no duplicates

### Backward compatibility

v1 fixtures (`2026-06-12.json` 2×4, `sample-puzzle.json` 2×2) remain valid under
the generalised rules; existing loader tests keep passing.

---

## Work Item: multi-film-board  *(confirm — checkpoint)*

### Approach — hidden-films group puzzle (confirmed with user)

The films' **titles are hidden** during play. The board shows **4 colour-coded
buckets** (unnamed) and 16 actor chips. The player arranges all 16 into the four
buckets (4 each); a bucket is correct when its four actors **share a film** —
graded by *membership/partition*, not by which bucket index it's in. Solving a
group reveals that film's title on the locked row; a wrong submit costs a life; a
near-miss shows **"One away…"**; all titles reveal on a loss.

**Interaction — colour brush:** four bucket selectors (Group 1–4, coloured) with
counts; one is active. Tap an actor → drop it in the active bucket; pick another
bucket and tap to move it. Submit enabled when all 16 are placed (4 each).

**Loop:**
1. Arrange 16 actors into the 4 buckets (4 per bucket).
2. Submit. For each bucket: if its 4 actors share a film → **correct** (reveal
   that film's title, lock the row); else stays editable.
3. Any imperfect submit costs one of 4 lives; show "One away…" for a bucket with
   exactly 3 of one film.
4. Win when all four groups solved; lose at 0 lives → reveal every film + grouping.

This is graded on the *partition*, so the model needs a new pure helper rather
than the v1 per-label `gradeSubmission` (which stays for the v1 2-film board).

### New pure logic (`src/lib/group-logic.js`)

- `gradeGroups(buckets, answerKey, groupSize)` → per bucket
  `{ filmId|null, correct, oneAway, counts }`, where `correct` = all `groupSize`
  members share one solution film; `oneAway` = exactly `groupSize-1` share the
  modal film. Plus `solvedFilmIds`, `allSolved`.

### Files to Modify

| File | Changes |
|------|---------|
| `src/components/call-sheet-board.js` | Rework to the hidden-films bucket/brush model; reveal+lock solved groups; lives; "One away"; reveal-all on loss |
| `src/components/call-sheet-actor.js` | Simplify to a selectable chip: name + bucket colour + locked/solved state |
| `src/components/call-sheet-app.js` | Default to the 4-film puzzle (`2026-06-13`) to showcase v2 |
| `tests/e2e/play.spec.js` | Play the 4-film hidden-films puzzle to a win via the new UI |

### Files to Create

| File | Purpose |
|------|---------|
| `src/lib/group-logic.js` | `gradeGroups` partition grader (+ one-away) |
| `tests/unit/group-logic.test.js` | Exhaustive grading/one-away/boundary tests |
| `tests/component/call-sheet-board-v2.test.js` | Bucket assignment, submit, solve+reveal, one-away, loss |

### Notes

- v1 `call-sheet-board.test.js` (2-film toggle) is superseded by the new board.
  It will be removed/replaced; v1 `gradeSubmission` + its unit tests stay.
- Films revealed only on solve/loss (per user); buckets are colour/number only
  during play. `alsoIn` stays silent (the trap is player knowledge).

---
*Plan recorded. `game-board-ui` is confirm — awaiting approval before implementation.*

---

## Work Item: multi-film-result-share

### Approach

Make the result view and share grid reflect the 4-group outcome. The board's
`game-over` already carries `groupsSolved` / `totalGroups`. Add a group-aware,
spoiler-free share generator and surface "groups solved" in the result.

- `src/lib/share-grid.js` — add `generateGroupShareText({ id, status,
  groupsSolved, totalGroups, mistakes, maxMistakes })` → e.g.
  `Call Sheet 2026-06-13\nSolved 4/4 with 0 mistakes ✅\n🟩🟩🟩🟩`. (v1
  `generateShareText` retained.)
- `<call-sheet-result>` — show "g/t groups" + use the group share text.
- `<call-sheet-app>` — pass `groupsSolved`/`totalGroups` through.

### Files to Modify

| File | Changes |
|------|---------|
| `src/lib/share-grid.js` | Add `generateGroupShareText` (spoiler-free, group pips) |
| `src/components/call-sheet-result.js` | Group-aware result + share |
| `src/components/call-sheet-app.js` | Pass group counts to the result |
| `tests/component/call-sheet-result.test.js` | Update to the v2 share text |
| `tests/e2e/play.spec.js` | Assert the v2 win share text |

### Files to Create

| File | Purpose |
|------|---------|
| `tests/unit/share-grid-v2.test.js` | `generateGroupShareText` win/lose, spoiler-free, pips |

---
*Plan recorded (autopilot — no checkpoint). Execution follows.*
