/**
 * `localStorage`, with an in-memory fallback when it's unavailable (e.g. private
 * mode). Shared by the game and the archive page so progress is read/written the
 * same way on both.
 *
 * @returns {Pick<Storage, 'getItem' | 'setItem'>}
 */
export function safeStorage() {
  try {
    const probe = '__cs_probe__';
    window.localStorage.setItem(probe, probe);
    window.localStorage.removeItem(probe);
    return window.localStorage;
  } catch {
    const mem = new Map();
    return {
      getItem: (k) => (mem.has(k) ? mem.get(k) : null),
      setItem: (k, v) => mem.set(k, String(v)),
    };
  }
}
