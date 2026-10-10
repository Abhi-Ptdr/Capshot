# Phase 3: Scroll Storytelling Polish - Context

**Gathered:** 2026-10-10
**Status:** Ready for planning
**Mode:** mvp (per ROADMAP.md)
**Depends on:** Phase 2 (closed 2026-10-10)

<domain>
## Phase Boundary

Layer cinematic Motion scroll choreography across every section Phases 1–2 shipped — Hero, HowItWorks, FlavorTeaser, FlavorsPage grid + range filter — so the custom React build earns its creative premium over a Shopify theme. All animations stay inside the LazyMotion `m.*` contract, under the ≤10 KB Motion gzip entry-bundle budget, and respect `prefers-reduced-motion` with static fallbacks that preserve the Phase 2 layout exactly.

**Scope anchor — this phase ships:**

- **Hero (`src/sections/Hero.tsx`)** — adds a scroll-driven cap-twist rotation. The hero image is restructured into a two-layer composition (transparent-PNG cap over bottle JPG); only the cap rotates `0° → 35°` as the hero scrolls out of view, pivoting at the base of the cap (bottom-center where it meets the bottle).
- **HowItWorks (`src/sections/HowItWorks/HowItWorks.tsx`)** — the current single `whileInView` on the right (steps) column is replaced with per-`<li>` entrances; steps 01 → 02 → 03 stagger in with `opacity 0→1 + y 16→0` as the section enters viewport. The video card keeps the Phase 2 entrance unchanged.
- **FlavorTeaser (`src/sections/FlavorTeaser.tsx`)** — a section-level `whileInView` fade+slide wraps the whole scroller. Individual cards do NOT stagger (they're inside a horizontal snap-scroller where most start offscreen on mobile anyway).
- **FlavorGrid (`src/sections/FlavorGrid.tsx`)** — row-by-row stagger: each row of cards enters together (`opacity 0→1 + y 16→0`) as that row enters the viewport, with ~120ms intra-row stagger between cards in a row.
- **RangeFilter + FlavorsPage** — card swap on filter change uses `AnimatePresence` crossfade (fade out ~160ms → fade in). The existing URL-synced filter logic (FLAV-02) is NOT touched.
- **New reduced-motion plumbing** — one new file `src/lib/useReducedMotion.ts` (re-export of Motion's `useReducedMotion()`), consumed by every component that uses `useScroll`/`useTransform` to short-circuit scroll-linked motion when the user prefers reduced motion. For `whileInView` elements, the existing Tailwind `motion-reduce:` pattern stays.
- **Bundle verification** — add `rollup-plugin-visualizer` as a dev dep so `npm run build` emits `dist/stats.html`; a per-release manual check confirms the Motion-chunk gzip stays ≤10 KB.
- **Manual-pass evidence** — a developer-captured screencast + bulleted observation note at `.planning/evidence/03-scroll-polish-manual-pass.md` covering Hero / HowItWorks / FlavorTeaser / `/flavors` on real iPhone + Android.

**Explicitly NOT in this phase (belongs elsewhere):**

- Any new section (USP, variants, Premium Sports showcase, trust strip, FAQ, About, Contact) → Phase 4/5
- Any new raster asset beyond the one cap-cutout PNG for the Hero → deferred (new photography is Phase 4/5 content polish)
- Section seams: hard-cut seams between sections (cream → brand-deep HowItWorks → cream) are PRESERVED from Phase 2 — no gradient fades, no accent sweeps, no sticky headers
- Marquee auto-drift / coverflow tilt / layoutId morphs on flavor cards → not pursued (budget + jank risk)
- Hero parallax halos / flavor-swap color-wash → considered and declined for Phase 3; cap-twist is the sole Hero signature moment
- Lighthouse mobile ≥90 verification → Phase 4 (PERF-01); Phase 3 verifies "no jank, no CLS, no bundle regression" via manual pass only, not full Lighthouse
- Nav / ThemeToggle / HamburgerMenu / PrimaryCTA micro-interaction polish → out of Phase 3 scope guard (locked to shipped sections only; Nav is a shipped section but polish there would broaden surface — defer unless caught during manual pass)
- Playwright jank/CLS asserts → not reliable on x86 CI; defer to Phase 4's perf pass
- Scroll-to-top button / scroll-progress indicator / Nav scroll hide-show → not in Phase 3 scope

</domain>

<decisions>
## Implementation Decisions

### Hero Signature Moment

- **D3-01:** Hero's signature scroll moment = **cap-twist rotation**. The deferred Phase 1 idea ("Hero cap-twist on-scroll Motion polish") is realized here. No parallax halos, no flavor-swap color-wash — one dominant moment keeps the Hero focused on the TWIST → SHAKE → BOOM promise and stays inside the Motion budget.

- **D3-02:** Twist is **driven by scroll position**, not entrance-only. Use Motion's `useScroll({ target: heroRef, offset: ['start start', 'end start'] })` + `useTransform` to map progress `0 → 1` (hero visible → fully scrolled out) to rotation `0° → 35°`. Direct user control — scroll stops, rotation stops. Deterministic, no autoplay, no idle wake-ups.

- **D3-03:** Rotation range + anchor = **`0° → 35°`, pivoting at the cap base** (bottom-center of the cap PNG, where it meets the bottle). Reads as "being twisted ON" rather than "tilting/wobbling". Use CSS `transform-origin: 50% 100%` on the cap layer. Clockwise rotation on scroll-down.

- **D3-04:** Cap isolation strategy = **two-layer composition**: a transparent-PNG cap on top of the existing bottle-only JPG (or the current full composition with the cap masked out). Only the cap layer rotates. The Hero's user-approved composition (text left, image right, ambient halos) is preserved exactly — the only visual change in the stacked DOM is that one `<img>` becomes two layered `<img>` elements (bottle underneath, cap on top in an `m.div` wrapper).
  - Asset work: a cap-only transparent PNG cutout from the existing `/hero/cap-on-bottle.jpg` source — a Photoshop / remove.bg-level task. No studio shoot.
  - File location: `/public/hero/cap.png` (transparent cap) + `/public/hero/bottle.jpg` (bottle without cap). Keep the current `/hero/cap-on-bottle.jpg` as a fallback for the reduced-motion static state (shown as one image).

- **D3-05 (Claude's call):** The cap rotation uses a gentle easing curve for scrubbed values — `useTransform` natively doesn't ease, so the mapping `[0, 1] → [0°, 35°]` is linear. If scrubbing feels mechanical during manual-pass, planner may wrap via `useSpring({ stiffness: 100, damping: 20 })` for a slight lag effect. Lineear by default; spring is a judgment call during execution.

### How It Works Beat Progression

- **D3-06:** Upgrade = **per-step stagger 01 → 02 → 03**. Each `<li>` in the 3-step list gets its own `whileInView` with a per-item delay (step 01: 0ms, step 02: 120ms, step 03: 240ms). Reads like a storyboard beat.

- **D3-07:** Step motion = **`opacity 0 → 1` + `y 16 → 0`**, duration 0.5s, ease `[0.2, 0, 0.2, 1]` — matches the Phase 2 pattern already used on the HowItWorks block. Transform + opacity only (satisfies success criterion #1).

- **D3-08:** Block vs. per-step wiring = **replace the current right-column `m.div` `whileInView` with per-step `m.li` `whileInView`**. The right column becomes a plain div; each step becomes its own motion element. Cleaner Motion graph — one effect per visible element. The heading + eyebrow kicker keep their current place in the right column but do NOT get their own entrance (they inherit the view).

- **D3-09:** Video card entrance = **unchanged from Phase 2**. The existing `whileInView` on the video wrapper (`opacity 0→1, y 24→0, 0.5s`) + its `motion-reduce:` fallback stays as-is. Phase 3 does NOT add scale, parallax, or scroll-link to the video. Lowest regression risk, protects the Phase 2 UAT.

- **D3-10 (Claude's call):** Viewport trigger threshold for the staggered steps = `{ once: true, margin: '-10% 0px' }` (same as the Phase 2 block setting). Fire once per element; trigger when 10% of the step is above the fold. Planner may tune to `-15%` if steps fire too early on tall viewports during manual pass.

### Flavor Teaser + Grid Entrance

- **D3-11:** FlavorTeaser (home) = **section fade+slide once as the section enters viewport**. The whole `<Section>` wrapper gets a single `m.section` with `whileInView` (`opacity 0→1 + y 32→0, 0.6s, once: true, margin: '-10% 0px'`). Individual cards inside the horizontal scroller do NOT stagger — most are offscreen horizontally anyway. The "See all 16 flavors" terminal tile inherits the section fade.

- **D3-12:** `/flavors` grid = **row-by-row stagger as rows enter viewport**. Implementation: each `<li>` card gets a `whileInView` (`opacity 0→1 + y 16→0, 0.4s`) with a per-card `transition.delay` computed from its column index (`(index % cols) * 0.12`), so cards in the same row stagger left-to-right. `once: true` so they don't re-animate when the user scrolls back.
  - Column count varies by breakpoint (2/3/4) — compute via a `useMediaQuery`-style helper or hardcode via a `transition.delay` that mods the index against the mobile column count (2) and let desktop staggers look slightly denser. Planner picks the exact implementation.

- **D3-13:** Range filter card swap = **`AnimatePresence` crossfade**. When the user changes range, outgoing cards fade out `(opacity 1→0, 0.16s)` and new cards fade in `(opacity 0→1, 0.16s)` via `AnimatePresence` + `m.li` with a stable `key={flavor.handle}`. Already-available: `AnimatePresence` is re-exported from `@/lib/motion` since Phase 2 Plan 01.
  - Fade mode = default (both out + in happen simultaneously). If grid "pumps" during the swap, planner may switch to `mode="wait"` (out finishes before in starts) during execution.
  - Keep the filter functionally snappy: 160ms total is fast enough to feel instant on tap.

- **D3-14:** FlavorCard itself = **NO new scroll motion inside the card**. The existing hover `scale-[1.02]` stays. No per-card cap graphic parallax, no range-chip pulse. Phase 3 motion lives at the row/section level, not inside the card. Protects the 10 KB Motion budget and keeps the component simple.

### Section Seams + Reduced-Motion + Scope

- **D3-15:** Section seams = **keep hard-cut seams from Phase 2**. Homepage flow Hero (cream) → HowItWorks (inverted brand-deep) → FlavorTeaser (cream) stays as-is. No gradient fades, no accent-color sweep bar, no sticky section headers. The contrast rhythm Phase 2 locked in IS the visual seam.

- **D3-16:** Reduced-motion implementation = **central `useReducedMotion` hook for scroll-linked anim + existing `motion-reduce:` utilities for `whileInView`**. Create `src/lib/useReducedMotion.ts` that re-exports Motion's own `useReducedMotion()` hook (keeps the "all Motion imports go through `@/lib/motion`" contract from Phase 1 CONV-05 — this new file complements `motion.ts`).
  - Hero cap-twist: when `useReducedMotion() === true`, the component short-circuits — skip the `useScroll` wiring entirely and render the single original `/hero/cap-on-bottle.jpg` (no two-layer, no rotation). Zero layout shift vs. the animated path.
  - HowItWorks steps + FlavorTeaser section + FlavorGrid rows: keep the Phase 2 Tailwind `motion-reduce:!transform-none motion-reduce:!opacity-100` pattern on each `m.*` element. These work out of the box with `whileInView`.
  - `AnimatePresence` crossfade on filter: when reduced-motion is on, children render without transition (default behavior; AnimatePresence respects reduced-motion automatically via Motion's own detection).

- **D3-17:** Bundle budget verification = **`rollup-plugin-visualizer` at build**. Add as a dev dep; wire into `vite.config.ts` as a build-only plugin that emits `dist/stats.html`. Developer reviews stats.html before each ship to confirm Motion-related chunk gzip ≤10 KB (CONV-05 contract). No hard CI gate — manual check only, because chunk naming can shift between Vite minor versions and false-flag regressions.
  - If a future ship shows the entry Motion footprint over budget, the hard fallback is to narrow the feature import in `src/lib/motion.ts` (today: `domAnimation`; options: trim to just the features used, or drop `AnimatePresence` from the default re-export).

- **D3-18:** Manual-pass evidence = **developer-captured notes + screencast at `.planning/evidence/03-scroll-polish-manual-pass.md`**. Include:
  - Device + browser + viewport (real iPhone + real Android Chrome)
  - Observations per section: Hero (cap-twist smoothness, cutout seam, scroll jank), HowItWorks (step stagger, video autoplay unaffected), FlavorTeaser (section fade, horizontal snap intact), `/flavors` (row stagger, filter crossfade, URL state intact)
  - Reduced-motion run: enable OS-level reduced-motion, confirm static fallbacks across all four sections + zero layout shift vs. animated path
  - Short screencast per device (phone screen recording is enough; no studio setup)
  - Bundle report: paste the Motion chunk size from `dist/stats.html` for the record

- **D3-19:** Scope guard = **lock to shipped sections only**. Phase 3 ONLY touches: `src/sections/Hero.tsx`, `src/sections/HowItWorks/HowItWorks.tsx`, `src/sections/FlavorTeaser.tsx`, `src/sections/FlavorGrid.tsx`, `src/components/ui/FlavorCard.tsx` (only to confirm no change), `src/components/ui/RangeFilter.tsx` (if the filter swap needs a key change), `src/pages/FlavorsPage.tsx` (filter crossfade wiring), `src/pages/HomePage.tsx` (no change expected). Adds: `src/lib/useReducedMotion.ts`, `public/hero/cap.png`, `public/hero/bottle.jpg`, `.planning/evidence/03-scroll-polish-manual-pass.md`, `vite.config.ts` edit for the visualizer. New capabilities (USP, variants, trust, FAQ) belong in Phase 4/5 — if the planner surfaces one during execution, redirect to deferred.

### Carried Forward (from Phase 1 + 2 — do NOT re-decide)

- **CONV-05 LazyMotion contract (Phase 1):** ALL Motion imports go through `src/lib/motion.ts`. New `src/lib/useReducedMotion.ts` is an additive file that follows the same contract — never import `useReducedMotion` from `motion/react` elsewhere in `src/`. ESLint rule / CI grep (if any) applies to the new file too.
- **No `motion.div` anywhere outside `@/lib/motion`:** Phase 3 uses `m.div`, `m.section`, `m.li`, `m.img` (for the cap PNG layer). The CI grep from Phase 1 Plan 03 enforces this.
- **Mobile-first (CAPSHOT):** 360×640 is the baseline. All scroll choreography must be tested at that viewport first; desktop scale-up follows.
- **Reduced-motion is a locked success criterion** (Phase 3 criterion #3) — every new animation needs a static fallback with ZERO layout shift. This is a hard contract.
- **Transform + opacity only** (Phase 3 criterion #1) — no `width`/`height`/`top`/`left`/`filter` animations. GPU-safe properties only, so scroll stays smooth on mid-tier Android + 4G.
- **No `wa.me` / "energy drink" leakage** — Phase 1 CI grep still applies; Phase 3 does not add any new copy or CTA destinations.
- **Brand palette locked:** `#594545 / #815B5B / #9E7676 / #FFF8EA` + per-flavor `accentHex`. Phase 3 adds no new colors (and no "accent-color sweep" seam that would require one).
- **D2-04 FlavorCard visual (Phase 2):** color-washed accentHex background with cream text + shadow. Phase 3 does NOT redesign the card — motion lives at the parent row/section level.
- **D2-07 pill-chip filter visual (Phase 2):** no change. The filter continues to use its existing React state + `history.pushState` for URL sync. Phase 3 only adds the AnimatePresence wrapper around the grid children.
- **Phase 6 invariant:** no refactor of `src/config/cta.ts`, `src/data/flavors.ts` schema, `src/config/features.ts`. Phase 3 only reads these contracts.

### Claude's Discretion

Items the user did not explicitly weigh in on; planner/executor picks the sensible default consistent with locked constraints:

- **Cap-twist timing curve:** linear by default; `useSpring({ stiffness: 100, damping: 20 })` optional if the raw `useTransform` feels mechanical during manual-pass.
- **HowItWorks step stagger timing:** 0ms / 120ms / 240ms per step; planner may tune to 0 / 150 / 300 if it reads cleaner.
- **FlavorGrid intra-row stagger delay:** `(index % cols) * 0.12` or similar — planner picks between a `useMediaQuery` hook and a flat index-based delay. Either is acceptable as long as the row-by-row effect is preserved and no layout shift occurs.
- **AnimatePresence filter mode:** default (overlap) by default; switch to `mode="wait"` if the grid pumps during swap.
- **Viewport trigger margins:** `-10% 0px` default (matches Phase 2); tune to `-15%` or `-20%` per-section if elements fire too early on tall viewports.
- **`vite.config.ts` visualizer options:** emit `dist/stats.html`, gzip view enabled, open-on-build disabled. Build-only plugin (not dev).
- **Hero bottle+cap asset pipeline:** cutout work is a one-off Photoshop task; executor picks whether to use the existing `/hero/cap-on-bottle.jpg` as-is for reduced-motion fallback or re-flatten `bottle.jpg + cap.png` as a separate single asset.
- **Reduced-motion detection granularity:** `useReducedMotion()` returns `boolean | null` (null during SSR); treat `null` as "assume reduced" during first paint to avoid flash-of-animation on cold load.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project context (always read first)

- `.planning/PROJECT.md` — core value, locked constraints, out-of-scope, key decisions table
- `.planning/REQUIREMENTS.md` — v1 REQ-IDs; Phase 3 owns no REQ directly but re-verifies CONV-05 (LazyMotion + `m.*` only) and inherits mobile-perf expectations
- `.planning/ROADMAP.md` §Phase 3 — goal statement, 4 success criteria (useScroll/whileInView, ≤10 KB bundle, reduced-motion, no jank)
- `.planning/STATE.md` — current project position

### Phase 1 + 2 artifacts (what Phase 3 polishes)

- `.planning/phases/01-foundation-hero-conversion-infrastructure/01-CONTEXT.md` — D-01 (static hero shot → Phase 3 adds cap-twist), D-04 ("no secondary element in hero" — Phase 3 preserves this: the twist is a motion overlay on the existing composition), deferred ideas §"Hero cap-twist on-scroll Motion polish"
- `.planning/phases/01-foundation-hero-conversion-infrastructure/01-UI-SPEC.md` — baseline design tokens + interaction contracts
- `.planning/phases/01-foundation-hero-conversion-infrastructure/01-02-SUMMARY.md` — Hero + LazyMotion wrapper + hero image preload
- `.planning/phases/01-foundation-hero-conversion-infrastructure/01-03-SUMMARY.md` — Phase 1 CI greps (`wa.me`, "energy drink", `motion.div`) + the Phase 1 reduced-motion baseline
- `.planning/phases/02-how-it-works-flavor-catalog/02-CONTEXT.md` — D2-01..D2-14; especially D2-04 (card visual) + D2-07 (filter UX) + D2-11..D2-12 (nav evolution); Phase 2 whileInView pattern on HowItWorks block that Phase 3 replaces per-step
- `.planning/phases/02-how-it-works-flavor-catalog/02-01-SUMMARY.md` — FlavorCard + FlavorCapGraphic + lightenHex (Phase 3 does NOT modify these)
- `.planning/phases/02-how-it-works-flavor-catalog/02-02-SUMMARY.md` — HowItWorks + FlavorTeaser shipped structure (Phase 3 adds motion inside these)
- `.planning/phases/02-how-it-works-flavor-catalog/02-03-SUMMARY.md` — FlavorsPage + FlavorGrid + RangeFilter (Phase 3 adds AnimatePresence crossfade here)

### Research (from roadmap creation — still authoritative)

- `.planning/research/ARCHITECTURE.md` — 4-layer tree; Phase 3 touches Pages (FlavorsPage) + Sections (Hero/HowItWorks/FlavorTeaser/FlavorGrid) + Lib (new useReducedMotion.ts, additive to motion.ts)
- `.planning/research/STACK.md` — Motion 14, `LazyMotion` + `m.*` only, LazyMotion feature bundle sized under 10 KB
- `.planning/research/PITFALLS.md` — "Motion full-bundle risk" (why LazyMotion), iOS Safari sticky jank (why Phase 3 avoids sticky section headers)
- `.planning/research/FEATURES.md` — must/should/defer partitioning — Phase 3 is a "should" polish; defer anything beyond cinematic entrance + Hero cap-twist

### Project-local skills (load when applicable)

- `.claude/skills/capshot-brand/SKILL.md` — palette tokens, Hinglish policy, mobile-first mandate; Phase 3 adds no new copy
- `.claude/skills/react-perf-optimizer/SKILL.md` — **REQUIRED read for Phase 3** — covers Motion / Framer-Motion stuttering, `useScroll`/`useTransform` performance patterns, GPU-safe transform+opacity-only animation, how to avoid re-renders inside scroll handlers
- `.claude/skills/capshot-catalog/SKILL.md` — flavors + accentHex (unchanged in Phase 3; filter crossfade reads existing data)

### Project root (authoritative)

- `CLAUDE.md` — technology stack: Motion 14, `LazyMotion` + `m` component everywhere, "Pick one pattern per project — recommend `LazyMotion` + `m` component everywhere, imported via a wrapper (`src/lib/motion.ts`)"
- `product_specs_short` — brand/product spec; "cinematic Motion scroll choreography" direction is the whole creative reason for the custom React stack per the ROADMAP.md overview

### Existing source files Phase 3 touches

- `src/sections/Hero.tsx` — becomes a motion element; cap image splits into two layers; `useScroll` + `useTransform` wires the twist
- `src/sections/HowItWorks/HowItWorks.tsx` — replace right-column `m.div whileInView` with per-step `m.li whileInView`; video card unchanged
- `src/sections/FlavorTeaser.tsx` — section-level `m.section whileInView` fade+slide; cards unchanged
- `src/sections/FlavorGrid.tsx` — per-card `m.li whileInView` with intra-row stagger delay
- `src/pages/FlavorsPage.tsx` — wrap the grid in `AnimatePresence` so filter changes crossfade
- `src/components/ui/RangeFilter.tsx` — read-only in Phase 3 (filter state logic unchanged); only confirm the key prop on children is stable
- `src/components/ui/FlavorCard.tsx` — unchanged; hover scale persists; no new motion inside
- `src/lib/motion.ts` — read-only; keeps `LazyMotion`, `m`, `domAnimation`, `AnimatePresence` re-exports
- `index.html` — no change
- `src/App.tsx` — no change (LazyMotion provider already mounted in Phase 1)

### New files Phase 3 adds

- `src/lib/useReducedMotion.ts` — re-export of Motion's `useReducedMotion` hook; keeps the CONV-05 "all Motion imports go through `@/lib/motion*`" contract. Imported by Hero (scroll-linked anim needs runtime short-circuit).
- `public/hero/cap.png` — transparent-PNG cap cutout (new asset; one-off Photoshop task from existing hero source)
- `public/hero/bottle.jpg` — bottle without cap (new asset)
- `.planning/evidence/03-scroll-polish-manual-pass.md` — developer-captured notes + screencast references per device
- `vite.config.ts` — edit to add `rollup-plugin-visualizer` build-only plugin

### External docs the planner-researcher should query (Context7)

- `motion/react` docs — current `useScroll` + `useTransform` + `useSpring` API, LazyMotion feature import tree-shaking, `AnimatePresence` modes (`sync` / `wait` / `popLayout`)
- `motion/react` reduced-motion docs — `useReducedMotion()` behavior, SSR null handling, AnimatePresence reduced-motion defaults

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets

- **`src/lib/motion.ts`** — the LazyMotion + `m.*` + `AnimatePresence` wrapper is already in place from Phase 1 Plan 02; Phase 3 adds ONE new lib file (`useReducedMotion.ts`) that complements it.
- **`<LazyMotion>` provider** — already mounted in `src/App.tsx` around `<Routes>` since Phase 1 (CONV-05 provider contract closed). Phase 3 adds no provider wiring — just consumes the context inside sections.
- **`AnimatePresence`** — already re-exported from `@/lib/motion` since Phase 2 Plan 01 (used nowhere yet in `src/`; Phase 3 is the first consumer). No new import needed.
- **Phase 2 whileInView pattern** — `<m.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-10% 0px' }} transition={{ duration: 0.5, ease: [0.2, 0, 0.2, 1] }} className="... motion-reduce:!transform-none motion-reduce:!opacity-100">` — HowItWorks' current block anim uses this verbatim; Phase 3 shards it per-step (same variants, applied to each `<m.li>`).
- **`<FlavorCard>`** — memoized, hover-scale-only, cap graphic recolored via CSS variables. Phase 3 wraps it in motion at the parent level — the card itself stays untouched.
- **`<FlavorCapGraphic>` + `lightenHex`** — unchanged in Phase 3.
- **`<RangeFilter>`** — pill-chip UI + `history.pushState`-driven URL sync is stable from Phase 2; Phase 3 only wraps the grid children in AnimatePresence.
- **`motion-reduce:` Tailwind utility** — already applied everywhere motion exists today (Hero PrimaryCTA arrow nudge, HowItWorks whileInView, FlavorTeaser scroll arrow transform, FlavorCard hover scale). Phase 3 extends the same pattern to all new per-step/per-row motion.

### Established Patterns

- **4-layer architecture (research/ARCHITECTURE.md):** `src/pages/` → `src/sections/` → `src/components/ui/` → `src/components/primitives/`. Phase 3 modifications respect the layering — motion wrappers live in `src/sections/*` (not pushed into UI components), keeping the UI layer theme-independent.
- **Transform + opacity only:** every current Phase 1–2 animation already respects this (whileInView fades, hover scales, scroll-arrow buttons). Phase 3 continues the contract — scroll-driven rotation on the cap is a transform; crossfade is opacity; stagger uses opacity + y.
- **`motion-reduce:` on every `m.*` element:** mandatory CI/manual convention. Phase 3 extends it to each new `m.li`, `m.section`, `m.img`.
- **CSS custom properties for theming:** HowItWorks' theme-flipped inverted palette uses `[--color-bg:...]` + `dark:[--color-bg:...]`. Phase 3 does not alter theme vars — motion stays decoupled from theme.
- **`AnimatePresence` key stability:** cards must have a stable `key={flavor.handle}` so AnimatePresence can distinguish exits from enters when the filter changes.

### Integration Points

- **Hero → cap-twist:** `useScroll({ target: heroRef })` reads scroll of the Hero section itself; cap `m.img` reads `useTransform(scrollYProgress, [0, 1], [0, 35])` and sets `rotate`. `transform-origin: 50% 100%` is a plain CSS class on the cap image.
- **HowItWorks right column → per-step stagger:** the three `STEPS` constant stays; each list item becomes an `m.li` with its own `whileInView` + `transition.delay` indexed from the step order. The right-column wrapping `m.div` becomes a plain `<div>`.
- **FlavorTeaser → section-level entrance:** wrap the current `<Section>` body in an `m.section` (or convert the inner heading/scroller block into one motion wrapper); the horizontal scroller UX stays identical, only the outer wrapper fades + slides in.
- **FlavorGrid → row-by-row entrance:** each `<li>` becomes `m.li` with per-card `transition.delay` computed from column index. If a `useMediaQuery` hook doesn't exist yet, this is a 1-file add (`src/lib/useMediaQuery.ts`) that reads the current column count — but a flat `(index % 2) * 0.12` using the mobile baseline also works acceptably and avoids the hook entirely.
- **FlavorsPage filter crossfade:** wrap the `<FlavorGrid flavors={filtered} />` call site in `<AnimatePresence mode="sync">` (or `"wait"` if pump occurs). The `FlavorGrid` component itself needs `<m.li>` children with stable `key={flavor.handle}` so AnimatePresence can track exits.
- **`src/lib/useReducedMotion.ts`:** `export { useReducedMotion } from 'motion/react';` — the single-line additive module keeps the CONV-05 contract intact. Hero imports from here when wiring the scroll short-circuit.
- **`vite.config.ts` → bundle visualizer:** add `rollup-plugin-visualizer({ filename: 'dist/stats.html', gzipSize: true, open: false })` inside the `plugins` array, guarded by `mode === 'production'` so dev builds stay fast.

</code_context>

<specifics>
## Specific Ideas

- **The "whole reason this is a custom React site vs. Shopify theme" framing** (ROADMAP.md §Phase 3 goal) is the north star for Phase 3. The cap-twist on scroll is the one signature moment that most carries that story — a Shopify theme cannot animate a scroll-linked cap rotation layered over a two-image composition without heavy custom theme development. Every other Phase 3 decision (section fades, step stagger, row-by-row grid, filter crossfade) is in service of that storytelling arc, not standalone showpieces.
- **Phase 1 D-01 explicitly reserved cap-twist for Phase 3** — the user chose to ship Phase 1 as a static hero shot specifically to earn Lighthouse budget headroom for the Motion polish that lands here. The cap-twist is a long-standing promise, not a new idea.
- **Phase 1 D-04 said "no secondary element" in hero** — Phase 3 respects this: the cap-twist is a motion overlay on the existing composition, not a new element. The flavor-swap color-wash option (which WOULD have added a secondary element) was explicitly declined.
- **Phase 2 shipped a working whileInView fade+slide for HowItWorks** — the user explicitly chose "keep video card unchanged" in Phase 3 to preserve the Phase 2 UAT and prevent regression. Phase 3's per-step stagger is additive on the right column only.
- **`react-perf-optimizer` SKILL is a Phase 3 must-load** — the user signaled a preference for "no jank, no CLS, no bundle regression" per success criterion #4. The skill covers Motion-specific jank patterns (over-animation, non-GPU properties, re-render loops inside `useScroll`) that the planner-researcher must apply.

</specifics>

<deferred>
## Deferred Ideas (captured, not acted on)

- **Parallax ambient halos in Hero** — would add depth but was declined to keep Hero focused on one dominant moment (cap-twist). Could revisit in Phase 4+ polish if the manual pass shows the Hero feels under-animated vs. the rest of the site.
- **Flavor-swap color-wash in Hero** (cap halo cycles through flavor accentHex values on scroll) — declined; conflicts with Phase 1 D-04 "no secondary element". Flagged as a potential Phase 5 experiment if the brand wants a stronger "16 flavors" preview on the homepage, but not v1.
- **Sticky video + swapping steps in HowItWorks** (Apple-style storyboard pin) — declined; adds ~2000px of scroll height, iOS sticky jank risk, more Motion code. Could revisit in a future "immersive storytelling" phase if the brand ever adds editorial content.
- **Coverflow-style card tilt in FlavorTeaser** (scroll-linked rotation/scale as cards pass center) — declined; low-end Android jank risk, 16+ scroll listeners on `/flavors`. Could revisit if a desktop-focused showcase ever becomes a priority.
- **Marquee auto-drift on FlavorTeaser when idle** — declined; fights native touch intent + prefers-reduced-motion.
- **Section seam gradient fades / brand-rose accent sweep bar / sticky section eyebrows** — declined; Phase 2's inverted-theme contrast in HowItWorks IS the visual seam. Keep hard-cuts.
- **Nav + ThemeToggle + HamburgerMenu + PrimaryCTA scroll micro-interactions** — out of Phase 3 scope guard. Logo nudge on load, hamburger panel entrance easing polish, CTA shimmer on scroll — all deferred to a potential Phase 5 UI polish pass or dropped entirely.
- **Playwright jank/CLS automated asserts** — declined for Phase 3; CI can't reliably measure real-device jank. Defer to Phase 4 PERF-01 (Lighthouse mobile ≥90) which is a better fit.
- **Hard CI bundle-size gate on Motion chunks** — declined; chunk naming can shift between Vite versions and false-flag regressions. Manual visualizer check is sufficient at this project size.
- **Lighthouse mobile audit as Phase 3 evidence** — formally Phase 4 (PERF-01); doing it now double-books that criterion. Phase 3 verifies "no regression" manually only.
- **Full Lighthouse ≥90 pass + responsive hero `<picture>` AVIF/WebP/JPG via vite-imagetools** — Phase 4.

</deferred>

<open_questions>
## Open Questions for Planning

None blocking. The planner can proceed to break Phase 3 into waves. Likely wave split (planner refines):

1. **Wave 1 — Foundations**: Add `src/lib/useReducedMotion.ts`; cutout work for `public/hero/cap.png` + `public/hero/bottle.jpg`; wire `rollup-plugin-visualizer` into `vite.config.ts`. Parallelizable; no component changes yet.
2. **Wave 2 — Section polish (Hero + HowItWorks)**: Rebuild Hero to the two-layer composition + wire `useScroll` + `useTransform` cap rotation (with reduced-motion short-circuit); replace HowItWorks right-column block anim with per-step `m.li` stagger. Parallelizable; different files.
3. **Wave 3 — Flavor surfaces (FlavorTeaser + FlavorGrid + Filter)**: Section-level entrance on FlavorTeaser; row-by-row stagger on FlavorGrid; AnimatePresence crossfade on filter changes in FlavorsPage. Parallelizable with Wave 2; different files/routes.
4. **Wave 4 — Verification**: Build + visualizer stats.html capture; manual-pass evidence doc at `.planning/evidence/03-scroll-polish-manual-pass.md` across real iPhone + Android, light + dark + reduced-motion. Serial after Waves 1–3.

Phase 3's natural plan count is likely 2–3 plans. Planner finalizes.

</open_questions>

---

*Phase: 3-Scroll Storytelling Polish*
*Context gathered: 2026-10-10*
