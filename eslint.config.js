import js from '@eslint/js';
import globals from 'globals';

/** ESLint 9 flat config. Web-platform-first: browser globals for src,
 *  node globals for build scripts and configs. */
export default [
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      'coverage/**',
      'playwright-report/**',
      'test-results/**',
      // FIRE tooling + artifacts — not project source.
      '.specsmd/**',
      '.specs-fire/**',
    ],
  },
  js.configs.recommended,
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: { ...globals.browser },
    },
    rules: {
      'prefer-const': 'error',
      eqeqeq: 'error',
      'no-unused-vars': 'error',
      'no-var': 'error',
    },
  },
  {
    // Node context: build/curation scripts, configs, and tests.
    files: [
      'scripts/**/*.js',
      'tests/**/*.js',
      '*.config.js',
      'playwright.config.js',
    ],
    languageOptions: {
      globals: { ...globals.node },
    },
  },
];
