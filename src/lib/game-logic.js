/**
 * Pure, framework-free Call Sheet game rules.
 *
 * An *assignment* maps actor id → the film id the player put them in:
 * `{ [actorId]: filmId }`. The *answer key* has the same shape but holds the
 * correct film for each actor. Nothing here touches the DOM, network, or storage
 * so it is exhaustively unit-testable and reused by the board and share grid.
 */

/**
 * Build the answer key from a validated puzzle, preserving actor order (which
 * the share grid relies on).
 *
 * @param {import('./puzzle-schema.js').Puzzle} puzzle
 * @returns {Record<string, string>} actorId → correct filmId
 */
export function buildAnswerKey(puzzle) {
  /** @type {Record<string, string>} */
  const key = {};
  for (const actor of puzzle.actors) {
    key[actor.id] = actor.filmId;
  }
  return key;
}

/**
 * Is every actor in the answer key assigned to some film?
 *
 * @param {Record<string, string>} assignment
 * @param {Record<string, string>} answerKey
 * @returns {boolean}
 */
export function isComplete(assignment, answerKey) {
  return Object.keys(answerKey).every(
    (actorId) =>
      assignment[actorId] !== undefined && assignment[actorId] !== null
  );
}

/**
 * @typedef {Object} ActorResult
 * @property {string} actorId
 * @property {string|null} assignedFilmId Film the player chose (null if unassigned).
 * @property {string} correctFilmId
 * @property {boolean} correct
 *
 * @typedef {Object} GradeResult
 * @property {number} total    Number of actors graded.
 * @property {number} correct  Correctly assigned actors.
 * @property {number} wrong    Misassigned (or unassigned) actors.
 * @property {boolean} solved  True when `wrong === 0`.
 * @property {boolean} lost    True when `wrong > maxMistakes`.
 * @property {ActorResult[]} results Per-actor breakdown, in answer-key order.
 */

/**
 * Grade a submission against the answer key.
 *
 * One submission is evaluated as a whole: zero wrong is a win; more than
 * `maxMistakes` wrong is a loss; anything in between is neither (the board may
 * let the player keep adjusting within budget). An unassigned actor counts as
 * wrong. Keys in `assignment` that aren't in the answer key are ignored.
 *
 * @param {Record<string, string>} assignment actorId → chosen filmId
 * @param {Record<string, string>} answerKey   actorId → correct filmId
 * @param {number} maxMistakes Allowed wrong assignments before a loss.
 * @returns {GradeResult}
 */
export function gradeSubmission(assignment, answerKey, maxMistakes) {
  const safeAssignment = assignment || {};
  /** @type {ActorResult[]} */
  const results = [];
  let correct = 0;

  for (const [actorId, correctFilmId] of Object.entries(answerKey)) {
    const raw = safeAssignment[actorId];
    const assignedFilmId = raw === undefined || raw === null ? null : raw;
    const isCorrect = assignedFilmId === correctFilmId;
    if (isCorrect) correct += 1;
    results.push({
      actorId,
      assignedFilmId,
      correctFilmId,
      correct: isCorrect,
    });
  }

  const total = results.length;
  const wrong = total - correct;

  return {
    total,
    correct,
    wrong,
    solved: wrong === 0,
    lost: wrong > maxMistakes,
    results,
  };
}
