import { defineConfig, type PluginOption } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { visualizer } from 'rollup-plugin-visualizer';
import { fileURLToPath, URL } from 'node:url';
import { readFileSync, existsSync } from 'node:fs';
import { resolve, extname } from 'node:path';

// Phase 1 Plan 01 "true HTTP 404" contract (CONTEXT D-17): any path that is
// not one of the four known client-side routes AND is not a static asset in
// `dist/` must return HTTP 404 while still serving the SPA shell so the 404
// React page renders client-side. Production hosting handles this via
// `vercel.json`; this plugin provides the equivalent for `vite preview` so
// `curl -I http://localhost:4173/does-not-exist` reproduces the deployed
// behavior locally and the Playwright webServer sees the right status.
function spaFallbackWith404(): PluginOption {
  const KNOWN_ROUTES = new Set(['/', '/flavors', '/about', '/contact']);
  return {
    name: 'capshot-spa-fallback-with-404',
    configurePreviewServer(server) {
      // Register BEFORE Vite's built-in static middleware so our 404 handler
      // runs first for unknown paths. For known routes and static assets we
      // call next() so Vite's static server handles them normally.
      const distDir = resolve(server.config.root, 'dist');
      const indexHtmlPath = resolve(distDir, 'index.html');
      server.middlewares.use((req, res, next) => {
        const url = (req.url ?? '/').split('?')[0];
        // Known client-side route → let Vite's SPA fallback serve index.html.
        if (KNOWN_ROUTES.has(url)) {
          return next();
        }
        // Static asset (any path with a file extension) → let Vite serve it.
        if (extname(url) !== '') {
          return next();
        }
        // Unknown path → serve SPA shell but with HTTP 404 status (CONTEXT D-17).
        if (existsSync(indexHtmlPath)) {
          const html = readFileSync(indexHtmlPath, 'utf-8');
          res.statusCode = 404;
          res.setHeader('Content-Type', 'text/html; charset=utf-8');
          res.end(html);
          return;
        }
        return next();
      });
    },
  };
}

// Vite 8 defaults to `baseline-widely-available` which covers Chrome 111+ / Safari 16.4+ —
// matches the 95% Indian mobile baseline this marketing site targets.
//
// Phase 3 Plan 01 (D3-17) — rollup-plugin-visualizer is wired as a build-only
// plugin (mode === 'production') so `npm run build` emits `dist/stats.html`
// (gzip-aware treemap). Dev builds stay fast; manual pre-ship inspection
// verifies the Motion-related entry chunk gzip stays ≤ 10 KB per CONV-05.
// No hard CI gate — chunk names can shift between Vite minor versions and
// would false-flag regressions.
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    tailwindcss(),
    spaFallbackWith404(),
    mode === 'production' &&
      (visualizer({
        // Path is relative to project root (NOT rollup `output.dir`) when
        // `emitFile` is omitted; this writes to `./dist/stats.html` directly.
        // Setting `emitFile: true` would place the file under rollup's
        // output dir and produce `dist/dist/stats.html` which breaks the
        // documented `dist/stats.html` contract.
        filename: 'dist/stats.html',
        gzipSize: true,
        brotliSize: false,
        open: false,
        template: 'treemap',
      }) as PluginOption),
  ].filter(Boolean) as PluginOption[],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 5173,
  },
  // Phase 3 Plan 03 (D3-17 CONV-05 verification) — isolate Motion into its
  // own vendor chunk so `rollup-plugin-visualizer`'s per-module gzip (which
  // reports 0 for non-entry modules under Rolldown) resolves to a readable
  // chunk-level number. The CONV-05 budget check now reads the `motion`
  // chunk's gzip size directly from dist/stats.html.
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/motion') || id.includes('node_modules/framer-motion') || id.includes('node_modules/motion-dom') || id.includes('node_modules/motion-utils')) {
            return 'motion';
          }
          return undefined;
        },
      },
    },
  },
}));
