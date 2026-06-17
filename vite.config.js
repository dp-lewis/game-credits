import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('.', import.meta.url));

// Web-platform-first static build. `base: './'` keeps asset URLs relative so the
// built site can live at a domain root or a subpath on Dreamhost without rework.
export default defineConfig({
  base: './',
  build: {
    outDir: 'dist',
    sourcemap: true,
    // Multi-page: the game, the archive index, and the curator preview are real,
    // separate pages. (preview.html is built but intentionally unlinked.)
    rollupOptions: {
      input: {
        main: resolve(root, 'index.html'),
        archive: resolve(root, 'archive.html'),
        preview: resolve(root, 'preview.html'),
      },
    },
  },
  // Vitest configuration (read by `vitest`).
  test: {
    environment: 'happy-dom',
    include: ['tests/unit/**/*.test.js', 'tests/component/**/*.test.js'],
    coverage: {
      provider: 'v8',
      include: ['src/lib/**/*.js'],
      reporter: ['text', 'html'],
    },
  },
});
