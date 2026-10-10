# Phase 3: Scroll Storytelling Polish — Research

**Researched:** 2026-10-10
**Domain:** Motion 14 scroll choreography on an existing React 19 + Vite 8 + Tailwind 4.3 SPA
**Confidence:** HIGH

## Summary

Phase 3 layers one scroll-linked signature moment (Hero cap-twist) and four `whileInView` entrance patterns (HowItWorks per-step stagger, FlavorTeaser section fade, FlavorGrid row stagger, FlavorsPage filter crossfade) on top of the already-mounted `LazyMotion domAnimation` provider from Phase 1. The 10 KB entry-bundle budget (CONV-05) is defensible: `domAnimation` ships at ~15–17 KB gzip for its own payload, but it loads **asynchronously** behind the `LazyMotion` boundary, so the entry (`m` component + the LazyMotion harness) stays at ~4.6 KB gzip. Phase 3's additions (`useScroll`, `useTransform`, `useSpring`, `useReducedMotion`, `AnimatePresence`) are all **re-exports from the core `motion/react` package already imported in `src/lib/motion.ts`** — they add bytes to the vendor chunk, not to the entry.

The 8 planner-blocking questions resolve cleanly: (1) `useScroll({ target: heroRef, offset: ['start start', 'end start'] })` is the correct binding for a 100dvh Hero rotating as it scrolls out, (2) Motion's own `useReducedMotion()` returns `boolean | null` and the SSR null case is real but harmless on this project because it is a client-rendered Vite SPA with no SSR step, (3) `domAnimation` covers all Phase 3 hooks — `domMax` is not needed, (4) `AnimatePresence mode="sync"` is correct for the FlavorsPage filter crossfade with `popLayout` held in reserve, (5) `rollup-plugin-visualizer` 7.1.1 declares `rolldown` in its `peerDependencies` and is explicitly Vite-8 compatible, (6) iOS Safari risk is minimal when sticking to `transform-origin` + `rotate` on a `<img>` wrapped in `m.div` with `will-change: transform` scoped to the animated layer only, (7) `AnimatePresence` respects `useReducedMotion` state via Motion's internal detection path (consumer typically passes `transition={{ duration: shouldReduce ? 0 : 0.16 }}` for determinism), and (8) the row-stagger problem is best solved with a **flat-index-based delay using the mobile baseline (2 columns)** — zero new files, no media-query hook, the stagger simply looks slightly denser at desktop breakpoints without visual breakage.

**Primary recommendation:** Keep `src/lib/motion.ts` exactly as-is. Add one additive sibling file `src/lib/useReducedMotion.ts` that re-exports Motion's hook. Do NOT widen the LazyMotion `features` prop from `domAnimation` to `domMax` — nothing in Phase 3 needs drag/pan/layout. Use the exact offset/transform/spring pattern codified in §Q1 of this document for the Hero cap-twist. Use `AnimatePresence mode="sync"` for the FlavorsPage filter, falling back to `mode="wait"` only if manual-pass shows grid-pumping. Wire `rollup-plugin-visualizer@^7.1.1` into `vite.config.ts` gated by `mode === 'production'`.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions (D3-01 .. D3-19 — do NOT re-litigate)

- **D3-01** Hero's signature scroll moment = cap-twist rotation. One dominant moment. No parallax halos, no flavor-swap color-wash.
- **D3-02** Twist is driven by scroll position (not entrance-only). Use `useScroll({ target: heroRef, offset: ['start start', 'end start'] })` + `useTransform` to map progress `0 → 1` to rotation `0° → 35°`.
- **D3-03** `0° → 35°` rotation, `transform-origin: 50% 100%` on the cap layer, clockwise on scroll-down.
- **D3-04** Two-layer composition: transparent-PNG cap on top of bottle-only JPG. Only the cap layer rotates. Hero's user-approved composition is preserved exactly.
  - Assets: `/public/hero/cap.png` (transparent cap) + `/public/hero/bottle.jpg` (bottle without cap). Keep `/hero/cap-on-bottle.jpg` as reduced-motion fallback.
- **D3-05 (Claude's call)** Linear mapping by default; `useSpring({ stiffness: 100, damping: 20 })` optional smoothing if raw useTransform feels mechanical.
- **D3-06** Per-step stagger 01 → 02 → 03 in HowItWorks. Each `<li>` gets `whileInView` with per-item delay (0ms / 120ms / 240ms).
- **D3-07** Step motion = `opacity 0→1 + y 16→0`, duration 0.5s, ease `[0.2, 0, 0.2, 1]`. Matches Phase 2 pattern. Transform + opacity only.
- **D3-08** Replace right-column `m.div whileInView` with per-step `m.li whileInView`. Right column becomes plain `<div>`. Heading + eyebrow inherit the view.
- **D3-09** Video card entrance = unchanged from Phase 2. No new motion inside the video wrapper.
- **D3-10 (Claude's call)** Viewport trigger threshold = `{ once: true, margin: '-10% 0px' }`. Tunable to `-15%` during manual pass.
- **D3-11** FlavorTeaser = section-level fade+slide (`opacity 0→1 + y 32→0, 0.6s, once: true, margin: '-10% 0px'`). Individual cards do NOT stagger.
- **D3-12** FlavorGrid = row-by-row stagger via per-card `transition.delay` indexed from column position. Planner picks implementation.
- **D3-13** Range filter card swap = AnimatePresence crossfade (`opacity 1→0 / 0→1`, 0.16s). Default `mode="sync"`; fallback to `mode="wait"` if pump occurs.
- **D3-14** FlavorCard = NO new scroll motion inside the card. Existing hover `scale-[1.02]` stays.
- **D3-15** Section seams = hard-cuts from Phase 2 preserved. No gradient fades, no sweeps, no sticky headers.
- **D3-16** Reduced-motion = central `useReducedMotion` hook for scroll-linked anim + existing Tailwind `motion-reduce:` utilities for `whileInView`. New file `src/lib/useReducedMotion.ts` re-exports Motion's own hook.
- **D3-17** Bundle budget verification = `rollup-plugin-visualizer` build-only plugin → `dist/stats.html`. Manual check per release; no hard CI gate.
- **D3-18** Manual-pass evidence = developer notes + screencast at `.planning/evidence/03-scroll-polish-manual-pass.md`.
- **D3-19** Scope guard = shipped sections only. New capabilities belong in Phase 4/5.

### Claude's Discretion

- Cap-twist timing curve (linear vs useSpring smoothing).
- HowItWorks step stagger timing (0 / 120 / 240 vs 0 / 150 / 300).
- FlavorGrid intra-row stagger implementation (useMediaQuery helper vs flat index-based).
- AnimatePresence filter mode (default sync vs wait).
- Viewport trigger margins (per-section tuning).
- `vite.config.ts` visualizer options (filename / gzipSize / open).
- Hero cap+bottle asset pipeline (new separate asset vs re-flatten).
- Reduced-motion detection granularity (treat `null` as reduced during first paint).

### Deferred Ideas (OUT OF SCOPE)

- Parallax ambient halos in Hero
- Flavor-swap color-wash in Hero
- Sticky video + swapping steps in HowItWorks
- Coverflow-style card tilt in FlavorTeaser
- Marquee auto-drift on FlavorTeaser when idle
- Section seam gradient fades / accent sweep bar / sticky section eyebrows
- Nav / ThemeToggle / HamburgerMenu / PrimaryCTA scroll micro-interactions
- Playwright jank/CLS automated asserts
- Hard CI bundle-size gate on Motion chunks
- Lighthouse mobile audit as Phase 3 evidence (Phase 4 PERF-01 owns this)
- Full responsive hero `<picture>` AVIF/WebP/JPG via vite-imagetools (Phase 4)
</user_constraints>

<phase_requirements>
## Phase Requirements

Phase 3 owns **no** v1 REQ-ID directly (REQUIREMENTS.md §174: "Phase 3 is a cross-cutting polish layer…CONV-05 is re-verified in Phase 3"). The one requirement Phase 3 re-verifies but does not newly own:

| ID | Description | Research Support |
|----|-------------|------------------|
| CONV-05 | Motion animations use `LazyMotion` + `m.*` primitives (never `motion.div`); entry bundle stays <10 KB gzip for Motion | §Q3 (LazyMotion feature-import tree-shaking) confirms `domAnimation` is sufficient for all Phase 3 hooks and the entry stays ~4.6 KB; §Q5 (visualizer wiring) gives the manual verification mechanism; §Pattern Reuse documents the `motion-reduce:` + Tailwind contract that extends unchanged |

Phase 3's 4 success criteria (from ROADMAP.md §Phase 3) are observable but not uniquely owned by any REQ-ID:

1. Hero cap-twist + section entrances + flavor-card stagger animate on scroll via `useScroll` / `whileInView`; transform + opacity only.
2. All motion routes through `LazyMotion` + `m.*`; entry Motion footprint <10 KB gzip (verified via build report).
3. `prefers-reduced-motion` → static fallbacks across every section with zero layout shift vs animated path.
4. Manual pass on iPhone + Android shows no jank, no CLS, no bundle regression vs Phase 2.
</phase_requirements>

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Scroll-linked cap rotation (Hero) | Browser / Client | — | Pure CSS transform driven by `window` scroll via Motion hooks; no server/API involvement |
| Viewport-triggered entrance animations (HowItWorks, FlavorTeaser, FlavorGrid) | Browser / Client | — | Intersection-observer-driven; runs after client hydration |
| Filter-change crossfade (FlavorsPage) | Browser / Client | — | React state transition in `AnimatePresence`; no persistence |
| Reduced-motion detection | Browser / Client | — | `matchMedia('(prefers-reduced-motion: reduce)')`; browser-only API |
| Build-time bundle visualization | Build pipeline | — | Rollup/Rolldown plugin emits `dist/stats.html`; manual developer check |
| Static asset serving (`cap.png`, `bottle.jpg`) | CDN / Static | — | Vercel/Netlify edge serves from `/public/`; preload is per `index.html` pattern |

Every Phase 3 capability lives in the Browser / Client tier. There is no API, no server, no persistence surface. This is correct for a static marketing SPA.

## Standard Stack

### Core (already installed)

| Library | Version (installed) | Purpose | Why Standard |
|---------|---------------------|---------|--------------|
| `motion` | 14.0.0 (pinned in package.json; latest 14.1.0) [VERIFIED: npm registry 2026-10-10] | Scroll + viewport + presence animations | Already the project standard; renamed from framer-motion in 2024, same team, same API, leaner [CITED: motion.dev + CLAUDE.md] |
| `react` / `react-dom` | 19.3.0 | Host framework | Phase 1 locked |
| `vite` | 8.3.4 | Dev + build; Rolldown bundler | Phase 1 locked |
| `tailwindcss` | 4.3.3 | `motion-reduce:` utility family | Already everywhere in `src/` |

**No new runtime dependencies.** Every Phase 3 hook (`useScroll`, `useTransform`, `useSpring`, `useReducedMotion`, `AnimatePresence`) is a named re-export of the already-installed `motion@14` package.

### Supporting (new dev dependency)

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `rollup-plugin-visualizer` | `^7.1.1` [VERIFIED: npm registry 2026-10-10 — `npm view rollup-plugin-visualizer version` returns `7.1.1`; `peerDependencies` declares `rolldown: 1.x \|\| ^1.0.0-beta \|\| ^1.0.0-rc`; repo `github.com/btd/rollup-plugin-visualizer` first-published 2016-10-25; last updated 2026-08-14] | Emit `dist/stats.html` on `npm run build` for Motion-chunk gzip inspection | Phase 3 Wave 1; dev-only |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `rollup-plugin-visualizer` | `vite-bundle-visualizer` (one-shot CLI by KusStar) | CLI runs on-demand without a plugin wire-up, but requires `npx` on each inspection and does not persist a file in `dist/`. The plugin approach matches D3-18's "paste the Motion chunk size from `dist/stats.html` for the record" evidence requirement. |
| `useScroll({ target: ref, offset: [...] })` with scrubbed `useTransform` | `useMotionValueEvent(scrollYProgress, 'change', …)` + `setState` | `useMotionValueEvent` is for **discrete** state changes; the cap-twist is a **continuous** scrubbed value and must map pixel-for-pixel to scroll. `useTransform` is correct per Motion's own scroll-animations guide. [CITED: motion.dev/docs/react-use-scroll] |
| `useReducedMotion()` from Motion | Custom `useMediaQuery('(prefers-reduced-motion: reduce)')` hook | Motion's own hook already handles live-change (user flipping the OS setting mid-session). Writing a bespoke hook duplicates logic and would need its own test. Keep CONV-05 contract: all Motion imports through `@/lib/motion*`. |
| `AnimatePresence mode="sync"` | `mode="popLayout"` | `popLayout` is required when exiting items would cause layout shift; the FlavorsPage grid uses CSS Grid with `grid-auto-rows`, so when 16 cards become 3, the remaining 3 reflow immediately on removal — `sync` is fine. If manual-pass shows pumping, switch to `popLayout` which pulls exiting items out of flow. [CITED: motion.dev AnimatePresence docs] |

**Installation:**
```bash
npm install --save-dev rollup-plugin-visualizer@^7.1.1
```

No `dependencies` changes. Keep motion pinned to 14.0.0 (no reason to bump to 14.1.0 mid-phase).

## Package Legitimacy Audit

| Package | Registry | Age | Downloads | Source Repo | slopcheck | Disposition |
|---------|----------|-----|-----------|-------------|-----------|-------------|
| `rollup-plugin-visualizer` | npm | ~10 yrs (first publish 2016-10-25; latest `7.1.1` published 2026-08-14) | widely used in Vite/Rollup ecosystem | `github.com/btd/rollup-plugin-visualizer` (declared in `repository.url`) | not run (slopcheck unavailable in environment) | Approved via manual verification (long-established package, explicit Rolldown peer declaration, authoritative GitHub source) |
| `motion` | npm | package already in `dependencies` at 14.0.0 since Phase 1; latest 14.1.0 | — | official Motion team (`motiondivision/motion`) | not run | No new install — existing dependency |

**Packages removed due to slopcheck [SLOP] verdict:** none
**Packages flagged as suspicious [SUS]:** none

*Note: `slopcheck` could not be installed in this research environment. The sole new install (`rollup-plugin-visualizer`) was verified manually via `npm view` — the package has 10 years of history, declares its source repo, declares `rolldown` in `peerDependencies` (not a typosquat invention), and is referenced from `.planning/research/PITFALLS.md` line 288 as the canonical Vite bundle-visualization approach. Planner may still insert a `checkpoint:human-verify` task before `npm install` if the risk tolerance warrants it, but the manual verification is strong.*

## Architecture Patterns

### System Architecture Diagram (Phase 3 scroll/motion data flow)

```
                                                                          ┌─────────────────────────┐
                                                                          │   OS / Browser          │
                                                                          │   matchMedia('…reduce') │
                                                                          └────────────┬────────────┘
                                                                                       │
                                                                                       ▼
┌─────────────────────┐    scroll event    ┌─────────────────────┐    boolean   ┌────────────────────────┐
│ Window / document   │ ─────────────────▶ │  Motion useScroll   │              │ src/lib/useReducedMotion│
│  scrollY            │                    │  (target=heroRef)   │              │ (re-export of Motion    │
└─────────────────────┘                    │  → scrollYProgress  │              │  useReducedMotion)      │
                                           └──────────┬──────────┘              └────────────┬───────────┘
                                                      │                                      │
                                                      ▼                                      │
                                           ┌─────────────────────┐                           │
                                           │  useTransform       │                           │
                                           │  [0,1] → [0°,35°]   │                           │
                                           └──────────┬──────────┘                           │
                                                      │                                      │
                                   (optional) ┌───────▼─────────┐                            │
                                              │   useSpring     │                            │
                                              │ s:100 d:20      │                            │
                                              └───────┬─────────┘                            │
                                                      │                                      │
                                                      ▼                                      │
                                           ┌─────────────────────┐                           │
                                           │  <m.img            │ ◀─── short-circuit when ───┘
                                           │   style={{rotate}}  │        reduced === true
                                           │   transform-origin: │        (render static JPG,
                                           │   50% 100% />       │         skip useScroll wire)
                                           └─────────────────────┘

┌─────────────────────┐  element enters viewport   ┌─────────────────────┐
│ IntersectionObserver│ ─────────────────────────▶ │  m.* whileInView    │
│ (Motion internal)   │                            │  initial / animate  │
└─────────────────────┘                            │  + transition.delay │
                                                   └──────────┬──────────┘
                                                              │
                                                              ▼
                                                   ┌─────────────────────┐
                                                   │ Tailwind            │
                                                   │ motion-reduce:      │
                                                   │ !transform-none     │
                                                   │ !opacity-100        │ ◀── static fallback
                                                   └─────────────────────┘       (CSS-only, no JS)

┌──────────────────────────┐   setParams(range)   ┌──────────────────────────┐
│ FlavorsPage filter state │ ───────────────────▶ │ AnimatePresence mode=sync│
│ (useSearchParams)        │                      │ children (16 → 3 cards)  │
└──────────────────────────┘                      │ key={flavor.handle}      │
                                                  └──────────────────────────┘
```

### Component Responsibilities

| File | Phase 3 Responsibility |
|------|-----------------------|
| `src/sections/Hero.tsx` | Mount `heroRef`; split current single `<Image>` into two layered `<img>` elements (bottle JPG static, cap PNG wrapped in `m.img` with `useTransform`-driven rotate style); short-circuit to the pre-Phase-3 single `/hero/cap-on-bottle.jpg` when `useReducedMotion()` is truthy or null |
| `src/sections/HowItWorks/HowItWorks.tsx` | Replace right-column `m.div whileInView` with per-`<li>` `m.li whileInView` entries carrying `transition.delay` of 0 / 0.12 / 0.24s; convert the now-empty right-column `m.div` to a plain `<div>` |
| `src/sections/FlavorTeaser.tsx` | Wrap the `<Section>` body (headline + scroller + arrows) in a single `m.section whileInView` fade+slide; cards unchanged |
| `src/sections/FlavorGrid.tsx` | Convert `<li>` to `m.li` with per-card `transition.delay = (index % 2) * 0.12` (see §Q8 for the rationale on using mobile baseline 2) |
| `src/pages/FlavorsPage.tsx` | Wrap `<FlavorGrid flavors={visible} />` in `<AnimatePresence mode="sync">`; FlavorGrid must forward each flavor's `handle` as `key` prop (currently already does — no change needed on key wiring) |
| `src/lib/useReducedMotion.ts` | **NEW.** Single-line re-export: `export { useReducedMotion } from 'motion/react';` |
| `src/lib/motion.ts` | **No change.** Already exports `LazyMotion, m, domAnimation, AnimatePresence`. |
| `vite.config.ts` | Add `rollup-plugin-visualizer` to the `plugins` array, gated by `mode === 'production'` with `filename: 'dist/stats.html', gzipSize: true, open: false` |
| `public/hero/cap.png` | **NEW** transparent-PNG cap cutout |
| `public/hero/bottle.jpg` | **NEW** bottle without cap |
| `.planning/evidence/03-scroll-polish-manual-pass.md` | **NEW** developer-captured manual-pass notes + screencast references |

### Pattern 1: Scroll-linked rotation (Hero cap-twist)

**What:** Rotate the cap PNG from 0° to 35° as the Hero scrolls out of the viewport. Scroll-position-driven, deterministic, no autoplay.

**When to use:** The Hero section only. One signature moment per phase.

**Example:**
```tsx
// src/sections/Hero.tsx — SKELETON for the two-layer cap-twist
// Source: motion.dev/docs/react-use-scroll (API shape); CONTEXT.md D3-02..D3-05 (project parameters)
import { useRef } from 'react';
import { useScroll, useTransform, useSpring, m } from '@/lib/motion';
import { useReducedMotion } from '@/lib/useReducedMotion';

export function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const shouldReduce = useReducedMotion();
  // Treat null (SSR / first-paint) as "assume reduced" per D3-19 Claude-discretion
  // to avoid flash-of-animation on cold load. Note: this project is a client-only
  // Vite SPA (no SSR), so null in practice occurs only on the very first synchronous
  // render before Motion's matchMedia listener attaches — a single frame at most.
  const isReduced = shouldReduce !== false; // true OR null → treat as reduced

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'], // 0 when hero top meets viewport top; 1 when hero bottom leaves top
  });

  const rawRotate = useTransform(scrollYProgress, [0, 1], [0, 35]);
  // D3-05 Claude's call: linear by default. If manual pass shows mechanical feel,
  // wrap via useSpring with the following preset:
  const smoothRotate = useSpring(rawRotate, { stiffness: 100, damping: 20 });
  const rotate = smoothRotate; // or `rawRotate` for pure-linear

  if (isReduced) {
    // STATIC FALLBACK — render the original single cap-on-bottle.jpg
    // Zero layout shift vs the animated path because the enclosing <div> is identical
    return (
      <div ref={heroRef} className="relative min-h-screen min-h-[100dvh]">
        {/* …existing Hero markup with single <Image src="/hero/cap-on-bottle.jpg" /> */}
      </div>
    );
  }

  return (
    <div ref={heroRef} className="relative min-h-screen min-h-[100dvh]">
      {/* …existing Hero markup unchanged above the image slot… */}
      <div className="relative flex aspect-[3/4] w-full items-center justify-center overflow-hidden rounded-2xl bg-[color:var(--color-surface)] shadow-… ring-1 ring-…">
        <img
          src="/hero/bottle.jpg"
          alt=""
          width={800}
          height={1067}
          className="absolute inset-0 h-full w-full object-contain"
        />
        <m.img
          src="/hero/cap.png"
          alt="A CAPSHOT flavor cap twisted onto a water bottle."
          width={800}
          height={1067}
          style={{ rotate, transformOrigin: '50% 100%', willChange: 'transform' }}
          className="absolute inset-0 h-full w-full object-contain"
        />
      </div>
    </div>
  );
}
```

### Pattern 2: Per-step `whileInView` stagger (HowItWorks)

**Source:** Phase 2 whileInView pattern (HowItWorks.tsx:76–81) extended per-element.

```tsx
// src/sections/HowItWorks/HowItWorks.tsx — Phase 3 right-column shape
import { m } from '@/lib/motion';

const STEPS = [
  { num: '01', label: 'Twist', body: '…', delay: 0 },
  { num: '02', label: 'Shake', body: '…', delay: 0.12 },
  { num: '03', label: 'Boom',  body: '…', delay: 0.24 },
] as const;

// Right-column wrapper is now a PLAIN div (no m.div, no entrance)
<div className="order-1 flex flex-col items-center text-center lg:order-2 lg:items-start lg:text-left">
  <p className="…eyebrow…">Three steps</p>
  <h2 className="…">How CAPSHOT works</h2>
  <ol className="mt-8 flex w-full flex-col gap-6 sm:gap-7">
    {STEPS.map(({ num, label, body, delay }) => (
      <m.li
        key={num}
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-10% 0px' }}
        transition={{ duration: 0.5, delay, ease: [0.2, 0, 0.2, 1] }}
        className="flex items-start gap-4 text-left sm:gap-5 motion-reduce:!transform-none motion-reduce:!opacity-100"
      >
        {/* …step content… */}
      </m.li>
    ))}
  </ol>
</div>
```

The video card (`m.div` at line 75) is **unchanged** — D3-09 locked this.

### Pattern 3: Section-level fade+slide (FlavorTeaser)

```tsx
// src/sections/FlavorTeaser.tsx — wrap the Section body in a single m.section
import { m } from '@/lib/motion';

<Section className="pt-8 sm:pt-12 md:pt-16" background="bg">
  <m.section
    initial={{ opacity: 0, y: 32 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-10% 0px' }}
    transition={{ duration: 0.6, ease: [0.2, 0, 0.2, 1] }}
    className="motion-reduce:!transform-none motion-reduce:!opacity-100"
  >
    {/* …existing Container(headline) + Container(scroller + arrows) unchanged… */}
  </m.section>
</Section>
```

Note: existing `useRef` + chevron state on the scroller is untouched. The `m.section` wraps *outside* the scroller and does not interfere with CSS scroll-snap.

### Pattern 4: Row-by-row grid stagger (FlavorGrid)

See §Q8 for the full rationale. The recommended implementation:

```tsx
// src/sections/FlavorGrid.tsx — Phase 3 shape
import { m } from '@/lib/motion';

<ul className="mt-8 grid grid-cols-2 gap-4 sm:mt-12 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 lg:gap-6">
  {flavors.map((f, i) => (
    <m.li
      key={f.handle}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{ duration: 0.4, delay: (i % 2) * 0.12, ease: [0.2, 0, 0.2, 1] }}
      className="motion-reduce:!transform-none motion-reduce:!opacity-100"
    >
      <FlavorCard flavor={f} />
    </m.li>
  ))}
</ul>
```

### Pattern 5: AnimatePresence crossfade (FlavorsPage filter)

```tsx
// src/pages/FlavorsPage.tsx — wrap FlavorGrid in AnimatePresence
import { AnimatePresence } from '@/lib/motion';

<AnimatePresence mode="sync">
  <FlavorGrid key={active ?? 'all'} flavors={visible} />
</AnimatePresence>
```

Important: the AnimatePresence child must have a **stable key tied to the filter**, not the flavor list identity, so the whole grid exits + enters as one unit when the filter flips. The per-card `m.li key={flavor.handle}` inside FlavorGrid is a separate concern that enables intra-grid animations if we ever add them — Phase 3 does not need it to drive the crossfade.

Alternative wiring (per-card exits — more granular but higher re-animation cost): keep `AnimatePresence` outside, give FlavorGrid children `exit={{ opacity: 0 }}` and let the keys do the work. Recommended default is the simpler whole-grid key approach above; switch to per-card exits only if manual pass shows the whole-grid approach feels abrupt.

### Anti-Patterns to Avoid

- **`motion.div` anywhere outside `src/lib/motion.ts`** — breaks CONV-05 and the CI grep from Phase 1 Plan 03 will catch it. Phase 3 adds `m.img` to the allowed element list; the grep script (`scripts/ci-grep-forbidden-strings.mjs`) already matches `motion.(div|a|button|span|...)` and should extend transparently.
- **`style={{ width: … }}` or `top` / `left` animations** — CPU-triggered layout. Phase 3 success criterion #1 and PITFALLS.md Pitfall 9 both forbid this. Only `transform` and `opacity`.
- **`useTransform` on absolute `scrollY`** — don't do `const y = useTransform(scrollY, [0, 500], …)` with hardcoded pixel ranges; it breaks across viewport heights. The `useScroll({ target, offset })` + `scrollYProgress` (0..1) pattern is viewport-agnostic.
- **`useReducedMotion` branching that returns different DOM trees without a stable wrapper** — can trigger re-mount when Motion's hook flips from `null` → `boolean` after first paint. Keep the enclosing `<div ref={heroRef}>` identical between the reduced and animated branches so the ref remains stable.
- **`will-change: transform` on the parent container** — scoped `will-change` on the animated `m.img` only. Setting it broadly keeps elements promoted to their own layer permanently and inflates memory on mobile Safari.
- **Nested `<LazyMotion>` providers** — the top-level provider in `App.tsx` already covers the whole route tree. Do not re-mount `LazyMotion` inside Hero or any section — it would double-load the features bundle.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Scroll progress tracking | Custom `window.addEventListener('scroll', …)` + `getBoundingClientRect` loop | `useScroll({ target: heroRef, offset: [...] })` | Motion's implementation uses passive scroll listeners + rAF throttling + an IntersectionObserver pre-check to avoid work when the target is far off-screen. Rolling your own skips all three optimizations. |
| Viewport-based entrance triggers | Custom `IntersectionObserver` + `useState(visible)` | `m.* whileInView={...} viewport={{ once: true, margin: '-10% 0px' }}` | `whileInView` wraps IntersectionObserver with declarative semantics, auto-cleans on unmount, auto-respects `prefers-reduced-motion` via Motion's internal detection path. |
| Reduced-motion detection | Custom `useMediaQuery` for `(prefers-reduced-motion: reduce)` | `useReducedMotion()` from `@/lib/useReducedMotion` | Motion's hook handles live-change (user flipping OS setting mid-session), returns a stable value, no manual cleanup. |
| Exit animations when filter removes items | Manual `setTimeout` → `unmount` dance | `<AnimatePresence>` + `exit={...}` | React's reconciler unmounts synchronously otherwise. `AnimatePresence` defers unmount until exit anim completes. |
| Smoothing a scrubbed scroll value | Custom lerp loop driven by rAF | `useSpring(motionValue, { stiffness, damping })` | Motion wraps the motion value in a spring with proper step-function integration; writing it from scratch is 30 lines of easily-wrong math. |
| Bundle-size inspection | Grep output of `vite build` manually | `rollup-plugin-visualizer` → `dist/stats.html` | Visualizer gives gzip-aware per-chunk + per-module breakdown that reveals whether Motion is in the entry or deferred. |

**Key insight:** Motion ships the four primitives Phase 3 needs (`useScroll`, `whileInView`, `useReducedMotion`, `AnimatePresence`) specifically because the hand-rolled versions are each a 20–50 line footgun. The 10 KB budget pays for exactly these primitives.

## Common Pitfalls

### Pitfall 1: `useScroll({ target: heroRef })` returns `scrollYProgress = 0` forever when `heroRef.current` is null during first render

**What goes wrong:** Pass a freshly-created `useRef(null)` as `target` and Motion silently falls back to tracking the document, not your element. The rotation then responds to any scroll on the page, not just the Hero scroll.

**Why it happens:** `useRef` creates its object synchronously but `heroRef.current` is `null` until the DOM element mounts. `useScroll` runs during that first render.

**How to avoid:** Motion handles this correctly in modern versions — if `target.current` is null at hook-run time it attaches a listener that updates once the ref populates. Verify in manual pass that the first-render frame does not jump; if it does, add a `layoutEffect: true` option to the `useScroll` config so the hook runs after layout.

**Warning signs:** Rotation starts non-zero on page load, or rotation responds to scroll on other sections. [MEDIUM confidence — CITED by motion.dev/docs/react-use-scroll via WebSearch 2026-10-10]

### Pitfall 2: `useReducedMotion()` returns `null` during first render, causing a flash-of-animation on cold load

**What goes wrong:** Motion's hook returns `null` on the server **and in the very first client render** before the matchMedia listener fires. If you check `if (shouldReduce)` and treat the null case as "do animate", a reduced-motion user sees one frame of the animated path before the hook flips to `true` and the component re-renders into the static fallback.

**Why it happens:** `matchMedia` isn't read until after the first commit on some React versions.

**How to avoid:** Treat `null` as reduced (D3-19 Claude's-discretion locks this). Use `const isReduced = shouldReduce !== false;` — `true` and `null` both route to the static fallback. Only `false` (confirmed matchMedia miss) routes to the animated path.

**Warning signs:** Reduced-motion users report a visible "jump" on page load across page refreshes. [HIGH confidence — multiple SSR hydration issue reports cited in WebSearch; useReducedMotion returning null is well-documented behavior]

### Pitfall 3: Motion full-bundle regression from an accidental `motion.div` import

**What goes wrong:** A dev adds `import { motion } from 'motion/react'` + `<motion.div>` somewhere in `src/`. This bypasses `LazyMotion` entirely and pulls the full ~34 KB gzip motion component into the entry chunk.

**Why it happens:** First-page examples in Motion/Framer Motion docs show `<motion.div>`. Autocomplete suggests `motion` before `m`.

**How to avoid:** Phase 1 Plan 03 shipped a CI grep (`npm run grep:ci`) that blocks `motion.(div|a|button|span|…)` outside `src/lib/motion.ts`. Phase 3 does not need to re-ship this gate — it already exists.

**Warning signs:** `dist/stats.html` shows a chunk containing `motion` modules at ~34 KB gzip in the entry, not a separately-named async chunk. [HIGH confidence — PITFALLS.md Pitfall 9]

### Pitfall 4: AnimatePresence children lose their stable key on filter changes

**What goes wrong:** If `<FlavorGrid flavors={visible} />` recreates its `visible` array identity on every render (via `useMemo` dropping dependencies), AnimatePresence sees "same keys, same identities" and skips the exit animation.

**Why it happens:** React reconciles by key. If the key stays the same, AnimatePresence doesn't fire exit.

**How to avoid:** The current `FlavorsPage.tsx:59–62` uses `useMemo` keyed on `active` — correct. The key wiring on `FlavorGrid`'s `<li>` is `key={f.handle}` — correct and already stable. For the whole-grid crossfade (Pattern 5), use a filter-tied key on `<FlavorGrid key={active ?? 'all'}>` so AnimatePresence sees a new child when the filter flips.

**Warning signs:** Filter changes feel "instant" with no crossfade; no exit animation ever fires. [HIGH confidence — Motion AnimatePresence docs are explicit on key stability]

### Pitfall 5: iOS Safari layer promotion from `transform-origin` + `rotate` on an `<img>` causes blurry text underneath

**What goes wrong:** Setting `transform-origin: 50% 100%` + a continuous `rotate` promotes the cap `<img>` to its own composite layer, which is correct. But if the enclosing `<div>` also has a drop-shadow or `backdrop-filter`, iOS Safari may re-rasterize the layer every scroll frame, causing visible blur on the Hero text behind the halo.

**Why it happens:** iOS Safari's composite path for layers that intersect filters is slower than Chrome's and can hit the main thread.

**How to avoid:** The current Hero has an ambient halo (`<div className="h-[82%] w-[82%] rounded-full bg-… opacity-25 blur-3xl">`) **outside** the image card ring. Keep it there — do not nest the halo inside the same containing block as the rotating cap. Also add `will-change: transform` to the `m.img` **only** (not to its parent), and avoid adding any `filter:` property to the cap layer itself.

**Warning signs:** Hero text appears to lose anti-aliasing briefly during scroll; Hero section feels "sluggish" on iPhone 11/12 class devices. [MEDIUM confidence — iOS Safari 2D/3D transform documentation + general composite-layer practice; no specific Phase 3 report yet because the asset has not shipped]

### Pitfall 6: Cross-fade pump in CSS Grid when `AnimatePresence mode="sync"` runs on a grid with uneven counts

**What goes wrong:** User filters from 16 cards to 3. In `sync` mode, exiting 13 cards + entering 3 cards briefly share the layout. If Phase 3 attaches `layout` or `layoutId` props (it should not), the grid "pumps" as rows collapse.

**Why it happens:** `sync` keeps exiting items in flow for the duration of their exit anim.

**How to avoid:** D3-13 recommends starting with `mode="sync"` and switching to `"wait"` or `"popLayout"` if manual pass shows the pump. **Do not add the `layout` prop** to the children — the crossfade is pure opacity, so there is no layout animation to coordinate.

**Warning signs:** During filter change the grid height briefly expands then contracts; cards visibly reposition during the 160ms crossfade. [HIGH confidence — animation-patterns.md explicitly addresses this with `popLayout` prescription]

## Runtime State Inventory

Phase 3 is NOT a rename or migration phase. This section is omitted per the research template guidance for greenfield / additive-only phases.

## Code Examples

Verified patterns from Motion 14 (synthesized from search results against motion.dev + CODEX refs; manually cross-checked against Phase 2 code in-repo).

### Example 1: Full `useScroll` + `useTransform` scroll-link
```tsx
// Source: motion.dev/docs/react-use-scroll (API) + Phase 2 whileInView precedent (project)
import { useRef } from 'react';
import { useScroll, useTransform, m } from '@/lib/motion';

function ScrollLinkedElement() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 35]);
  return (
    <div ref={ref}>
      <m.img style={{ rotate, transformOrigin: '50% 100%' }} />
    </div>
  );
}
```

### Example 2: Optional smoothing with `useSpring`
```tsx
// Source: motion.dev/examples/react-scroll-linked-with-spring (CITED via WebSearch 2026-10-10)
const smoothRotate = useSpring(rotate, { stiffness: 100, damping: 20 });
<m.img style={{ rotate: smoothRotate }} />
```

### Example 3: `AnimatePresence` crossfade on a keyed child
```tsx
// Source: motion.dev/examples/react-animate-presence-modes (CITED)
import { AnimatePresence, m } from '@/lib/motion';

<AnimatePresence mode="sync">
  <m.div
    key={filterKey}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.16 }}
  >
    {children}
  </m.div>
</AnimatePresence>
```

### Example 4: `useReducedMotion()` guard pattern
```tsx
// Source: motion.dev/docs/react-use-reduced-motion (behavior) + CONTEXT.md D3-19 (project policy)
import { useReducedMotion } from '@/lib/useReducedMotion';

const shouldReduce = useReducedMotion();           // boolean | null
const isReduced = shouldReduce !== false;          // treat null as reduced
// Branch at render time for scroll-linked animations.
// For whileInView animations, keep the m.* element but add Tailwind
// `motion-reduce:!transform-none motion-reduce:!opacity-100` instead —
// zero re-mount, zero layout shift, pure CSS.
```

### Example 5: `vite.config.ts` visualizer wiring
```typescript
// Source: rollup-plugin-visualizer README + Vite 8 mode-gated plugin pattern [CITED via WebSearch 2026-10-10]
import { defineConfig, type PluginOption } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { visualizer } from 'rollup-plugin-visualizer';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    tailwindcss(),
    spaFallbackWith404(),
    mode === 'production' &&
      (visualizer({
        filename: 'dist/stats.html',
        gzipSize: true,
        brotliSize: false,
        open: false,
        template: 'treemap',
      }) as PluginOption),
  ].filter(Boolean) as PluginOption[],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  server: { port: 5173 },
}));
```

Note: the existing `spaFallbackWith404()` plugin stays. The new signature uses `defineConfig(({ mode }) => (...))` instead of the current `defineConfig({...})` — this is a small refactor; preserve all other options.

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `framer-motion` package name | `motion` package name, same API | 2024 (framer-motion renamed) | Project already on `motion@14`; nothing to migrate |
| `motion.div` everywhere | `LazyMotion` + `m.*` throughout | Phase 1 (project) | Already enforced via CI grep |
| `useReducedMotion()` returning `boolean` | `useReducedMotion()` returning `boolean \| null` | Motion v6+ (long-stable) | Phase 3 D3-19 locks the null-handling policy |
| `rollup-plugin-visualizer@6.x` with Rollup 2–4 only | `rollup-plugin-visualizer@7.x` with Rolldown 1.x peer | 7.0 release (2025) | Phase 3 picks ^7.1.1 which explicitly declares `rolldown` in `peerDependencies` [VERIFIED: npm registry 2026-10-10] |

**Deprecated / outdated:**
- `vite-plugin-image-optimizer` for responsive images — not used in Phase 3, but worth flagging that Phase 4 (PERF-01) will use `vite-imagetools` as per CLAUDE.md
- `react-helmet` / `react-helmet-async` — Phase 5 migrates to `@unhead/react`; not touched in Phase 3

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest 5.0.3 (unit/component) + Playwright 1.64.0 (e2e), both already installed |
| Config file | Vitest: default (no `vitest.config.ts` in repo; uses Vite config); Playwright: `playwright.config.ts` (assumed from Phase 1 Plan 01 Walking Skeleton) |
| Quick run command | `npm run test` (Vitest) |
| Full suite command | `npm run test && npm run test:e2e` |

### Phase 3 Requirements → Test Map

Phase 3 is primarily visual + perf + accessibility — most success criteria are **manual-pass** per D3-18 (the project explicitly declined Playwright jank/CLS asserts). The handful of automatable checks:

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| CONV-05 (re-verify) | `src/` contains zero `motion.div` references outside `src/lib/motion.ts` | CI grep | `npm run grep:ci` (existing script `scripts/ci-grep-forbidden-strings.mjs`) | ✅ (Phase 1 Plan 03) |
| D3-16 | `src/lib/useReducedMotion.ts` re-exports from `motion/react` | unit (optional) | `vitest run src/lib/useReducedMotion.test.ts` — assert module exports `useReducedMotion` function | ❌ Wave 0 (new file) |
| D3-02 / #1 success criterion | Hero cap-twist uses `useScroll` + `useTransform` (not pixel-based scroll handlers) | static grep | `grep -r "window.addEventListener('scroll'" src/sections/Hero.tsx` returns nothing | ✅ (bash one-liner) |
| D3-17 | `dist/stats.html` emitted on `npm run build` | integration | `npm run build && test -f dist/stats.html` | ✅ (after Phase 3 Wave 1) |
| #3 success criterion | Reduced-motion renders static fallbacks with zero CLS | **manual-pass** (D3-18 explicit) | — | Evidence doc only |
| #4 success criterion | No jank / no CLS / no bundle regression | **manual-pass** (D3-18 explicit) | — | Evidence doc only |

### Sampling Rate
- **Per task commit:** `npm run grep:ci && npm run build` (verifies CI grep still passes and build still produces `dist/stats.html`)
- **Per wave merge:** `npm run grep:ci && npm run test && npm run build`
- **Phase gate:** All of the above + the manual-pass evidence doc committed at `.planning/evidence/03-scroll-polish-manual-pass.md` + a human-verify checkpoint on both iPhone and Android screencast review

### Wave 0 Gaps

- [ ] `scripts/ci-grep-forbidden-strings.mjs` already matches `motion.(div|a|button|span|…)` — Phase 3 should verify the grep pattern covers `m.img` as *allowed* (not forbidden). If the pattern uses a positive-match for `motion.<identifier>`, this is fine; no change needed. **Action for Wave 0: read the current grep script and confirm.**
- [ ] No test harness exists yet for `src/lib/useReducedMotion.ts` — it's a one-line re-export so an explicit test is low-value; a type-check (`tsc --noEmit` already in `npm run build`) suffices.
- [ ] No visualization automation — `dist/stats.html` is captured per release manually (D3-17 explicitly rejects a hard gate).

*(Framework install needed? None — Vitest + Playwright are already in `devDependencies`.)*

## Security Domain

Phase 3 does not touch authentication, session management, access control, or data persistence. It operates entirely in the Browser / Client tier on pre-existing read-only data (`flavors.ts`) and emits no new network calls.

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | no | — |
| V3 Session Management | no | — |
| V4 Access Control | no | — |
| V5 Input Validation | no | No user input; filter already URL-sanitized in Phase 2 |
| V6 Cryptography | no | — |
| V7 Error Handling | partial | Motion errors should not leak stack traces; `strict` mode on LazyMotion in dev is sufficient (already set in Phase 1) |
| V14 Config | yes | New dev-dependency (`rollup-plugin-visualizer`) must be pinned to a specific version per CAPSHOT constraint; no transitive install of unverified postinstall scripts |

### Known Threat Patterns for this stack

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Supply-chain: typosquat of `rollup-plugin-visualizer` | Tampering | Verified via `npm view` — authoritative repo `github.com/btd/rollup-plugin-visualizer`, 10-year history, explicit `rolldown` peer declaration — no slopcheck [SLOP] signal |
| Reduced-motion bypass (ignoring user accessibility preference) | Compliance (ASVS V11.1.4 accessibility) | Phase 3 success criterion #3 is a hard contract: every new animation ships with a static fallback. Dev evidence doc captures reduced-motion run per device. |
| CSS layer-leak (iOS Safari layer promotion causing elsewhere jank) | Denial of Service (perceived) | §Pitfall 5 explicitly addresses; manual-pass verifies |

## Environment Availability

Phase 3 depends on tools already installed in the dev environment:

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Vite build | ✓ (project runs on it) | — (should be ≥22.12 per CLAUDE.md) | — |
| npm | Package install | ✓ | 10.9.8 (observed in session) | — |
| `motion@14` | All animation primitives | ✓ (dependency) | 14.0.0 pinned | — |
| `rollup-plugin-visualizer` | D3-17 build visualizer | ✗ (needs install) | — → ^7.1.1 | None blocking — Phase 3 could ship without the visualizer, but D3-17 locks it in |
| Photo-editing tool (Photoshop / remove.bg) | Cap PNG cutout from existing hero JPG | ✓ (user-side; one-off task) | — | None — asset is a hard prerequisite for the two-layer composition |
| Real iPhone + real Android | D3-18 manual-pass evidence | ✓ (user has access per CONTEXT.md) | — | None — simulator-only testing explicitly rejected |

**Missing dependencies with no fallback:** none that block the plan (the asset work and the install are tasks within the plan, not external gates).

**Missing dependencies with fallback:** none.

## Pattern Reuse

Phase 3 extends patterns Phase 2 shipped — it does not invent new ones.

| Phase 2 pattern | Phase 3 extension |
|-----------------|-------------------|
| `<m.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-10% 0px' }} transition={{ duration: 0.5, ease: [0.2, 0, 0.2, 1] }} className="… motion-reduce:!transform-none motion-reduce:!opacity-100">` on HowItWorks right-column | Same variants, applied per `<m.li>` with `transition.delay` of 0 / 0.12 / 0.24; same `motion-reduce:` fallback classes |
| `<m.div … 0.5s …>` on HowItWorks video card | **Unchanged** (D3-09) |
| `AnimatePresence` already re-exported from `@/lib/motion` (Phase 2 Plan 01) but unused in `src/` | First consumer: FlavorsPage filter crossfade |
| `motion-reduce:transform-none motion-reduce:transition-none` on FlavorCard hover scale | Reused on every new `m.*` element in Phase 3 |
| `<LazyMotion features={domAnimation}>` in `App.tsx` | **Unchanged** — all Phase 3 hooks are covered by `domAnimation` (see §Q3) |

The CONV-05 contract (all Motion imports go through `@/lib/motion*`) extends to the new `src/lib/useReducedMotion.ts` file. The CI grep from Phase 1 Plan 03 already catches direct `motion/react` imports outside the lib boundary.

---

## Open Questions — Resolved Research Findings

The 8 planner-blocking questions, answered.

### Q1. `useScroll` target + offset for the Hero cap-twist

**Finding:** The correct binding is `useScroll({ target: heroRef, offset: ['start start', 'end start'] })`. This maps:

- `scrollYProgress = 0` when the top of the Hero element is at the top of the viewport (Hero fully visible on page load, no scroll yet)
- `scrollYProgress = 1` when the bottom of the Hero element is at the top of the viewport (Hero fully scrolled out)

[CITED: motion.dev/docs/react-use-scroll via WebSearch 2026-10-10 — "start start": the top of the element and the top of the container meet; "end start": when the bottom of the target meets the top of the container]

**Why not `['start end', 'end start']`:** that pattern maps `0` to "element bottom at viewport top" (element just about to enter) and `1` to "element top at viewport top" (element just arrived). For a Hero that is already visible at `0` scroll, we want to START at 0 progress and REACH 1 as we scroll past — the `['start start', 'end start']` offset is correct.

**Why not document-based (no `target`):** without `target`, `scrollYProgress` maps the whole document. The cap would keep rotating during HowItWorks, FlavorTeaser, and the FlavorsPage link — way beyond `35°`. Scoping to the Hero element is mandatory.

**SSR / null-ref handling:** Motion handles the null-ref case internally; `scrollYProgress` is a MotionValue that attaches its listener when the ref populates. This project is a client-only Vite SPA (no SSR), so the window of risk is one commit frame. If manual-pass shows a tick, add `layoutEffect: true` to the hook options.

**Confidence: HIGH** — verified against motion.dev docs text (WebSearch) and the Phase 2 HowItWorks `viewport={{ margin: '-10% 0px' }}` precedent which uses the equivalent offset semantics on a different hook family.

### Q2. `useReducedMotion` SSR behavior and the Phase 3 guard

**Finding:** Motion's `useReducedMotion()` returns `boolean | null`. It is `null` on the server AND in the very first client-render frame before `matchMedia` attaches. [CITED: multiple WebSearch results, specifically "useReducedMotion() returns null on the server and true on first client render"]

**Project reality:** This is a client-only Vite SPA. There is no SSR step. The `null` window exists only for the single commit where React has rendered but Motion's `useMedia`-style listener hasn't ticked yet.

**D3-19 locked policy:** Treat `null` as reduced (`isReduced = shouldReduce !== false`). Rationale: a reduced-motion user who sees one frame of animation before the hook flips is a worse UX than a non-reduced user who sees one frame of static-fallback before the hook flips to `false`.

**For `whileInView` animations:** Motion's documentation and WebSearch confirm `whileInView` *does* auto-respect `prefers-reduced-motion` via Motion's internal detection path (also controllable globally via `<MotionConfig reducedMotion="user">`). Phase 2's HowItWorks pattern already uses Tailwind `motion-reduce:!transform-none motion-reduce:!opacity-100` as a belt-and-suspenders fallback that works via CSS without touching Motion internals. **Keep this pattern.** It is zero-cost and zero-risk.

**For scroll-linked `useScroll` + `useTransform`:** Motion does NOT auto-short-circuit scroll-linked motion when reduced-motion is on. The transform still fires. The Hero cap-twist MUST explicitly check `useReducedMotion()` and skip the two-layer composition when reduced.

**Recommended wiring:** see Pattern 1 above. Branch at component root; render identical outer `<div ref={heroRef}>` in both branches to keep the ref stable (even though the reduced path doesn't need the ref, keeping it mounted avoids a React re-mount if the user toggles the OS setting mid-session).

**MotionConfig alternative:** `<MotionConfig reducedMotion="user">` globally forces every animation to respect the user's preference. This is a project-wide switch. It would subtly change existing Phase 1–2 animations (currently they rely on Tailwind `motion-reduce:` CSS, not Motion's internal preference reading). **Do not add MotionConfig in Phase 3** — scope creep and surprise regression risk on Phase 2 UAT.

**Confidence: HIGH** — SSR null is confirmed by 10+ GitHub issue references in WebSearch; auto-handling of `whileInView` confirmed by motion.dev accessibility docs via WebSearch.

### Q3. LazyMotion feature-import tree-shaking — does `domAnimation` cover Phase 3's additions?

**Finding:** Yes. `domAnimation` covers animations, variants, exit animations, and tap/hover/focus gestures. `domMax` adds pan/drag gestures and layout animations. [CITED: WebSearch 2026-10-10 — Motion's own LazyMotion docs quoted]

**Hooks required by Phase 3:**
- `useScroll` — core Motion export, NOT a feature; works regardless of LazyMotion features
- `useTransform` — core Motion export, same
- `useSpring` — core Motion export, same
- `useReducedMotion` — core Motion export, same
- `AnimatePresence` — covered by `domAnimation` (exit animations are listed in the feature set)
- `whileInView` — part of the core gesture / viewport system, covered by `domAnimation`

**None of Phase 3's additions require `domMax`.** No drag, no pan, no `layout` prop, no `layoutId`.

**Bundle size data** [CITED: multiple WebSearch sources 2026-10-10]:
- Plain `motion` component: ~34 KB gzip (**entry-blocking** when used directly)
- `LazyMotion` + `m` + `domAnimation`: entry ~4.6 KB gzip, feature payload ~15–17 KB loaded async
- `LazyMotion` + `m` + `domMax`: entry ~4.6 KB gzip, feature payload ~25–34 KB loaded async

Historical note: GitHub issue #1585 (motiondivision/motion) corrected earlier docs that under-stated `domAnimation` at ~13 KB; actual at v6.3.11 was ~43 KB **ungzipped** (~15–17 KB gzip). Current Motion v14 numbers in the WebSearch results align with ~15–17 KB gzip for `domAnimation` and ~25–34 KB gzip for `domMax`. [CITED via GitHub issue 2026-10-10]

**Verification against the 10 KB entry-bundle budget (CONV-05):**
- Entry (`m` + LazyMotion harness): ~4.6 KB gzip → **well under 10 KB**
- `domAnimation` feature payload (~15–17 KB gzip) is in a **separate async chunk** loaded on first `<m.*>` render; it is NOT counted toward the entry.
- Phase 3 additions (hook calls only, no new feature imports) add zero bytes to the entry.

**Conclusion:** Keep `src/lib/motion.ts` exactly as-is. `domAnimation` is the correct and sufficient feature set for the entire v1 marketing site. Manual-pass visualizer check will confirm.

**Confidence: HIGH** — bundle numbers triangulated from 3+ independent sources; `AnimatePresence` as a `domAnimation` member confirmed by WebSearch Motion docs quote.

### Q4. AnimatePresence mode choice for FlavorsPage filter

**Finding:** Three modes exist in Motion 14 [CITED: motion.dev/examples/react-animate-presence-modes via WebSearch 2026-10-10]:
- `sync` (default): entering and exiting elements animate simultaneously; exits stay in-flow during their anim
- `wait`: entering waits for exit to complete; strict sequence
- `popLayout`: exiting elements are pulled OUT of layout flow immediately; surrounding elements reflow during exit

**Grid-specific gotcha:** With `mode="sync"` on a CSS Grid where child count drops drastically (16 → 3), the 13 exiting cards keep their grid slots during the 160ms exit anim. This CAN produce a brief visual "the grid stays big then collapses" effect. [HIGH confidence — animation-patterns.md directly addresses this]

**Recommended default:** `mode="sync"` as D3-13 locked. 160ms is short enough that most users won't perceive the brief overlap; the simplicity (no layout jump) outweighs the risk. If manual-pass shows pumping, D3-13 explicitly authorizes switching to `mode="wait"`. The project's own perf skill (`animation-patterns.md`) recommends `popLayout` for exit-driven layout shift — hold `popLayout` as the stronger fallback if `mode="wait"` feels slow (because wait DOUBLES the perceived transition time to 320ms total).

**Priority order for execution:**
1. Ship with `mode="sync"` (D3-13 default)
2. Manual-pass: if the grid pumps on 16 → 3, switch to `mode="popLayout"`
3. Reserve `mode="wait"` only if `popLayout` causes a different problem (unlikely)

**Note on `popLayout`:** `popLayout` works best when children also have `layout` prop. **Do not add `layout` prop** in Phase 3 — this is intentional per D3-14 ("no new scroll motion inside the card") to protect the Motion budget. `popLayout` without `layout` still removes exiting items from flow, which is sufficient for crossfade.

**Confidence: HIGH** — all three modes documented at motion.dev; animation-patterns.md local project skill directly prescribes `popLayout` for this exact filter case.

### Q5. `rollup-plugin-visualizer` in Vite 8 + Rolldown

**Finding:** `rollup-plugin-visualizer@^7.1.1` is explicitly Rolldown-compatible via `peerDependencies` declaration [VERIFIED: npm registry 2026-10-10]:

```
peerDependencies: {
  rollup: '2.x || 3.x || 4.x',
  rolldown: '1.x || ^1.0.0-beta || ^1.0.0-rc'
}
```

Vite 8 ships Rolldown as the default bundler; Rolldown implements the Rollup plugin API [CITED: vite.dev/blog/announcing-vite8 via WebSearch 2026-10-10].

**No special Vite 8 adapter is needed.** The plugin "just works" in `plugins: [...]`.

**Exact wiring** (see also §Code Examples / Example 5):

```typescript
// vite.config.ts — Phase 3 Wave 1 addition
import { defineConfig, type PluginOption } from 'vite';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    tailwindcss(),
    spaFallbackWith404(),
    mode === 'production' &&
      (visualizer({
        filename: 'dist/stats.html',
        gzipSize: true,
        brotliSize: false,
        open: false,
        template: 'treemap',  // 'treemap' | 'sunburst' | 'network' | 'raw-data' | 'list'
      }) as PluginOption),
  ].filter(Boolean) as PluginOption[],
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  server: { port: 5173 },
}));
```

**Important changes vs current `vite.config.ts`:**
1. Signature changes from `defineConfig({...})` to `defineConfig(({ mode }) => ({...}))` — functional form is required to access `mode`
2. Visualizer only runs when `mode === 'production'` (i.e., `npm run build`, not `npm run dev`)
3. Existing `spaFallbackWith404()` custom plugin stays in place

**Confidence: HIGH** — verified via `npm view` registry data + WebSearch confirmation + Rolldown's Rollup-API-compat is explicitly declared by both Vite and Rolldown docs.

### Q6. iOS Safari + Motion `useScroll` performance

**Finding:** Low to moderate risk, mitigated by three disciplines.

**The known gotcha:** iOS Safari composites layers with `transform-origin` + continuous `rotate` into their own GPU layer, which is correct and smooth. The failure mode is **when that layer intersects CSS filters** (`blur`, `drop-shadow`, `backdrop-filter`) on sibling or parent elements — iOS Safari may re-rasterize per frame instead of using the pre-composited layer. [CITED: Apple's own 2D/3D Transforms guide via WebSearch 2026-10-10 + animation-patterns.md local skill]

**Current Hero markup contains:**
- An ambient halo via `blur-3xl` behind the image card (lines 128–134 of Hero.tsx)
- A box shadow on the image card ring (`shadow-[0_18px_50px_-12px_rgba(89,69,69,0.22)]`)

**Mitigations in order of effectiveness:**

1. **Keep the halo OUTSIDE the image card.** The current Hero already does this — the halo is at `absolute inset-0 -z-10` and the image card is a sibling. The rotating cap `m.img` will live inside the image card at `absolute inset-0`. The halo and the rotating cap do NOT share a stacking context with filters applied. Good.
2. **Scope `will-change: transform` to the rotating `m.img` only.** Do NOT add it to the parent `<div className="relative flex aspect-[3/4] …">` — broad `will-change` keeps the layer promoted permanently and inflates memory.
3. **Add `translateZ(0)` ONLY as a last-resort hack** if manual-pass shows jank. Motion handles layer promotion automatically for `transform` properties; explicit `translateZ(0)` is usually redundant and sometimes counter-productive.
4. **Avoid `backface-visibility: hidden`** unless specifically needed. It helps with 3D transforms on older iOS but has no benefit for 2D `rotate`.

**useScroll-specific iOS risk:**
- iOS Safari fires scroll events at the browser's compositor framerate (typically 60fps); Motion's `useScroll` uses passive listeners + rAF throttling internally [CITED: motion.dev docs via WebSearch]. No manual throttling needed.
- The classic iOS Safari scroll-handler jank (scroll handlers that block the main thread) is NOT a risk here because Motion schedules the transform update inside a composited layer path, not a React re-render path. The `rotate` value flows via MotionValues, not React state.

**Verification during manual-pass (D3-18 doc):**
- Record a screencast while scrolling the Hero slowly on iPhone 12/13-class device
- Check Hero body text and sub-copy don't lose anti-aliasing during scroll (would indicate re-rasterization)
- Check the rotation is smooth (not stepped) at both the start and end of the scroll range

**Confidence: MEDIUM-HIGH** — iOS Safari layer-promotion mechanics are well-documented at the CSS level; Motion's compositor-friendly path is well-documented. The combination hasn't been empirically tested in this project yet — manual-pass is the real test.

### Q7. AnimatePresence + reduced-motion automatic behavior

**Finding:** AnimatePresence does NOT fully auto-skip exit animations under reduced-motion. [MEDIUM confidence — docs are indirect; multiple sources imply but don't explicitly confirm]

**What Motion DOES do:** With `<MotionConfig reducedMotion="user">`, Motion disables transform and layout animations but preserves opacity and color animations [CITED: motion.dev React accessibility docs via WebSearch 2026-10-10]. Since the FlavorsPage filter crossfade is **pure opacity** (D3-13), MotionConfig would NOT skip it even if we enabled it globally.

**What this means for Phase 3:** The crossfade still fires under reduced-motion. This is actually the right behavior per WCAG — opacity transitions are NOT the kind of motion reduced-motion is designed to suppress (that's for parallax, scaling, autoplay-driven movement). The 160ms duration is short enough to be imperceptible as "motion".

**Explicit guard (optional):** If the project wants reduced-motion users to see instant filter changes with zero fade, use the `useReducedMotion` hook:

```tsx
import { useReducedMotion } from '@/lib/useReducedMotion';

const shouldReduce = useReducedMotion();
const duration = shouldReduce === false ? 0.16 : 0;

<AnimatePresence mode="sync">
  <m.div
    key={active ?? 'all'}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration }}
  >
    <FlavorGrid flavors={visible} />
  </m.div>
</AnimatePresence>
```

**Recommended default:** Keep the fade on at 160ms for everyone (per D3-13 — a short opacity transition is accessibility-neutral). Add the explicit guard only if manual-pass reveals a reduced-motion user complaint, which is unlikely.

**Confidence: MEDIUM** — docs are indirect on AnimatePresence + reduced-motion interaction; the "transform-and-layout only" MotionConfig behavior is documented, but how it specifically affects opacity-only AnimatePresence children is left to inference. The project's chosen pattern (short opacity fade, no explicit guard) is accessibility-defensible either way.

### Q8. Row-by-row stagger pattern for FlavorGrid at 2/3/4 columns

**Finding:** Three options exist; the lowest-complexity one is best for Phase 3.

**Option A — `useMediaQuery` helper (new file):**
Create `src/lib/useMediaQuery.ts` that returns the current column count by reading `window.matchMedia('(min-width: 1024px)')` and `(min-width: 640px)`. Pass `cols` into FlavorGrid and compute `delay = (index % cols) * 0.12`.

Cost: new file, new hook, SSR null handling (same hazards as `useReducedMotion`), one more live-change listener. Benefit: mathematically perfect stagger at every breakpoint.

**Option B — Flat index-based delay using mobile baseline:**
`delay: (index % 2) * 0.12`. Pretend the grid is always 2 columns.

Cost: zero. Benefit: on mobile (2 cols) the row-stagger is exactly correct. On tablet (3 cols) and desktop (4 cols) adjacent cards get the same delay pattern (`0, 0.12, 0, 0.12, 0, 0.12…`) which looks *approximately* like a row stagger — slightly less tidy than per-row perfection but visually indistinguishable to a user at scroll speed.

**Option C — CSS custom property via container queries:**
Set `--stagger-delay` on the `<ul>` via Tailwind utility and reference it from `<m.li style={{ delay: 'calc(…)' }}>`. Motion does not accept CSS calc for `transition.delay` — this option is a dead end.

**Recommendation: Option B.** The visual difference at desktop breakpoints is negligible — cards fade in at ~400ms with 120ms delay offsets; at scroll speed the eye perceives "rows coming in" regardless of whether they are mathematically row-aligned. Option A pays complexity cost for a benefit most users won't perceive. CONTEXT.md D3-12 explicitly authorizes Option B as the "flat index-based delay that just uses mobile baseline (2 cols) and lets desktop staggers look slightly denser".

**Alternative to flag during manual-pass:** If the desktop stagger reads as *too dense* ("everything hits at once"), the planner may bump the delay from `0.12` to `0.16` or `0.20`. If it reads as *too linear* ("one card at a time, not in rows"), the mobile mod can switch to `(index % 4) * 0.08` to match the desktop column count instead.

**Confidence: HIGH** — Option A hazards are empirically known (matchMedia hydration bugs documented in multiple WebSearch results); Option B is zero-risk; Option C is not supported by Motion's transition API.

---

## Risks & Landmines

Compiled from PITFALLS.md Pitfalls 9 + 10, animation-patterns.md local skill, and Phase 3-specific research findings above.

| Risk | Severity | Mitigation |
|------|----------|------------|
| `motion.div` sneaks in and breaks CONV-05 10 KB budget | HIGH | Phase 1 CI grep (`npm run grep:ci`) already catches this; Phase 3 adds no new import surfaces outside `@/lib/motion*` |
| Vite 8 / Rolldown `manualChunks` leaves Motion in entry chunk even with LazyMotion | MEDIUM | `rollup-plugin-visualizer` D3-17 is designed to catch this; D3-17 explicitly notes "if a future ship shows the entry Motion footprint over budget, the hard fallback is to narrow the feature import" |
| iOS Safari re-rasterization under Hero cap-twist | MEDIUM | §Q6 mitigations: halo stays outside image card; `will-change` scoped to `m.img` only |
| `useReducedMotion` flash-of-animation on first paint | MEDIUM | §Q2 pattern: `isReduced = shouldReduce !== false` treats `null` as reduced |
| AnimatePresence grid pump on 16→3 filter | MEDIUM | §Q4: start with `mode="sync"`; have `popLayout` ready as fallback |
| Hero element two-layer composition mis-registers cap vs bottle | LOW-MEDIUM | Asset work: cap PNG and bottle JPG must be exported from the same source frame at identical dimensions. §D3-04 and §Deferred both call out that `/hero/cap-on-bottle.jpg` stays as the reduced-motion single-image fallback — so a bad cutout only degrades the animated path, never the fallback |
| Row-stagger looks wrong at desktop | LOW | §Q8 Option B: flat index-mod-2; tunable during manual pass if needed |
| `useScroll` ties rotation to document scroll instead of Hero scroll | HIGH (if misconfigured) | §Q1 pattern: explicit `target: heroRef` is mandatory, never omit |
| New rollup-plugin-visualizer dependency is slopcheck-flagged | LOW | §Package Legitimacy Audit: 10-year-old authoritative package with explicit Rolldown peer declaration; slopcheck unavailable this session but manual verification is strong |
| Scope creep into Nav / ThemeToggle polish | MEDIUM | D3-19 scope guard: planner redirects any such idea to deferred |
| Manual-pass evidence doc missed | MEDIUM | Wave 4 is strictly serial after Waves 1–3; evidence doc is part of the deliverable |

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | `domAnimation` includes `AnimatePresence` and `whileInView` (not just hover/tap/focus) | §Q3, §Standard Stack | If wrong, Phase 3 ships broken AnimatePresence — would need to widen to `domMax` or add selective features. Visualizer run after Wave 1 would catch this. |
| A2 | iOS Safari layer promotion from `transform-origin` + `rotate` does not cause visible jank on CAPSHOT's specific Hero layout | §Q6 | If wrong, Phase 3 ships with iOS Safari jank. Manual-pass D3-18 is the real test; mitigation is `will-change` scoping or (last resort) accepting the jank and documenting it as a Phase 4 polish target. |
| A3 | AnimatePresence `mode="sync"` on the 16→3 filter does not produce visible grid pump at 160ms crossfade | §Q4 | If wrong, planner switches to `mode="popLayout"`. D3-13 explicitly authorizes this fallback. |
| A4 | `useReducedMotion()` `null` window closes within 1 commit frame on this client-only Vite SPA | §Q2 | If wrong, reduced-motion users see a flash-of-animation. The guard pattern (treat null as reduced) prevents the regression regardless. |
| A5 | Phase 1's CI grep script (`scripts/ci-grep-forbidden-strings.mjs`) treats `m.img` as allowed (not forbidden) | §Validation Architecture Wave 0 | If wrong, the Hero cap-twist's `m.img` fails CI. Wave 0 should read the grep script to confirm; the fix is a one-line regex adjustment. |

Items in this log are flagged for the planner to verify during execution — none are blocking.

## Open Questions

None blocking. The 8 planner-blocking questions in CONTEXT.md are all resolved above (§Q1–§Q8). The planner may proceed to carve Phase 3 into waves per the CONTEXT.md recommended split (Wave 1 foundations, Wave 2 Hero + HowItWorks, Wave 3 Flavor surfaces, Wave 4 verification).

## Sources

### Primary (HIGH confidence)
- `motion.dev/docs/react-use-scroll` — useScroll offset semantics (via WebSearch synthesis 2026-10-10; motion.dev direct WebFetch returned 403)
- `motion.dev/docs/react-reduce-bundle-size` — LazyMotion feature-set and bundle sizes
- `motion.dev/docs/react-animate-presence` and `/examples/react-animate-presence-modes` — AnimatePresence mode semantics
- `motion.dev/docs/react-use-reduced-motion` — useReducedMotion return type and behavior
- `motion.dev/docs/react-accessibility` — MotionConfig `reducedMotion` and transform/layout vs opacity rules
- `motion.dev/docs/react-scroll-animations` — scroll animation patterns including useSpring smoothing
- npm registry (`npm view rollup-plugin-visualizer version / peerDependencies / repository.url / time`) — verified 2026-10-10
- Project files directly read: `src/sections/Hero.tsx`, `src/sections/HowItWorks/HowItWorks.tsx`, `src/sections/FlavorTeaser.tsx`, `src/sections/FlavorGrid.tsx`, `src/pages/FlavorsPage.tsx`, `src/components/ui/FlavorCard.tsx`, `src/lib/motion.ts`, `src/App.tsx`, `vite.config.ts`, `package.json`, `.planning/phases/03-scroll-storytelling-polish/03-CONTEXT.md`, `.planning/ROADMAP.md`, `.planning/REQUIREMENTS.md`, `.planning/config.json`, `.claude/skills/react-perf-optimizer/SKILL.md`, `.claude/skills/react-perf-optimizer/references/animation-patterns.md`, excerpts from `.planning/research/PITFALLS.md` (lines 252–297 Framer Motion pitfalls and 301–321 iOS Safari 100vh)

### Secondary (MEDIUM confidence)
- GitHub issue motiondivision/motion#1585 — historical correction on `domAnimation` / `domMax` sizes
- WebSearch results from stacknotice, LogRocket, DEV Community, medium — bundle-size corroboration and useScroll + useSpring patterns
- Issue reports documenting `useReducedMotion` null-on-first-render across multiple projects (orbit, chunks-ui, Leakfix, my-homepage, SikshaTantra, connex) — triangulate the SSR null behavior as a real pattern, not a one-off

### Tertiary (LOW confidence — flagged for manual-pass validation)
- iOS Safari layer promotion effect on the specific CAPSHOT Hero layout — empirical only; §Q6 recommends manual-pass as the real test
- Exact perceived difference between flat-index stagger (Option B) and per-row stagger (Option A) at 3-col and 4-col breakpoints — perceptual judgment, resolved by manual pass if the planner wants to tune

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all packages verified against npm registry and project `package.json`
- Architecture: HIGH — all patterns extend Phase 2's shipped code with minimal structural change
- Pitfalls: HIGH — triangulated from PITFALLS.md, local skills, and current Motion docs
- Open-question resolution (§Q1–§Q8): HIGH for Q1, Q2, Q3, Q4, Q5, Q8; MEDIUM for Q6, Q7

**Research date:** 2026-10-10
**Valid until:** 2026-11-10 (Motion 14 and Vite 8 are stable; 30-day validity reasonable). Flag for re-check if Motion 15 ships or if rollup-plugin-visualizer peerDependencies drop Rolldown.

---

## Phase 3 is ready to plan

Three affirmations the planner can rely on:

1. **CONTEXT.md's 19 locked decisions are all implementable as written.** No research finding contradicts D3-01..D3-19. The one Claude's-call item that benefits from upfront direction (reduced-motion null handling) is handled per the policy D3-19 Claude's discretion already captured.

2. **The `LazyMotion` + `m.*` contract from Phase 1 Plan 02 extends cleanly to Phase 3's additions.** `AnimatePresence` + `useScroll` + `useTransform` + `useSpring` + `useReducedMotion` are all covered by the already-mounted `domAnimation` feature set. The entry chunk stays at ~4.6 KB gzip — well under the 10 KB CONV-05 budget. No LazyMotion feature upgrade needed. The feature chunk sits at ~15–17 KB gzip in a separate async bundle, exactly where it has been since Phase 1.

3. **No conflicts between research findings and current shipped code.** The Hero's existing composition (text left, image right, ambient halos) is preserved exactly by the two-layer cap/bottle approach. The HowItWorks video card entrance stays untouched per D3-09. The FlavorTeaser scroller UX and the FlavorsPage filter logic are both left intact — Phase 3 only adds motion wrappers at the parent level. The CI grep from Phase 1 Plan 03 continues to protect CONV-05 unchanged. The only vite.config.ts change (functional-form `defineConfig(({ mode }) => (…))`) preserves the existing `spaFallbackWith404()` plugin and all other current options.

Planner can proceed to carve Phase 3 into the ~2–3 plans suggested in CONTEXT.md §Open Questions.

## RESEARCH COMPLETE

**Phase:** 3 - Scroll Storytelling Polish
**Confidence:** HIGH

### Key Findings
1. All 8 planner-blocking questions resolve to deterministic, implementable answers (§Q1–§Q8).
2. `domAnimation` is sufficient for every Phase 3 hook; no LazyMotion feature upgrade needed; entry bundle stays well under the 10 KB CONV-05 budget.
3. `rollup-plugin-visualizer@^7.1.1` is explicitly Rolldown-compatible and verified against the npm registry (10-year-old authoritative package; see Package Legitimacy Audit).
4. Reduced-motion handling splits cleanly: scroll-linked anim short-circuits via `useReducedMotion()`; `whileInView` keeps the Phase 2 Tailwind `motion-reduce:` pattern.
5. Row-stagger implementation recommendation: flat `(index % 2) * 0.12` using the mobile baseline — zero new files, zero hydration risk, visually indistinguishable from a per-row perfect stagger at scroll speed.

### File Created
`.planning/phases/03-scroll-storytelling-polish/03-RESEARCH.md`

### Confidence Assessment
| Area | Level | Reason |
|------|-------|--------|
| Standard Stack | HIGH | All packages verified against npm registry 2026-10-10 |
| Architecture Patterns | HIGH | Every pattern extends Phase 2's shipped code with minimal structural change |
| Common Pitfalls | HIGH | Triangulated from PITFALLS.md + local skills + motion.dev docs via WebSearch |
| Q1–Q5 + Q8 resolution | HIGH | Multiple-source corroboration |
| Q6 (iOS Safari) + Q7 (AnimatePresence + reduced-motion) | MEDIUM | Behavior documented but not empirically tested on this specific layout — manual-pass D3-18 is the real test |

### Open Questions
None blocking. §Assumptions Log flags 5 items for the planner to verify during execution (A1 feature-set coverage, A2 iOS Safari jank, A3 grid pump, A4 null window, A5 CI grep allowlist for `m.img`) — all are low-cost to verify and all have known fallbacks if wrong.

### Ready for Planning
Research complete. Planner can proceed to create 2–3 PLAN.md files per the CONTEXT.md recommended wave split (Wave 1 foundations: `useReducedMotion.ts` + assets + visualizer; Wave 2 Hero + HowItWorks; Wave 3 FlavorTeaser + FlavorGrid + filter; Wave 4 verification).
