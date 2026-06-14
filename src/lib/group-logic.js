/**
 * Pure grading for the hidden-films group puzzle (v2).
 *
 * The player arranges actors into buckets (groups). A bucket is graded by
 * *membership*: it is correct when its `groupSize` members all share one solution
 * film — regardless of which bucket index it is. Films are never named here; the
 * caller reveals titles for solved groups. No DOM/state.
 */

/**
 * @typedef {Object} GroupResult
 * @property {string[]} actorIds  The bucket's members.
 * @property {string|null} filmId The shared solution film when correct, else null.
 * @property {boolean} correct    True when all `groupSize` members share a film.
 * @property {boolean} oneAway    True on a near-miss (exactly `groupSize-1` share the modal film).
 * @property {number} correctCount How many members share the bucket's modal film (its progress toward a group).
 *
 * @typedef {Object} GroupsGrade
 * @property {GroupResult[]} groups Per-bucket results, in input order.
 * @property {boolean} allSolved    True when every bucket is correct.
 */

/**
 * Grade the player's buckets against the answer key.
 *
 * @param {string[][]} buckets  Array of buckets, each a list of actor ids.
 * @param {Record<string,string>} answerKey actorId → solution filmId.
 * @param {number} groupSize    Required members per correct group.
 * @returns {GroupsGrade}
 */
export function gradeGroups(buckets, answerKey, groupSize) {
  const groups = buckets.map((actorIds) => {
    const counts = {};
    for (const id of actorIds) {
      const film = answerKey[id];
      counts[film] = (counts[film] || 0) + 1;
    }

    let modalFilm = null;
    let modalCount = 0;
    for (const [film, count] of Object.entries(counts)) {
      if (count > modalCount) {
        modalCount = count;
        modalFilm = film;
      }
    }

    const full = actorIds.length === groupSize;
    const correct = full && Object.keys(counts).length === 1;
    const oneAway = full && !correct && modalCount === groupSize - 1;

    return {
      actorIds: [...actorIds],
      filmId: correct ? modalFilm : null,
      correct,
      oneAway,
      correctCount: modalCount,
    };
  });

  return {
    groups,
    allSolved: groups.length > 0 && groups.every((g) => g.correct),
  };
}
