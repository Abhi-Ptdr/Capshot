---
phase: 03-scroll-storytelling-polish
plan: 01
subsystem: motion-foundation
tags: [motion, prefers-reduced-motion, rollup-plugin-visualizer, vite, bundle-budget, lazy-motion]

requires:
  - phase: 01-foundation-hero-conversion-infrastructure
    provides: src/lib/motion.ts (LazyMotion/m/domAnimation/AnimatePresence re-export surface — CONV-05 anchor file this plan extends with a sibling); vitest config
  - phase: 02-how-it-works-flavor-catalog
    provides: FlavorCard/HamburgerMenu/HowItWorks/FlavorTeaser surfaces that Plans 03-02/03-03 extend without touching this plan's output
provides:
  - "src/lib/useReducedMotion.ts — single-line additive re-export of motion/react's useReducedMotion; sibling of src/lib/motion.ts; project-wide central import surface"
  - "tests/unit/useReducedMotion.spec.ts — 3-test Vitest spec covering matches=true, matches=false, undefined-matchMedia (SSR-like null case)"
  - "vite.config.ts — migrated to defineConfig(({ mode }) => ({...})) function form with rollup-plugin-visualizer registered as a mode==='production' build-only plugin; emits dist/stats.html (gzip-aware treemap, template: 'treemap', open: false)"
  - "rollup-plugin-visualizer@7.1.1 — new dev dependency; verified Rolldown-compatible per RESEARCH Q5 Package Legitimacy Audit"
affects: [03-02 (HowItWorks whileInView — motion-reduce: Tailwind fallback), 03-03 (FlavorTeaser m.section + FlavorGrid m.li + FlavorsPage AnimatePresence; manual-pass Wave 4 reads dist/stats.html for Motion chunk budget check)]

tech-stack:
  added:
    - "rollup-plugin-visualizer@7.1.1 (dev dep)"
  patterns:
    - "Second CONV-05 anchor file established — the only two files in src/ that may import from motion/react are now src/lib/motion.ts (set in Phase 1 Plan 02) and src/lib/useReducedMotion.ts (added here)"
    - "Vite config function-form (defineConfig(({ mode }) => ({...}))) is the project pattern for conditionally registering build-only plugins"

key-files:
  created:
    - "src/lib/useReducedMotion.ts"
    - "tests/unit/useReducedMotion.spec.ts"
  modified:
    - "vite.config.ts"
    - "package.json"
    - "package-lock.json"

key-decisions:
  - "SCOPE CUT: Task 3 (Hero cutout assets `public/hero/cap.png` + `public/hero/bottle.jpg`) dropped mid-execution. Developer rejected the illustrated-asset direction on brand-fit grounds and locked the Hero to the Phase 2 single-image composition. Hero cap-twist signature moment removed from Phase 3 entirely (paired Plan 03-02 Task 1 also dropped; ROADMAP Phase 3 SC1/SC3/SC4 revised accordingly). See docs commit `docs(03): drop Hero cap-twist from Phase 3 scope`."
  - "Test file located at tests/unit/useReducedMotion.spec.ts (not src/lib/__tests__/useReducedMotion.test.ts as the plan originally called out) — vitest.config.ts include glob is tests/unit/**/*.spec.{ts,tsx}; new path matches 10 existing specs under tests/unit/"
  - "Test resets motion-dom module-level state singletons (prefersReducedMotion.current + hasReducedMotionListener.current) between tests. vi.resetModules() alone was insufficient because motion/react holds a live reference to these state objects"
  - "visualizer({ emitFile: true }) intentionally omitted. With emitFile, filename resolves relative to Rollup's output.dir (= dist/), producing dist/dist/stats.html and breaking the plan's documented dist/stats.html contract. Without emitFile, the path is CWD-relative, which gives dist/stats.html directly"
  - "Observation for Plan 03-03 Wave 4 — rollup-plugin-visualizer@7.1.1 under Vite 8 + Rolldown reports per-module gzipLength: 0 (gzip only attributed at top-level chunk entry). Current build is single-chunk (dist/assets/index-DKTSG6Li.js = 444.17 KB raw / 142.67 KB gzip). The Motion chunk-level gzip (CONV-05 ≤ 10 KB) is not isolable from stats.html as-configured; Plan 03-03's bundle-check step may need vite-bundle-analyzer or manual chunk splitting"

patterns-established:
  - "CONV-05 extension pattern: every new motion/react consumer in src/ must flow through a passthrough re-export in src/lib/*.ts. Grep gate (grep -rE \"from ['\\\"]motion/react['\\\"]\" src/) now has two allowed files instead of one"
  - "Build-only Vite plugin pattern: function-form defineConfig + mode === 'production' gate + .filter(Boolean) at the end of plugins array to drop the conditional cleanly"

requirements-completed: []

duration: ~15min
completed: 2026-10-10
---

# Phase 03 Plan 01: Scroll Storytelling Polish — Motion Foundation Summary

**Motion foundation prerequisites landed with ZERO section/component changes — `useReducedMotion` lib + central import surface extended, `rollup-plugin-visualizer` wired as a build-only plugin emitting `dist/stats.html`. Task 3 (Hero cutout assets) dropped mid-execution per brand-fit decision; Hero cap-twist removed from Phase 3 scope entirely.**

## Performance

- **Duration:** ~15 min (Tasks 1 + 2 execution + checkpoint halt + scope-cut doc rewrites)
- **Started:** 2026-10-10T10:25Z
- **Completed:** 2026-10-10T11:30Z (approx, including user-decision interval)
- **Tasks:** 2 of 3 executed (Task 3 scope-dropped)
- **Files modified:** 5 (2 new + 3 edited)

## Accomplishments

### Task 1 — `useReducedMotion` lib + Vitest unit test (commit `8d38803`)

- **`src/lib/useReducedMotion.ts`** — single `export { useReducedMotion } from 'motion/react';` under a JSDoc banner explaining the CONV-05 contract. Zero wrapper logic. Zero types. Pure passthrough.
- **`tests/unit/useReducedMotion.spec.ts`** — 3 tests:
  - U1: `matches=true` for `(prefers-reduced-motion: reduce)` → hook returns `true`
  - U2: `matches=false` → hook returns `false`
  - U3: `window.matchMedia` undefined → no throw (D3-19 null-case defensive check)
- **Verification snapshot:**
  - `npm run test`: 57/57 GREEN (11 test files, including the new 3-test spec)
  - CONV-05 preserved: `grep -rE "from ['\"]motion/react['\"]" src/` shows only `src/lib/motion.ts` + `src/lib/useReducedMotion.ts`

### Task 2 — `rollup-plugin-visualizer` wiring + Vite config migration (commit `950c4e2`)

- **`rollup-plugin-visualizer@7.1.1`** installed as dev dep (exact resolved; 28 transitive packages, 0 vulnerabilities; verified Rolldown-compatible per RESEARCH Q5 audit).
- **`vite.config.ts`** migrated to `defineConfig(({ mode }) => ({...}))` function form; visualizer registered as a `mode === 'production'` build-only plugin via `.filter(Boolean)` plugins array. `spaFallbackWith404`, `@` resolve alias, `server.port: 5173`, and all pre-existing dev-build behavior preserved byte-equivalent.
- **Visualizer options:**
  - `filename: 'dist/stats.html'`
  - `gzipSize: true` (CONV-05 measurement is gzip, not brotli)
  - `brotliSize: false` (don't pay the generation cost for a metric we don't use)
  - `open: false` (headless build env — must not auto-open)
  - `template: 'treemap'` (most scannable layout for Motion chunk identification)
  - `emitFile: true` **omitted** — see Key Decisions above
- **Verification snapshot:**
  - `npm run build`: exits 0, emits `dist/stats.html` (897 KB treemap; gzip-aware)
  - `npm run test:e2e`: 61/61 GREEN (Phase 1 + Phase 2 regression intact)
  - `npm run grep:ci`: GREEN (no `wa.me` / "energy drink" / `motion.div` leaks)

### Task 3 — DROPPED (scope cut 2026-10-10)

The original Task 3 was a `checkpoint:human-action` block requiring the developer to produce `public/hero/cap.png` (transparent cap cutout) and `public/hero/bottle.jpg` (bottle without cap, content-aware fill of neck) from the existing `public/hero/cap-on-bottle.jpg` source. These assets were to feed Plan 03-02's two-layer Hero rebuild with scroll-driven cap-twist rotation.

**What happened:** The developer produced two illustrated-style PNGs (clean flat-illustration cap and bottle, different artistic direction from the product-mockup composite). I built a throwaway browser preview (/tmp/capshot-hero-preview/preview.html) showing how the illustrated assets would render stacked over the Hero's current layout at 0°, 17°, 35° rotation states, alongside the current `cap-on-bottle.jpg` baseline. After reviewing the preview, the developer judged the illustrated direction a bad brand fit and decided to lock the Hero to the Phase 2 single-image composition for the rest of Phase 3.

**Decision:** Drop the Hero cap-twist signature moment entirely. The scope cut cascades across:

- **ROADMAP.md Phase 3 SC1/SC3/SC4** — Hero cap-twist removed from animated-surfaces list, reduced-motion coverage, and manual-pass checklist
- **03-01-PLAN.md** — Task 3 removed, cap.png/bottle.jpg dropped from `files_modified`, `user_setup` block removed, `autonomous: true`
- **03-02-PLAN.md** — Task 1 (Hero two-layer) removed, Hero.tsx + tests/e2e/hero-scroll.spec.ts dropped from `files_modified`, `useScroll`/`useTransform`/`useSpring` additions to `src/lib/motion.ts` dropped (no consumer in revised scope)
- **03-03-PLAN.md** — Hero removed from manual-pass walkthrough, evidence template, reduced-motion checklist, and SC-mapping

**Cleanup:** User's unused `cap.png` + `bottle.png` deleted from `public/hero/`. `public/hero/` is back to just the original `cap-on-bottle.jpg`. Preview server (port 8765) shut down. `/tmp/capshot-hero-preview/` removed.

See docs commit `docs(03): drop Hero cap-twist from Phase 3 scope` (`90349e4`) for the full planning rewrite.

## Deviations

**Rule 3 — Blocking → Pivot. Scope cut mid-execution.**
Task 3 (Hero cutout assets) dropped by developer decision after the illustrated-asset preview review on 2026-10-10. See Task 3 section above and the key-decisions entry.

**Rule 3 — Blocking (minor). Test file path.**
`tests/unit/useReducedMotion.spec.ts` (not `src/lib/__tests__/useReducedMotion.test.ts` as the plan originally called out). Reason: `vitest.config.ts` restricts `include` to `tests/unit/**/*.spec.{ts,tsx}` + `tests/ci/**/*.spec.{ts,tsx}`; the plan's path would not auto-discover. New path matches the 10 existing specs under `tests/unit/`. Plan frontmatter updated to reflect the actual path.

**Rule 1 — Passing. Config shape adjustment.**
`visualizer({ emitFile: true })` omitted. The plan listed `emitFile: true` in the suggested config, but under Rollup + Vite 8 the flag resolves `filename` relative to `output.dir` (`dist/`), producing `dist/dist/stats.html` which breaks the plan's documented `dist/stats.html` contract. Dropping `emitFile` lets the path remain CWD-relative, which gives `dist/stats.html` directly.

**Observation (for Plan 03-03 Wave 4). Visualizer gzip resolution limit.**
`rollup-plugin-visualizer@7.1.1` under Vite 8 + Rolldown reports per-module `gzipLength: 0`. Gzip is only attributed at top-level chunk entries. Current build is a single-chunk bundle (`dist/assets/index-DKTSG6Li.js` = 444.17 KB raw / 142.67 KB gzip). The Motion chunk-level gzip (CONV-05 ≤ 10 KB budget) cannot be isolated from `stats.html` as-configured. Plan 03-03's bundle-check step may need `vite-bundle-analyzer` or manual chunk splitting to isolate Motion's cost. Not a blocker for this plan.

## What's Next

- **Wave 2 (Plan 03-02):** HowItWorks per-step `m.li` stagger (01 → 02 → 03, delays 0ms / 120ms / 240ms). Hero task dropped per scope cut above. Uses `useReducedMotion` lib (Tailwind `motion-reduce:` fallback pattern — no direct render-time branch) via the central import surface established in this plan.
- **Wave 3 (Plan 03-03):** FlavorTeaser section fade + FlavorGrid row stagger + FlavorsPage AnimatePresence filter crossfade + bundle-check + real-device manual pass (minus Hero).

## Self-Check: PASSED

- Task 1 commit `8d38803` on main — `src/lib/useReducedMotion.ts` + `tests/unit/useReducedMotion.spec.ts` present on disk; `grep` confirms single-line re-export, matchMedia + prefers-reduced-motion assertions in test
- Task 2 commit `950c4e2` on main — `vite.config.ts` contains `visualizer`, `mode === 'production'`, `dist/stats.html`; `package.json` lists `rollup-plugin-visualizer`; `node_modules/rollup-plugin-visualizer` exists; `dist/stats.html` artifact present after `npm run build`
- Task 3 cleanly dropped — no partial artifacts in `public/hero/` (just the original `cap-on-bottle.jpg`); plan docs updated with scope_change blocks + narrative edits; cross-plan contracts (03-02 Task 1, 03-03 manual pass) also updated to match
- Full regression intact — 57/57 unit, 61/61 e2e, grep:ci GREEN
- CONV-05 preserved — only `src/lib/motion.ts` + `src/lib/useReducedMotion.ts` import from `motion/react`
