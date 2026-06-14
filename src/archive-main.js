// Entry for archive.html. Assembles the puzzle index — manifest dates <= today,
// newest first, decorated with each day's recorded status and theme — and hands
// it to the archive component to render as links. Also computes a locked tomorrow
// teaser (date + theme, not playable) from the theme index.
import { loadManifest } from './lib/puzzle-loader.js';
import { todayKey } from './lib/date-key.js';
import {
  listArchivePuzzles,
  enrichWithThemes,
  tomorrowEntry,
} from './lib/archive.js';
import { createProgressStore } from './lib/progress-store.js';
import { safeStorage } from './lib/safe-storage.js';
import './components/call-sheet-archive.js';

async function main() {
  const el = document.querySelector('call-sheet-archive');
  const store = createProgressStore(safeStorage());
  const today = todayKey();

  let entries = [];
  let preview = null;
  try {
    const [ids, indexEntries] = await Promise.all([
      loadManifest().then((manifest) => listArchivePuzzles(manifest, today)),
      fetch('puzzles/index.json')
        .then((r) => r.json())
        .catch(() => []),
    ]);

    const themed = enrichWithThemes(ids, indexEntries);
    entries = themed.map(({ id, theme }) => {
      const day = store.getDay(id);
      return {
        id,
        theme,
        status: day ? day.status : null,
        mistakes: day ? day.mistakes : undefined,
        isToday: id === today,
      };
    });

    preview = tomorrowEntry(indexEntries, today);
  } catch (err) {
    console.error(err);
  }
  el.entries = entries;
  el.preview = preview;
}

main();
