import { describe, it, expect } from 'vitest';
import { selectCluster } from '../../src/lib/theme-select.js';

const CLUSTERS = [
  { id: 'nolan', theme: 'Christopher Nolan' },
  { id: 'wes-anderson', theme: 'Wes Anderson' },
  { id: 'tarantino', theme: 'Quentin Tarantino' },
];

describe('selectCluster', () => {
  it('returns null when there are no clusters', () => {
    expect(selectCluster([], { seed: 1 })).toBe(null);
    expect(selectCluster(undefined, { seed: 1 })).toBe(null);
  });

  it('honours an explicit themeId', () => {
    expect(selectCluster(CLUSTERS, { themeId: 'tarantino' }).id).toBe(
      'tarantino'
    );
  });

  it('throws on an unknown themeId', () => {
    expect(() => selectCluster(CLUSTERS, { themeId: 'nope' })).toThrow(
      /Unknown theme/
    );
  });

  it('picks deterministically from the seed', () => {
    // seed % 3 → index; same seed → same cluster every time.
    expect(selectCluster(CLUSTERS, { seed: 0 }).id).toBe('nolan');
    expect(selectCluster(CLUSTERS, { seed: 1 }).id).toBe('wes-anderson');
    expect(selectCluster(CLUSTERS, { seed: 5 }).id).toBe(
      selectCluster(CLUSTERS, { seed: 5 }).id
    );
  });

  it('skips avoided themes in the seeded rotation', () => {
    // seed 0 would pick nolan; avoiding it advances to the next.
    expect(selectCluster(CLUSTERS, { seed: 0, avoid: ['nolan'] }).id).toBe(
      'wes-anderson'
    );
    expect(
      selectCluster(CLUSTERS, { seed: 0, avoid: ['nolan', 'wes-anderson'] }).id
    ).toBe('tarantino');
  });

  it('falls back to the seeded pick when everything is avoided', () => {
    const all = CLUSTERS.map((c) => c.id);
    expect(selectCluster(CLUSTERS, { seed: 1, avoid: all }).id).toBe(
      'wes-anderson'
    );
  });
});
