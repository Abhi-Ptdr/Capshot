# Phase 3: Scroll Storytelling Polish - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-10-10
**Phase:** 3-Scroll Storytelling Polish
**Areas discussed:** Hero signature moment, How It Works beat progression, Flavor Teaser + Grid entrance, Section seams + reduced-motion

---

## Hero signature moment

### What should the signature Hero scroll moment be?

| Option | Description | Selected |
|--------|-------------|----------|
| Cap-twist rotation | Cap-on-bottle image rotates 30–45° as user scrolls — Motion useScroll + useTransform. Phase 1 D-01 reserved this. | ✓ |
| Parallax halo + text drift | Ambient halos drift at different speeds vs headline+CTA; cap static. | |
| Flavor-swap color-wash | Halo accent cycles through 3–4 flavor accentHex values tied to scroll. | |
| Cap-twist + parallax halo | Combine recommended cap rotation with lighter halo parallax. | |

### What drives the cap-twist rotation?

| Option | Description | Selected |
|--------|-------------|----------|
| Scroll position (useScroll) | Motion useScroll + useTransform maps scroll progress → rotation 0→35°. Deterministic. | ✓ |
| Entrance only (whileInView) | Cap starts tilted -20°, animates to 0° once on load. One-shot. | |
| Idle loop + scroll override | Gentle rock ±5° forever + scroll-driven layer on top. | |

### What's the rotation range + anchor point?

| Option | Description | Selected |
|--------|-------------|----------|
| 0° → 35°, pivot cap-base | Rotation 0→35° clockwise; pivot bottom-center of cap. Reads as "being twisted ON". | ✓ |
| -15° → 15°, pivot center | Symmetric wobble through center — reads more as "floating/shaking". | |
| 0° → 90°, pivot cap-base | Full quarter-turn — dramatic but risks visual distortion. | |

### How to isolate the cap for rotation?

| Option | Description | Selected |
|--------|-------------|----------|
| Two-layer: cap PNG + bottle JPG | Transparent-PNG cap over bottle JPG; only cap rotates. New asset (Photoshop cutout). | ✓ |
| SVG cap + bottle JPG | Replace photo cap with stylized SVG. Conflicts with D-01 "static product shot". | |
| Rotate entire hero image | Simplest — tilt whole JPG ±5°. Weakest storytelling. | |
| You decide (planner picks) | Defer to planner. | |

---

## How It Works beat progression

### What's the Phase 3 upgrade?

| Option | Description | Selected |
|--------|-------------|----------|
| Stagger 01 → 02 → 03 | Each numbered step whileInView with 120ms stagger. Low complexity, storyboard feel. | ✓ |
| Scroll-scrubbed progression | Steps reveal based on scroll position inside section. More Motion code. | |
| Sticky video + swapping steps | Video sticky; steps swap in/out as user scrolls. iOS sticky jank risk. | |
| Keep current + add video entrance | No change to steps; add gentle scale on video card. | |

### What animates on each staggered step?

| Option | Description | Selected |
|--------|-------------|----------|
| Opacity + Y-slide (match Phase 2) | opacity 0→1, y 16→0 — mirrors Phase 2's whileInView pattern. Transform + opacity only. | ✓ |
| Opacity + Y + big number pop | Add 0.7→1 scale with overshoot on 01/02/03 number. | |
| Opacity + X-slide from left | Slide in from left (x: -24→0) — can collide with mobile viewport edges. | |

### Block vs. per-step wiring?

| Option | Description | Selected |
|--------|-------------|----------|
| Replace block anim with per-step | Remove right-column whileInView; each `<li>` gets its own whileInView. Cleaner. | ✓ |
| Keep block anim + add inner stagger | Keep right-column whileInView, add nested stagger via Motion variants. | |
| Keep block anim unchanged | Don't touch step anim; polish other section parts only. | |

### Video card entrance?

| Option | Description | Selected |
|--------|-------------|----------|
| Keep as-is | Phase 2 shipped the entrance; don't touch. Lowest regression risk. | ✓ |
| Add gentle scale-up | Keep opacity+y, add scale 0.95→1 on same transition. | |
| Replace with scroll-linked parallax | Scrap whileInView; make video drift up slower than page scroll. iOS jank risk. | |

---

## Flavor Teaser + Grid entrance

### FlavorTeaser (home) entrance choreography?

| Option | Description | Selected |
|--------|-------------|----------|
| Section fade+slide only | Whole section fades + y-slides once. Cards do NOT stagger per-item. | ✓ |
| Per-card stagger entrance | Each of 8+1 cards staggers in. Mostly offscreen on mobile — motion wasted. | |
| Scroll-linked card tilt | Coverflow-like tilt/scale on horizontal scroll. Low-end Android jank risk. | |
| Idle auto-drift when offscreen | Marquee-style auto-drift until user interacts. Fights native touch intent. | |

### /flavors grid entrance?

| Option | Description | Selected |
|--------|-------------|----------|
| Row-by-row stagger as scrolled into view | Each row's cards enter together, 120ms intra-row stagger left-to-right. | ✓ |
| Full grid single whileInView | Whole grid fades in as one block. Below-fold cards animate without being seen. | |
| Per-card stagger (all 16 chained) | All 16 cards sequentially — takes ~2s to settle, wasted below fold. | |
| No entrance — cards static | Grid stays static; motion only above/below. Feels inert. | |

### Range filter card swap?

| Option | Description | Selected |
|--------|-------------|----------|
| AnimatePresence crossfade | Outgoing opacity 1→0; incoming 0→1 via AnimatePresence. 160ms, snappy. | ✓ |
| Layout shift animation (Motion layoutId) | Cards animate position via `layout` prop; new cards fade in. Complex. | |
| No motion — instant swap | Replace grid instantly. Feels unpolished vs Phase 3 cinematic goal. | |
| You decide (planner picks) | Planner evaluates against budget. | |

### Per-card scroll motion inside FlavorCard?

| Option | Description | Selected |
|--------|-------------|----------|
| No per-card scroll motion | Card stays static color-washed tile. Hover scale persists. Simple, budget-friendly. | ✓ |
| Cap graphic parallax inside card | FlavorCapGraphic drifts relative to card. 16+ scroll listeners risk. | |
| Range chip pulse on filter match | Chip pulses briefly when filter matches. | |

---

## Section seams + reduced-motion

### How should sections visually connect?

| Option | Description | Selected |
|--------|-------------|----------|
| Keep hard-cut seams | Phase 2's inverted-theme HowItWorks between cream sections IS the seam. No change. | ✓ |
| Soft fade seams | Thin gradient at top/bottom of HowItWorks. Weakens the inverted-beat feel. | |
| Accent-color sweep | Brand-rose horizontal bar travels between sections tied to scroll. Busy. | |
| Sticky section headers | Eyebrow pills stick while scrolling through section. iOS sticky jank risk. | |

### Reduced-motion implementation?

| Option | Description | Selected |
|--------|-------------|----------|
| Central useReducedMotion hook + variants | New src/lib/useReducedMotion.ts; components short-circuit scroll-linked anim. | ✓ |
| Tailwind motion-reduce: utilities only | Keep Phase 2 pattern. Doesn't cover useScroll scrub (needs JS). | |
| Hybrid — utilities for whileInView, hook for useScroll | Utilities for whileInView, hook only for scroll-linked. Pragmatic. | |

### Bundle budget verification?

| Option | Description | Selected |
|--------|-------------|----------|
| rollup-plugin-visualizer at build | Add dev dep; emit dist/stats.html; manual check per release. | ✓ |
| CI budget gate | size-limit script fails if Motion chunks >10 KB. Brittle on chunk-name shifts. | |
| Manual Lighthouse / build-report check only | No new tooling; eyeball Vite build output. | |
| You decide (planner picks) | Planner picks during execution. | |

### Manual-pass evidence?

| Option | Description | Selected |
|--------|-------------|----------|
| Dev-captured notes + screencast | Short screencap + bullet notes at .planning/evidence/03-scroll-polish-manual-pass.md. | ✓ |
| Full Lighthouse mobile run | Double-books Phase 4 PERF-01. Not now. | |
| Playwright jank/CLS asserts | CI can't measure real-device jank. Not reliable. | |
| No formal evidence — UAT only | UAT checklist only. No artifact. | |

### Scope guard?

| Option | Description | Selected |
|--------|-------------|----------|
| Lock to shipped sections only | Phase 3 touches only Hero, HowItWorks, FlavorTeaser, FlavorGrid, FlavorCard, RangeFilter, FlavorsPage. | ✓ |
| Also polish Nav + ThemeToggle + HamburgerMenu | Broaden surface to also polish nav. | |
| No formal guard — planner decides | Trust planner + executor to stay in bounds. | |

---

## Claude's Discretion

- Cap-twist timing curve: linear by default; useSpring optional during manual-pass
- HowItWorks step stagger timing: 0 / 120 / 240 ms per step; planner may tune
- FlavorGrid intra-row stagger delay: `(index % cols) * 0.12` — planner picks hook vs flat index
- AnimatePresence filter mode: default (overlap); switch to `mode="wait"` if pumping
- Viewport trigger margins: `-10% 0px` default; tune per-section if elements fire too early
- `vite.config.ts` visualizer options: emit `dist/stats.html`, gzipSize true, open false, build-only
- Hero bottle+cap asset pipeline: executor picks flattening strategy for reduced-motion fallback
- Reduced-motion detection: treat null (SSR) as "assume reduced" during first paint

## Deferred Ideas

- Parallax ambient halos in Hero — declined; one dominant moment preferred
- Flavor-swap color-wash in Hero — declined; conflicts with Phase 1 D-04
- Sticky video + swapping steps in HowItWorks — declined; iOS sticky jank + ~2000px scroll height
- Coverflow-style card tilt in FlavorTeaser — declined; Android jank risk
- Marquee auto-drift on FlavorTeaser — declined; fights touch intent
- Section seam gradient / accent-color sweep / sticky eyebrows — declined; keep hard-cuts
- Nav + ThemeToggle + HamburgerMenu + PrimaryCTA scroll micro-interactions — out of scope guard
- Playwright jank/CLS automated asserts — defer to Phase 4
- Hard CI bundle-size gate on Motion chunks — declined; brittle
- Lighthouse mobile audit as Phase 3 evidence — formally Phase 4
- Full Lighthouse ≥90 pass + responsive hero `<picture>` AVIF/WebP/JPG — Phase 4
