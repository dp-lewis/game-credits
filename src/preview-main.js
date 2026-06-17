// Entry for preview.html — the curator QA gallery. Loads the theme index (every
// scheduled date + theme, future included) and hands it to the preview component.
import './components/call-sheet-preview.js';

async function main() {
  const el = document.querySelector('call-sheet-preview');
  try {
    const res = await fetch('puzzles/index.json');
    el.entries = res.ok ? await res.json() : [];
  } catch (err) {
    console.error(err);
    el.entries = [];
  }
}

main();
