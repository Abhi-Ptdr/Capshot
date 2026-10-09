import js from '@eslint/js';

/*
 * Phase 1 ESLint config — minimal.
 *
 * TS 7 ecosystem gap: @typescript-eslint 8.x refuses to run on TS 7 (upstream
 * issue typescript-eslint/typescript-eslint#10940), and eslint-plugin-react
 * 7.37.x is incompatible with ESLint 10's new context API. These plugins
 * remain pinned in package.json so a future upgrade is a one-install flip
 * once upstreams ship compatibility; for Phase 1 we rely on `tsc --noEmit`
 * for type checking and leave plugin rules disabled.
 *
 * This mirrors CLAUDE.md's "If a toolchain quirk shows up on TS 7, fall back
 * to TS 5.8" fallback — only here we trade the plugin layer rather than TS 7.
 */
export default [
  js.configs.recommended,
  {
    files: ['src/**/*.{ts,tsx}', 'tests/**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
      globals: {
        window: 'readonly',
        document: 'readonly',
        localStorage: 'readonly',
        sessionStorage: 'readonly',
        navigator: 'readonly',
        console: 'readonly',
        process: 'readonly',
      },
    },
  },
  {
    ignores: ['dist/**', 'node_modules/**', 'playwright-report/**', 'test-results/**'],
  },
];
