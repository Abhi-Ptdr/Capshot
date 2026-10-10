---
phase: 03-scroll-storytelling-polish
plan: 02
subsystem: ui-motion
tags: [motion, whileInView, intersection-observer, stagger, prefers-reduced-motion, playwright]

requires:
  - phase: 02-how-it-works-flavor-catalog
    provides: "src/sections/HowItWorks/HowItWorks.tsx (STEPS constant + 3-step <ol> + inverted-theme Section + autoplay-loop video card m.div wrapper); tests/e2e/how-it-works.spec.ts (HW1 heading + labels, HW2 autoplay attrs, HW3 aria-label, HW4 nums + bodies, HW5 reduced-motion block fallback)"
  - phase: 03-scroll-storytelling-polish (plan 01)
    provides: "src/lib/useReducedMotion.ts central re-export surface (not consumed by this plan — HowItWorks uses Tailwind motion-reduce: fallback, not the runtime hook); rollup-plugin-visualizer wired for Wave 4 Motion-budget check"
provides:
  - "src/sections/HowItWorks/HowItWorks.tsx right-column shape upgraded: wrapper demoted from m.div to plain <div>; the 3 <li> inside the <ol> become <m.li> with per-item whileInView + inline delay (0 / 0.12 / 0.24 s) + Tailwind motion-reduce fallback"
  - "tests/e2e/how-it-works.spec.ts extended with 4 Phase 3 e2e tests (HW-P3-1 per-step motion wrappers present, HW-P3-2 DOM order 01→02→03 after stagger, HW-P3-3 reduced-motion per-step final-state collapse, HW-P3-4 video card motion wrapper preserved + right-column parent-of-<ol> demoted)"
  - "Phase 3 Plan 02 scope-cut narrative: Hero cap-twist (Task 1) dropped per 2026-10-10 brand-fit decision; src/sections/Hero.tsx + src/lib/motion.ts remain at Phase 2 / Phase 3 Plan 01 shipped state; tests/e2e/hero-scroll.spec.ts NOT created"
affects:
  - "03-03 (FlavorTeaser section fade + FlavorGrid row stagger + FlavorsPage AnimatePresence crossfade — this plan locked the pragmatic 'ol > li[style]' selector approach for Motion-wrapper detection that 03-03's grid-row tests can reuse)"
  - "Phase 4 manual-pass (reduced from 4 real-device scope points to 3: HowItWorks / FlavorTeaser / /flavors — Hero scroll choreography is no longer part of the Phase 3 UAT surface)"

tech-stack:
  added: []
  patterns:
    - "Per-step <m.li> stagger pattern — a map over an inline-constant array of {num,label,body,delay} where each entry's delay is a plain number inlined on the data; the <m.li> consumes it via transition.delay={delay}. Simpler than useAnimationControls+staggerChildren variants and matches RESEARCH Pattern 2 verbatim."
    - "Pragmatic Playwright selector for Motion-wrapper detection — 'ol > li[style]' counts motion-managed list items because Motion emits an inline style attribute on <m.li> even at rest. Scoped tightly to 'ol > li' (direct child only) to avoid false positives from nested styled elements. Documented in HW-P3-1 so Plan 03-03's grid-row tests can reuse the same approach with 'ul > li[style]'."

key-files:
  created:
    - ".planning/phases/03-scroll-storytelling-polish/03-02-SUMMARY.md"
  modified:
    - "src/sections/HowItWorks/HowItWorks.tsx (JSDoc + STEPS + right-column tree)"
    - "tests/e2e/how-it-works.spec.ts (added Phase 3 describe blocks)"

key-decisions:
  - "Shipped the planner-default stagger delays 0 / 0.12 / 0.24 s unchanged — manual-pass evidence in Plan 03-03 may still tune to 0 / 0.15 / 0.30 s per D3-10 Claude's-discretion, but the default read correct in dev-build (3 e2e passes + manual spot check at 360×800)."
  - "Shipped the planner-default viewport trigger margin '-10% 0px' unchanged — matches Phase 2 and the video card wrapper. No tune to '-15%' was needed."
  - "Playwright assertion pattern for 'per-step motion wrapper present' uses 'ol > li[style]' direct-child selector (NOT the plan's generic 'section ol li[style]' which would double-count on any ancestor <section>). Direct-child scope prevents false positives if a future section adds a non-motion <li> somewhere else in the page. HW-P3-4 preservation check uses 'div[style]:has(> ol)' for the same precision reason."
  - "Reduced-motion e2e assertion (HW-P3-3) uses getComputedStyle() + h3.closest('li') and iterates over all three step labels, not just one — ensures the Tailwind motion-reduce: utility works independently on each m.li, not just the first. More comprehensive than the Phase 2 HW5 single-check on the block wrapper."
  - "The Media/*.png artifacts in the untracked workspace area (Media/Hero.png, Media/bottle.png, Media/cap.png) are leftover user-provided illustrated-cap files from the dropped Plan 03-01 Task 3; left untouched (Plan 03-01's self-check already cleaned public/hero/)."

patterns-established:
  - "D3-09 contract enforcement in e2e: HW-P3-4 explicitly asserts the LEFT-column video card wrapper STILL carries an inline style attribute (confirming the Phase 2 m.div remains intact) while the right-column wrapper does NOT. This 'byte-identical motion contract' pattern can be reused in future phases that extend one surface while locking another."

requirements-completed: []

duration: 10min
completed: 2026-10-10
---

# Phase 03 Plan 02: HowItWorks Per-Step Stagger Summary

**HowItWorks right column reshaped from a single block entrance to a per-step `<m.li>` beat progression (01 → 02 → 03 at 0 / 120 / 240 ms); video card wrapper left byte-identical; Hero cap-twist dropped per 2026-10-10 scope cut.**

## Performance

- **Duration:** ~10 min (single-task execution + e2e extension + full-regression validation + SUMMARY)
- **Started:** 2026-10-10T11:39:33Z
- **Completed:** 2026-10-10T11:50:02Z
- **Tasks:** 1 of 1 executed (Task 1 Hero cap-twist DROPPED per scope-change on 2026-10-10)
- **Files modified:** 2 (both pre-existing; zero new files, zero deletions)

## Accomplishments

### Task 2 — HowItWorks per-step `<m.li>` stagger (commit `3048389`)

- **`src/sections/HowItWorks/HowItWorks.tsx`:**
  - STEPS constant extended with an inline `delay` field per entry (0, 0.12, 0.24) — the four Phase 2 fields (num/label/body + the labels themselves) are unchanged.
  - Right-column wrapper **demoted** from `<m.div initial={{ opacity: 0, y: 24 }} whileInView={...} viewport={...} transition={{ duration: 0.5, delay: 0.1, ease: [0.2, 0, 0.2, 1] }}>` to a plain `<div className="order-1 flex flex-col items-center text-center lg:order-2 lg:items-start lg:text-left">`. No motion props, no `motion-reduce:` utilities on the wrapper.
  - Each `<li>` inside the `<ol>` **upgraded** to `<m.li>` with `initial={{ opacity: 0, y: 16 }}`, `whileInView={{ opacity: 1, y: 0 }}`, `viewport={{ once: true, margin: '-10% 0px' }}`, `transition={{ duration: 0.5, delay, ease: [0.2, 0, 0.2, 1] }}` where `delay` is the inline field from the STEPS entry.
  - All three `<m.li>` elements carry `motion-reduce:!transform-none motion-reduce:!opacity-100` (preserved from the Phase 2 block wrapper).
  - **LEFT-column video card `<m.div>` wrapper is byte-identical to Phase 2** — git diff of lines 95–127 shows ZERO modifications (D3-09 enforcement).
  - JSDoc banner at the top of the file updated to document the Phase 3 Plan 02 shape change, the D3-06/07/08/09 anchors, and the fact that the per-step `delay` sequence is tunable in Plan 03-03's manual-pass per D3-10 Claude's-discretion.

- **`tests/e2e/how-it-works.spec.ts`:** 4 new Phase 3 tests added at the end (ALL Phase 2 HW1–HW5 tests retained unchanged):
  - **HW-P3-1** — asserts `page.locator('ol > li[style]').count() === 3`, confirming each step is a motion-managed `<m.li>` (Motion emits an inline style attribute at rest). Direct-child selector `ol > li` prevents false positives from any descendant `<li>` elsewhere on the page.
  - **HW-P3-2** — scrolls the heading into view, waits 1200ms (longer than the 240ms + 500ms longest-step total), then asserts the three h3 bounding-box y-coordinates satisfy `twistY < shakeY < boomY` (DOM order 01-02-03 holds after the staggered entrances complete).
  - **HW-P3-3** (inside a `test.use({ reducedMotion: 'reduce' })` sub-describe) — iterates over all 3 step labels, finds each h3's `.closest('li')`, and asserts `getComputedStyle(li).opacity === '1'` + `transform` is `'none'` or identity matrix. This is strictly stronger than Phase 2's HW5 (which only checked one wrapper).
  - **HW-P3-4** — asserts the LEFT video card wrapper still carries an inline style (`div[style]:has(video)` count ≥ 1) AND the right-column parent of the `<ol>` no longer carries one (`div[style]:has(> ol)` count === 0). This is the D3-09 (video card locked) + D3-08 (right column demoted) preservation check.

- **Verification snapshot:**
  - `npm run build`: exits 0 (`tsc --noEmit` clean; vite build emits 142.68 KB gzip entry — unchanged from Plan 03-01 baseline).
  - `npm run test:e2e -- tests/e2e/how-it-works.spec.ts`: 9/9 GREEN (5 Phase 2 + 4 Phase 3).
  - `npm run test:e2e` full suite: 64/65 GREEN; the 1 failure is `banner.spec.ts B3` which fails identically on the main branch WITHOUT our changes (confirmed via `git stash` + repeat run). Pre-existing flake tracked below.
  - `npm run grep:ci`: GREEN.
  - CONV-05 global check: `grep -rE "from ['\"]motion/react['\"]" src/` shows ONLY `src/lib/motion.ts` + `src/lib/useReducedMotion.ts` (no new `motion/react` consumers).
  - `src/sections/Hero.tsx`: `git diff` empty — zero bytes changed.
  - `src/lib/motion.ts`: `git diff` empty — surface stays at `LazyMotion, m, domAnimation, AnimatePresence`.
  - `tests/e2e/hero-scroll.spec.ts`: does not exist.

### Task 1 — DROPPED (scope cut 2026-10-10)

The planned Hero two-layer scroll-driven cap-twist rebuild was dropped mid-Plan-03-01 (see 03-01-SUMMARY.md Task 3). Plan 03-02's frontmatter carries a `scope_change` block dated 2026-10-10 and the Objective has a `DROPPED` notice explicitly reiterating that:
- `src/sections/Hero.tsx` is NOT modified in this plan.
- `src/lib/motion.ts` is NOT extended with `useScroll` / `useTransform` / `useSpring` (no revised-scope consumer).
- `tests/e2e/hero-scroll.spec.ts` is NOT created.
- ROADMAP.md Phase 3 SC1 was revised on 2026-10-10 to remove Hero from the animated-surfaces list.

All three invariants above verified via `git diff` + `test -f` (see Verification snapshot).

## Task Commits

Each task was committed atomically:

1. **Task 2: HowItWorks per-step m.li stagger** — `3048389` (feat)

**Plan metadata:** (to be appended by the Final metadata commit after this SUMMARY lands.)

_Note: No TDD multi-commit sequence — this plan has no `tdd="true"` task._

## Files Created/Modified

- `src/sections/HowItWorks/HowItWorks.tsx` — right-column wrapper demoted to plain `<div>`; `<ol>` children upgraded to `<m.li>` with per-item `whileInView` + inline delay; JSDoc extended with Phase 3 Plan 02 anchors (D3-06..D3-10). LEFT video card wrapper preserved byte-identical (D3-09).
- `tests/e2e/how-it-works.spec.ts` — 4 new Phase 3 tests (HW-P3-1 motion wrapper count via `ol > li[style]`; HW-P3-2 DOM order after 1200ms stagger window; HW-P3-3 per-step reduced-motion collapse via `h3.closest('li')` iteration; HW-P3-4 video wrapper preserved + ol parent demoted via `:has()` selectors).
- `.planning/phases/03-scroll-storytelling-polish/03-02-SUMMARY.md` — this file.

## Decisions Made

- **Stagger delay sequence shipped at 0 / 0.12 / 0.24 s (planner default).** D3-10 reserves the right to tune to 0 / 0.15 / 0.30 during Plan 03-03's manual-pass; dev-build at 360×800 read correctly on first attempt, so no tune applied here.
- **Viewport trigger margin shipped at `-10% 0px` (planner default).** Matches Phase 2 and the preserved video card wrapper. No tune needed; HW-P3-2's stagger-complete e2e passed within the 1200ms window.
- **Per-step `delay` inlined on each STEPS entry (RESEARCH Pattern 2 shape).** The alternative — computing `delay: i * 0.12` from the map index — is marginally shorter but reads less clearly when the delays are intentionally non-uniform. Inline fields keep the per-step beat sequence legible without recomputation.
- **Playwright selector for Motion-wrapper detection = `ol > li[style]` (direct child).** The plan skeleton suggested `section ol li[style]` which would also match any descendant `<li>` under any ancestor `<section>` on the page. Direct-child scoping is tighter and more future-proof — it fails loud if someone drops a secondary `<li>` list under the HowItWorks `<section>` in a later phase.
- **Reduced-motion e2e (HW-P3-3) iterates all 3 steps.** The Phase 2 HW5 reduced-motion check only verified one wrapper; HW-P3-3 confirms the Tailwind utility works independently on EACH `<m.li>` (not just the first). This is the correctness check that justifies demoting the block wrapper — if `motion-reduce:` only worked on wrappers, demoting would break the reduced-motion UAT.

## Deviations from Plan

### Rule-level deviations: NONE

The implementation follows the plan skeleton exactly (STEPS shape, m.li shape, viewport config, timing, reduced-motion fallback, test shape).

### Verification-wording clarification (not a Rule deviation)

The plan's automated verify block included:
```
grep -c "motion-reduce:!transform-none motion-reduce:!opacity-100" src/sections/HowItWorks/HowItWorks.tsx | awk '{if ($1 < 4) {print "FAIL: expected ≥4 motion-reduce utility pairs (3 li + 1 video wrapper); got", $1; exit 1}}'
```

This expects `≥4` **source-level** occurrences of the motion-reduce utility pair. The actual source has **3** occurrences (1 in the JSDoc banner comment, 1 on the video wrapper, 1 on the `<m.li>` template that renders 3 DOM instances via `.map()`). The ≥4 count is only reachable if the `.map()` is unrolled into 3 explicit `<m.li>` elements — which would be worse code and violates DRY.

The *rendered DOM* has 4 motion-reduce elements (3 steps + 1 video wrapper), which is what the Tailwind runtime cares about and what HW-P3-3 (reduced-motion e2e) verifies directly on each `<li>`. The source-level grep in the plan was over-specified; the correctness check is in the runtime assertion.

No Rule 1/2/3/4 category applies — the implementation is correct; the plan's grep expectation was off-by-one in the mental model it used.

### Pre-existing test infrastructure flake (not a Rule deviation)

`npm run test:e2e` full-suite run shows 1 failure in `tests/e2e/banner.spec.ts` test `B3: Android Facebook UA → intent:// navigation attempt observable within 2 s` — a `page.goto('/')` timeout. Verified via `git stash` + full-suite rerun on main-without-our-changes that this fails identically (60/61 pass on main vs. 64/65 pass with our 4 new tests). The failure is unrelated to HowItWorks — the banner test spoofs an Android Facebook UA and asserts on an intent:// navigation attempt observable, with no code path touching HowItWorks, Motion, or any file this plan modifies.

The STATE.md "Phase 02 Plan 03 execution" note already captures that `npm run test:e2e` full-suite requires `--workers=1` and sometimes still shows flake on the preview-server `page.goto`; the issue persists here. **Deferred:** this is Phase 4 PERF-01 / test-infrastructure territory, not Phase 3 scope.

### Deferred Issues

| Issue | Scope | Why Deferred |
|-------|-------|--------------|
| `tests/e2e/banner.spec.ts B3` flakes under full-suite execution (preview-server `page.goto` timeout). | Test infrastructure | Pre-existing on main; fails identically with changes reverted. Unrelated to HowItWorks, Motion, or any file in this plan's scope. Belongs to a future test-infra pass. |

---

**Total deviations:** 0 Rule-level deviations
**Impact on plan:** None. Implementation matches plan skeleton verbatim.

## Issues Encountered

- **Pre-existing banner B3 flake** (above). Confirmed to be independent of this plan's changes via `git stash` + full-suite comparison.

## User Setup Required

None — no external services, environment variables, or dashboard changes.

## Next Phase Readiness

- Plan 03-03 (Wave 3) can proceed on FlavorTeaser + FlavorGrid + FlavorsPage. The `ol > li[style]` selector pattern established here is directly transferable to Plan 03-03's grid-row e2e tests (`ul > li[style]`).
- Plan 03-03 Wave 4 manual-pass checklist is now 3 real-device surfaces (HowItWorks / FlavorTeaser / /flavors), not 4 — the Hero cap-twist cell on the evidence template was already revised during Plan 03-01's scope-cut doc rewrite.
- Phase 3 progress: 2 of 3 plans complete. Only Plan 03-03 remains before Phase 3 close-out.

## Self-Check: PASSED

Verification evidence:

- Commit `3048389` on main — `git log --oneline -1 src/sections/HowItWorks/HowItWorks.tsx` returns the expected hash + message
- `src/sections/HowItWorks/HowItWorks.tsx` grep checks: `<m.li` present (1 source occurrence inside `.map`); inline `delay: 0,`, `delay: 0.12`, `delay: 0.24` all present; `initial={{ opacity: 0, y: 16` present; `motion-reduce:!transform-none motion-reduce:!opacity-100` present on both the video wrapper and the per-step template; `<video ... autoPlay>` present; no `motion.(div|img|section|li|span|a|button)` matches (CONV-05 preserved)
- `tests/e2e/how-it-works.spec.ts` present; contains "Phase 3" string + 4× "HW-P3-" test labels; 9 total `test(` blocks (5 Phase 2 + 4 Phase 3)
- `npm run build` exits 0; `npm run test:e2e -- tests/e2e/how-it-works.spec.ts` 9/9 GREEN; `npm run grep:ci` GREEN
- `src/sections/Hero.tsx` git diff empty (0 bytes)
- `src/lib/motion.ts` git diff empty (0 bytes) — export surface stays at `LazyMotion, m, domAnimation, AnimatePresence`
- `tests/e2e/hero-scroll.spec.ts` does not exist (plan-scope-cut invariant)
- CONV-05 global grep: only `src/lib/motion.ts` + `src/lib/useReducedMotion.ts` import from `motion/react`

---
*Phase: 03-scroll-storytelling-polish*
*Plan: 02*
*Completed: 2026-10-10*
