// Entry for archive.html. Assembles the puzzle index — manifest dates <= today,
// newest first, decorated with each day's recorded status — and hands it to the
// archive component to render as links.
import { loadManifest } from './lib/puzzle-loader.js';
import { todayKey } from './lib/date-key.js';
import { listArchivePuzzles } from './lib/archive.js';
import { createProgressStore } from './lib/progress-store.js';
import { safeStorage } from './lib/safe-storage.js';
import './components/call-sheet-archive.js';

async function main() {
  const el = document.querySelector('call-sheet-archive');
  const store = createProgressStore(safeStorage());
  const today = todayKey();

  let entries = [];
  try {
    const ids = listArchivePuzzles(await loadManifest(), today);
    entries = ids.map((id) => {
      const day = store.getDay(id);
      return {
        id,
        status: day ? day.status : null,
        mistakes: day ? day.mistakes : undefined,
        isToday: id === today,
      };
    });
  } catch (err) {
    console.error(err);
  }
  el.entries = entries;
}

main();
