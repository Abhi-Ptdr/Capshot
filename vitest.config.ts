import { defineConfig } from 'vitest/config';
import { fileURLToPath, URL } from 'node:url';

/**
 * Vitest 5.0.3 (pinned exactly per CLAUDE.md §Technology Stack → Development
 * Tools). Pure-TS layer + React component tests for Phase 1 Plan 02:
 *   - src/config/cta.ts (destination truth)
 *   - src/data/flavors.ts (16-flavor Shopify-shaped stub)
 *   - src/components/ui/TrustBadge.tsx (evidenceUrl contract)
 *
 * jsdom env is needed for TrustBadge's @testing-library/react render; cta +
 * flavors specs would run in node, but one unified env keeps the suite simple.
 * The `@` alias mirrors vite.config.ts so test files can import from `@/...`.
 */
export default defineConfig({
  test: {
    environment: 'jsdom',
    include: ['tests/unit/**/*.spec.{ts,tsx}'],
    globals: false,
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
