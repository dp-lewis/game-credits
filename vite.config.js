import { defineConfig } from 'vite';

// Web-platform-first static build. `base: './'` keeps asset URLs relative so the
// built site can live at a domain root or a subpath on Dreamhost without rework.
export default defineConfig({
  base: './',
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
  // Vitest configuration (read by `vitest`).
  test: {
    environment: 'happy-dom',
    include: ['tests/unit/**/*.test.js'],
    coverage: {
      provider: 'v8',
      include: ['src/lib/**/*.js'],
      reporter: ['text', 'html'],
    },
  },
});
