import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '../..');
const MANIFEST_PATH = path.join(ROOT, 'public/puzzles/manifest.json');
const INDEX_PATH = path.join(ROOT, 'public/puzzles/index.json');

describe('archive index guard', () => {
  it('index.json exists and is a non-empty array', () => {
    const raw = fs.readFileSync(INDEX_PATH, 'utf8');
    const entries = JSON.parse(raw);
    expect(Array.isArray(entries)).toBe(true);
    expect(entries.length).toBeGreaterThan(0);
  });

  it('every manifest date appears in the index with a non-empty theme', () => {
    const manifestIds = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
    const indexEntries = JSON.parse(fs.readFileSync(INDEX_PATH, 'utf8'));
    const indexByDate = Object.fromEntries(
      indexEntries.map((e) => [e.date, e])
    );

    for (const date of manifestIds) {
      const entry = indexByDate[date];
      expect(entry, `index missing date ${date}`).toBeDefined();
      expect(
        typeof entry.theme === 'string' && entry.theme.length > 0,
        `index has empty theme for ${date}`
      ).toBe(true);
    }
  });

  it('index is sorted by date ascending', () => {
    const entries = JSON.parse(fs.readFileSync(INDEX_PATH, 'utf8'));
    for (let i = 1; i < entries.length; i++) {
      expect(entries[i].date >= entries[i - 1].date).toBe(true);
    }
  });
});
