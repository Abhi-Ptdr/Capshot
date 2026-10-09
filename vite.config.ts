import { defineConfig, type PluginOption } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
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
export default defineConfig({
  plugins: [react(), tailwindcss(), spaFallbackWith404()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 5173,
  },
});
