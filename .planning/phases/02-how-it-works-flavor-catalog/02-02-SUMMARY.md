---
phase: 02-how-it-works-flavor-catalog
plan: 02
subsystem: ui
tags: [react, motion, motion-while-in-view, inline-svg, scroll-snap, react-router, landmark, hinglish, tailwind-v4]

# Dependency graph
requires:
  - phase: 01-foundation-hero-conversion-infrastructure
    provides: [Hero section (minus the <main> landmark), <PrimaryCTA>, <Container>, <Section>, flavors.ts data, LazyMotion provider mounted in src/App.tsx, Tailwind v4 brand tokens, CI grep gates]
  - phase: 02-how-it-works-flavor-catalog
    plan: 01
    provides: [<FlavorCard> memoized color-washed tile, <FlavorCapGraphic>, lightenHex, AnimatePresence re-export from @/lib/motion, HamburgerMenu + Nav upgrade]
provides:
  - "<HowItWorks> section — 3 Hinglish beats (TWIST / SHAKE / BOOM) + 3 inline React SVG illustrations with Motion whileInView staggered fade+slide entrance"
  - "<StepTwistIllustration> + <StepShakeIllustration> + <StepBoomIllustration> — brand-palette-only decorative SVGs (data-testid=\"step-illustration\", aria-hidden=\"true\")"
  - "<FlavorTeaser> section — CSS scroll-snap-x-mandatory horizontal row of 8 curated FlavorCards + 9th 'See all 16 flavors →' Link tile to /flavors"
  - "`<main id=\"main\">` landmark now owned by HomePage.tsx (not Hero.tsx) — the skip-link lands on the whole homepage body, not only the Hero"
  - "Hero.tsx root demoted from <main> to a plain <div> (visual layout unchanged); inner <section aria-labelledby=\"hero-title\"> is the new Playwright H5/H6 target"
affects: [03-scroll-choreography (Phase 3 will layer cinematic cap-twist + path-morph animations over the static Phase 2 SVG trees)]

# Tech tracking
tech-stack:
  added: []  # Zero new dependencies in Wave 2 (lucide-react ArrowUpRight already shipping; Motion + Tailwind + React Router already in place)
  patterns:
    - "Inline React SVG components colocated with their section (src/sections/HowItWorks/) so Phase 3 can address individual paths with Motion later; vite-plugin-svgr intentionally not installed"
    - "Motion whileInView + viewport.once + viewport.margin + staggered delay index pattern — reusable across any 'tile grid that animates in on scroll' future section"
    - "Reduced-motion fallback = Motion's auto-detect + Tailwind motion-reduce:!transform-none motion-reduce:!opacity-100 (belt-and-suspenders)"
    - "Full-bleed horizontal scroller composed of heading-inside-Container + scroller-outside-Container; CSS scroll-snap mandatory with scrollbar hidden across engines"
    - "Landmark hoisting pattern — a shared <main> moves up to the composition point once the page has more than one section; inner <section aria-labelledby=…> carries the sized viewport"

key-files:
  created:
    - src/sections/HowItWorks/HowItWorks.tsx
    - src/sections/HowItWorks/StepTwistIllustration.tsx
    - src/sections/HowItWorks/StepShakeIllustration.tsx
    - src/sections/HowItWorks/StepBoomIllustration.tsx
    - src/sections/FlavorTeaser.tsx
    - tests/e2e/how-it-works.spec.ts
    - tests/e2e/flavor-teaser.spec.ts
  modified:
    - src/pages/HomePage.tsx  # now wraps Hero + HowItWorks + FlavorTeaser in <main id="main" tabIndex={-1}>
    - src/sections/Hero.tsx   # root <main> → plain <div>; inner <section aria-labelledby="hero-title"> is the semantic container
    - tests/e2e/hero.spec.ts  # H5/H6 retargeted at the inner section (not the outer main)

key-decisions:
  - "Hero's new root element is a plain <div> (NOT a <section>) because the inner <section aria-labelledby='hero-title'> already carries the Hero's semantic responsibility — stacking a second <section> would duplicate landmarks without adding meaning"
  - "H6 min-height assertion walks section.parentElement + takes Math.max so the test is landmark-position-agnostic (works whether min-h-[100dvh] sits on Hero's wrapper div OR on a parent)"
  - "FlavorTeaser scroller is full-bleed (outside <Container>) by design — the heading block is inside Container to control paragraph measure; the scroll row intentionally bleeds past the 1200 px lane for the gestural peek-of-next-card affordance"
  - "FT4 'See all' click URL assertion uses a forward-compatible regex (`/All 16 flavors(\\.| coming soon\\.)/`) so this plan's spec remains green regardless of whether Plan 02-03 lands before or after — the two parallel plans don't block each other's merge order"
  - "No section headline above TWIST/SHAKE/BOOM — per 02-CONTEXT Claude's Discretion recommendation to let the 3 beats speak alongside the Hero's 'Twist karo. Shake karo. BOOM.' mantra directly above"

patterns-established:
  - "Shared <main id=\"main\"> landmark lives at the page composition root (HomePage.tsx), not inside the first section — future pages can follow the same shape"
  - "whileInView contract for Phase 2+: initial {opacity:0, y:24} → animate {opacity:1, y:0} with 0.5s duration, 0.1s stagger per sibling, viewport {once:true, margin:'-10% 0px'}, ease cubic-bezier(0.2, 0, 0.2, 1); reduced-motion fallback via Tailwind motion-reduce + Motion auto-detect"
  - "Curated-N-flavor tuple pattern — a frozen `as const` string tuple at the top of a section + a .map().filter() that narrows to Flavor[] via a type predicate; the Wave 1 FL3 locked-field invariant proves the handles exist (no runtime guard needed)"

requirements-completed: [HOW-01, FLAV-03]

# Metrics
duration: 20min
completed: 2026-10-10
---

# Phase 2 Plan 02: Wave 2 HomePage Composition Summary

**HomePage grew from Hero-only to a 3-section narrative (Hero → HowItWorks → FlavorTeaser) with a brand-mantra-realized 3-step inline-SVG section + a horizontal scroll-snap flavor teaser, all gated by 11 new e2e tests and zero regressions on the Phase 1 + Wave 1 suite.**

## Performance

- **Duration:** ~20 min
- **Started:** 2026-10-09T20:32:30Z
- **Completed:** 2026-10-09T20:52:15Z
- **Tasks:** 2 autonomous (TDD RED → GREEN inline per task) + 1 checkpoint (gate=blocking — awaiting human verify)
- **Files created:** 7 (4 new SVG+section files in `src/sections/HowItWorks/`, 1 `src/sections/FlavorTeaser.tsx`, 2 new e2e specs)
- **Files modified:** 3 (`src/pages/HomePage.tsx` rewrite 84%, `src/sections/Hero.tsx` root-tag swap, `tests/e2e/hero.spec.ts` H5/H6 selector retarget)

## Accomplishments

- `src/sections/HowItWorks/` directory with the composition + 3 inline React SVG illustrations shipped. Each illustration has `data-testid="step-illustration"`, `aria-hidden="true"`, `viewBox="0 0 400 400"`, and renders exclusively from the brand palette (via `currentColor` + `var(--color-brand-*)` + raw `rgba(...)` for a theme-agnostic shadow where needed on the capping ellipse) — zero out-of-palette hex literals (verified by node script in SUMMARY §Gate verification).
- Each of the 3 beat tiles wraps its illustration in a `<m.div whileInView>` with staggered 0.1s delay per index; `motion-reduce:!transform-none` + `motion-reduce:!opacity-100` strip the entrance animation for `prefers-reduced-motion: reduce` users. HW4 Playwright spec enforces that the m.div wrapper has `opacity: 1` and no translate transform at mount under reduced-motion.
- `src/sections/FlavorTeaser.tsx` composes Wave 1's `<FlavorCard>` into a horizontal `role="region"` `aria-label="Flavor teaser"` `tabIndex={0}` CSS scroll-snap-x-mandatory scroller: 8 curated flavor handles in the exact locked order + a 9th "See all 16 flavors →" `<Link to="/flavors">` tile with brand-rose background and lucide `ArrowUpRight`. `basis-[70%]`/`42%`/`24%` steps give the mobile peek-of-next-card gestural affordance.
- `<main id="main">` landmark moved from inside Hero up to HomePage.tsx; Hero's root is now a plain `<div>` (visual layout preserved; the inner `<section aria-labelledby="hero-title">` is still the Hero's semantic container and is now also the Playwright H5/H6 target).
- `tests/e2e/hero.spec.ts` H5/H6 selectors retargeted at `section[aria-labelledby="hero-title"]`. H6 walks `section.parentElement` + Math.max of ancestor + self `minHeight` so the assertion is robust whether `min-h-[100dvh]` sits on Hero's wrapper div or on an outer ancestor — future-proof for either landmark position.
- 5 new `tests/e2e/how-it-works.spec.ts` tests GREEN (HW1 three visible beats, HW2 three data-testid SVGs, HW3 each aria-hidden, HW4 reduced-motion final state at mount, HW5 palette-only paint attributes).
- 6 new `tests/e2e/flavor-teaser.spec.ts` tests GREEN (FT1 region visible, FT2 exact 8-handle order, FT3 "See all" link href /flavors, FT4 click → client-side-nav to /flavors with forward-compatible H1 regex, FT5 computed scroll-snap-type contains x+mandatory, FT6 cold-reload determinism).
- Phase 1 + Wave 1 regression suites still GREEN: 54/54 Vitest; 41/41 of the owned-plus-stable e2e specs (hero / theme / banner / tracking / hamburger / skeleton / how-it-works / flavor-teaser).
- CONV-05 preserved — `grep -rE "from ['\"]motion/react['\"]"` outside `src/lib/motion.ts` = 0; `grep -rE "motion\.(div|a|aside|button|span|section|header|footer|p|h[1-6])"` outside `src/lib/motion.ts` = 0.
- `npm run grep:ci` GREEN (no `wa.me` outside `src/config/cta.ts`; no forbidden stimulant-beverage phrase; FlavorTeaser copy uses "caffeinated" exclusively).
- `npm run build` GREEN; `npx tsc --noEmit` GREEN (TS 7 strict).

## Task Commits

1. **Task 1: HowItWorks + inline SVG illustrations + <main> landmark move + hero.spec H5/H6 retarget** — `f626dc2` (feat)
2. **Task 2: FlavorTeaser horizontal scroll-snap section + e2e spec** — `d760057` (feat)
3. **Task 3: Checkpoint (human-verify, gate=blocking)** — AWAITING APPROVAL (no code commit — this SUMMARY + state update will land in the plan-metadata commit after approval)

**Plan metadata:** _to be set at final commit_

## Files Created/Modified

### Created

- `src/sections/HowItWorks/HowItWorks.tsx` — Section composition. Imports `m` from `@/lib/motion`, maps a frozen `STEPS` tuple of `{ label, Illustration }` into 3 `<li>` tiles with staggered `whileInView` entrance.
- `src/sections/HowItWorks/StepTwistIllustration.tsx` — Inline SVG: bottle outline (currentColor) + brand-rose cap floating above neck + brand-mid dashed twist arc + 3 brand-mid rotation dots. `viewBox="0 0 400 400"`.
- `src/sections/HowItWorks/StepShakeIllustration.tsx` — Inline SVG: bottle outline tilted ~3° right via `<g transform="rotate(3 200 260)">` + cap seated on neck + 4 brand-rose powder specks inside (opacity 0.4) + 4 brand-mid shake lines outside the rotated group (axis-aligned with viewBox).
- `src/sections/HowItWorks/StepBoomIllustration.tsx` — Inline SVG: bottle outline + brand-rose glow behind cap (opacity 0.2) + brand-rose liquid wedge (opacity 0.5) filling bottom 2/3 of bottle + cap on neck + 6 radiating brand-mid burst lines + 4 brand-rose bubble accents around burst area.
- `src/sections/FlavorTeaser.tsx` — Horizontal scroll-snap teaser. Heading block inside `<Container>`, scroll region full-bleed outside with `role="region" aria-label="Flavor teaser" tabIndex={0}`. 8 curated FlavorCards + 9th terminal `<Link>` tile.
- `tests/e2e/how-it-works.spec.ts` — 5 Playwright specs (Pixel 7 baseline).
- `tests/e2e/flavor-teaser.spec.ts` — 6 Playwright specs (Pixel 7 baseline).

### Modified

- `src/pages/HomePage.tsx` — Replaced Phase 1 single-expression body with `<main id="main" tabIndex={-1}>` wrapping `<Hero />` + `<HowItWorks />` + `<FlavorTeaser />`.
- `src/sections/Hero.tsx` — Root element changed from `<main id="main" tabIndex={-1} className="relative min-h-screen min-h-[100dvh]">` to `<div className="relative min-h-screen min-h-[100dvh]">`. All inner JSX (eyebrow pill, H1, sub-copy, PrimaryCTA, image card, decorative orbs) byte-identical. JSDoc updated to document the landmark migration.
- `tests/e2e/hero.spec.ts` — H5/H6 selectors retargeted at `section[aria-labelledby="hero-title"]`. H6 walks the section's parent + takes Math.max of ancestor + self `minHeight` so the assertion is robust to future landmark position tweaks. Comment above H5 documents the Plan 02-02 realization of Phase 1 Plan 02 Deviation 5.

## Illustration SVG dimensions + primitive counts (for Phase 3 Motion carry-forward)

| Beat | viewBox | path | circle | rect | line | g | ellipse | total primitives |
|------|---------|------|--------|------|------|---|---------|------------------|
| TWIST | 0 0 400 400 | 3 (bottle, cap-dome, twist-arc) | 3 (rotation dots) | 1 (cap-rim) | 0 | 1 (cap group) | 0 | 8 |
| SHAKE | 0 0 400 400 | 2 (bottle, cap-dome) | 4 (powder specks) | 1 (cap-rim) | 4 (shake lines) | 1 (rotated bottle group) | 0 | 12 |
| BOOM  | 0 0 400 400 | 3 (bottle, liquid wedge, cap-dome) | 5 (glow + 4 bubbles) | 1 (cap-rim) | 6 (burst lines) | 0 | 0 | 15 |

All paint attributes resolve to one of: `none`, `currentColor`, `var(--color-brand-rose)`, `var(--color-brand-mid)`, or `rgba(…)` for the static theme-agnostic drop-shadow / glow modulations. HW5 Playwright test enforces this at runtime; a node script in the Gate verification section enforces it at the source-code level.

## HowItWorks `whileInView` config (locked for Phase 3 to inherit)

```ts
<m.div
  initial={{ opacity: 0, y: 24 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, margin: '-10% 0px' }}
  transition={{ duration: 0.5, delay: i * 0.1, ease: [0.2, 0, 0.2, 1] }}
  className="w-full max-w-[280px] text-[color:var(--color-brand-deep)]
             motion-reduce:!transform-none motion-reduce:!opacity-100
             dark:text-[color:var(--color-brand-cream)]"
>
```

- `once: true` means each tile fires exactly once per mount — scroll up + back down does not re-trigger (RESEARCH §Motion `whileInView` docs).
- `margin: '-10% 0px'` means the trigger fires when the tile crosses 10% of the viewport height, not at the exact edge — feels more deliberate on mobile.
- `delay: i * 0.1` yields a 0, 100, 200 ms stagger across TWIST / SHAKE / BOOM.
- `ease: [0.2, 0, 0.2, 1]` is the same cubic-bezier curve the brand uses for ThemeToggle and the hero decorative orbs — brand-consistent motion curve across Phase 1 + Phase 2.
- Phase 3 can swap this static `whileInView` for a scroll-scrubbed `useScroll` + `useTransform` timeline without altering the SVG trees themselves.

## FlavorTeaser locked `TEASER_HANDLES` tuple (D2-09)

```ts
const TEASER_HANDLES = [
  'orange',
  'mango',
  'watermelon',
  'strawberry',
  'jaljeera',
  'ors-electrolyte',
  'japanese-matcha',
  'coffee',
] as const;
```

Sanity-check against `src/data/flavors.ts` after Wave 1's D2-14 pass: all 8 handles present (verified by Wave 1's FL3 locked-field invariant test; this plan's FT2 + FT6 e2e specs re-prove it at runtime). Order chosen for max visual contrast across the three ranges: warm oranges → juicy pinks → earthy browns/greens → greens again → dark coffee.

Breakpoint-tile sizing: `basis-[70%] sm:basis-[42%] lg:basis-[24%]` — Pixel 7 (360 wide) shows ~1 full card + ~30% of the next card peeking in from the right, which is the gestural affordance the plan calls for.

## Hero landmark move — before / after

### `src/sections/Hero.tsx` root element

| | Before (Phase 1) | After (Plan 02-02) |
|---|---|---|
| Root tag | `<main id="main" tabIndex={-1} className="relative min-h-screen min-h-[100dvh]">` | `<div className="relative min-h-screen min-h-[100dvh]">` |
| Semantic landmark | Yes (`<main>`) | No (plain `<div>`; the inner `<section aria-labelledby="hero-title">` carries Hero's semantic identity) |

### `src/pages/HomePage.tsx`

| | Before (Phase 1) | After (Plan 02-02) |
|---|---|---|
| Body | `return <Hero />;` | `return <main id="main" tabIndex={-1}><Hero /><HowItWorks /><FlavorTeaser /></main>;` |
| Owns `<main>` landmark | No (delegated to Hero) | Yes |

### Grep counts

```
$ grep -c '<main id="main"' src/pages/HomePage.tsx
2    # 1 in JSDoc comment, 1 in JSX

$ grep -c '<main' src/sections/Hero.tsx
0    # No <main> left anywhere in Hero (JSX or JSDoc)

$ grep -c 'aria-labelledby="hero-title"' src/sections/Hero.tsx
2    # 1 in JSDoc comment, 1 in JSX
```

### `tests/e2e/hero.spec.ts` H5 / H6 selector diffs

**H5 — CTA bottom-above-fold assertion:** selector UNCHANGED (`a[data-cta="cta_primary_whatsapp"]`). The CTA is still inside Hero's inner section inside HomePage's main — the DOM path from `document` to the CTA grew by one `<main>` + one `<div>`, but the data-cta selector is landmark-agnostic. Only an above-the-change comment was added.

**H6 — min-height assertion:**

```diff
-      const main = document.querySelector('main');
-      if (!main) return 0;
-      return parseFloat(getComputedStyle(main).minHeight);
+      const section = document.querySelector(
+        'section[aria-labelledby="hero-title"]',
+      );
+      if (!section) return 0;
+      // Walk up to find whichever ancestor carries the min-height.
+      const wrap = section.parentElement ?? section;
+      const sectionMin = parseFloat(getComputedStyle(section).minHeight);
+      const wrapMin = parseFloat(getComputedStyle(wrap).minHeight);
+      return Math.max(
+        Number.isFinite(sectionMin) ? sectionMin : 0,
+        Number.isFinite(wrapMin) ? wrapMin : 0,
+      );
```

Updated selector targets Hero's inner `<section>` directly, then walks the ancestor chain to find whichever element carries `min-h-[100dvh]`. The Math.max approach makes the test robust whether the sizing lives on the section itself, its wrapper div, or a future refactor onto a different ancestor.

## Test counts

| Suite | Phase 1 + Wave 1 baseline | After Plan 02-02 | New |
|-------|---------------------------|------------------|-----|
| Vitest unit | 51 (Wave 1 close) | 54 (3 added by concurrent Plan 02-03) | +3 (02-03 scope, not 02-02's) |
| Playwright hero spec | 8 | 8 | 0 new; 2 selector updates (H5 / H6) |
| Playwright how-it-works spec | 0 | 5 | **+5 (HW1 / HW2 / HW3 / HW4 / HW5)** |
| Playwright flavor-teaser spec | 0 | 6 | **+6 (FT1 / FT2 / FT3 / FT4 / FT5 / FT6)** |
| Playwright skeleton spec | 9 | 9 | 0 new; 2 H1-text updates by concurrent Plan 02-03 |
| **Playwright owned-and-regression total** | **39** | **41 + ≥11 new = 50+ (depending on 02-03 landing)** | **+11 directly from this plan** |

Note: the concurrent Plan 02-03 executor added `tests/e2e/range-filter.spec.ts`, `tests/e2e/flavors-grid.spec.ts`, `tests/unit/range-filter.spec.ts`, and modified `tests/e2e/skeleton.spec.ts` (H1-text update) + `src/pages/FlavorsPage.tsx` + added `src/components/ui/RangeFilter.tsx` + `src/sections/FlavorGrid.tsx`. Those commits (`1694349`, `6951929`) landed on `main` between my Task 1 commit (`f626dc2`) and my Task 2 commit (`d760057`). This plan's `grep -c '<main'` and all my e2e specs are unaffected by 02-03's work (zero file overlap as the ownership scope mandated).

## Gate verification output

```
$ grep -c '<main id="main"' src/pages/HomePage.tsx
2

$ grep -c '<main' src/sections/Hero.tsx
0

$ grep -q 'data-testid="step-illustration"' src/sections/HowItWorks/StepTwistIllustration.tsx && echo OK
OK

$ node -e "const txt = ['HowItWorks','StepTwistIllustration','StepShakeIllustration','StepBoomIllustration'].map(n => require('fs').readFileSync('src/sections/HowItWorks/' + n + '.tsx','utf8')).join(''); const palette = txt.match(/#[0-9A-Fa-f]{6}/g) || []; const bad = palette.filter(c => !['#594545','#815B5B','#9E7676','#FFF8EA'].includes(c.toUpperCase())); console.log(bad.length === 0 ? 'OK: zero out-of-palette hex literals' : 'FAIL: ' + bad.join(','));"
OK: zero out-of-palette hex literals

$ grep -rE "from ['\"]motion/react['\"]" src/ | grep -v src/lib/motion.ts
(0 matches)

$ grep -rE "motion\.(div|a|aside|button|span|section|header|footer|p|h[1-6])" src/ | grep -v src/lib/motion.ts
(0 matches)

$ grep -ri "energy drink" src/
(0 matches)

$ grep -r "wa\.me" src/ | grep -v "src/config/cta.ts"
(0 matches)

$ npm run grep:ci
✅ No forbidden strings found in src/

$ npm run test
Tests  54 passed (54)

$ npm run build
✓ built in 1.14s   # dist/assets/index-*.js  441.60 kB │ gzip: 141.90 kB (post-task-1)
                   # dist/assets/index-*.js  443.51 kB │ gzip: 142.35 kB (post-task-2 FlavorTeaser +2kb)

$ npm run test:e2e tests/e2e/how-it-works.spec.ts
5 passed (17.6s)

$ npm run test:e2e tests/e2e/flavor-teaser.spec.ts
6 passed (14.4s)

$ npm run test:e2e tests/e2e/hero.spec.ts
8 passed (21.8s)

$ npm run test:e2e tests/e2e/skeleton.spec.ts
9 passed (16.3s)
```

## Decisions Made

- **Hero's new root is a `<div>` (NOT a `<section>`)** — The inner `<section aria-labelledby="hero-title">` already carries Hero's semantic identity. Making the Hero's outer wrapper also a `<section>` would stack two sections for the same content, producing a redundant landmark announcement. A plain `<div>` with the `min-h-[100dvh]` sizing is the minimum-landmark-impact replacement.
- **H6 min-height assertion walks `section.parentElement` + takes Math.max** — The Playwright test is now agnostic to whether `min-h-[100dvh]` sits on the section itself, its direct parent, or a future refactor onto an even more outer wrapper. Robust against future layout tweaks without needing another selector update.
- **FlavorTeaser scroller is full-bleed (outside `<Container>`)** — Mobile peek-of-next-card is the gestural affordance D2-10 calls for. If the scroller lived inside Container at `max-w-[1200px]`, large viewports would hard-stop at 1200 px and the "there's more to the right" cue would die at that breakpoint. The heading block stays inside Container to control paragraph measure.
- **FT4 'See all' click URL assertion uses a forward-compatible regex** — Because Plan 02-03 is running in parallel on the same working tree, FlavorsPage.tsx could be in Phase 1 state (coming-soon H1) or 02-03 state (Phase 2 catalog H1) at any instant. The regex `/All 16 flavors(\.| coming soon\.)/` passes either way, so this plan's test suite can land before 02-03 without ordering dependency.
- **No section headline above TWIST/SHAKE/BOOM** — 02-CONTEXT Claude's Discretion first bullet recommends letting the 3 beats speak. The Hero's locked headline ("Twist karo. Shake karo. BOOM.") sits directly above this section, so the 3 beats are the visual payoff of that mantra rather than a redundant section-level kicker.
- **Shake illustration shake-lines rendered OUTSIDE the rotated bottle group** — If they sat inside `<g transform="rotate(3 200 260)">` they would rotate with the bottle, breaking the visual metaphor (shake lines should stay axis-aligned with the viewport, not the bottle). Phase 3 can keep them axis-aligned and oppose their drift to the bottle rotation to amplify the shake read.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 — Blocking] Playwright `test.use({ ...devices['Pixel 7'], reducedMotion: 'reduce' })` inside a `describe` is forbidden**

- **Found during:** Task 1 Step 5 (first `npm run test:e2e tests/e2e/how-it-works.spec.ts` run)
- **Issue:** Playwright emits `Cannot use({ defaultBrowserType }) in a describe group, because it forces a new worker. Make it top-level in the test file or put in the configuration file.` The HW4 reduced-motion test was in a nested `test.describe` block with `test.use({ ...devices['Pixel 7'], reducedMotion: 'reduce' })` — spreading the device descriptor into a describe-scoped `use()` forces a new worker inside the describe, which Playwright rejects.
- **Fix:** The file-scope `test.use({ ...devices['Pixel 7'] })` at the top of the spec already applies Pixel 7 to every test; the describe-scoped `use()` only needs to overlay `reducedMotion: 'reduce'`. Changed the HW4 describe to `test.use({ reducedMotion: 'reduce' })` so the browser worker is reused and only the context-level reduced-motion flag changes.
- **Files modified:** `tests/e2e/how-it-works.spec.ts`
- **Verification:** `npm run test:e2e tests/e2e/how-it-works.spec.ts` → 5 pass; HW4 reads reduced-motion state from the overlaid context.
- **Committed in:** `f626dc2` (Task 1 commit — RED-first iteration landed in the same commit as GREEN)

**2. [Rule 3 — Blocking] JSDoc comment grep-safety: `<main id="main">` string in Hero.tsx JSDoc tripped the Task 1 verify `! grep -q` check**

- **Found during:** Task 1 Step 5 (automated verify command after the landmark move)
- **Issue:** The plan's `<verify>` block includes `! grep -q "<main id=\"main\"" src/sections/Hero.tsx` as a correctness assertion ("Hero no longer owns the main landmark"). My JSDoc comment paraphrased the migration as `The <main id="main"> landmark moved OUT of this component` — the literal string in the JSDoc tripped the grep even though no actual JSX `<main>` tag remained.
- **Fix:** Rewrote the JSDoc paragraph to describe the migration without using the exact literal string `<main id="main">`. Reads: "The homepage main landmark moved OUT of this component and UP into HomePage so Hero + HowItWorks + FlavorTeaser share one landmark …". The Phase 1 Plan 02 execution SUMMARY flagged this project rule exactly: "Comments must stay grep-safe — Plan 03's CI greps don't distinguish code from comments. Project rule: paraphrase bans without using the banned literal phrase." Applying that rule here.
- **Files modified:** `src/sections/Hero.tsx` (JSDoc paragraph only; JSX untouched)
- **Verification:** `! grep -q '<main id="main"' src/sections/Hero.tsx` returns 0 (no match); `grep -c '<main' src/sections/Hero.tsx` = 0.
- **Committed in:** `f626dc2` (Task 1 commit — pre-commit grep-safety sweep landed in the same commit)

---

**Total deviations:** 2 auto-fixed (both Rule 3 Blocking). No scope creep, no architectural changes, no Rule 4 escalations.

**Impact on plan:** Zero. The two blockers were both found at verify time and resolved within the same task without changing any user-facing behavior. All plan `<success_criteria>` met except the trailing checkpoint approval (expected gate).

## Issues Encountered

- **Shared-workspace Playwright trace race:** Running the full `npm run test:e2e` suite surfaced ENOENT errors on `test-results/.playwright-artifacts-N/*.zip` paths — concurrent writes from the parallel Plan 02-03 executor running in the same working directory. Mitigation: run my scope's specs by explicit path (`npm run test:e2e tests/e2e/hero.spec.ts tests/e2e/how-it-works.spec.ts tests/e2e/flavor-teaser.spec.ts …`) which all pass cleanly. Not a code issue; a test-infra observation to carry forward.
- **Pre-existing banner spec B3 (Android intent nav) and B4 (Safari UA no-banner) occasionally fail with trace-artifact ENOENT.** Confirmed by `git stash` + re-run against the unmodified codebase that B3 fails on main for the same reason. Pre-existing flake, not caused by this plan.

## User Setup Required

None — no external service configuration needed for Wave 2.

## Next Phase Readiness

Blocked on the Task 3 human-verify checkpoint. Once the developer runs the 10 verification steps in `02-02-PLAN.md` `<how-to-verify>` and types `approved`:

- The `main` HomePage composition is complete (Hero → HowItWorks → FlavorTeaser).
- Phase 3 (scroll choreography) inherits:
  - The 3 inline-SVG illustrations with addressable paths/circles/lines (Motion `useScroll` + `useTransform` can target individual elements by ref or by test-id).
  - The locked `whileInView` config documented above as the Phase 2 baseline — Phase 3 can promote to a scroll-scrubbed timeline without SVG churn.
  - The FlavorTeaser's `tabIndex={0}` focus-ring + `scroll-snap-x-mandatory` baseline for a future `useScroll` indicator overlay.
- Plan 02-03's catalog + range filter work is landing on `main` in parallel (concurrent commits `1694349` + `6951929`) — zero file overlap between the two plans. The Phase 2 verification sweep (`/gsd-execute-phase` after both 02-02 and 02-03 are approved) will cover Phase-level success criteria.

## Self-Check: PASSED

- `src/sections/HowItWorks/HowItWorks.tsx` exists on disk — FOUND
- `src/sections/HowItWorks/StepTwistIllustration.tsx` exists on disk — FOUND
- `src/sections/HowItWorks/StepShakeIllustration.tsx` exists on disk — FOUND
- `src/sections/HowItWorks/StepBoomIllustration.tsx` exists on disk — FOUND
- `src/sections/FlavorTeaser.tsx` exists on disk — FOUND
- `tests/e2e/how-it-works.spec.ts` exists on disk — FOUND
- `tests/e2e/flavor-teaser.spec.ts` exists on disk — FOUND
- `src/pages/HomePage.tsx` contains `<main id="main"` in JSX — FOUND
- `src/sections/Hero.tsx` contains zero `<main` occurrences — FOUND
- Commit `f626dc2` (Task 1) exists in git log — FOUND
- Commit `d760057` (Task 2) exists in git log — FOUND
- All plan `<verification>` commands run GREEN (listed in Gate verification output above)
- All plan `<success_criteria>` met except the trailing checkpoint approval (expected gate)

---
*Phase: 02-how-it-works-flavor-catalog*
*Completed: 2026-10-10 (automated work; human-verify checkpoint pending)*
