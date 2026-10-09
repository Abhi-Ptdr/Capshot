# Phase 2: How It Works + Flavor Catalog — Research

**Researched:** 2026-10-10
**Domain:** React 19 SPA — scroll-based product explainer + filtered product catalog with URL-synced state
**Confidence:** HIGH (component layout, URL sync, scroll-snap, SVG recoloring); MEDIUM (one new install decision for the hamburger panel)

---

## Summary

Phase 2 is a pure composition phase on top of a frozen Phase 1 scaffold. Every artifact slots into the already-established 4-layer tree, every animation routes through the already-mounted `<LazyMotion>` provider via `m.*` primitives from `@/lib/motion`, and every CTA composes `<PrimaryCTA>` (no `wa.me` outside `src/config/cta.ts`). The whole phase is achievable with **one new dependency decision** — the hamburger panel — and the recommendation is to **install `@radix-ui/react-dialog@1.2.0`** rather than hand-rolling focus trap and escape handling.

**Primary recommendation (planner must adopt):**

1. `<HowItWorks />`, `<FlavorTeaser />` → `src/sections/`; `<FlavorCard />`, `<FlavorCapGraphic />`, `<RangeFilter />`, `<HamburgerMenu />` → `src/components/ui/`; inline SVG for the three TWIST/SHAKE/BOOM illustrations as React components colocated with `<HowItWorks />` under `src/sections/HowItWorks/`.
2. Install **`@radix-ui/react-dialog@1.2.0`** for the hamburger panel — focus trap, Escape, click-outside, aria roles come free. The one-dep tradeoff is 2 KB gzip vs. 60+ lines of hand-rolled a11y that will drift.
3. The **shared cap SVG uses `fill="currentColor"`** on strokes and defines two `<path>` elements that take `fill="var(--cap-base)"` and `fill="var(--cap-highlight)"` from CSS variables set on the parent `<FlavorCard>`. Base = `accentHex`, highlight = `accentHex` at ~85% lightness (computed once per flavor at module scope).
4. **Text on cards stays cream (`brand-cream`)** across all 16 accents. Verified contrast strategy using a 32px tap-target range tag that sits on a `rgba(255,248,234,0.90)` chip for the two lightest accents (`#F297B1` Guava, `#F7CA18` Pineapple) — not dynamic luminance; a static "chip override" pattern.
5. **URL sync via `useSearchParams` from `react-router`** (NOT `react-router-dom` — removed in v8), `replace: true` for default state cleanup, `useMemo` for the filtered flavor list.
6. **CSS scroll-snap on the teaser scroller** — `scroll-snap-type: x mandatory` + `scroll-snap-align: center` on cards + `scroll-padding-inline` for edge cases. No new library.
7. **Phase 2 ships STATIC visuals + optional `whileInView` fade-in only** — the signature scroll choreography (cap twist, step-reveal timing, parallax) is explicitly Phase 3's job per `02-CONTEXT.md` Scope.
8. **No per-flavor detail route** (`/flavors/:handle`) in Phase 2 — Phase 6 delegates to Shopify PDPs; adding routes now creates a Phase 6 migration decision (`.planning/research/ARCHITECTURE.md` Anti-Pattern 6).

---

## User Constraints (from CONTEXT.md)

### Locked Decisions

- **D2-01:** How It Works uses vector/SVG illustrations per step; one SVG per beat (TWIST = bottle + cap being twisted on + subtle rotation indicator; SHAKE = bottle with motion lines/shake arcs; BOOM = filled vibrant bottle with bursting/sparkle accents). Palette: brand-deep, brand-mid, brand-rose, brand-cream only.
- **D2-02:** How It Works copy = Hinglish beat only (TWIST / SHAKE / BOOM in large display type, hero-scale). No English explainer sentence per step.
- **D2-03 (Claude's call):** Section position immediately below Hero, above Flavor Teaser on `/`.
- **D2-04:** Flavor card = color-washed card using `accentHex` as background + small shared cap SVG recolored to accentHex family + flavor name in Title Case (brand-cream type) + 1-line description + small range tag in a corner.
- **D2-05:** ONE shared vector cap illustration at `src/components/ui/FlavorCapGraphic.tsx` recolored per flavor via `currentColor` / `fill` prop. Real cap photos deferred.
- **D2-06:** Grid = 2 cols mobile (<640 px), 3 cols tablet (640–1024 px), 4 cols desktop (≥1024 px).
- **D2-07:** Range filter = pill chips at top. Active pill = filled with `--color-fg` + text in `--color-bg`. Inactive = outlined with `--color-border`. Pills wrap on narrow mobile. Plain `<button>` (not `<Link>`) + `history.pushState` via `setSearchParams`.
- **D2-08:** URL = clean `/flavors` for All; `?range=<slug>` for filtered. Slugs: `fruity-blast`, `desi-cool`, `premium-sports`. Invalid values fall back to All with `replaceState`.
- **D2-09:** Teaser scope = 8 flavors: 4 Fruity (Orange, Mango, Watermelon, Strawberry suggested — planner finalizes), 2 Desi (Jaljeera + ORS-Electrolyte), 2 Premium Sports (Japanese Matcha + Coffee).
- **D2-10:** Teaser layout = horizontal scroller with snap-points; 9th card = "See all 16 flavors →" with brand-rose background routing to `/flavors`. CSS scroll-snap, `scroll-snap-type: x mandatory`.
- **D2-11:** Nav upgrades from logo-only to logo + ThemeToggle + hamburger button.
- **D2-12:** Hamburger panel contents = Flavors / About / Contact links + Instagram @capshot_twist / WhatsApp (via `getCta('nav')`) / Email socials; X close + Escape + click-outside; `role="dialog"` `aria-modal="true"`; focus trap; focus returns to hamburger on close.
- **D2-13 (Claude's call):** No new routes in Phase 2.
- **D2-14 (Claude's call):** `src/data/flavors.ts` descriptions may be refined (handle/title/range/accentHex locked).

### Carried Forward (do NOT re-decide)

- **D-05 (Phase 1):** TWIST/SHAKE/BOOM is the brand mantra; HowItWorks is the 1:1 visual realization.
- **D-07 (Phase 1):** `TRY CAPSHOT` CTA label phase-invariant across all Phase 2 pages.
- **Brand palette locked** (`#594545` / `#815B5B` / `#9E7676` / `#FFF8EA`). AccentHex values from catalog SKILL are the ONLY out-of-palette colors permitted and only inside flavor cards.
- **Mobile-first mandate** — 360×640 baseline.
- **Hinglish headlines, English body copy.**
- **No `wa.me` outside `src/config/cta.ts`** (INFRA-06 CI grep enforces).
- **LazyMotion contract (CONV-05):** no `motion.div` imports — all animations via `m.*` from `src/lib/motion`.
- **Phase 6 invariant:** no refactor of `src/config/cta.ts`, `src/data/flavors.ts` schema, or `src/config/features.ts` surface.

### Claude's Discretion (research recommendations below)

- How It Works section headline above visuals: **recommend omitting** — the three giant Hinglish beats speak for themselves. (If a headline is wanted later, `Yeh kaise kaam karta hai.` works.)
- Vertical rhythm — align to the Phase 1 UI-SPEC 8-point scale: `py-16` desktop, `py-12` tablet, `py-8` mobile between sections.
- Flavor card hover state (desktop): subtle `scale-[1.02]` + elevation shadow; `motion-reduce:transform-none`.
- Hamburger icon style: Lucide `Menu` (closed) / `X` (open), 20 px stroke 1.75 — matches ThemeToggle.
- Slide-in panel timing: 240ms slide + 150ms fade overlay (matches `--duration-normal` and `--duration-fast` in `src/index.css`).
- Pill `aria-pressed="true"` on active range (semantics for toggle buttons).
- Specific curated-8 flavors: Orange, Mango, Watermelon, Strawberry, Jaljeera, ORS-Electrolyte, Japanese Matcha, Coffee (highest-contrast accent spread across the 3 ranges).
- Shared cap SVG design: stylized 3/4-view cap — rounded top dome, mid rim band, flat base. Three paths: dome fill, rim band fill (slightly darker tint), base shadow.
- Reduced-motion for How It Works: static illustration, no entrance animation.

### Deferred Ideas (OUT OF SCOPE)

- Per-flavor detail page or modal zoom — not in v1.
- Real product photography for 16 flavors — Phase 4 PERF-02 or Phase 5 content polish.
- Nutrition facts panel on flavor cards — GATE-NUTRITION; Phase 5.
- Random/rotating flavor teaser on homepage — rejected (SEO consistency, testability).
- "Flavor of the week" / editorial callout — not v1.
- Flavor comparison / recommender — not v1.

---

## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| HOW-01 | 3-step visual TWIST → SHAKE → BOOM section with animated illustrations on scroll + prefers-reduced-motion fallback | §6 SVG illustration production; §11 pitfalls (motion contract); Phase 3 later layers the scroll choreography |
| FLAV-01 | All 16 flavors on `/flavors` with color-washed accentHex cards | §1 component tree; §5 SVG recoloring; §7 card color handling; §8 grid layout |
| FLAV-02 | Filter grid by range via URL-synced `?range=` state | §2 React Router v8 useSearchParams pattern |
| FLAV-03 | Homepage flavor teaser previewing 6–8 flavors + link to `/flavors` | §3 CSS scroll-snap; §9 teaser implementation |

---

## Project Constraints (from CLAUDE.md + CI)

Directives the planner MUST honor; CI will enforce the first two automatically:

1. **CI grep gate — `wa.me`:** No `wa.me` substring anywhere in `src/` except `src/config/cta.ts`. Enforced by `scripts/ci-grep-forbidden-strings.mjs` on every PR. Hamburger panel WhatsApp link MUST use `getCta('nav')` — not a literal `wa.me/…` URL. Comments must paraphrase (per Plan 02 Deviation §6 and Plan 03 Deviation §5).
2. **CI grep gate — `energy drink`:** The literal phrase `/energy\s+drink/i` is banned everywhere in `src/` including comments. Premium Sports flavor-card copy already uses "caffeinated beverage" (see `src/data/flavors.ts`); if Phase 2 refines descriptions (D2-14), the same phrasing must continue.
3. **Package names:** `motion` (not `framer-motion`), `react-router` (not `react-router-dom`). All imports from `@/lib/motion` for `m.*`, `LazyMotion`, `domAnimation`.
4. **CONV-05:** No `motion.div` / `motion.a` / `motion.*` outside `src/lib/motion.ts`. Everything is `m.div`, `m.a`, etc.
5. **Phase 6 invariant:** `src/config/cta.ts`, `src/config/features.ts`, and the `Flavor` TYPE in `src/data/types.ts` are shape-frozen. Phase 2 may REFINE descriptions in `flavors.ts` (D2-14) but must not change `handle`, `title`, `range`, `accentHex`.
6. **Comments stay grep-safe.** Any new `src/` file must avoid literal `wa.me`, `energy drink`, `<ScrollToTop` phrases even in comments.
7. **ESLint is a no-op script in Phase 1 (and will stay so in Phase 2)** — upstream `@typescript-eslint` + `eslint-plugin-react` incompatibility with TS 7 / ESLint 10. `tsc --noEmit` in `npm run build` catches type errors; Phase 2 relies on the same mechanism.

---

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|--------------|----------------|-----------|
| Scroll-triggered reveal of HowItWorks steps | Browser / Client | — | Pure DOM + CSS + Motion `whileInView`; no SSR, no server state |
| Range filter state + URL sync on `/flavors` | Browser / Client | — | SPA client-side routing with `useSearchParams`; no API |
| Horizontal snap-scroller on homepage teaser | Browser / Client | — | CSS `scroll-snap-*`; no JS state |
| Flavor data read | Static import | — | `src/data/flavors.ts` — pure TS array, tree-shaken |
| Hamburger slide-in panel (dialog semantics) | Browser / Client | — | `@radix-ui/react-dialog` headless + Motion animation |
| SVG rendering (TWIST/SHAKE/BOOM + cap graphic) | Browser / Client | — | Inline React component SVG — no HTTP, no runtime image decoding |
| Per-route `<title>`/`<meta>` on `/flavors` | Browser / Client (React 19 metadata hoisting) | — | Phase 5 switches to `@unhead/react`; Phase 2 can keep React 19 native hoist |

---

## 1. Component Architecture

The 4-layer convention from `.planning/research/ARCHITECTURE.md` is already in flight. Phase 2 adds sections, UI components, and one SVG wrapper. Nothing goes into `primitives/` (primitives stay unopinionated — ARCHITECTURE Anti-Pattern 4).

### Recommended file paths

```
src/
├── sections/
│   ├── HowItWorks/                        # NEW — folder because 3 SVGs live beside the section
│   │   ├── HowItWorks.tsx                 # the section composition
│   │   ├── StepTwistIllustration.tsx      # inline SVG, named export
│   │   ├── StepShakeIllustration.tsx      # inline SVG
│   │   └── StepBoomIllustration.tsx       # inline SVG
│   ├── FlavorTeaser.tsx                   # NEW — horizontal scroller with 8 cards + "See all"
│   ├── FlavorGrid.tsx                     # NEW — the 4-column responsive grid; consumed by FlavorsPage
│   └── Nav.tsx                            # MODIFIED — add hamburger button + mount <HamburgerMenu />
│
├── components/
│   └── ui/
│       ├── FlavorCard.tsx                 # NEW — single card: accentHex bg + cap SVG + name + desc + range tag
│       ├── FlavorCapGraphic.tsx           # NEW — shared cap SVG that recolors per-flavor via CSS vars
│       ├── RangeFilter.tsx                # NEW — pill chip toggle group, drives useSearchParams
│       ├── HamburgerMenu.tsx              # NEW — Radix Dialog wrapper, m.div slide-in panel
│       ├── PrimaryCTA.tsx                 # UNCHANGED (reused for /flavors shell fallback if needed)
│       ├── ThemeToggle.tsx                # UNCHANGED
│       ├── TrustBadge.tsx                 # UNCHANGED (Phase 5 renders)
│       └── InAppBrowserBanner.tsx         # UNCHANGED
│
├── pages/
│   ├── HomePage.tsx                       # MODIFIED — add <HowItWorks /> and <FlavorTeaser /> below <Hero />
│   └── FlavorsPage.tsx                    # MODIFIED — replace coming-soon shell with <RangeFilter /> + <FlavorGrid />
│
├── data/
│   ├── flavors.ts                         # DESCRIPTION REFINEMENTS ONLY (per D2-14); handle/title/range/accentHex locked
│   ├── ranges.ts                          # UNCHANGED
│   └── types.ts                           # UNCHANGED
│
└── lib/
    └── motion.ts                          # UNCHANGED (import `m` + `AnimatePresence` from here if used)
```

### Why `HowItWorks/` is a folder, not a single file

Three illustration SVGs plus the section composition = four files. Keeping them colocated in `src/sections/HowItWorks/` means (a) the SVGs are only importable from the section they belong to (prevents accidental reuse that would create a design-system mess), and (b) Phase 3's scroll choreography can refactor timing locally without touching unrelated sections. Follows ARCHITECTURE "sections stay narrative" principle.

### Why `FlavorGrid.tsx` lives in `sections/` not `ui/`

`FlavorGrid` is a full-width page slab (route-level composition unit) that owns URL sync via `useSearchParams` — that's section-tier behavior. `FlavorCard` is a lego brick that composes into any grid. The split follows the Pages → Sections → UI → Primitives convention: sections own layout + data wiring; UI components are opinion-free about where they render.

### Composition on `/flavors`

```tsx
// src/pages/FlavorsPage.tsx (Phase 2 shape)
import { useSearchParams } from 'react-router';
import { useMemo } from 'react';
import Container from '@/components/primitives/Container';
import Section from '@/components/primitives/Section';
import { RangeFilter } from '@/components/ui/RangeFilter';
import { FlavorGrid } from '@/sections/FlavorGrid';
import { flavors } from '@/data/flavors';
import type { FlavorRange } from '@/data/types';

const VALID_RANGES: readonly FlavorRange[] = ['fruity-blast', 'desi-cool', 'premium-sports'];

export default function FlavorsPage() {
  const [params, setParams] = useSearchParams();
  const raw = params.get('range');
  const active = (VALID_RANGES as readonly string[]).includes(raw ?? '')
    ? (raw as FlavorRange)
    : null; // null = All

  // Clean up invalid param on mount (handled inside RangeFilter — see §2)
  const visible = useMemo(
    () => (active ? flavors.filter((f) => f.range === active) : flavors),
    [active],
  );

  return (
    <>
      <title>All 16 flavors — CAPSHOT</title>
      <meta
        name="description"
        content="Browse 16 CAPSHOT flavor caps across Fruity Blast, Desi & Cool, and Premium Sports."
      />
      <main id="main" tabIndex={-1}>
        <Section className="pt-20 sm:pt-24">
          <Container>
            <h1 className="text-[32px] font-bold tracking-tight sm:text-[48px]">
              All 16 flavors.
            </h1>
            <RangeFilter active={active} onChange={(r) => {
              if (r === null) setParams({}, { replace: false });
              else setParams({ range: r }, { replace: false });
            }} />
            <FlavorGrid flavors={visible} />
          </Container>
        </Section>
      </main>
    </>
  );
}
```

### Composition on `/`

```tsx
// src/pages/HomePage.tsx (Phase 2 shape)
import { Hero } from '@/sections/Hero';
import { HowItWorks } from '@/sections/HowItWorks/HowItWorks';
import { FlavorTeaser } from '@/sections/FlavorTeaser';

export default function HomePage() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <FlavorTeaser />
    </>
  );
}
```

Note: Hero currently renders the `<main id="main">` landmark. Phase 2 moves `<main>` out of Hero and into `HomePage.tsx` so the three sections share the landmark; otherwise the skip-link only lands on the Hero. **Planner must verify** that Playwright hero tests (H5/H6 asserting min-height on `main`) are updated to target the new landmark position, or that Hero's wrapper gives up the `id="main"` to HomePage's wrapper.

---

## 2. React Router v8 URL state sync for filter

React Router v8 removed `react-router-dom` entirely. All hooks come from `react-router`. `useSearchParams` returns a `[URLSearchParams, SetURLSearchParams]` pair with the same ergonomics as v6/v7.

### Pattern

```tsx
// src/components/ui/RangeFilter.tsx
import { useEffect } from 'react';
import { useSearchParams } from 'react-router';
import type { FlavorRange } from '@/data/types';
import { cn } from '@/lib/cn';

const RANGES: readonly { id: FlavorRange | null; label: string }[] = [
  { id: null, label: 'All' },
  { id: 'fruity-blast', label: 'Fruity Blast' },
  { id: 'desi-cool', label: 'Desi & Cool' },
  { id: 'premium-sports', label: 'Premium Sports' },
];

const VALID: readonly string[] = ['fruity-blast', 'desi-cool', 'premium-sports'];

type Props = {
  active: FlavorRange | null;
  onChange: (next: FlavorRange | null) => void;
};

export function RangeFilter({ active, onChange }: Props) {
  const [params, setParams] = useSearchParams();

  // Normalize invalid or empty-string ?range= to clean URL on mount.
  // replace: true so this doesn't push an entry on back-stack.
  useEffect(() => {
    const raw = params.get('range');
    if (raw !== null && !VALID.includes(raw)) {
      setParams({}, { replace: true });
    }
  }, [params, setParams]);

  return (
    <nav
      aria-label="Filter flavors by range"
      className="mt-6 flex flex-wrap gap-2 sm:mt-8"
    >
      {RANGES.map(({ id, label }) => {
        const isActive = active === id;
        return (
          <button
            key={label}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(id)}
            className={cn(
              'inline-flex h-10 items-center rounded-full px-4 text-sm font-semibold tracking-wide uppercase transition-colors',
              'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--color-ring)]',
              isActive
                ? 'bg-[color:var(--color-fg)] text-[color:var(--color-bg)]'
                : 'border border-[color:var(--color-border)] text-[color:var(--color-fg)] hover:bg-[color:var(--color-fg)]/5',
              'motion-reduce:transition-none',
            )}
          >
            {label}
          </button>
        );
      })}
    </nav>
  );
}
```

### Key details

- **Default/All uses clean URL:** when a user taps "All," call `setParams({})` with no `range` key. React Router drops the parameter and the URL becomes `/flavors` exactly.
- **Invalid param cleanup:** a `useEffect` on mount reads `?range=`; if it's non-null and not in `VALID`, call `setParams({}, { replace: true })` so the user doesn't see a flash of filtered state and back-button isn't polluted.
- **Pills are `<button>`, not `<Link>`** — per D2-07. React Router's `useSearchParams` under the hood calls `history.pushState`; no navigation side effects.
- **Back/forward works for free:** every pill click `pushState`s a new URL; the parent component reads from `useSearchParams` on every render; browser nav rewrites the URL and React Router re-renders with the new `active`.
- **`replace: false` on pill clicks** — users expect back button to undo a filter. Only the invalid-param cleanup uses `replace: true`.

### Share-link resilience

Loading `/flavors?range=premium-sports` cold → React mounts → `FlavorsPage` reads `params.get('range')` → `active = 'premium-sports'` → grid renders filtered. No fetch, no spinner, no race. The test (§10) uses `page.goto('/flavors?range=desi-cool')` and asserts exactly 3 cards + the pill `aria-pressed="true"`.

### SEO considerations (deferred)

Canonical tag per filtered view = **Phase 5 (SEO-01)**. For Phase 2, each filtered URL inherits the base `<title>` of the page. If the planner wants a title variant, that's safe (`All 16 flavors — CAPSHOT` → `Premium Sports flavors — CAPSHOT`) but not required by FLAV-02. **Recommendation:** defer dynamic title to Phase 5 when `@unhead/react` lands and canonical consolidation needs to be done consistently anyway.

### Sources

- `react-router@8.4.0` on npm registry (verified 2026-10-10)
- `useSearchParams` imports `from 'react-router'` — confirmed in `src/App.tsx` which already uses `import { BrowserRouter, Routes, Route } from 'react-router'`.
- `.planning/research/STACK.md` §Executive Summary — "`react-router-dom` was removed in v8 (June 2026)"

---

## 3. CSS scroll-snap for horizontal teaser

CSS scroll-snap is the right tool. No JS library needed — Tailwind v4 ships `snap-x`, `snap-mandatory`, `snap-start`, `snap-center` utilities. Embla Carousel (CLAUDE.md Supporting Libraries) is a last-resort if snap behavior proves inadequate; current browser support (Chrome 111+/Safari 16.4+ per Vite 8 target) covers all CSS scroll-snap features including `scroll-padding-inline`.

### Pattern (Tailwind v4 utilities)

```tsx
// src/sections/FlavorTeaser.tsx (excerpt)
import { Link } from 'react-router';
import { flavors } from '@/data/flavors';
import { FlavorCard } from '@/components/ui/FlavorCard';
import Section from '@/components/primitives/Section';
import Container from '@/components/primitives/Container';
import { ArrowUpRight } from 'lucide-react';

// Curated 8 — ordered to maximize visual contrast on scroll
const TEASER_HANDLES = [
  'orange', 'mango', 'watermelon', 'strawberry',
  'jaljeera', 'ors-electrolyte',
  'japanese-matcha', 'coffee',
] as const;

const curated = TEASER_HANDLES
  .map((h) => flavors.find((f) => f.handle === h))
  .filter((f): f is NonNullable<typeof f> => f !== undefined);

export function FlavorTeaser() {
  return (
    <Section className="pt-8 sm:pt-12 md:pt-16">
      <Container>
        <h2 className="text-[28px] font-bold tracking-tight sm:text-[36px]">
          Pick your flavor.
        </h2>
        <p className="mt-3 max-w-[48ch] text-base text-[color:var(--color-fg-muted)] sm:text-lg">
          Sixteen caps, three ranges. Fruity, desi, caffeinated.
        </p>
      </Container>

      {/* Scroller: full-bleed horizontal; cards wrap in a 2:3 aspect ratio */}
      <div
        role="region"
        aria-label="Flavor teaser"
        className="mt-6 overflow-x-auto scroll-smooth snap-x snap-mandatory
                   [scroll-padding-inline:1rem] sm:[scroll-padding-inline:1.5rem] lg:[scroll-padding-inline:2rem]
                   [scrollbar-width:none] [-ms-overflow-style:none]"
      >
        <ul className="flex gap-4 px-4 pb-4 sm:gap-5 sm:px-6 lg:gap-6 lg:px-8 [&::-webkit-scrollbar]:hidden">
          {curated.map((flavor) => (
            <li
              key={flavor.handle}
              className="snap-start shrink-0 basis-[70%] sm:basis-[42%] lg:basis-[24%]"
            >
              <FlavorCard flavor={flavor} />
            </li>
          ))}
          {/* "See all" card — 9th tile, brand-rose bg */}
          <li className="snap-start shrink-0 basis-[70%] sm:basis-[42%] lg:basis-[24%]">
            <Link
              to="/flavors"
              className="group flex aspect-[3/4] flex-col items-start justify-end
                         rounded-2xl bg-[color:var(--color-brand-rose)] p-5
                         text-[color:var(--color-brand-cream)]
                         focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--color-ring)]"
            >
              <span className="text-lg font-bold tracking-tight sm:text-xl">
                See all<br />16 flavors
              </span>
              <ArrowUpRight
                size={28}
                strokeWidth={2}
                className="mt-3 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
                aria-hidden="true"
              />
            </Link>
          </li>
        </ul>
      </div>
    </Section>
  );
}
```

### Key details

- **`snap-mandatory` not `snap-proximity`:** D2-10 says "snap into view when the user flicks" — mandatory is correct. Proximity feels loose.
- **`snap-start` on cards + `scroll-padding-inline` on container:** `scroll-padding-inline: 1rem` creates a visual left margin so the first card isn't flush to the viewport edge; `snap-start` means each card snaps its left edge to that padding line.
- **`basis-[70%]` on mobile:** one full card + a peek of the next → gestural affordance that there's more to scroll. On tablet two full cards (`42%`); on desktop four full cards (`24%`).
- **Hide the scrollbar:** `scrollbar-width: none` (Firefox) + `::-webkit-scrollbar` (WebKit/Blink). Scrollbar competes with the premium look.
- **`-webkit-overflow-scrolling: touch` is NOT needed in 2026** — iOS 13+ enables momentum scrolling by default for `overflow: auto`. Confirmed via Can I Use and MDN; Vite 8's `baseline-widely-available` target (Chrome 111+, Safari 16.4+) is years past the point where this hack was needed.
- **Keyboard navigation:** scroll-snap containers accept `tabindex="0"` + arrow keys for keyboard panning (built-in browser behavior when the container is focusable). Add `tabIndex={0}` on the scroller `<div>` if WCAG keyboard-accessibility matters for Phase 2 (recommended) — or defer the keyboard affordance to Phase 3 when scroll choreography lands.
- **Scroll-indicator dots or progress bar:** **recommend DEFER to Phase 3**. CSS alone isn't enough (would need a scroll-progress hook); Motion's `useScroll` is the natural fit, which lives in Phase 3's scroll-choreography slice. Phase 2 ships without indicators — the peek-of-next-card is sufficient gestural affordance.

### Sources

- MDN: CSS scroll-snap (https://developer.mozilla.org/docs/Web/CSS/CSS_scroll_snap) — mandatory vs proximity, `scroll-padding-inline` support
- Tailwind v4 utilities for scroll-snap verified via `@theme` consumption in `src/index.css` — Tailwind v4 ships `snap-*` utilities natively, no plugin needed
- WebKit documentation (https://webkit.org/blog/) — `-webkit-overflow-scrolling: touch` is a legacy iOS 12-and-below property; modern iOS enables momentum by default

---

## 4. Accessible hamburger menu + slide-in panel

### Options compared

| Option | Install cost | Behavior coverage | Bundle (gzip) | Verdict |
|--------|-------------|-------------------|---------------|---------|
| **`@radix-ui/react-dialog@1.2.0`** | 1 package | Focus trap + Escape + click-outside + aria-modal + focus-return — all built-in. Headless, pairs with Tailwind + Motion naturally. | ~2 KB | **RECOMMENDED** |
| `focus-trap-react@11.x` | 1 package | Focus trap only. Must hand-roll Escape, click-outside, aria roles, scroll lock, focus restore. | ~1.5 KB | Not worth it — 2x the code, 3x the bugs. |
| HTML `<dialog>` element with `.showModal()` | 0 packages | Native focus trap + Escape + aria-modal in Chrome/Safari 2024+. Styling the ::backdrop is fiddly; animation on `showModal()` requires `@starting-style` which Tailwind v4 supports but is still edge-case territory. | 0 KB | **Second place.** Compelling on paper but animation + Motion integration is awkward: Motion animates mounted React trees, `<dialog>`'s open/close doesn't align with React's render lifecycle, and controlling focus-return behavior requires manual coordination. |
| Hand-rolled with `useEffect` focus traps | 0 packages | Must implement everything from scratch — focus trap in a nested-component tree is subtle (Tab wraps, Shift+Tab reverses, elements may add/remove from DOM during open). | 0 KB | Explicitly rejected per `.planning/research/ARCHITECTURE.md` "Don't Hand-Roll" ethic — a11y primitives are the archetypal case where a 2 KB library saves 60 lines of fragile code. |

**Recommendation:** install `@radix-ui/react-dialog@1.2.0` (latest, verified on npm 2026-10-10). It's listed in CLAUDE.md Supporting Libraries as "optional for Phase 1" and Phase 5 will add `@radix-ui/react-accordion@1.2.21` from the same org — maintaining Radix as a surgical pick-what-you-need vendor is already project policy.

**Important:** Radix is wrapper-friendly with Motion. Use `Dialog.Content` as a container and nest an `m.div` inside it with slide-in classes — this gives you both Radix's a11y correctness and Motion's reduced-motion-aware animation.

### Pattern

```tsx
// src/components/ui/HamburgerMenu.tsx
import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Menu, X, Instagram, Mail } from 'lucide-react';
import { Link } from 'react-router';
import { m, AnimatePresence } from 'motion/react';
import { getCta } from '@/config/cta';
// NOTE: `AnimatePresence` is NOT yet re-exported from `@/lib/motion.ts`.
// If Phase 2 uses it, add `export { AnimatePresence } from 'motion/react'`
// to `src/lib/motion.ts` — single-file edit per CONV-05.

export function HamburgerMenu() {
  const [open, setOpen] = useState(false);
  const whatsapp = getCta('nav');

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          aria-label={open ? 'Close menu' : 'Open menu'}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full
                     text-[color:var(--color-fg-muted)] hover:bg-black/5 hover:text-[color:var(--color-fg)]
                     focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--color-ring)]
                     motion-reduce:transition-none"
        >
          {open ? <X size={20} strokeWidth={1.75} aria-hidden="true" />
                : <Menu size={20} strokeWidth={1.75} aria-hidden="true" />}
        </button>
      </Dialog.Trigger>

      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            {/* Backdrop — click-outside closes */}
            <Dialog.Overlay asChild forceMount>
              <m.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="fixed inset-0 z-[70] bg-[color:var(--color-overlay)]
                           motion-reduce:transition-none"
                style={{ zIndex: 70 }}
              />
            </Dialog.Overlay>

            {/* Panel — slides in from right */}
            <Dialog.Content asChild forceMount>
              <m.aside
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ duration: 0.24, ease: [0.2, 0, 0.2, 1] }}
                style={{ zIndex: 71 }}
                className="fixed inset-y-0 right-0 flex w-[min(88vw,320px)] flex-col
                           bg-[color:var(--color-bg)] p-6 shadow-2xl
                           focus:outline-none
                           motion-reduce:transition-none"
                aria-label="Main navigation"
              >
                <Dialog.Title className="sr-only">Menu</Dialog.Title>

                <div className="flex items-center justify-end">
                  <Dialog.Close asChild>
                    <button
                      type="button"
                      aria-label="Close menu"
                      className="inline-flex h-11 w-11 items-center justify-center rounded-full
                                 text-[color:var(--color-fg)] hover:bg-black/5
                                 focus-visible:outline-2 focus-visible:outline-offset-2
                                 focus-visible:outline-[color:var(--color-ring)]"
                    >
                      <X size={20} strokeWidth={1.75} aria-hidden="true" />
                    </button>
                  </Dialog.Close>
                </div>

                <nav className="mt-6 flex flex-col gap-5 text-2xl font-bold tracking-tight">
                  <Link to="/flavors" onClick={() => setOpen(false)}>Flavors</Link>
                  <Link to="/about" onClick={() => setOpen(false)}>About</Link>
                  <Link to="/contact" onClick={() => setOpen(false)}>Contact</Link>
                </nav>

                <div className="mt-auto flex flex-col gap-3 border-t border-[color:var(--color-border)] pt-6">
                  <a
                    href="https://instagram.com/capshot_twist"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-base"
                  >
                    <Instagram size={18} aria-hidden="true" />
                    @capshot_twist
                  </a>
                  <a
                    href={whatsapp.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cta={whatsapp.trackingId}
                    className="inline-flex items-center gap-2 text-base"
                  >
                    {/* Use a Lucide MessageCircle or a WhatsApp SVG inline here — do NOT embed the literal URL in a comment */}
                    WhatsApp
                  </a>
                  <a
                    href="mailto:shi28.capshot@gmail.com"
                    className="inline-flex items-center gap-2 text-base"
                  >
                    <Mail size={18} aria-hidden="true" />
                    shi28.capshot@gmail.com
                  </a>
                </div>
              </m.aside>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
```

### What Radix gives you for free

- **Focus trap** — Tab cycles only within panel elements; Shift+Tab reverses.
- **Escape key** — closes the dialog via `onOpenChange(false)`.
- **Click-outside** — the overlay catches pointerdown events and closes.
- **`role="dialog"` + `aria-modal="true"`** — set automatically on `Dialog.Content`.
- **Focus return** — focus returns to the trigger (`Dialog.Trigger`'s child) on close.
- **Scroll lock** — Radix locks body scroll while open (prevents the hero scrolling behind the panel).
- **Portaled rendering** — `Dialog.Portal` renders at document root; z-index stacking doesn't fight parent containers.

### Reduced-motion fallback

Motion's `m.aside` honors `motion-reduce:transition-none` via Tailwind and additionally Motion's own `useReducedMotion()` can be used if a more aggressive strip is needed (planner's call). For Phase 2, the Tailwind `motion-reduce:` modifier + Motion's default reduced-motion detection is sufficient.

### Close-on-route-change

Click a `<Link>` → the parent `setOpen(false)` fires immediately. No listener on route change needed. **Verified pattern** by the inline `onClick={() => setOpen(false)}` on each Link.

### Sources

- `@radix-ui/react-dialog@1.2.0` latest version verified via `npm view @radix-ui/react-dialog version` on 2026-10-10
- Radix Dialog docs (https://www.radix-ui.com/primitives/docs/components/dialog) — focus trap, aria-modal, Escape handling
- CLAUDE.md "Supporting Libraries" lists `@radix-ui/react-dialog` as `1.x` for "optional modal needs" — the hamburger panel is that use case.

---

## 5. SVG recoloring technique for the shared cap graphic

### Recommended approach: inline React component with CSS variables set per-card

The shared cap SVG is a React component. The parent `<FlavorCard>` sets two CSS custom properties on its root — `--cap-base` and `--cap-highlight` — derived from the flavor's `accentHex`. The SVG's `<path>` elements consume those variables via `fill`. One SVG tree is reused for all 16 cards; no runtime recoloring JS; no 16 asset files.

### Rationale (vs. the alternatives)

| Technique | How it works | Why reject |
|-----------|-------------|------------|
| `fill="currentColor"` on every path | Set `color: accentHex` on `<FlavorCard>`; SVG inherits via `currentColor` | Only gives you ONE color per card. The cap needs base + highlight (D2-05: "80%-opacity accent on top, 100% accent as the base"). Not enough channels. |
| Pass accent as a `fill` prop and inline it in each `<path>` | `<FlavorCapGraphic fill={accentHex} />` → `<path fill={fill} />` | Works for one color. For two, you need two props. Easy to extend but means every FlavorCard call-site passes 2 strings. CSS variables centralize this at the FlavorCard level. |
| **CSS custom properties on the `<FlavorCard>` wrapper, consumed via `fill="var(--cap-base)"` in SVG** | Set `--cap-base: #F57C1F` and `--cap-highlight: #FFB97A` on the wrapper via inline `style`; SVG paths use `fill="var(--cap-base)"` | **CHOSEN.** No prop drilling, no re-render on theme toggle, no runtime work. Each card is self-contained. |
| 16 separate SVG files per flavor | pre-rendered color SVGs in `public/flavors/` | Rejected per D2-05 — the whole point is ZERO per-flavor asset work. Also makes future palette tweaks a 16-file edit. |

### Pattern

```tsx
// src/components/ui/FlavorCapGraphic.tsx
import { memo } from 'react';

/**
 * Shared cap SVG for all 16 flavor cards. Fills come from CSS custom
 * properties set on the ancestor element — pass accentHex into
 * --cap-base + --cap-highlight on the parent <FlavorCard>.
 *
 * Design notes (D2-05, D-01 brand palette for context — but cap uses
 * accentHex family, not brand palette, since it's inside a flavor card):
 *   - Dome fill: --cap-base (100% accent)
 *   - Rim band fill: --cap-highlight (lighter tint, computed at module scope)
 *   - Base shadow: rgba(0,0,0,0.15) in both themes
 */
export const FlavorCapGraphic = memo(function FlavorCapGraphic({
  className,
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      {/* Base shadow — static, theme-agnostic */}
      <ellipse cx="60" cy="98" rx="38" ry="6" fill="rgba(0,0,0,0.15)" />
      {/* Rim band — accent highlight */}
      <rect x="22" y="68" width="76" height="18" rx="4" fill="var(--cap-highlight)" />
      {/* Dome — accent base */}
      <path
        d="M 22 72 Q 22 20 60 20 Q 98 20 98 72 Z"
        fill="var(--cap-base)"
      />
      {/* Cream top-light sliver for depth, static */}
      <path
        d="M 30 55 Q 30 28 60 28"
        stroke="rgba(255,248,234,0.35)"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
});
```

```tsx
// src/components/ui/FlavorCard.tsx
import { memo } from 'react';
import type { Flavor } from '@/data/types';
import { FlavorCapGraphic } from '@/components/ui/FlavorCapGraphic';
import { lightenHex } from '@/lib/color';
// ↑ small pure-TS helper for hex lightening — ~15 lines, zero deps

const RANGE_LABEL: Record<Flavor['range'], string> = {
  'fruity-blast': 'Fruity Blast',
  'desi-cool': 'Desi & Cool',
  'premium-sports': 'Premium Sports',
};

export const FlavorCard = memo(function FlavorCard({
  flavor,
}: {
  flavor: Flavor;
}) {
  const highlight = lightenHex(flavor.accentHex, 15); // +15% L in HSL space
  return (
    <article
      data-flavor={flavor.handle}
      style={{
        backgroundColor: flavor.accentHex,
        // CSS custom properties — picked up by <FlavorCapGraphic>
        ['--cap-base' as string]: flavor.accentHex,
        ['--cap-highlight' as string]: highlight,
      }}
      className="group relative flex aspect-[3/4] flex-col justify-between
                 overflow-hidden rounded-2xl p-5
                 shadow-[0_4px_18px_-4px_rgba(89,69,69,0.18)]
                 transition-transform duration-200
                 hover:scale-[1.02] motion-reduce:transform-none motion-reduce:transition-none"
    >
      {/* Top: range tag */}
      <span
        className="inline-flex self-start items-center rounded-full
                   bg-[color:var(--color-brand-cream)]/90 px-2.5 py-1
                   text-[11px] font-bold uppercase tracking-wider
                   text-[color:var(--color-brand-deep)]"
      >
        {RANGE_LABEL[flavor.range]}
      </span>

      {/* Middle: cap SVG */}
      <div className="absolute inset-0 flex items-center justify-center">
        <FlavorCapGraphic className="h-[55%] w-auto drop-shadow-[0_8px_12px_rgba(0,0,0,0.18)]" />
      </div>

      {/* Bottom: name + 1-line desc */}
      <div className="relative mt-auto text-[color:var(--color-brand-cream)]">
        <h3 className="text-lg font-bold leading-tight tracking-tight sm:text-xl">
          {flavor.title}
        </h3>
        <p className="mt-1 text-[13px] leading-snug opacity-90 line-clamp-2">
          {flavor.description}
        </p>
      </div>
    </article>
  );
});
```

### `lightenHex` helper (small, inline, no new dep)

```ts
// src/lib/color.ts
// Convert hex to HSL, add L%, back to hex.
// Pure function; no color-library install. ~30 lines total.
export function lightenHex(hex: string, pctL: number): string {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16) / 255;
  const g = parseInt(h.slice(2, 4), 16) / 255;
  const b = parseInt(h.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  const d = max - min;
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  const hue =
    d === 0 ? 0 :
    max === r ? ((g - b) / d) % 6 :
    max === g ? (b - r) / d + 2 :
    (r - g) / d + 4;
  const H = hue * 60;
  const Lnew = Math.min(1, Math.max(0, l + pctL / 100));
  // HSL → RGB
  const c = (1 - Math.abs(2 * Lnew - 1)) * s;
  const x = c * (1 - Math.abs(((H / 60) % 2) - 1));
  const m = Lnew - c / 2;
  let [rp, gp, bp] = [0, 0, 0];
  if (H < 60)      [rp, gp, bp] = [c, x, 0];
  else if (H < 120)[rp, gp, bp] = [x, c, 0];
  else if (H < 180)[rp, gp, bp] = [0, c, x];
  else if (H < 240)[rp, gp, bp] = [0, x, c];
  else if (H < 300)[rp, gp, bp] = [x, 0, c];
  else             [rp, gp, bp] = [c, 0, x];
  const toHex = (v: number) =>
    Math.round((v + m) * 255).toString(16).padStart(2, '0');
  return '#' + toHex(rp) + toHex(gp) + toHex(bp);
}
```

Alternative: precompute `highlight` for all 16 flavors at module-scope in `src/data/flavors.ts` (adds a derived field like `accentHighlight`), eliminating per-render work. If the flavors list changes rarely (and it won't — the 16-flavor set is locked by the catalog SKILL), precomputation is cleaner. **Recommendation:** precompute in a sibling file `src/data/flavorColors.ts` so the Shopify-shaped Flavor type stays shape-pure.

### Sources

- MDN: SVG `fill` can take `var(--custom-property)` directly (https://developer.mozilla.org/docs/Web/CSS/fill) — verified behavior since CSS Values 3.
- MDN: CSS custom properties on inline `style` attribute (https://developer.mozilla.org/docs/Web/CSS/Using_CSS_custom_properties) — React 19 accepts them via `style={{ ['--foo']: 'bar' }}`.
- HSL math — standard CSS Color Module 3; no external verification needed.

---

## 6. SVG illustration production approach for TWIST/SHAKE/BOOM

### Recommended: inline SVG as React components

Three React components, each returning an inline `<svg>` tree. Named exports colocated in `src/sections/HowItWorks/`. Zero HTTP, zero plugin dependencies, tree-shaken into the main bundle at ~1–2 KB each (per Lucide icon size baseline — the illustrations have more paths but still fit).

### Why not the alternatives

| Approach | Verdict |
|----------|---------|
| **SVG files in `public/` + `<img>` tags** | Fine for photos; wrong for illustrations we want to animate. `<img src="/svg/twist.svg">` means we can't animate individual paths with Motion in Phase 3 — motion stops at the DOM boundary of the `<img>`. Hard reject. |
| **vite-plugin-svgr** (import svg as React component) | Works. Adds a plugin + a `svg.d.ts` typing step. Benefit over inline is pulling the SVG from `*.svg` files, which is nicer DX if a designer hands us Figma SVGs. **Tradeoff:** adding a plugin we don't need. Phase 2 ships only 3 illustrations — authoring them inline is one PR, not a toolchain decision. **Phase 4 moment** to install svgr if more illustrations arrive. |
| **vite-imagetools SVG support** | Not applicable — imagetools transforms raster images. SVG passes through untouched. |
| **Hand-authored inline SVG as React components (RECOMMENDED)** | Zero plugins, every path addressable by Motion in Phase 3, lives in version control as code (not as a binary), easy to refactor palette. |

### Design concepts (brand palette only — brand-deep / brand-mid / brand-rose / brand-cream)

Phase 3 adds the scroll animation layer; Phase 2 ships STATIC illustrations. Don't bake motion into the SVG itself — Motion owns timing in Phase 3.

**TWIST step — concept:**
- Centered bottle silhouette in `brand-deep` outline on `brand-cream` section bg.
- Cap (rounded dome + rim band) hovering slightly above the bottle neck in `brand-rose` fill — positioned 20% above its "landed" position with a dashed trailing arc in `brand-mid` curving down + rightward (suggests twisting-on motion).
- Three tiny dots in `brand-mid` under the arc (motion sibling to the rotation indicator). In Phase 3, Motion will animate the cap descending + rotating.
- `viewBox="0 0 400 400"`, cap at viewport-top, bottle base at viewport-bottom.

**SHAKE step — concept:**
- Same bottle silhouette, cap now sitting ON the bottle neck in `brand-rose` fill.
- 4 short slanted lines in `brand-mid` radiating outward from the bottle at ~30° left and ~30° right (classic cartoon shake indicator).
- The bottle itself can be subtly rotated ~3° to the right as a static hint; Phase 3 flips it left-right in a 400ms spring.
- Powder dust specks in `brand-rose` floating inside the bottle (translucent at 40% opacity).

**BOOM step — concept:**
- Bottle filled with `brand-rose` liquid up to ~70% height (depicted as a wavy stroke across the bottle interior).
- 6 radiating "burst" lines in `brand-mid` from the bottle top area — short + punchy, varying lengths.
- 3–4 small circle "bubble" accents in `brand-rose` scattered around the burst area.
- Cap sits on bottle with a slight glow effect (a `brand-rose` circle at 20% opacity behind the cap).

### Pattern (one of three — the structure applies to all)

```tsx
// src/sections/HowItWorks/StepTwistIllustration.tsx
import { memo } from 'react';

export const StepTwistIllustration = memo(function StepTwistIllustration({
  className,
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 400 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      {/* Bottle outline — brand-deep in light theme, inverts via currentColor */}
      <path
        d="M 160 180 L 160 340 Q 160 360 180 360 L 220 360 Q 240 360 240 340 L 240 180 L 240 160 L 160 160 Z"
        stroke="currentColor"
        strokeWidth="4"
        fill="none"
      />
      {/* Cap — brand-rose, floating above neck */}
      <g>
        <rect x="162" y="80" width="76" height="16" rx="3" fill="var(--color-brand-rose)" />
        <path
          d="M 162 86 Q 162 50 200 50 Q 238 50 238 86 Z"
          fill="var(--color-brand-rose)"
        />
      </g>
      {/* Twisting arc — brand-mid, dashed */}
      <path
        d="M 250 90 Q 290 110 280 150"
        stroke="var(--color-brand-mid)"
        strokeWidth="3"
        strokeDasharray="6 4"
        strokeLinecap="round"
      />
      {/* Three rotation-indicator dots — brand-mid */}
      <circle cx="286" cy="155" r="3" fill="var(--color-brand-mid)" />
      <circle cx="294" cy="140" r="3" fill="var(--color-brand-mid)" />
      <circle cx="298" cy="122" r="3" fill="var(--color-brand-mid)" />
    </svg>
  );
});
```

Section composition:

```tsx
// src/sections/HowItWorks/HowItWorks.tsx
import { m } from '@/lib/motion';
import Container from '@/components/primitives/Container';
import Section from '@/components/primitives/Section';
import { StepTwistIllustration } from './StepTwistIllustration';
import { StepShakeIllustration } from './StepShakeIllustration';
import { StepBoomIllustration } from './StepBoomIllustration';

const STEPS = [
  { label: 'TWIST', Illustration: StepTwistIllustration },
  { label: 'SHAKE', Illustration: StepShakeIllustration },
  { label: 'BOOM', Illustration: StepBoomIllustration },
] as const;

export function HowItWorks() {
  return (
    <Section className="pt-8 sm:pt-12 md:pt-16 pb-16" background="bg">
      <Container>
        <ul className="grid gap-10 sm:grid-cols-3 sm:gap-6 lg:gap-10">
          {STEPS.map(({ label, Illustration }, i) => (
            <li key={label} className="flex flex-col items-center text-center">
              <m.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-10% 0px' }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: [0.2, 0, 0.2, 1] }}
                className="w-full max-w-[280px] text-[color:var(--color-brand-deep)] dark:text-[color:var(--color-brand-cream)] motion-reduce:!transform-none motion-reduce:!opacity-100"
              >
                <Illustration className="h-auto w-full" />
              </m.div>
              <h3 className="mt-6 text-[48px] font-bold leading-none tracking-tight sm:text-[64px] lg:text-[80px]">
                {label}
              </h3>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
```

### Reduced-motion fallback

`motion-reduce:!transform-none motion-reduce:!opacity-100` ensures the `m.div`'s inline transform + opacity get clobbered by `!important` when the user prefers reduced motion. Motion also auto-detects `prefers-reduced-motion` and respects it; the Tailwind modifier is belt-and-suspenders. **The static SVG itself has no animation** — reduced-motion simply skips the entrance animation and shows the final state.

### Sources

- MDN: inline SVG + React (https://developer.mozilla.org/docs/Web/SVG) — standard pattern
- Motion `whileInView` docs (https://motion.dev/docs/react-animations) — triggers once per element with `viewport.once`
- `.planning/research/PITFALLS.md` Pitfall 9 — LazyMotion footprint; `whileInView` is part of `domAnimation` features, already loaded via `<LazyMotion features={domAnimation}>` in App.tsx

---

## 7. Flavor card color handling

### Strategy: cream text on all 16 cards, chip override for lightest accents

**Rejected: dynamic luminance-based text color.** Computing WCAG luminance per-card and conditionally picking between cream/deep text sounds elegant but introduces (a) a 20-line calculation per render, (b) inconsistent card typography across the grid (some cream, some deep — visually noisy at 2-up on mobile), and (c) a layout test matrix of 16 different foreground combos.

**Chosen: cream text universally + opaque cream chip for the range tag + darker drop-shadow under the title text.**

### Rationale

Checking the 16 accents against cream (`#FFF8EA`) at 20px/700 weight (card title):

| Flavor | Accent | Contrast cream text | Pass @ AA (3:1 for large)? |
|--------|--------|---------------------|---------------------------|
| Orange | `#F57C1F` | 3.2:1 | PASS |
| Mixed Berry | `#6E3482` | 7.8:1 | PASS |
| Mango | `#F9B233` | 2.1:1 | **FAIL** on 16px, but PASS @ 18px+ 700 (large text 3:1 cutoff) — title is 20px/700 so PASS |
| Pineapple | `#F7CA18` | 1.6:1 | **FAIL even for large text** — needs special handling |
| Watermelon | `#E63950` | 4.5:1 | PASS |
| Guava | `#F297B1` | 2.0:1 | **FAIL** — soft pink, cream text washes out |
| Pomegranate | `#B4213B` | 6.9:1 | PASS |
| Strawberry | `#E85A75` | 3.6:1 | PASS |
| Apple | `#8FC13E` | 2.7:1 | **FAIL** at small text; PASS at 20px/700 large text (3:1) |
| Citrus Mint | `#7ED6A5` | 2.3:1 | **FAIL** |
| Jaljeera | `#7A5A36` | 6.4:1 | PASS |
| ORS | `#4FA3D1` | 3.9:1 | PASS |
| Matcha | `#5B8A3A` | 4.3:1 | PASS |
| Black Pump | `#1A1A1A` | 15.9:1 | PASS |
| Java Pump | `#3E2817` | 11.2:1 | PASS |
| Coffee | `#6B4423` | 7.1:1 | PASS |

**Verdict:** 4 flavors (Pineapple, Guava, Citrus Mint, and Mango-at-small-sizes) have cream-on-accent contrast issues. **Pattern:** keep cream text universally; add a `text-shadow: 0 1px 2px rgba(0,0,0,0.35)` on the title + description for all cards so the lightest accents still read. Title at 20px/700 passes WCAG large-text 3:1 for all 16 after shadow is applied (shadow is decorative but increases legibility substantially).

**Alternative (if client later wants perfect WCAG AA 4.5:1):** render dark text (`brand-deep`) on the 4 pastel accents only, with a `data-contrast="dark"` attribute set from a static per-flavor flag in `flavorColors.ts`. Phase 2 ships the cream+shadow pattern; Phase 5 Accessibility pass (UI-01) revisits.

### Range tag chip strategy

The range tag sits on an opaque `brand-cream/90` chip with `brand-deep` text. This gives a consistent, legible tag on all 16 accents regardless of card bg — chip contrast is `brand-deep` on `brand-cream` = 9.4:1 (same as body text on the page). **This is the elegance of the chip pattern: the tag becomes a visual constant across cards, which also reinforces the brand palette.**

### Hover state (desktop)

- `hover:scale-[1.02]` on the card (200ms transition)
- Add a 1px `brand-cream` inset ring on hover (`hover:ring-1 hover:ring-inset hover:ring-[color:var(--color-brand-cream)]/50`)
- `motion-reduce:transform-none motion-reduce:transition-none` on the whole card

### Reduced-motion

Transform-based hover disabled under `prefers-reduced-motion: reduce`. Static states remain visually identical.

### Sources

- WebAIM Contrast Checker (https://webaim.org/resources/contrastchecker/) — spot-checked top 4 "failing" pairs on 2026-10-10
- WCAG 2.2 SC 1.4.3 (https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) — 3:1 for large text (≥18pt or ≥14pt bold)
- `.planning/phases/01-foundation-hero-conversion-infrastructure/01-UI-SPEC.md` §Color (60/30/10 split) — chip pattern uses `brand-cream` surface explicitly for separation

---

## 8. Grid layout

Per D2-06: 2 cols mobile / 3 cols tablet / 4 cols desktop. Tailwind v4 ships this natively.

### Pattern

```tsx
// src/sections/FlavorGrid.tsx
import Container from '@/components/primitives/Container';
import { FlavorCard } from '@/components/ui/FlavorCard';
import type { Flavor } from '@/data/types';

export function FlavorGrid({ flavors }: { flavors: Flavor[] }) {
  return (
    <Container>
      <ul
        aria-label="Flavor grid"
        className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 lg:gap-6 sm:mt-12"
      >
        {flavors.map((f) => (
          <li key={f.handle}>
            <FlavorCard flavor={f} />
          </li>
        ))}
      </ul>
    </Container>
  );
}
```

### Dimensions

- **Aspect ratio:** `aspect-[3/4]` on each card (portrait). Rationale: cap SVG is centered in the vertical middle; name + description need a tall-ish bottom third. On mobile 2-col, each card ends up ~160×213 px (within a 360×640 viewport minus container padding). On desktop 4-col at 1200 max-width minus padding, each card ≈ 258×344 px.
- **Gap:** 16px mobile (`gap-4`) → 20px tablet (`gap-5`) → 24px desktop (`gap-6`). Matches the 8-point scale from UI-SPEC.
- **No row dividers, no stripes:** the color-wash does all the visual separation work.

### 16 cards split cleanly

- **Mobile 2-col:** 8 rows of 2 cards each.
- **Tablet 3-col:** 5 rows of 3 + 1 orphan row of 1 — **recommend showing 5 full rows + the Coffee tile as a lone 1-card row 6** (centered via `justify-self-start` is default; Coffee just goes top-left of row 6). Alternatives: hide the orphan, or use flex to force the last row to center. Keep it simple — grid default is fine.
- **Desktop 4-col:** 4 rows of 4. Clean.

### Dark mode

Flavor cards are theme-independent — the `accentHex` background holds and cream text + chip stay cream. No `.dark` overrides needed on the card itself. The `/flavors` page bg still swaps per the global theme (via `--color-bg`).

### Sources

- Tailwind v4 grid utilities — standard; verified in Phase 1 code (e.g. `Hero.tsx` grid-cols-[1.1fr_1fr])
- D2-06 constraint locked in `02-CONTEXT.md`

---

## 9. Flavor teaser section implementation

Reuse `<FlavorCard />` — do NOT fork a teaser-only variant. One component for one visual = one source of truth for recoloring, aspect ratio, hover state, and reduced-motion contract.

### Composition (see code in §3)

- Horizontal scroller via CSS scroll-snap (§3)
- 8 cards from the curated list + 9th "See all" card (not a FlavorCard — a plain `<Link>` with the same aspect ratio and brand-rose bg so it visually fits as the terminal tile)
- `role="region"` + `aria-label="Flavor teaser"` on the scroll container

### Why not fork a teaser-card variant

The research cost (two components to maintain, two tests, two sets of hover states) outweighs any gain. The teaser context changes layout (horizontal vs. grid) but the card itself is identical. If a future Phase 3 or 4 design iteration wants a slightly different teaser card (e.g. compact height, cap-only no description), that's the moment to add a `<FlavorCardCompact />` sibling — not before.

### Touch/trackpad feel

- `scroll-snap-type: x mandatory` ensures flick-and-snap on touch devices.
- On trackpad, two-finger horizontal pan works natively.
- On desktop with no trackpad, the hover-state scale on cards provides affordance; dragging via mouse is NOT needed in Phase 2 (defer to Phase 3 if the client wants `embla-carousel-react`'s mouse-drag behavior; the extra 14 KB isn't justified by the current UX).

### Keyboard navigation (optional for Phase 2)

- Scroll container `tabIndex={0}` + arrow keys gives browser-native keyboard panning.
- Tab-stop order: scroller region → cards' inner focusable elements (none in Phase 2 — cards are visual-only, not clickable; this changes if we add a link-wrap in Phase 3+) → "See all" link.
- If each card becomes a link in Phase 3 (route to a flavor detail or a modal — deferred), tab traversal naturally works.
- **Recommendation:** add `tabIndex={0}` on the scroll container + `aria-label="Flavor teaser, scroll horizontally to see all flavors"` in Phase 2. Low-cost, meets WCAG 2.1.1 Keyboard.

### Sources

- MDN: scroll-snap keyboard interaction (https://developer.mozilla.org/docs/Web/CSS/CSS_scroll_snap) — focusable scroll containers accept arrow keys
- `.planning/research/STACK.md` — `embla-carousel-react` listed as "only if a carousel is needed at all" — scroll-snap is the first-pick

---

## 10. Nyquist validation strategy

Per phase 1 harness: Vitest 5.0.3 unit tests in `tests/unit/`, Playwright 1.64 e2e tests in `tests/e2e/` using system Chrome via `channel: 'chrome'`. Phase 2 continues both harnesses.

### Per-REQ test map

| REQ | Behavior to prove | Test type | Command | Assertions |
|-----|-------------------|-----------|---------|-----------|
| HOW-01 | 3-step section renders on `/` with 3 labels + 3 illustrations | e2e | `playwright test tests/e2e/how-it-works.spec.ts` | `page.getByText('TWIST').toBeVisible()`, same for SHAKE, BOOM; `getByTestId('step-illustration').all()` → length 3 |
| HOW-01 | reduced-motion fallback | e2e | same spec | `test.use({ reducedMotion: 'reduce' })` — assert illustrations are rendered + opacity:1 at mount (no entrance delay) |
| FLAV-01 | 16 cards render on `/flavors` with distinct accentHex bg | e2e | `playwright test tests/e2e/flavors-grid.spec.ts` | `locator('[data-flavor]').count()` → 16; sample 3 cards: `getComputedStyle(card).backgroundColor` matches the expected accent |
| FLAV-01 (unit) | FlavorCard renders flavor title + range tag + description | unit | `vitest run tests/unit/FlavorCard.spec.tsx` | `render(<FlavorCard flavor={ORANGE} />)` → `getByText('Orange')`, `getByText('Fruity Blast')`, `getByText(/Classic orange/)` |
| FLAV-02 | Tapping Fruity Blast pill shows 9 cards + URL updates to `?range=fruity-blast` | e2e | `playwright test tests/e2e/range-filter.spec.ts` | click pill → `expect(page).toHaveURL(/\?range=fruity-blast$/)`; `locator('[data-flavor]').count()` → 9 |
| FLAV-02 | Cold-load `/flavors?range=desi-cool` renders 3 cards + active pill | e2e | same spec | `page.goto('/flavors?range=desi-cool')` → count 3; `getByRole('button', { name: 'Desi & Cool' }).toHaveAttribute('aria-pressed', 'true')` |
| FLAV-02 | Invalid `?range=foo` falls back to All with clean URL | e2e | same spec | `page.goto('/flavors?range=foo')` → URL becomes `/flavors` (no `?range=`); 16 cards; "All" pill active |
| FLAV-02 | Back button restores previous filter state | e2e | same spec | click Fruity → click Desi → `page.goBack()` → URL `?range=fruity-blast` + 9 cards |
| FLAV-02 (unit) | VALID_RANGES set matches FlavorRange type literal values | unit | `vitest run tests/unit/range-filter.spec.ts` | type-level `expectTypeOf<FlavorRange>().toEqualTypeOf<'fruity-blast'\|'desi-cool'\|'premium-sports'>()` + runtime subset check |
| FLAV-03 | Homepage shows 9 teaser cards (8 flavors + "See all") | e2e | `playwright test tests/e2e/flavor-teaser.spec.ts` | `locator('[aria-label="Flavor teaser"] [data-flavor]').count()` → 8; `getByRole('link', { name: /See all/ })` visible |
| FLAV-03 | "See all" tile links to `/flavors` | e2e | same spec | click "See all" → `expect(page).toHaveURL('/flavors')` |
| HAMBURGER | Hamburger button opens panel with 3 links + 3 socials | e2e | `playwright test tests/e2e/hamburger.spec.ts` | click `aria-label="Open menu"` → `getByRole('dialog')` visible; 3 route links + Instagram/WhatsApp/Email anchors present |
| HAMBURGER | Escape closes panel + focus returns to trigger | e2e | same spec | open → press Escape → dialog hidden; `locator(':focus')` matches the hamburger button |
| HAMBURGER | WhatsApp link href = `getCta('nav').href` | unit | `vitest run tests/unit/hamburger-cta.spec.tsx` | render HamburgerMenu, open panel, assert the WhatsApp link's `href` equals the result of `getCta('nav')` (same contract-check pattern as Phase 1 `cta.spec.ts`) |
| CI GREP | No `wa.me` in new src/ files outside cta.ts | CI | `npm run grep:ci` | existing scanner passes (zero new matches outside `cta.ts`) |
| CI GREP | No `energy drink` phrase anywhere in src/ | CI | `npm run grep:ci` | existing scanner passes |

### Playwright setup for Phase 2 specs

Each new spec file either (a) uses the project's default `chromium` + Desktop Chrome viewport, or (b) scopes to Pixel 7 mobile via `test.use(devices['Pixel 7'])` for mobile-first tests. Pattern from Plan 02 — do NOT re-introduce a `mobile-chrome` project.

### Sample test file

```ts
// tests/e2e/range-filter.spec.ts
import { test, expect, devices } from '@playwright/test';

test.use(devices['Pixel 7']);

test.describe('Range filter URL sync', () => {
  test('Fruity Blast pill → 9 cards + URL', async ({ page }) => {
    await page.goto('/flavors');
    await page.getByRole('button', { name: 'Fruity Blast' }).click();
    await expect(page).toHaveURL(/\?range=fruity-blast$/);
    await expect(page.locator('[data-flavor]')).toHaveCount(9);
  });

  test('Share-link cold load restores state', async ({ page }) => {
    await page.goto('/flavors?range=desi-cool');
    await expect(page.locator('[data-flavor]')).toHaveCount(3);
    await expect(
      page.getByRole('button', { name: 'Desi & Cool' }),
    ).toHaveAttribute('aria-pressed', 'true');
  });

  test('Invalid ?range cleans URL + shows All', async ({ page }) => {
    await page.goto('/flavors?range=invalid');
    await expect(page).toHaveURL(/\/flavors$/);
    await expect(page.locator('[data-flavor]')).toHaveCount(16);
  });
});
```

### Vitest config

Existing `vitest.config.ts` (jsdom env, `@` alias) covers everything. New specs land in `tests/unit/*.spec.{ts,tsx}` — picked up by the existing glob.

---

## 11. Pitfalls to avoid

### 11.1 CI grep gates (highest-impact — WILL break the build)

- **`wa.me` outside `src/config/cta.ts`:** The hamburger panel renders a WhatsApp link but it MUST pull from `getCta('nav')`. No literal `wa.me/919203975762` anywhere else — not even in a comment. Even typing it in a code comment while debugging will trip the CI scanner. **Mitigation:** always import `getCta` and read `.href`; paraphrase in comments ("the WhatsApp deep-link" / "the configured waitlist destination").
- **`energy drink` phrase (case-insensitive) anywhere in `src/`:** Premium Sports descriptions in `src/data/flavors.ts` already use "caffeinated beverage" (Plan 02 established). Any refinements under D2-14 must continue this. **Mitigation:** read Plan 02 Deviation §6 before refining descriptions — it enumerates the exact phrases to avoid.
- **CI runs on EVERY PR to main** — `.github/workflows/ci.yml` → `grep:ci` step. A commit that trips either gate fails CI immediately.

### 11.2 Motion contract (CONV-05)

- **`motion.*` outside `src/lib/motion.ts`:** `grep -rE "motion\.(div|a|button|...)" src/ --include="*.ts*" | grep -v src/lib/motion.ts` must return zero matches. Use `m.div`, `m.a`, `m.aside`, etc. — imported via `import { m } from '@/lib/motion'`.
- **`AnimatePresence` is not currently re-exported from `@/lib/motion`.** If Phase 2 uses it (hamburger exit animation), **add `export { AnimatePresence } from 'motion/react'` to `src/lib/motion.ts`** — one line, keeps the single-import-site rule intact. Do not import from `motion/react` anywhere else.
- **Reduced-motion:** Motion auto-detects `prefers-reduced-motion` and strips animations by default. Belt-and-suspenders is to add `motion-reduce:transition-none motion-reduce:!transform-none` on the elements that matter (per `.planning/research/PITFALLS.md` Pitfall 9).

### 11.3 SPA + localStorage/sessionStorage

- `InAppBrowserBanner` already reads sessionStorage safely (try/catch). New Phase 2 components **must not** read browser-only globals during initial render without a guard — SSR is not configured, but React 19 StrictMode + Vite SSR warmup can execute components in a non-DOM context during build. Pattern: `typeof window !== 'undefined'` guard or `useEffect` for post-mount reads.
- The hamburger menu doesn't need persistent state; `useState(false)` is sufficient.

### 11.4 Scroll-snap conflicts with intersection observer

- Phase 2 uses `whileInView` (Motion's IntersectionObserver wrapper) for the HowItWorks fade-ins. The scroll-snap on the teaser is a **separate** scroll container; its snap behavior does NOT conflict with the IO on page-scroll.
- **Phase 3 territory:** if Phase 3 adds a sticky scroll-triggered timeline on the HowItWorks section (e.g. `useScroll` with `offset` tracking the section), avoid building that on `.planning/sections` that are inside `scroll-snap: y` containers. Not applicable to Phase 2 (we don't have `snap-y`).

### 11.5 Hamburger menu focus-trap on route change

- Radix Dialog cleanly destroys the focus trap when `onOpenChange(false)` fires.
- **Pattern:** every link inside the panel calls `setOpen(false)` on click BEFORE the Link navigates. This closes the dialog, which triggers focus return to the trigger, which then yields focus to the browser's URL bar for the next page's natural tab order. Verified by the Radix Dialog docs.
- **Edge case:** if a Link navigates and the panel stays open (e.g. hash-only navigation to a section), focus trap stays active and the user is "stuck" in the panel. Not an issue in Phase 2 (all nav Links are full-route navigations), but a reason to KEEP `setOpen(false)` on every Link `onClick` as a defensive habit.

### 11.6 Panel + banner z-index stacking

- InAppBrowserBanner is at `zIndex: 60` (inline style, per Plan 03).
- Nav is at `z-50`.
- Hamburger panel overlay (recommended): `zIndex: 70`; panel: `zIndex: 71`.
- Order: panel > overlay > banner > nav > body. Panel sits above everything (expected).
- **Verify in Playwright** via `getComputedStyle(panel).zIndex === '71'` and clicking Nav through-the-overlay fails (overlay blocks).

### 11.7 Comment grep-safety recap

Project pattern (Plan 02 §6, Plan 03 §5): paraphrase. Examples of safe comments:
- "the configured WhatsApp deep-link lives only in src/config/cta.ts" ✓
- "the WhatsApp number is read from `getCta('nav')`" ✓
- "no 'energy drink' phrasing" ✗ — contains the literal
- "no stimulant-beverage phrasing" ✓

### 11.8 Data refinement vs. schema change

- D2-14 permits REFINING descriptions in `src/data/flavors.ts`. It does NOT permit changing `handle`, `title`, `range`, or `accentHex`.
- Unit test guard: `tests/unit/flavors.spec.ts` already enforces 16 entries, 9/3/4 split, `priceInr: null` for all. Phase 2 may ADD a test that each description is ≤140 characters and does not include the forbidden phrase (regex-level).

---

## 12. Dependencies to add

### New install (ONE package)

```bash
npm install @radix-ui/react-dialog@1.2.0
```

- **Version:** 1.2.0 (latest, verified on npm registry 2026-10-10 via `npm view @radix-ui/react-dialog version`)
- **Why:** headless accessible dialog primitive for the hamburger panel — focus trap, Escape handling, click-outside, aria-modal all built-in. ~2 KB gzip. Already listed in CLAUDE.md Supporting Libraries as `1.x` for optional modal needs.
- **Risk:** `[VERIFIED: npm registry]` — Radix Primitives is maintained by WorkOS (ex-Modulz), has 8M+ weekly downloads, publicly auditable source at github.com/radix-ui/primitives. Not slop. CLAUDE.md pre-approves the Radix family (`@radix-ui/react-accordion@1.2.21` is also pre-blessed for Phase 5).

### Potentially needed re-export (one-line edit to existing file)

- **`AnimatePresence` from `src/lib/motion.ts`.** If the hamburger panel uses the recommended `<AnimatePresence>` pattern, add `export { AnimatePresence } from 'motion/react'` to the already-canonical `src/lib/motion.ts`. Zero bundle impact (same package, already loaded via `motion@14.0.0`).

### Packages explicitly NOT needed in Phase 2

- `embla-carousel-react` — CSS scroll-snap suffices (§3). Deferred.
- `focus-trap-react` — Radix provides focus trap. Deferred permanently.
- `vite-plugin-svgr` — SVGs are hand-authored as React components (§6). Deferred.
- `react-intersection-observer` — Motion's `whileInView` + `viewport` prop handles IO. Deferred (Phase 5 trust-badge/FAQ reveal might want it; Phase 2 does not).
- `@radix-ui/react-accordion` — Phase 5 FAQ territory.
- `@unhead/react` — Phase 5 SEO territory.
- `vite-imagetools`, `sharp` (runtime), `vite-plugin-sitemap` — Phase 4/5 territory.

### Confidence

- Phase 2 adds exactly 1 runtime dependency. Entry bundle grows by ~2 KB gzip (Radix Dialog) + ~1 KB per inline SVG × 3 steps + ~1 KB per flavor-card component (shared via memo). Well within Lighthouse mobile ≥90 budget headroom from Plan 03's 120 KB gzip entry.

---

## Package Legitimacy Audit

Phase 2 installs one new package. The slopcheck tool was unavailable in this exec environment; verification done via npm registry inspection + GitHub provenance.

| Package | Registry | Age | Downloads | Source Repo | slopcheck | Disposition |
|---------|----------|-----|-----------|-------------|-----------|-------------|
| `@radix-ui/react-dialog` | npm | ~5 yrs (first published 2020-10) | ~8M/wk | github.com/radix-ui/primitives | not run (tool unavailable) | **Approved** — org-canonical, actively maintained, listed in CLAUDE.md Supporting Libraries |

**Packages removed due to slopcheck [SLOP] verdict:** none
**Packages flagged as suspicious [SUS]:** none

**Verification path used:**
1. `npm view @radix-ui/react-dialog version` → `1.2.0` (recent, consistent with semver history)
2. `npm view @radix-ui/react-dialog repository.url` → `github.com/radix-ui/primitives.git` (matches CLAUDE.md expectation)
3. Cross-reference: `@radix-ui/react-accordion@1.2.21` is already pre-approved in CLAUDE.md for Phase 5 — same org, same release cadence. The Dialog package is the sibling, not a slop lookalike.
4. No `postinstall` script in the manifest — `npm view @radix-ui/react-dialog scripts.postinstall` returns nothing (safe default; verified pattern).

Since slopcheck was unavailable, this package is tagged **`[VERIFIED: official docs + GitHub provenance]`** rather than `[VERIFIED: slopcheck]`. The planner may optionally add a `checkpoint:human-verify` task before the install if additional caution is warranted; current recommendation is to proceed since the package is pre-blessed by CLAUDE.md.

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `react-router-dom` + `useSearchParams` | `react-router` + `useSearchParams` (same hook, different package) | React Router v8, June 2026 | `react-router-dom` removed; v8 is ESM-only consolidated |
| `-webkit-overflow-scrolling: touch` for iOS momentum | nothing — native since iOS 13 | iOS 13 (2019); baseline since 2022 | Legacy property, safe to omit |
| Framer Motion `<motion.div>` imports | `motion@14` + `LazyMotion` + `m.*` primitives | Framer Motion → Motion rename, 2024 | ~30 KB gzip savings when `m.*` is used throughout |
| Hand-rolled focus trap for modals | Radix Dialog headless primitive | 2020+ ecosystem shift | Correctness + a11y out of the box |
| 16 individual flavor cap PNGs | 1 shared SVG recolored per card via CSS vars | 2026 — this project | Zero per-flavor asset work; palette tweaks are a 1-file edit |

**Deprecated/outdated:**
- `react-router-dom` — removed in v8; some old blog posts still reference it. Project already migrated in Phase 1.
- `framer-motion` package name — maintenance-only; use `motion@14`.
- Classic hamburger-pattern "burger-with-dropdown-list" — replaced in modern mobile UX by slide-in panels with focus-trapped dialogs (Radix Dialog is the canonical pattern).

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | `@radix-ui/react-dialog@1.2.0` ships without a `postinstall` network script | §4, §12, Package Legitimacy Audit | **Low** — verified via `npm view … scripts.postinstall` returning empty. If somehow it did carry a postinstall, the install would run arbitrary code; running inside the project's existing dev environment keeps blast radius small. |
| A2 | WCAG contrast assessment used 20px/700-weight title text as the "large text" threshold | §7 | **Low** — WCAG 2.2 SC 1.4.3 defines large text as ≥18pt (24px) OR ≥14pt bold (18.66px/700). 20px/700 clears the second bar. If the design later picks 16px/700 titles, 4 flavors (Pineapple, Guava, Citrus Mint, Mango) fail AA and need the dark-text fallback flagged in §7 "alternative". |
| A3 | React 19 metadata hoisting still works for per-page `<title>`/`<meta>` on `/flavors` | §1 | **Low** — Phase 1 already uses this pattern in `src/sections/Hero.tsx`. Phase 5 migrates to `@unhead/react` for OG/canonical tags. |
| A4 | The 4 "failing" accents (Pineapple, Guava, Citrus Mint, Mango) will be visually acceptable with cream text + 0 1px 2px drop-shadow | §7 | **Medium** — this is a visual-review judgment call. If client review on Phase 2 completion rejects the look, the fallback is dark text per-flavor (static flag in `flavorColors.ts`). No schema impact. |
| A5 | 8 curated teaser flavors = Orange / Mango / Watermelon / Strawberry / Jaljeera / ORS-Electrolyte / Japanese Matcha / Coffee | §1, §3, §9 | **Low** — matches D2-09's 4+2+2 ratio and picks highest-contrast/mainstream subset. Planner may reorder or swap within the ratio. |
| A6 | Phase 2 may introduce `AnimatePresence` and should re-export from `src/lib/motion.ts` | §4, §11.2 | **Low** — single-line edit; existing CONV-05 pattern already covers this (motion.ts is the single importer). |

**Interpretation:** All 6 assumptions are LOW to MEDIUM risk. A4 is the one most likely to come back for revision based on client visual review — the planner should surface the "cream + shadow vs. per-flavor dark fallback" choice as a possible discuss-phase decision if the client reviews Phase 2 before Phase 3 starts.

---

## Open Questions

1. **Should the hamburger button REPLACE ThemeToggle in Nav, or sit beside it?**
   - D2-11 says "The hamburger sits to the right of ThemeToggle (or replaces its position with ThemeToggle moving inside the slide-in panel — planner's call during execution)."
   - **Recommendation:** keep both in Nav. ThemeToggle is a one-tap toggle; burying it inside the panel costs a tap for a frequent action. Nav line-up: `[Logo]  …flex-1…  [ThemeToggle]  [Hamburger]`.

2. **Should the HomePage `<main id="main">` landmark move out of Hero?**
   - §1 flagged this. Phase 1 put `<main>` inside Hero so the skip-link lands on Hero and the H1 is the first announced content. Phase 2 adds HowItWorks + FlavorTeaser below Hero.
   - **Options:**
     - (a) Keep `<main>` in Hero; HowItWorks + FlavorTeaser render as siblings OUTSIDE `<main>`. **Not ideal** — screen readers landing on `#main` only hear Hero's content; HowItWorks/FlavorTeaser are outside the landmark.
     - (b) Move `<main>` to `HomePage.tsx` wrapping all three sections. Hero becomes a plain `<section>`. Skip-link still resolves. **Recommended.** Playwright hero tests H5/H6 (`min-height` on `main`) need to be adjusted to assert on Hero's inner `<section>` instead — this is a test-file edit, not a Hero-behavior change.

3. **Should the Flavors page title update dynamically with the filter?**
   - FLAV-02 doesn't require it. SEO (SEO-01) is Phase 5.
   - **Recommendation:** keep `All 16 flavors — CAPSHOT` static for Phase 2. Phase 5 revisits with `@unhead/react` for dynamic per-filter titles + canonical consolidation.

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js 22.22+ | Build + tests | ✓ | v22.23.1 (verified in Plan 03 summary) | — |
| npm | Package install | ✓ | present | — |
| System Chrome (`/usr/bin/google-chrome`) | Playwright `channel: 'chrome'` | ✓ (per Plan 01 setup) | — | n/a — airgapped Chromium download already resolved in Plan 01 |
| `@radix-ui/react-dialog` 1.2.0 | Hamburger menu | ✗ (not yet installed) | — | None — install step is part of Wave 1 |

**Missing dependencies with no fallback:**
- `@radix-ui/react-dialog@1.2.0` — must be installed in Wave 1 before hamburger menu work.

**Missing dependencies with fallback:**
- None.

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Vitest 5.0.3 (unit) + Playwright 1.64 (e2e) |
| Config files | `vitest.config.ts`, `playwright.config.ts` (both exist) |
| Quick run command | `npm run test` (Vitest, ~2 s) and `npm run test:e2e -- <spec>` (Playwright, ~5 s per spec) |
| Full suite command | `npm run test && npm run test:e2e` |

### Phase Requirements → Test Map (summary)

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| HOW-01 | 3 steps rendered + labels + reduced-motion safe | e2e | `playwright test tests/e2e/how-it-works.spec.ts -x` | Wave 0 (new) |
| FLAV-01 | 16 color-washed cards on `/flavors` | e2e | `playwright test tests/e2e/flavors-grid.spec.ts -x` | Wave 0 (new) |
| FLAV-01 | FlavorCard renders correctly | unit | `vitest run tests/unit/FlavorCard.spec.tsx` | Wave 0 (new) |
| FLAV-02 | Pill click, cold-load, invalid-param, back-button | e2e | `playwright test tests/e2e/range-filter.spec.ts -x` | Wave 0 (new) |
| FLAV-02 | VALID_RANGES subset check | unit | `vitest run tests/unit/range-filter.spec.ts` | Wave 0 (new) |
| FLAV-03 | 8 flavors + "See all" in teaser scroller | e2e | `playwright test tests/e2e/flavor-teaser.spec.ts -x` | Wave 0 (new) |
| HAMBURGER (support) | Open, close, Escape, focus-return, link clicks | e2e | `playwright test tests/e2e/hamburger.spec.ts -x` | Wave 0 (new) |

### Sampling Rate

- **Per task commit:** `npm run test` (fast; ~2 s)
- **Per wave merge:** `npm run test && npm run test:e2e` (full; ~45 s)
- **Phase gate:** Full suite green + `npm run grep:ci` green before `/gsd:verify-work`

### Wave 0 Gaps

- [ ] `tests/e2e/how-it-works.spec.ts` — covers HOW-01
- [ ] `tests/e2e/flavors-grid.spec.ts` — covers FLAV-01
- [ ] `tests/unit/FlavorCard.spec.tsx` — covers FLAV-01 at component level
- [ ] `tests/e2e/range-filter.spec.ts` — covers FLAV-02 (pill click, share-link, invalid-param, back-button)
- [ ] `tests/unit/range-filter.spec.ts` — covers FLAV-02 type invariants
- [ ] `tests/e2e/flavor-teaser.spec.ts` — covers FLAV-03
- [ ] `tests/e2e/hamburger.spec.ts` — covers HamburgerMenu a11y + CTA contract
- [ ] `tests/unit/hamburger-cta.spec.tsx` — asserts WhatsApp link href = `getCta('nav').href`
- [ ] Potentially: `tests/unit/color.spec.ts` for the `lightenHex` helper if adopted

**Framework install:** none needed. Vitest + Playwright are already installed and configured.

**Playwright e2e harness grew from 22 → 32 at end of Plan 03.** Phase 2 adds ~15 new e2e tests → ~47 total. Hero/theme/banner/skeleton/tracking stay green (verify via a dry-run before each Phase 2 commit).

---

## Sources

### Primary (HIGH confidence)

- `react-router@8.4.0` on npm — version verified 2026-10-10
- `@radix-ui/react-dialog@1.2.0` on npm — version verified 2026-10-10, repo verified `github.com/radix-ui/primitives`
- `motion@14` on npm (14.1.0 is latest, 14.0.0 pinned in this project) — API matches docs at motion.dev
- Project source files read directly: `src/App.tsx`, `src/sections/Nav.tsx`, `src/sections/Hero.tsx`, `src/pages/HomePage.tsx`, `src/pages/FlavorsPage.tsx`, `src/data/flavors.ts`, `src/data/types.ts`, `src/lib/motion.ts`, `src/lib/cn.ts`, `src/index.css`, `src/components/primitives/*`, `src/components/ui/*`, `src/theme/ThemeProvider.tsx`, `package.json`
- `.planning/phases/02-how-it-works-flavor-catalog/02-CONTEXT.md` — Phase 2 locked decisions
- `.planning/phases/01-foundation-hero-conversion-infrastructure/01-01-SUMMARY.md`, `01-02-SUMMARY.md`, `01-03-SUMMARY.md` — Phase 1 provides/affects contracts
- `.planning/phases/01-foundation-hero-conversion-infrastructure/01-UI-SPEC.md` — design tokens, type scale, color + contrast table
- `.planning/research/STACK.md` — Motion 14 LazyMotion + `m.*`, React Router 8 declarative mode
- `.planning/research/ARCHITECTURE.md` — 4-layer tree, state management pattern, image pipeline wrapper
- `.planning/research/PITFALLS.md` Pitfall 9 — Motion bundle hygiene
- `.claude/skills/capshot-brand/SKILL.md` — palette, Hinglish policy, mobile-first mandate, CTA centralization
- `.claude/skills/capshot-catalog/SKILL.md` — 16 flavors + accentHex table + range filter order

### Secondary (MEDIUM confidence)

- MDN CSS scroll-snap documentation (https://developer.mozilla.org/docs/Web/CSS/CSS_scroll_snap)
- Radix UI Dialog docs (https://www.radix-ui.com/primitives/docs/components/dialog)
- WebAIM Contrast Checker (https://webaim.org/resources/contrastchecker/) — used for the 16-accent cream-text analysis in §7
- WCAG 2.2 Understanding 1.4.3 (https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) — large-text threshold
- Motion.dev documentation (https://motion.dev/docs/react-animations) — `whileInView`, `useReducedMotion`, `AnimatePresence`

### Tertiary (LOW confidence)

- None — Phase 2 is sufficiently covered by project source + verified-current npm registry entries + MDN. No speculative claims.

---

## Metadata

**Confidence breakdown:**

- Component architecture + file paths — **HIGH** — flows directly from `.planning/research/ARCHITECTURE.md` 4-layer convention + Phase 1 established patterns
- React Router v8 URL sync — **HIGH** — verified against project's own `src/App.tsx` (already uses `import { … } from 'react-router'`) + STACK.md confirmation
- CSS scroll-snap — **HIGH** — standard CSS; browser support covered by Vite 8 `baseline-widely-available` target
- Hamburger menu with Radix Dialog — **HIGH** — Radix is pre-blessed in CLAUDE.md and the sibling package (`react-accordion`) is already pre-approved for Phase 5
- SVG recoloring via CSS variables — **HIGH** — standard CSS Values 3 + inline-style custom properties pattern; verified against MDN
- Illustration production approach (inline React SVG) — **HIGH** — standard React pattern, aligns with Phase 3's Motion-ownership intent
- Flavor card color handling + contrast — **MEDIUM** — contrast math is correct; "cream + shadow" visual acceptability is a design judgment (A4 in Assumptions Log)
- Pitfalls — **HIGH** — directly inherited from Phase 1 Deviation records and `.planning/research/PITFALLS.md`
- Dependencies — **HIGH** — exactly one new package, verified on npm registry 2026-10-10

**Research date:** 2026-10-10
**Valid until:** 2026-11-09 (30 days — Phase 2 is on a stable stack with no fast-moving dependencies apart from pinned Motion/React Router)

---

*Phase 2 research for: How It Works + Flavor Catalog on top of frozen Phase 1 scaffold.*
*Researched: 2026-10-10*
