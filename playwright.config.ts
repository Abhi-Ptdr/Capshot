import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright config for the walking-skeleton e2e harness.
 *
 * Browser note: Playwright's bundled Chromium download failed on the exec
 * host (airgapped). We use `channel: 'chrome'` + Chromium emulation profile
 * so the system Google Chrome at /usr/bin/google-chrome is used instead.
 * This matches CI expectations where a system browser is pre-installed.
 */
// Some execution hosts route traffic through an outbound HTTP proxy; make
// sure localhost tests bypass it so `page.goto('/')` reaches the Vite preview
// server directly instead of the proxy's 403.
if (!process.env.NO_PROXY) process.env.NO_PROXY = 'localhost,127.0.0.1';
if (!process.env.no_proxy) process.env.no_proxy = 'localhost,127.0.0.1';

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30_000,
  expect: { timeout: 5_000 },
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:4173',
    trace: 'retain-on-failure',
    // Playwright context-level proxy bypass for the system Chrome channel.
    ignoreHTTPSErrors: true,
  },
  webServer: {
    command: 'npm run build && npm run preview',
    url: 'http://localhost:4173',
    timeout: 120_000,
    reuseExistingServer: !process.env.CI,
    stdout: 'pipe',
    stderr: 'pipe',
    env: {
      NO_PROXY: 'localhost,127.0.0.1',
      no_proxy: 'localhost,127.0.0.1',
    },
  },
  projects: [
    {
      // Single-project run. Phase 1 Plan 02 adds hero.spec.ts and theme.spec.ts
      // which both call `test.use({ ...devices['Pixel 7'] })` to override to the
      // mobile viewport per-suite — so we don't need a separate `mobile-chrome`
      // project. Keeping a single project means the e2e count stays legible
      // (22 Playwright tests at Plan 02 close: 9 skeleton + 8 hero + 5 theme).
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chrome',
        launchOptions: {
          args: ['--proxy-bypass-list=<-loopback>'],
        },
      },
    },
  ],
});
