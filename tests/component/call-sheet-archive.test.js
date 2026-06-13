import { describe, it, expect, afterEach } from 'vitest';
import '../../src/components/call-sheet-archive.js';

async function mount(entries) {
  const el = document.createElement('call-sheet-archive');
  el.entries = entries;
  document.body.appendChild(el);
  await el.updateComplete;
  return el;
}

const rows = (el) => [...el.shadowRoot.querySelectorAll('a.row')];

afterEach(() => {
  document.body.innerHTML = '';
});

describe('<call-sheet-archive>', () => {
  it('renders a link row per entry with the formatted date', async () => {
    const el = await mount([
      { id: '2026-06-14', status: null, isToday: true },
      { id: '2026-06-13', status: 'lost', mistakes: 4, isToday: false },
      { id: '2026-06-12', status: 'won', mistakes: 1, isToday: false },
    ]);
    const r = rows(el);
    expect(r).toHaveLength(3);
    expect(r[0].textContent).toContain('Jun 14, 2026');
    expect(r[0].textContent).toContain('today');
  });

  it('links today to the official game and past days to a ?puzzle replay', async () => {
    const el = await mount([
      { id: '2026-06-14', status: null, isToday: true },
      { id: '2026-06-13', status: 'won', mistakes: 0, isToday: false },
    ]);
    const [today, past] = rows(el);
    expect(today.getAttribute('href')).toBe('index.html');
    expect(past.getAttribute('href')).toBe('index.html?puzzle=2026-06-13');
  });

  it('shows status: won (with mistakes), lost, and unplayed', async () => {
    const el = await mount([
      { id: '2026-06-14', status: 'won', mistakes: 1, isToday: false },
      { id: '2026-06-13', status: 'won', mistakes: 0, isToday: false },
      { id: '2026-06-12', status: 'lost', mistakes: 4, isToday: false },
      { id: '2026-06-11', status: null, isToday: false },
    ]);
    const text = rows(el).map((a) => a.textContent);
    expect(text[0]).toContain('solved, 1 mistake');
    expect(text[1]).toContain('solved, 0 mistakes');
    expect(text[2]).toContain('out of lives');
    expect(text[3]).toContain('play');
  });

  it('renders an empty state when there are no entries', async () => {
    const el = await mount([]);
    expect(rows(el)).toHaveLength(0);
    expect(el.shadowRoot.textContent).toContain('No puzzles available');
  });
});
