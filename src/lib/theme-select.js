/**
 * Pure theme-cluster selection for the build-time generator.
 *
 * Picks one themed cluster for a puzzle: an explicit `themeId` wins; otherwise a
 * deterministic seeded rotation, skipping any recently-used themes in `avoid` so
 * a batch can avoid repeating a theme on consecutive days.
 */

/**
 * @param {{id:string,theme:string}[]} clusters
 * @param {Object} [opts]
 * @param {string} [opts.themeId]      Force this cluster id.
 * @param {number} [opts.seed=0]       Deterministic seed (e.g. from the date).
 * @param {string[]} [opts.avoid=[]]   Theme ids to skip if possible.
 * @returns {object|null} The chosen cluster, or null when there are none.
 * @throws {Error} when `themeId` is given but unknown.
 */
export function selectCluster(
  clusters,
  { themeId, seed = 0, avoid = [] } = {}
) {
  if (!Array.isArray(clusters) || clusters.length === 0) return null;

  if (themeId) {
    const found = clusters.find((c) => c.id === themeId);
    if (!found) {
      throw new Error(
        `Unknown theme "${themeId}". Known: ${clusters.map((c) => c.id).join(', ')}`
      );
    }
    return found;
  }

  const n = clusters.length;
  const start = ((Math.trunc(seed) % n) + n) % n;
  const avoidSet = new Set(avoid);
  for (let i = 0; i < n; i++) {
    const c = clusters[(start + i) % n];
    if (!avoidSet.has(c.id)) return c;
  }
  return clusters[start];
}
