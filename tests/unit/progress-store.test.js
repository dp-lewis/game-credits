import { describe, it, expect } from 'vitest';
import { createProgressStore } from '../../src/lib/progress-store.js';

function fakeStorage(seed) {
  const m = new Map(seed ? Object.entries(seed) : []);
  return {
    getItem: (k) => (m.has(k) ? m.get(k) : null),
    setItem: (k, v) => m.set(k, String(v)),
  };
}

const won = (over = {}) => ({
  status: 'won',
  mistakes: 0,
  groupsSolved: 3,
  totalGroups: 3,
  ...over,
});
const lost = () => ({
  status: 'lost',
  mistakes: 4,
  groupsSolved: 1,
  totalGroups: 3,
});

describe('createProgressStore', () => {
  it('starts empty', () => {
    const store = createProgressStore(fakeStorage());
    expect(store.getStreaks()).toEqual({ current: 0, longest: 0 });
    expect(store.getDay('2026-06-13')).toBeNull();
  });

  it('records a win and stores the day', () => {
    const store = createProgressStore(fakeStorage());
    const res = store.recordResult('2026-06-13', won());
    expect(res).toMatchObject({ current: 1, longest: 1 });
    expect(store.getDay('2026-06-13')).toMatchObject({ status: 'won' });
  });

  it('increments the streak on consecutive winning days', () => {
    const store = createProgressStore(fakeStorage());
    store.recordResult('2026-06-13', won());
    const res = store.recordResult('2026-06-14', won());
    expect(res).toMatchObject({ current: 2, longest: 2 });
  });

  it('resets the streak on a gap but keeps longest', () => {
    const store = createProgressStore(fakeStorage());
    store.recordResult('2026-06-13', won());
    store.recordResult('2026-06-14', won()); // current 2
    const res = store.recordResult('2026-06-16', won()); // skipped 06-15
    expect(res.current).toBe(1);
    expect(res.longest).toBe(2);
  });

  it('resets the streak to 0 on a loss', () => {
    const store = createProgressStore(fakeStorage());
    store.recordResult('2026-06-13', won());
    const res = store.recordResult('2026-06-14', lost());
    expect(res.current).toBe(0);
    expect(store.getDay('2026-06-14')).toMatchObject({ status: 'lost' });
  });

  it('starts a fresh streak after a loss', () => {
    const store = createProgressStore(fakeStorage());
    store.recordResult('2026-06-13', won());
    store.recordResult('2026-06-14', lost());
    const res = store.recordResult('2026-06-15', won());
    expect(res.current).toBe(1);
  });

  it('does not double-count the same day', () => {
    const store = createProgressStore(fakeStorage());
    store.recordResult('2026-06-13', won());
    const again = store.recordResult('2026-06-13', won());
    expect(again.current).toBe(1);
    expect(store.getStreaks().current).toBe(1);
  });

  it('persists across store instances on the same storage', () => {
    const storage = fakeStorage();
    createProgressStore(storage).recordResult('2026-06-13', won());
    const reopened = createProgressStore(storage);
    expect(reopened.getDay('2026-06-13')).toMatchObject({ status: 'won' });
    expect(reopened.getStreaks().current).toBe(1);
  });

  it('recovers from malformed stored data', () => {
    const store = createProgressStore(
      fakeStorage({ 'call-sheet:progress:v1': 'not json{' })
    );
    expect(store.getStreaks()).toEqual({ current: 0, longest: 0 });
    expect(() => store.recordResult('2026-06-13', won())).not.toThrow();
  });

  describe('practice mode (updateStreak)', () => {
    it('records a practice win as a played day without touching the streak', () => {
      const store = createProgressStore(fakeStorage());
      const res = store.recordResult('2026-06-01', won(), {
        updateStreak: false,
      });
      expect(res).toMatchObject({ current: 0, longest: 0 });
      expect(store.getDay('2026-06-01')).toMatchObject({ status: 'won' });
      expect(store.getStreaks()).toEqual({ current: 0, longest: 0 });
    });

    it('leaves an existing streak untouched on a practice play', () => {
      const store = createProgressStore(fakeStorage());
      store.recordResult('2026-06-13', won()); // streak 1
      store.recordResult('2026-06-14', won()); // streak 2
      const res = store.recordResult('2026-05-01', won(), {
        updateStreak: false,
      });
      expect(res).toMatchObject({ current: 2, longest: 2 });
      expect(store.getDay('2026-05-01')).toMatchObject({ status: 'won' });
    });

    it('a practice loss does not break the streak', () => {
      const store = createProgressStore(fakeStorage());
      store.recordResult('2026-06-14', won()); // streak 1
      store.recordResult('2026-05-02', lost(), { updateStreak: false });
      expect(store.getStreaks()).toEqual({ current: 1, longest: 1 });
    });

    it('is replay-safe: re-recording a day never overwrites or re-streaks it', () => {
      const store = createProgressStore(fakeStorage());
      store.recordResult('2026-06-14', won()); // recorded + streak 1
      const replay = store.recordResult('2026-06-14', lost(), {
        updateStreak: false,
      });
      expect(replay.day).toMatchObject({ status: 'won' }); // original kept
      expect(store.getStreaks()).toEqual({ current: 1, longest: 1 });
    });

    it('defaults to updating the streak (backward compatible)', () => {
      const store = createProgressStore(fakeStorage());
      expect(store.recordResult('2026-06-14', won()).current).toBe(1);
    });
  });
});
