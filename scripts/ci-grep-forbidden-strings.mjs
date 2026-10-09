#!/usr/bin/env node
/**
 * Phase 1 Plan 03 — CI grep gate (INFRA-06).
 *
 * Two scanners run against src/ ONLY (not tests/, api/, public/, dist/,
 * node_modules/, .git/):
 *
 *   (a) `wa.me` guard
 *       - Allowlisted file: src/config/cta.ts
 *       - Any other src/ file containing the literal substring `wa.me`
 *         fails CI. Enforces INFRA-03: the WhatsApp destination is the
 *         single Phase 6 swap point.
 *
 *   (b) `energy drink` guard
 *       - Case-insensitive regex /energy\s+drink/i.
 *       - No allowlist — the phrase is FSSAI-non-compliant anywhere in src/.
 *       - CAPSHOT is NOT an energy drink; the Premium Sports range uses the
 *         compliant phrase "caffeinated beverages" (research/SUMMARY §1 +
 *         capshot-commerce-rollout SKILL §Pitfalls).
 *
 * Portability: scans via node:fs (recursive readdir). Does NOT spawn
 * `grep` — CI runners vary (GNU grep vs BSD grep vs busybox) and
 * portability matters more than execution speed on <500 KB of source.
 *
 * Exit codes:
 *   0 — clean (OR no matches found)
 *   1 — one or more violations printed to stdout
 *
 * CLI usage:
 *   node scripts/ci-grep-forbidden-strings.mjs
 *
 * Programmatic usage (Vitest tests):
 *   import scan from './ci-grep-forbidden-strings.mjs';
 *   const violations = scan({ rootDir: '/path/to/project' });
 */

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, relative } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DEFAULT_ROOT = resolve(__dirname, '..');

const SCANNABLE_EXTENSIONS = new Set([
  '.ts',
  '.tsx',
  '.js',
  '.jsx',
  '.mjs',
  '.cjs',
  '.css',
  '.md',
  '.html',
]);

const WA_ME_ALLOWLIST = new Set([
  'src/config/cta.ts',
]);

const ENERGY_DRINK_RE = /energy\s+drink/i;

/**
 * Recursively walk a directory, yielding file paths with scannable
 * extensions. Skips node_modules, .git, dist, .vercel, playwright-report,
 * test-results, coverage.
 */
function* walk(dir, root) {
  const entries = readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = resolve(dir, entry.name);
    if (entry.isDirectory()) {
      if (
        entry.name === 'node_modules' ||
        entry.name === '.git' ||
        entry.name === 'dist' ||
        entry.name === '.vercel' ||
        entry.name === 'playwright-report' ||
        entry.name === 'test-results' ||
        entry.name === 'coverage'
      ) {
        continue;
      }
      yield* walk(full, root);
    } else if (entry.isFile()) {
      const ext = entry.name.includes('.')
        ? '.' + entry.name.split('.').pop()
        : '';
      if (SCANNABLE_EXTENSIONS.has(ext)) {
        yield full;
      }
    }
  }
}

function tryStatIsDir(p) {
  try {
    return statSync(p).isDirectory();
  } catch {
    return false;
  }
}

/**
 * Scan `rootDir/src/` for the two forbidden patterns. Returns an array of
 * violation objects `{ gate, file, line, snippet }`.
 */
export function scan({ rootDir = DEFAULT_ROOT } = {}) {
  const srcDir = resolve(rootDir, 'src');
  if (!tryStatIsDir(srcDir)) {
    return [];
  }
  const violations = [];
  for (const filePath of walk(srcDir, rootDir)) {
    const relPath = relative(rootDir, filePath).replace(/\\/g, '/');
    let contents;
    try {
      contents = readFileSync(filePath, 'utf-8');
    } catch {
      continue;
    }
    const lines = contents.split('\n');
    const isAllowlistedForWaMe = WA_ME_ALLOWLIST.has(relPath);

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const lineNo = i + 1;

      // wa.me scanner (allowlisted to cta.ts)
      if (!isAllowlistedForWaMe && line.includes('wa.me')) {
        violations.push({
          gate: 'wa.me',
          file: relPath,
          line: lineNo,
          snippet: line.trim().slice(0, 200),
        });
      }

      // energy drink scanner (no allowlist)
      if (ENERGY_DRINK_RE.test(line)) {
        violations.push({
          gate: 'energy drink',
          file: relPath,
          line: lineNo,
          snippet: line.trim().slice(0, 200),
        });
      }
    }
  }
  return violations;
}

export default scan;

/**
 * CLI entry: run the scan and exit non-zero if any violation found.
 * Prints every violation to stdout with file:line and the offending line.
 */
function main() {
  const violations = scan({ rootDir: process.cwd() });
  if (violations.length === 0) {
    console.log('✅ No forbidden strings found in src/');
    process.exit(0);
  }
  for (const v of violations) {
    if (v.gate === 'wa.me') {
      console.log(
        `❌ wa.me outside src/config/cta.ts: ${v.file}:${v.line}  →  ${v.snippet}`,
      );
    } else {
      console.log(
        `❌ "energy drink" phrase in ${v.file}:${v.line}  →  ${v.snippet}`,
      );
    }
  }
  console.log('');
  console.log(
    `✖ ${violations.length} CI grep violation${violations.length === 1 ? '' : 's'} found.`,
  );
  console.log(
    '  See README.md § CI Guardrails for the rules enforced by this script.',
  );
  process.exit(1);
}

// Run main() when invoked as a script (not when imported for tests).
const isMainModule = (() => {
  try {
    return resolve(process.argv[1] ?? '') === __filename;
  } catch {
    return false;
  }
})();

if (isMainModule) {
  main();
}
