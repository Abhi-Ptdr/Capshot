import { afterEach, describe, expect, it } from 'vitest';
import { execSync } from 'node:child_process';
import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

/**
 * Phase 1 Plan 03 — CI grep gate (INFRA-06).
 *
 * Script under test: scripts/ci-grep-forbidden-strings.mjs
 *
 * Two gates:
 *   (a) `wa.me` guard — only src/config/cta.ts may contain the string.
 *   (b) `energy drink` guard — case-insensitive, forbidden everywhere in
 *       src/ (brand-rules + FSSAI 2026 compliance).
 *
 * Tests exercise the script against the current repository state
 * (expected clean → exit 0), then plant temporary offending files and
 * confirm non-zero exit, then clean up. Also verifies the scan scope
 * stays strictly within `src/` — tests, api/, public/, dist/ are exempt.
 */

const ROOT = resolve(process.cwd());
const SCRIPT = resolve(ROOT, 'scripts/ci-grep-forbidden-strings.mjs');

function runScript(): { status: number; stdout: string; stderr: string } {
  try {
    const stdout = execSync(`node "${SCRIPT}"`, {
      cwd: ROOT,
      stdio: ['ignore', 'pipe', 'pipe'],
      encoding: 'utf-8',
    });
    return { status: 0, stdout, stderr: '' };
  } catch (e) {
    const err = e as { status?: number; stdout?: string; stderr?: string };
    return {
      status: err.status ?? -1,
      stdout: err.stdout?.toString() ?? '',
      stderr: err.stderr?.toString() ?? '',
    };
  }
}

const SCRATCH_FILES: string[] = [];

afterEach(() => {
  for (const f of SCRATCH_FILES) {
    try {
      rmSync(f, { force: true });
    } catch {
      /* already gone */
    }
  }
  SCRATCH_FILES.length = 0;
});

describe('ci-grep-forbidden-strings script', () => {
  it('exits 0 on the current clean src/', () => {
    const { status, stdout } = runScript();
    expect(status).toBe(0);
    expect(stdout + '').toMatch(/No forbidden strings/i);
  });

  it('fails (non-zero exit) when wa.me appears in src/ outside cta.ts', () => {
    const bad = resolve(ROOT, 'src/sections/__scratch_wa_me__.tsx');
    writeFileSync(
      bad,
      "export const url = 'https://wa.me/919203975762?text=hi';\n",
      'utf-8',
    );
    SCRATCH_FILES.push(bad);
    const { status, stdout } = runScript();
    expect(status).not.toBe(0);
    expect(stdout).toMatch(/wa\.me/);
    expect(stdout).toMatch(/__scratch_wa_me__\.tsx/);
  });

  it('fails when energy drink (case-insensitive) appears anywhere in src/', () => {
    const bad = resolve(ROOT, 'src/sections/__scratch_energy__.tsx');
    writeFileSync(
      bad,
      '// Try our ENERGY Drink alternative!\nexport const foo = 1;\n',
      'utf-8',
    );
    SCRATCH_FILES.push(bad);
    const { status, stdout } = runScript();
    expect(status).not.toBe(0);
    expect(stdout).toMatch(/energy/i);
    expect(stdout).toMatch(/__scratch_energy__\.tsx/);
  });

  it('tolerates wa.me INSIDE the allowlisted src/config/cta.ts (passes)', () => {
    // cta.ts already contains wa.me in its primary href. The clean-state
    // test above also exercises this, but we re-assert here so future
    // allowlist edits don't accidentally break the carve-out.
    const { status } = runScript();
    expect(status).toBe(0);
  });

  it('does NOT scan tests/ (wa.me in tests/e2e/hero.spec.ts is permitted)', () => {
    // tests/e2e/hero.spec.ts regex-asserts the wa.me href. If the gate
    // scanned tests/ it would false-positive on this plan's own suites.
    const { status } = runScript();
    expect(status).toBe(0);
  });

  it('does NOT scan api/ (api/track-lead.ts path is outside src/)', () => {
    // api/track-lead.ts does not contain wa.me, but we assert the gate's
    // scope is strictly src/ by planting a file under api/ and expecting
    // the script to pass.
    mkdirSync(resolve(ROOT, 'api'), { recursive: true });
    const bad = resolve(ROOT, 'api/__scratch_api_wa_me__.ts');
    writeFileSync(bad, "const url = 'wa.me/919203975762';\n", 'utf-8');
    SCRATCH_FILES.push(bad);
    const { status } = runScript();
    expect(status).toBe(0);
  });

  it('reports the offending file path AND line number', () => {
    const bad = resolve(ROOT, 'src/sections/__scratch_line_report__.tsx');
    writeFileSync(
      bad,
      ['// line 1 harmless', '// line 2 energy drink leak', '// line 3'].join(
        '\n',
      ) + '\n',
      'utf-8',
    );
    SCRATCH_FILES.push(bad);
    const { status, stdout } = runScript();
    expect(status).not.toBe(0);
    // Line 2 is where "energy drink" sits
    expect(stdout).toMatch(/__scratch_line_report__\.tsx:2/);
  });
});
