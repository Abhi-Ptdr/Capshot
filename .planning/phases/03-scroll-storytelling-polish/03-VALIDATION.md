---
phase: 3
slug: scroll-storytelling-polish
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-10-10
---

# Phase 3 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest 5.0.3 (unit) + @playwright/test (e2e; system Chrome via `channel: 'chrome'`) |
| **Config file** | `vitest.config.ts` + `playwright.config.ts` (both from Phase 1 Plan 01) |
| **Quick run command** | `npm run test` (vitest run) |
| **Full suite command** | `npm run test && npm run test:e2e` |
| **Estimated runtime** | ~60s unit + ~75s e2e = ~135s |

---

## Sampling Rate

- **After every task commit:** Run `npm run test` (vitest unit — fast feedback on hooks + utilities)
- **After every plan wave:** Run `npm run test && npm run test:e2e` (full suite incl. Playwright on real Chrome)
- **Before `/gsd:verify-work`:** Full suite must be green AND `dist/stats.html` manually inspected to confirm Motion gzip ≤10 KB
- **Max feedback latency:** 60 seconds (vitest only; Playwright is wave-boundary)

---

## Per-Task Verification Map

> Phase 3 owns no v1 REQ-ID (cross-cutting polish). Verification maps to the 4 ROADMAP.md success criteria (SC1..SC4) and the 19 locked CONTEXT.md decisions (D3-01..D3-19).

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 3-01-* | 01 | 1 | SC2 (LazyMotion contract) | — | useReducedMotion re-export from motion/react only (CONV-05 preserved) | unit | `npm run test -- src/lib/useReducedMotion` | ❌ W0 | ⬜ pending |
| 3-01-* | 01 | 1 | SC2 (10 KB budget) | — | rollup-plugin-visualizer emits dist/stats.html on `vite build` | manual | `npm run build && test -f dist/stats.html` | ❌ W0 | ⬜ pending |
| 3-02-* | 02 | 2 | SC1 + SC3 (Hero cap-twist) | — | useScroll rotation 0°→35° on scroll; static fallback when reduced-motion | e2e | `npm run test:e2e -- tests/e2e/hero-scroll.spec.ts` | ❌ W0 | ⬜ pending |
| 3-02-* | 02 | 2 | SC1 (HowItWorks per-step stagger) | — | Each `<li>` animates independently; video card unchanged (D3-09) | e2e | `npm run test:e2e -- tests/e2e/how-it-works.spec.ts` | ✅ (Phase 2 spec — extend) | ⬜ pending |
| 3-03-* | 03 | 3 | SC1 (Teaser + Grid entrances) | — | Section-level fade on FlavorTeaser; row-stagger on grid; cards unchanged | e2e | `npm run test:e2e -- tests/e2e/flavors.spec.ts` | ✅ (Phase 2 spec — extend) | ⬜ pending |
| 3-03-* | 03 | 3 | SC1 (filter crossfade) | — | AnimatePresence crossfade on filter change; URL state intact | e2e | `npm run test:e2e -- tests/e2e/range-filter.spec.ts` | ✅ (Phase 2 spec — extend) | ⬜ pending |
| 3-04-* | 03 | 4 | SC2 (bundle verify) | — | dist/stats.html review — Motion chunk ≤ 10 KB gzip | manual | `npm run build && open dist/stats.html` | ❌ W0 | ⬜ pending |
| 3-04-* | 03 | 4 | SC3 (reduced-motion contract) | — | OS-level reduced-motion → static fallbacks + zero CLS vs. animated path | manual | real-device toggle | — | ⬜ pending |
| 3-04-* | 03 | 4 | SC4 (no jank/CLS/bundle regression) | — | Dev-captured notes + screencast on real iPhone + Android | manual | see `.planning/evidence/03-scroll-polish-manual-pass.md` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `src/lib/useReducedMotion.ts` — new file; re-export of `useReducedMotion` from `motion/react` (keeps CONV-05 contract)
- [ ] `src/lib/__tests__/useReducedMotion.test.ts` — unit test confirming hook returns boolean and respects `matchMedia('(prefers-reduced-motion: reduce)')` mock
- [ ] `public/hero/cap.png` — new transparent-PNG cutout asset (Photoshop one-off from existing `/hero/cap-on-bottle.jpg`)
- [ ] `public/hero/bottle.jpg` — new bottle-without-cap asset
- [ ] `vite.config.ts` — add `rollup-plugin-visualizer` plugin, mode-gated (`mode === 'production'`), `gzipSize: true, open: false, filename: 'dist/stats.html'`
- [ ] `rollup-plugin-visualizer` installed as dev dep (`npm install -D rollup-plugin-visualizer@^7.1.1` — verified Rolldown-compatible per RESEARCH Q5)
- [ ] Extend Phase 2's `tests/e2e/how-it-works.spec.ts` to verify per-step stagger (not just block fade)
- [ ] Extend Phase 2's `tests/e2e/range-filter.spec.ts` to verify AnimatePresence does not break URL sync
- [ ] New `tests/e2e/hero-scroll.spec.ts` — asserts cap rotation on scroll + reduced-motion static fallback
- [ ] `.planning/evidence/03-scroll-polish-manual-pass.md` — manual-pass evidence doc skeleton

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| iPhone + Android cap-twist smoothness | SC4 (no jank) | Playwright CI runs x86 Linux at 60fps — can't measure real-device scroll frame rate | Real iPhone + real Android Chrome: load `/`, scroll through Hero, confirm cap rotates smoothly without stutter. Note frame-rate observations in evidence doc. |
| Reduced-motion static fallback | SC3 | Playwright can emulate `prefers-reduced-motion` but can't measure zero-CLS vs. animated path on a real device | Enable OS reduced-motion (iOS: Settings → Accessibility → Motion → Reduce Motion; Android: Settings → Accessibility → Remove Animations). Load `/` and `/flavors`. Confirm Hero shows single original composition (no two-layer, no rotation); HowItWorks shows static steps; FlavorTeaser + grid show no entrance anim. Measure layout parity vs. animated path — screenshot both and compare. |
| Motion gzip ≤ 10 KB | SC2 | Bundle verification against CONV-05 contract; requires human reading `dist/stats.html` | Run `npm run build`, open `dist/stats.html` in browser, locate Motion chunks, sum gzip sizes, confirm ≤ 10 KB entry-bundle footprint. Record the number in the evidence doc for the record. |
| No bundle regression vs. Phase 2 baseline | SC4 | Need a "before" measurement from the Phase 2 commit for comparison | Capture Phase 2's main.js gzip size from git history (checkout Phase 2's final commit, `npm run build`, record size). Compare against Phase 3's `npm run build`. Record delta in evidence doc. |
| Horizontal snap-scroller still functions during section fade | SC4 (no regression) | Playwright touch events don't fully replicate iOS momentum scrolling | On real iPhone, swipe through FlavorTeaser scroller after section finishes fading in. Confirm snap-points still trigger, chevron arrows (desktop) still disable at boundaries. |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references (useReducedMotion.ts, hero assets, visualizer wiring, test files)
- [ ] No watch-mode flags (vitest `run` + playwright `--reporter=line` only)
- [ ] Feedback latency < 60s for unit tests
- [ ] `nyquist_compliant: true` set in frontmatter after planner reconciles automated-vs-manual split

**Approval:** pending
