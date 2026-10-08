# Architecture Research

**Domain:** Hybrid React/Vite marketing site + Shopify-hosted checkout (D2C beverage, India)
**Researched:** 2026-10-09
**Confidence:** HIGH

> **How this document is scoped:** The project is already committed to React + TypeScript + Vite + Tailwind + Framer Motion + React Router + Shopify-at-subdomain (Phase 6). This architecture research is NOT a stack re-litigation. It is an opinionated blueprint for *how to arrange that stack* so the Phase 1 marketing site becomes a zero-refactor Phase 6 commerce site — and so every Phase 1–5 section is built on top of boundaries that will not shift.

---

## Standard Architecture

### System Overview

```
┌───────────────────────────────────────────────────────────────────────┐
│                     BROWSER (mobile-first, 95% traffic)               │
└───────────────────────────┬───────────────────────────────────────────┘
                            │
                            │ HTTPS
                            ▼
┌───────────────────────────────────────────────────────────────────────┐
│  capshot.co  (Vercel/Netlify static edge — Phase 1–6)                │
│  ┌─────────────────────────────────────────────────────────────────┐  │
│  │                 Vite SPA (React 19 + TS)                        │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐         │  │
│  │  │  Pages   │  │ Sections │  │   UI     │  │ Primitives│        │  │
│  │  │ (routes) │→ │  (slabs) │→ │(composed)│→ │  (atoms) │         │  │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘         │  │
│  │         ▲            ▲            ▲             ▲               │  │
│  │         │            │            │             │               │  │
│  │  ┌──────┴────────────┴────────────┴─────────────┴───────────┐   │  │
│  │  │  Data layer  (src/data/*.ts  —  Shopify-shaped TS)       │   │  │
│  │  │  Config layer (src/config/cta.ts  —  SINGLE SWAP POINT)  │   │  │
│  │  │  Theme layer (src/theme/*  —  Tailwind tokens + toggle)  │   │  │
│  │  └─────────────────────────────────────────────────────────┘    │  │
│  └─────────────────────────────────────────────────────────────────┘  │
└───────────────┬───────────────────────────────────┬───────────────────┘
                │                                   │
                │ Phase 1–5: wa.me link             │ Phase 6: shop.* link
                ▼                                   ▼
┌─────────────────────────────┐    ┌──────────────────────────────────┐
│  WhatsApp Business          │    │  shop.capshot.co (Shopify Basic) │
│  (waitlist convos, manual)  │    │  Dawn theme + Razorpay + Shiprkt │
└─────────────────────────────┘    └──────────────────────────────────┘
```

**Key architectural property:** The marketing site is a *pure static-rendered SPA* that reads from in-repo TS data. Phase 6 does not add React code paths — it only edits two files (`src/config/cta.ts`, `src/data/flavors.ts`) and ships a Shopify store on a subdomain. There is no shared runtime between the two apps.

### Component Responsibilities

| Component | Responsibility | Implementation |
|-----------|----------------|----------------|
| **Pages** (`src/pages/*`) | Route-level composition. Owns `<title>`/`<meta>` for the route. One per React Router route. | `HomePage.tsx`, `FlavorsPage.tsx`, `AboutPage.tsx`, `ContactPage.tsx`, `FlavorDetailPage.tsx` (deferred to Phase 6 if needed) |
| **Sections** (`src/sections/*`) | Full-width homepage slabs. Each is a self-contained scroll "slide" from `sections-blueprint.md`. Owns its own section-level Framer Motion scroll animations. | `Hero.tsx`, `HowItWorks.tsx`, `FlavorTeaser.tsx`, `USPComparison.tsx`, `Variants.tsx`, `PremiumSports.tsx`, `TrustSafety.tsx`, `FAQ.tsx`, `FinalCTA.tsx`, `Footer.tsx`, `Nav.tsx` |
| **UI** (`src/components/ui/*`) | Composed, reusable, brand-aware. These are the "lego bricks" sections build with. | `PrimaryCTA.tsx`, `SecondaryCTA.tsx`, `FlavorCard.tsx`, `RangeFilter.tsx`, `Accordion.tsx`, `TrustBadge.tsx`, `BundleCard.tsx` (Phase 6), `ThemeToggle.tsx` |
| **Primitives** (`src/components/primitives/*`) | Unopinionated atoms. No brand bias. Styled via Tailwind utility passthroughs. | `Button.tsx`, `Container.tsx`, `Heading.tsx`, `Text.tsx`, `Image.tsx`, `Section.tsx` (wrapper that handles alternating bg + motion viewport trigger) |
| **Data** (`src/data/*`) | Pure TS modules. No React. Shape mirrors Shopify product schema (per `capshot-catalog`). | `flavors.ts`, `ranges.ts`, `faqs.ts`, `bundles.ts` (empty stub in Phase 1, populated Phase 6) |
| **Config** (`src/config/*`) | Deployment-time swap points. The ONLY files Phase 6 edits besides data. | `cta.ts` (destination routing), `site.ts` (domain, social handles, OG defaults), `theme.ts` (feature flags) |
| **Theme** (`src/theme/*`) | Tailwind token definitions + light/dark mode controller. | `tokens.ts` (hex → semantic names), `ThemeProvider.tsx` (prefers-color-scheme + localStorage), `tailwind.config.ts` imports tokens |

---

## Recommended Project Structure

```
capshot/
├── public/                       # Served as-is; NO Vite processing
│   ├── logos/
│   │   ├── logo-horizontal.png   # from /Media/Logo_SHI-28.png
│   │   └── logo-square.png       # from /Media/Logo_Square.png
│   ├── flavors/                  # Phase 3: 16 flavor cap shots, kebab-case
│   │   ├── orange.png
│   │   ├── mixed-berry.png
│   │   └── ...
│   ├── og/                       # Open Graph preview images per route
│   │   ├── home.jpg              # 1200x630
│   │   ├── flavors.jpg
│   │   └── about.jpg
│   ├── favicon.ico
│   ├── apple-touch-icon.png
│   ├── robots.txt
│   └── sitemap.xml               # Generated by vite-plugin-sitemap at build
│
├── src/
│   ├── main.tsx                  # Vite entry; mounts <App/>
│   ├── App.tsx                   # Router + ThemeProvider + layout shell
│   │
│   ├── pages/                    # Route-level components (one per route)
│   │   ├── HomePage.tsx          # Composes all 11 homepage sections
│   │   ├── FlavorsPage.tsx       # /flavors — grid + range filter
│   │   ├── AboutPage.tsx         # /about — founder story
│   │   ├── ContactPage.tsx       # /contact — WhatsApp/IG/email
│   │   └── NotFoundPage.tsx      # 404
│   │
│   ├── sections/                 # Homepage slabs (ordered per sections-blueprint.md)
│   │   ├── Nav.tsx
│   │   ├── Hero.tsx
│   │   ├── HowItWorks.tsx
│   │   ├── FlavorTeaser.tsx
│   │   ├── USPComparison.tsx
│   │   ├── Variants.tsx
│   │   ├── PremiumSports.tsx
│   │   ├── Bundles.tsx           # Phase 6 only — stub-exported, not rendered until flag flipped
│   │   ├── TrustSafety.tsx
│   │   ├── FAQ.tsx
│   │   ├── FinalCTA.tsx
│   │   └── Footer.tsx
│   │
│   ├── components/
│   │   ├── primitives/           # Atoms — no brand opinions
│   │   │   ├── Button.tsx
│   │   │   ├── Container.tsx     # max-w + padding wrapper
│   │   │   ├── Section.tsx       # alternating bg + motion viewport trigger
│   │   │   ├── Heading.tsx       # H1-H4 with display font
│   │   │   ├── Text.tsx
│   │   │   └── Image.tsx         # <picture> wrapper, lazy + aspect ratio
│   │   └── ui/                   # Composed, brand-aware
│   │       ├── PrimaryCTA.tsx    # THE conversion button — reads cta.ts
│   │       ├── SecondaryCTA.tsx
│   │       ├── FlavorCard.tsx    # Reads Flavor type from data/flavors.ts
│   │       ├── RangeFilter.tsx   # Pill filter for /flavors
│   │       ├── Accordion.tsx     # FAQ item
│   │       ├── TrustBadge.tsx
│   │       ├── BundleCard.tsx    # Phase 6 — reads data/bundles.ts
│   │       ├── Meta.tsx          # React 19 metadata hoisting (per-route <title>/<meta>)
│   │       └── ThemeToggle.tsx
│   │
│   ├── data/                     # Pure TS, Shopify-shaped (per capshot-catalog skill)
│   │   ├── flavors.ts            # 16 flavors, Flavor[] with Shopify-aligned fields
│   │   ├── ranges.ts             # 3 range metas (label, tagline, flavor list)
│   │   ├── faqs.ts               # 6-8 Q&A pairs
│   │   ├── bundles.ts            # [] in Phase 1; 3 bundles in Phase 6
│   │   └── types.ts              # Flavor, FlavorRange, Bundle, FAQ types
│   │
│   ├── config/                   # The ONLY files Phase 6 edits (besides data)
│   │   ├── cta.ts                # THE swap point — WhatsApp → Shopify URLs
│   │   ├── site.ts               # Domain, social handles, default OG metadata
│   │   └── features.ts           # Boolean flags: ENABLE_BUNDLES, ENABLE_SHOPIFY_CTAS
│   │
│   ├── theme/
│   │   ├── tokens.ts             # Brand hex + semantic names (brand-deep, etc.)
│   │   ├── ThemeProvider.tsx     # Light/dark context + localStorage persistence
│   │   └── useTheme.ts
│   │
│   ├── hooks/                    # Add only when a hook has ≥2 consumers
│   │   ├── useReducedMotion.ts   # Respects prefers-reduced-motion
│   │   └── useInView.ts          # (If not using Framer Motion's useInView directly)
│   │
│   ├── lib/                      # Framework-agnostic helpers
│   │   ├── cn.ts                 # tailwind-merge + clsx
│   │   └── seo.ts                # buildOgTags(), buildCanonicalUrl()
│   │
│   └── skills.ts                 # Phase 0: declarative map of which claude skills to auto-load
│
├── .claude/
│   └── skills/                   # Already exists: capshot-brand, capshot-catalog, capshot-commerce-rollout
│
├── index.html                    # Vite entry HTML; default <meta> for crawler fallback
├── tailwind.config.ts
├── vite.config.ts                # React plugin + vite-plugin-sitemap
├── tsconfig.json
├── package.json
└── README.md
```

### Structure Rationale

- **`pages/` separate from `sections/`:** Pages = routes. Sections = scrollable slabs that compose into pages. Enforcing this split prevents the common React mistake of giving a scroll-section its own React Router entry (which breaks the long-scroll narrative the Hinglish copy relies on).
- **`primitives/` separate from `ui/`:** Primitives have no brand opinions — they will survive any rebrand. UI components encode brand decisions (CTA label from config, flavor accent wash). This split keeps Framer Motion effects and Tailwind classes layered correctly: primitives are tokenized, UI is composed, sections are narrative.
- **`data/` is pure TS (no React):** Lets Vite tree-shake unused data, lets Node scripts (sitemap generator, image preprocessor) import it, and makes the Phase 6 Shopify migration a mechanical find-and-replace rather than a component rewrite.
- **`config/cta.ts` is a dedicated folder, not a top-level file:** Keeps room for `site.ts` and `features.ts` to live beside it. Three config files is the right ceiling — more becomes a dumping ground.
- **No `store/` folder:** This project does NOT need Zustand/Redux. See [State Management](#state-management) below. Theme state lives in a Context; filter state is route-local `useState`. Adding a global store before you have a problem is premature architecture.
- **`skills.ts` at `src/`:** Declarative pointer the `/gsd:*` orchestrator and future Claude sessions read to know which `.claude/skills/*` to auto-load for different work. See [Skills Integration Pattern](#skills-integration-pattern).

---

## Architectural Patterns

### Pattern 1: Centralized CTA Config (THE swap point)

**What:** All conversion CTAs — "Join the Waitlist", "Shop Now", bundle buttons — read their label, href, and intent from one file. Components NEVER hard-code `wa.me` or `shop.capshot.co` URLs.

**When to use:** Every Primary CTA and every bundle CTA across the site. No exceptions.

**Trade-offs:**
- Pro: Phase 6 commerce swap = edit one file, redeploy. Zero component refactors.
- Pro: A/B testing a CTA label is one-line change, propagates everywhere.
- Pro: Analytics (`kind` field below) can route to different trackers per destination type.
- Con: Adds one import to every section — negligible.

**Full file (Phase 1 state):**

```ts
// src/config/cta.ts
export type CtaKind = 'whatsapp' | 'shopify' | 'external';

export type CtaDestination = {
  label: string;
  href: string;
  kind: CtaKind;
  ariaLabel?: string;      // for screen readers when label is Hinglish
  trackingId?: string;     // optional analytics event name
};

export const ctaConfig = {
  // Primary conversion CTA — the "big button" every section uses
  primary: {
    label: 'Join the Waitlist',
    href: 'https://wa.me/919203975762?text=Hi%20CAPSHOT!%20I%20want%20to%20join%20the%20waitlist.',
    kind: 'whatsapp' as const,
    ariaLabel: 'Join the CAPSHOT waitlist on WhatsApp',
    trackingId: 'cta_primary_whatsapp',
  },

  // Secondary CTA — browse flavors
  secondary: {
    label: 'See All Flavours',
    href: '/flavors',
    kind: 'external' as const,
    trackingId: 'cta_secondary_flavors',
  },

  // Nav CTA — compact "Notify Me" in the top bar
  nav: {
    label: 'Notify Me',
    href: 'https://wa.me/919203975762?text=Hi%20CAPSHOT!%20Notify%20me%20when%20you%20launch.',
    kind: 'whatsapp' as const,
    trackingId: 'cta_nav_notify',
  },

  // Bundle CTAs — empty strings in Phase 1 (bundles section not rendered)
  // Phase 6 fills these with Shopify product URLs
  bundles: {
    trial: '',
    fitness: '',
    bulk: '',
  },
} satisfies {
  primary: CtaDestination;
  secondary: CtaDestination;
  nav: CtaDestination;
  bundles: Record<'trial' | 'fitness' | 'bulk', string>;
};

// Convenience helper for components
export const getCta = (slot: 'primary' | 'secondary' | 'nav') => ctaConfig[slot];
```

**Phase 6 swap procedure (exactly 3 edits in this file):**

```ts
// 1. Replace primary with Shopify destination
primary: {
  label: 'Shop Now',
  href: 'https://shop.capshot.co/products/fitness-pack',
  kind: 'shopify' as const,
  trackingId: 'cta_primary_shop',
},

// 2. Replace nav
nav: {
  label: 'Shop',
  href: 'https://shop.capshot.co/collections/all',
  kind: 'shopify' as const,
  trackingId: 'cta_nav_shop',
},

// 3. Populate bundles
bundles: {
  trial:   'https://shop.capshot.co/products/trial-pack',
  fitness: 'https://shop.capshot.co/products/fitness-pack',
  bulk:    'https://shop.capshot.co/products/bulk-energy-pack',
},
```

Then flip `src/config/features.ts` → `ENABLE_BUNDLES: true`. Rebuild. Done.

**`<PrimaryCTA>` component (reads config, always):**

```tsx
// src/components/ui/PrimaryCTA.tsx
import { getCta } from '@/config/cta';
import { Button } from '@/components/primitives/Button';

type Props = {
  slot?: 'primary' | 'nav';         // defaults to primary
  size?: 'md' | 'lg';
  className?: string;
};

export function PrimaryCTA({ slot = 'primary', size = 'lg', className }: Props) {
  const cta = getCta(slot);
  const isExternal = cta.kind === 'whatsapp' || cta.kind === 'shopify';

  return (
    <Button
      as="a"
      href={cta.href}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      aria-label={cta.ariaLabel ?? cta.label}
      data-cta={cta.trackingId}
      size={size}
      className={className}
    >
      {cta.label}
    </Button>
  );
}
```

Every section imports `<PrimaryCTA />` — no props required for the standard case.

---

### Pattern 2: Shopify-Shaped Data Model (data swap, not refactor)

**What:** `src/data/flavors.ts` holds a `Flavor[]` whose fields match Shopify's product schema. Phase 1 populates design fields; Phase 6 fills `shopifyProductId`, `priceInr`, `available`. Components read the same type both phases.

**When to use:** Any product-like data (flavors, bundles). The `capshot-catalog` skill is the source of truth for the type definition.

**Trade-offs:**
- Pro: Phase 6 Shopify migration = replace a `.ts` file; component tree is untouched.
- Pro: Lets you ship static Phase 1 without a Shopify account, no mocking layer.
- Con: Means you can't use Shopify's Storefront GraphQL in Phase 6 without a client — but we explicitly rejected that (hybrid redirect model). The marketing site never calls Shopify APIs; it just links to them.

**Full type (as it ships in Phase 1):**

```ts
// src/data/types.ts
export type FlavorRange = 'fruity-blast' | 'desi-cool' | 'premium-sports';

export type Flavor = {
  // Shopify-aligned (identity + commerce)
  handle: string;              // kebab-case, URL slug, = Shopify product handle
  title: string;               // display name
  description: string;         // <140 chars tagline
  images: { cap: string; lifestyle?: string };

  // CAPSHOT-specific (design + narrative)
  range: FlavorRange;
  accentHex: string;
  dosage: { light: string; strong: string };

  // Phase 6 placeholders — undefined in Phase 1
  shopifyProductId?: string;
  priceInr?: number;
  available?: boolean;
};
```

**Phase 6 migration:** Fill the three placeholder fields for all 16 flavors. Components reading `flavor.priceInr` are gated with `features.ENABLE_SHOPIFY_CTAS` so they stay dormant until flipped.

---

### Pattern 3: Static Content, Context Theme, Local Filter State

**What:** This site has no business state. It has (a) static content read from TS, (b) one piece of global UI state (theme), and (c) one piece of route-local UI state (range filter on `/flavors`). We use the simplest tool for each, not a global store.

**When to use:** Any marketing site under 20 pages where the backend is "static files on a CDN." If this ever grows into an authenticated dashboard, revisit.

**Trade-offs:**
- Pro: Zero global-store bundle cost. Zero "which selector should I use" cognitive load.
- Pro: Theme Context is standard React; range filter is a `useState` + URL searchParam (shareable links).
- Con: If a *fifth* widget needs cross-component state later, this will feel undersized — at that point adopt Zustand (not Redux). Threshold: when you're prop-drilling the same piece of state through 3+ layers.

**Decision table (what state goes where):**

| State | Where it lives | Reasoning |
|-------|---------------|-----------|
| Theme (light/dark) | `ThemeProvider` Context | Needs to be readable anywhere; changes rarely; small payload |
| Range filter on `/flavors` | `useState` + `useSearchParams` | Route-local; shareable via URL (`?range=fruity-blast`) |
| FAQ accordion open/close | `useState` in `Accordion.tsx` | Trivially local |
| Mobile nav open/close | `useState` in `Nav.tsx` | Trivially local |
| Form fields (Contact) | `useState` or `react-hook-form` | Local; Phase 5 decision |
| Scroll position / animations | Framer Motion `useScroll` / `useInView` | Owned by motion lib |
| Cart | **NEVER** | Lives in Shopify checkout, not here |

**Explicit non-choices:**
- ❌ **Zustand** — No cross-section state exists. Adding it is premature.
- ❌ **Redux** — Overkill for this scope by two orders of magnitude.
- ❌ **TanStack Query** — No HTTP data fetching happens on the marketing site.
- ❌ **Jotai/Valtio** — Same as Zustand; no justification.

---

### Pattern 4: Router Choice — React Router 7 in Library Mode (NOT Framework Mode)

**What:** Use React Router 7's **library mode** (`react-router-dom` style, client-side routing on top of Vite). Do NOT adopt framework mode (`@react-router/dev`, file-based routing, SSR, loaders).

**When to use:** This project. Always.

**Trade-offs:**
- Pro: Keeps Vite as the build tool with no plugin lock-in to the router.
- Pro: Static build output is deployable to any CDN as plain files; no Node runtime needed.
- Pro: Loaders and actions solve problems we don't have (no auth, no form POSTs on this site).
- Pro: Framework mode's SSR is unnecessary — we pre-render at build time if we want crawler-friendly HTML, via `vite-plugin-ssg` or just letting React 19's `<meta>` hoist into the HTML head.
- Con: We lose automatic code splitting per route. Mitigation: `React.lazy()` on `AboutPage`/`ContactPage` manually — one-line fix.

**Setup:**

```tsx
// src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { ThemeProvider } from '@/theme/ThemeProvider';
import HomePage from '@/pages/HomePage';
import FlavorsPage from '@/pages/FlavorsPage';

const AboutPage = lazy(() => import('@/pages/AboutPage'));
const ContactPage = lazy(() => import('@/pages/ContactPage'));

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Suspense fallback={null}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/flavors" element={<FlavorsPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ThemeProvider>
  );
}
```

Route count ceiling: **5** in Phase 1–5 (`/`, `/flavors`, `/about`, `/contact`, 404). Flavor detail pages (`/flavors/:handle`) are explicitly deferred — the Flavor Teaser + `/flavors` grid cover product browsing until Shopify owns detail pages in Phase 6.

---

### Pattern 5: SEO/Meta Architecture (React 19 metadata hoisting)

**What:** Use React 19's built-in `<title>`, `<meta>`, `<link>` hoisting inside page components. No `react-helmet-async`.

**When to use:** Every page. The `Meta` component wraps the pattern.

**Trade-offs:**
- Pro: Zero library dependency. React 19 natively hoists these elements to `<head>`.
- Pro: Works in SPA mode (client-side) and in any future static-generation flow.
- Pro: `react-helmet-async` has known issues under React 19 and is in maintenance; the ecosystem is actively moving off it.
- Con: No SSR context serialization — not needed here since we are client-rendered. Crawlers see the final rendered HTML either via Vercel's edge rendering or via explicit prerender.

**Shared metadata helper:**

```ts
// src/lib/seo.ts
import { siteConfig } from '@/config/site';

export type RouteMeta = {
  title: string;              // page-specific; will be suffixed with site name
  description: string;        // <160 chars for SERP
  ogImage?: string;           // defaults to /og/home.jpg
  canonical?: string;         // full URL; defaults to current path on site domain
};

export function buildMeta(route: RouteMeta, path: string) {
  return {
    title: `${route.title} · ${siteConfig.name}`,
    description: route.description,
    canonical: route.canonical ?? `${siteConfig.url}${path}`,
    ogImage: route.ogImage ?? `${siteConfig.url}/og/home.jpg`,
    ogType: 'website',
    twitterCard: 'summary_large_image',
  };
}
```

**Per-page usage:**

```tsx
// src/pages/FlavorsPage.tsx
import { Meta } from '@/components/ui/Meta';
import { buildMeta } from '@/lib/seo';

export default function FlavorsPage() {
  const meta = buildMeta({
    title: 'All 16 Flavours',
    description: 'Explore 16 CAPSHOT flavours across Fruity Blast, Desi & Cool, and Premium Sports. Twist, shake, boom — drink ready.',
    ogImage: '/og/flavors.jpg',
  }, '/flavors');

  return (
    <>
      <Meta {...meta} />
      {/* ... page body ... */}
    </>
  );
}
```

```tsx
// src/components/ui/Meta.tsx — pure React 19 metadata hoisting
type Props = {
  title: string;
  description: string;
  canonical: string;
  ogImage: string;
  ogType?: string;
  twitterCard?: string;
};

export function Meta({ title, description, canonical, ogImage, ogType = 'website', twitterCard = 'summary_large_image' }: Props) {
  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonical} />

      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
    </>
  );
}
```

**Sitemap generation:**

- Use `vite-plugin-sitemap` in `vite.config.ts` with the 5-route static list.
- `/flavors/:handle` dynamic routes are NOT added — Shopify owns product URLs in Phase 6, and Phase 1–5 doesn't have detail pages.
- `robots.txt` lives in `public/` statically. One line: `Sitemap: https://capshot.co/sitemap.xml`.

```ts
// vite.config.ts (excerpt)
import sitemap from 'vite-plugin-sitemap';

export default defineConfig({
  plugins: [
    react(),
    sitemap({
      hostname: 'https://capshot.co',
      dynamicRoutes: ['/', '/flavors', '/about', '/contact'],
    }),
  ],
});
```

---

### Pattern 6: Image Pipeline (public/ now, CDN later — behind a wrapper)

**What:** All image loads go through `<Image />` primitive. In Phase 1–5 it resolves URLs from `/public/`. The wrapper can be upgraded to Cloudinary/ImageKit without touching callers.

**When to use:** Every `<img>` tag on the site. Zero direct `<img>` usage.

**Trade-offs:**
- Pro: Public folder is free. Phase 1–5 traffic will be modest; Vercel/Netlify static hosting is well within free tier.
- Pro: When CDN is justified (likely Phase 4 when Lighthouse pass happens or Phase 6 when ads scale), the swap is one component.
- Pro: `<Image />` enforces `width`, `height`, `alt`, lazy-loading, and aspect-ratio containers — avoids CLS.
- Con: Flavor cap shots can be large; without CDN transforms you ship a single resolution. Mitigation: pre-process at build time with `sharp` or `@squoosh/cli` once (Phase 4), serve WebP + fallback PNG. Lighter than pulling in Cloudinary SDK for 16 images.

**The `<Image />` primitive (Phase 1 implementation):**

```tsx
// src/components/primitives/Image.tsx
type Props = {
  src: string;                 // path relative to /public, e.g. "/flavors/orange.png"
  alt: string;
  width: number;
  height: number;
  priority?: boolean;          // true for hero/above-the-fold
  className?: string;
  sizes?: string;              // responsive hint
};

export function Image({ src, alt, width, height, priority, className, sizes }: Props) {
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading={priority ? 'eager' : 'lazy'}
      decoding={priority ? 'sync' : 'async'}
      fetchPriority={priority ? 'high' : 'auto'}
      sizes={sizes}
      className={className}
    />
  );
}
```

**Phase 4+ upgrade (same signature, Cloudinary resolver):**

```tsx
// src/components/primitives/Image.tsx — v2
import { cldSrcSet } from '@/lib/cld';

export function Image({ src, alt, width, height, priority, className, sizes }: Props) {
  const { src: optimized, srcSet } = cldSrcSet(src, { width });
  return <img src={optimized} srcSet={srcSet} alt={alt} ... />;
}
```

Callers never change. The 16 flavor cap shots become responsive, format-adaptive, zero-code-change.

**Recommendation on CDN choice when the time comes:** ImageKit (India presence, ~40–50% cheaper than Cloudinary at equivalent features, free tier covers Phase 6 opening traffic). Deferred decision — don't optimize before you have real image bandwidth bills.

---

### Pattern 7: Theme System (CSS vars + Tailwind + Context)

**What:** Brand tokens are defined once in `src/theme/tokens.ts`, exposed as CSS variables on `:root` and `[data-theme="dark"]`, and consumed by Tailwind via `tailwind.config.ts`. Toggle sets `data-theme` on `<html>` and persists to localStorage.

**When to use:** Everywhere. Never use raw hex in components.

**Trade-offs:**
- Pro: Light/dark swap is one attribute flip; no re-render cascade.
- Pro: Tailwind utility `bg-brand-cream` resolves to the right hex per mode automatically.
- Pro: Future rebrand changes `tokens.ts` only.
- Con: Setup requires both the Tailwind config and the CSS variable layer — ~30 lines of plumbing one time.

**tokens.ts:**

```ts
// src/theme/tokens.ts
export const brandTokens = {
  light: {
    'brand-deep': '#594545',    // body, headings
    'brand-mid': '#815B5B',     // accent, surfaces
    'brand-rose': '#9E7676',    // soft accents, borders
    'brand-cream': '#FFF8EA',   // background
  },
  dark: {
    'brand-deep': '#FFF8EA',    // swapped — now text
    'brand-mid': '#9E7676',
    'brand-rose': '#815B5B',
    'brand-cream': '#594545',   // swapped — now background
  },
} as const;
```

**Tailwind config:**

```ts
// tailwind.config.ts
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'brand-deep': 'var(--brand-deep)',
        'brand-mid': 'var(--brand-mid)',
        'brand-rose': 'var(--brand-rose)',
        'brand-cream': 'var(--brand-cream)',
      },
    },
  },
};
```

**ThemeProvider:**

```tsx
// src/theme/ThemeProvider.tsx
import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';
const ThemeContext = createContext<{ theme: Theme; toggle: () => void } | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'light';
    const saved = localStorage.getItem('capshot-theme') as Theme | null;
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('capshot-theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggle: () => setTheme(t => t === 'light' ? 'dark' : 'light') }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be inside ThemeProvider');
  return ctx;
};
```

---

### Pattern 8: Skills Integration Pattern

**What:** A declarative `src/skills.ts` file maps work topics → `.claude/skills/*` to load. The `/gsd:*` orchestrator and future Claude sessions reference this file to auto-load relevant skills without re-reading SKILL.md descriptions each time.

**When to use:** Any time a Claude session is working in this repo and a user mentions one of the registered trigger topics.

**Trade-offs:**
- Pro: Future-you doesn't have to remember which skill to load for which task.
- Pro: Keeps the skill "trigger" vocabulary explicit and auditable.
- Con: One more file to update when a skill is added. Negligible — skills are rare.

```ts
// src/skills.ts
// Declarative map of claude skills registered in .claude/skills/
// Consumed by Claude Code sessions to auto-load the right context per task.
// Also serves as documentation for human contributors.

export const skillRegistry = [
  {
    name: 'capshot-brand',
    path: '.claude/skills/capshot-brand/SKILL.md',
    triggers: [
      'colors', 'palette', 'theme', 'tokens', 'logo',
      'copy', 'headline', 'cta', 'voice', 'hinglish',
      'section', 'hero', 'mobile', 'brand',
    ],
    loadWhen: 'any src/ work touching UI, copy, components, or theme',
  },
  {
    name: 'capshot-catalog',
    path: '.claude/skills/capshot-catalog/SKILL.md',
    triggers: [
      'flavor', 'flavors', 'catalog', 'variants',
      'product data', 'shopify migration', 'range filter',
    ],
    loadWhen: 'editing src/data/flavors.ts, FlavorCard, /flavors page, or any product rendering',
  },
  {
    name: 'capshot-commerce-rollout',
    path: '.claude/skills/capshot-commerce-rollout/SKILL.md',
    triggers: [
      'shopify', 'razorpay', 'shiprocket', 'checkout',
      'bundles', 'commerce', 'buy now', 'phase 6',
    ],
    loadWhen: 'ONLY during Phase 6 commerce wiring — do not load earlier',
  },
] as const;
```

The registry is also referenced by `.planning/ROADMAP.md` to document which skills are expected in each phase.

---

## Data Flow

### Phase 1–5 Content Flow (static)

```
┌─────────────────────┐
│ src/data/flavors.ts │  ← source of truth, hand-authored TS array
└──────────┬──────────┘
           │ import
           ▼
┌─────────────────────┐
│  FlavorsPage.tsx    │
│  FlavorTeaser.tsx   │ ← pages/sections import the array
└──────────┬──────────┘
           │ map to <FlavorCard flavor={f} />
           ▼
┌─────────────────────┐
│   FlavorCard.tsx    │ ← reads flavor.accentHex, flavor.title, flavor.images.cap
└─────────────────────┘
```

### Phase 6 Content Flow (same shape, swapped values)

```
┌──────────────────────────────────┐
│ src/data/flavors.ts (v2)         │  ← same type, now with shopifyProductId,
│  + priceInr, available populated │     priceInr, available filled in
└──────────────┬───────────────────┘
               │ import (unchanged)
               ▼
┌─────────────────────┐
│  FlavorCard.tsx     │ ← now also renders price + "Shop" button
│  (gated on flag)    │   under `features.ENABLE_SHOPIFY_CTAS`
└──────────┬──────────┘
           │ CTA onClick → window.open(cta.href)
           ▼
┌──────────────────────────────┐
│ shop.capshot.co (Shopify)    │
└──────────────────────────────┘
```

### CTA Resolution Flow (both phases, same path)

```
Section component (Hero, FinalCTA, etc.)
       │
       │ renders
       ▼
<PrimaryCTA />
       │
       │ calls getCta('primary')
       ▼
src/config/cta.ts  ← SINGLE source of truth, phase-dependent values
       │
       │ returns { label, href, kind, trackingId }
       ▼
<Button as="a" href={cta.href}>{cta.label}</Button>
       │
       │ Phase 1: href = wa.me/...
       │ Phase 6: href = shop.capshot.co/...
       ▼
   External destination
```

### State Management

**There is no central store.** The three state surfaces:

```
   ┌──────────────────────┐          ┌──────────────────────┐
   │  ThemeProvider       │          │ useSearchParams()    │
   │  (global, Context)   │          │ (route-local, URL)   │
   └──────────┬───────────┘          └──────────┬───────────┘
              │ useTheme()                       │ ?range=fruity-blast
              ▼                                  ▼
   ┌──────────────────────┐          ┌──────────────────────┐
   │ ThemeToggle,         │          │ FlavorsPage filter   │
   │ bg-brand-cream, etc. │          │ pill state           │
   └──────────────────────┘          └──────────────────────┘

   Local useState for: FAQ open/close, mobile nav open/close, form fields
```

### Key Data Flows

1. **Flavor render:** `data/flavors.ts` → `FlavorsPage` / `FlavorTeaser` → `FlavorCard` → DOM. Pure read; no mutation.
2. **CTA click:** `config/cta.ts` → `PrimaryCTA` → anchor tag → external destination (WhatsApp or Shopify). No React state involved.
3. **Theme toggle:** `ThemeToggle` click → `useTheme().toggle()` → Context state → `useEffect` sets `data-theme` on `<html>` → CSS variables cascade → all `bg-brand-*` and `text-brand-*` utilities update.
4. **Range filter:** Pill click → `setSearchParams({ range })` → URL updates → `useSearchParams` reads back → `flavors.filter(f => f.range === range)` → re-render card grid.
5. **Scroll animations:** Framer Motion `useScroll` / `whileInView` → component-local; triggers animations as sections enter viewport. No global state.

---

## Build Order Dependencies

The homepage sections blueprint already defines a phase build order. This architecture adds the **foundation requirements** that must exist before each phase.

| Phase | Required scaffolding (must exist before phase work begins) | Produced by this phase |
|-------|-----------------------------------------------------------|------------------------|
| **Phase 0** (bootstrap, in progress) | — | `vite.config.ts`, `tsconfig.json`, `tailwind.config.ts`, folder structure above, placeholder `App.tsx` |
| **Phase 1** (Nav + Hero + Footer) | `theme/tokens.ts`, `ThemeProvider`, `config/cta.ts`, `components/primitives/*`, `components/ui/PrimaryCTA.tsx` | `sections/Nav.tsx`, `sections/Hero.tsx`, `sections/Footer.tsx` scaffolded; other sections placeholder divs |
| **Phase 2** (How It Works + Final CTA) | Framer Motion patterns from Phase 1 Hero (reusable scroll triggers) | `HowItWorks`, `FinalCTA` |
| **Phase 3** (Flavor Teaser + /flavors) | `data/flavors.ts` with all 16 populated, `data/ranges.ts`, `components/ui/FlavorCard.tsx`, `RangeFilter.tsx`; `/public/flavors/*.png` present | `sections/FlavorTeaser.tsx`, `pages/FlavorsPage.tsx` |
| **Phase 4** (USP + Variants + Premium Sports) | Nothing new — composes existing primitives | 3 new sections |
| **Phase 5** (Trust + FAQ + About + Contact + SEO/perf) | `data/faqs.ts`, `lib/seo.ts`, `components/ui/Meta.tsx`, `vite-plugin-sitemap` wired, `/public/og/*.jpg` created | `TrustSafety`, `FAQ`, `AboutPage`, `ContactPage`, Lighthouse pass |
| **Phase 6** (Commerce) | FSSAI license, inventory, Shopify + Razorpay + Shiprocket per `capshot-commerce-rollout`; `data/bundles.ts` filled; `features.ENABLE_BUNDLES = true`; `cta.ts` destinations swapped | `sections/Bundles.tsx` rendered; CTAs point at `shop.capshot.co` |

**Critical dependency note:** `src/config/cta.ts` and `components/ui/PrimaryCTA.tsx` MUST exist before Phase 1's Hero section is built. Every section built from Phase 1 onward uses `<PrimaryCTA />` — if it isn't established first, the whole "zero-refactor Phase 6" guarantee collapses.

---

## Phase 6 Migration Surface Area

This is the enumerated list of **every file that changes** when the marketing site becomes a commerce site. The whole architecture exists to make this list short.

### Files Edited (3)
1. **`src/config/cta.ts`** — Edit `primary`, `nav`, and `bundles` destinations. ~10 lines.
2. **`src/data/flavors.ts`** — Fill `shopifyProductId`, `priceInr`, `available` for 16 flavors. ~48 lines of data (3 fields × 16 flavors).
3. **`src/config/features.ts`** — Flip `ENABLE_BUNDLES: true`, `ENABLE_SHOPIFY_CTAS: true`. 2 lines.

### Files Added (2)
1. **`src/data/bundles.ts`** — Was `export const bundles: Bundle[] = []` in Phase 1; now populated with 3 bundles.
2. **`public/og/bundles.jpg`** — OG preview image for the bundles section.

### Files Rendered for First Time (1)
1. **`src/sections/Bundles.tsx`** — Was imported but gated behind `ENABLE_BUNDLES` flag in `HomePage.tsx`. Now renders.

### Files That Do NOT Change
- Any file under `src/components/primitives/*`
- Any file under `src/components/ui/*` (including `PrimaryCTA`, `FlavorCard`)
- Any file under `src/sections/*` (except `Bundles.tsx` becoming visible)
- Any file under `src/pages/*`
- `src/theme/*`
- `src/App.tsx`
- `vite.config.ts`

**Total surface area:** ~60 lines of edits + one new data file. No component refactor. No new library. No new route. The marketing site code is frozen; Shopify is a separate deployment on a subdomain.

---

## Scaling Considerations

| Scale | Architecture adjustments |
|-------|--------------------------|
| **0–1k visitors/mo** (Phase 1–5 pre-launch) | Vercel/Netlify free tier. Public-folder images. No analytics beyond basic. No CDN. |
| **1k–50k visitors/mo** (Phase 6 soft launch, early paid ads) | Add Meta Pixel + Google Analytics 4 (both via `src/lib/analytics.ts`). Still free tier. Pre-process flavor images to WebP at build. |
| **50k–500k visitors/mo** (scaled ad campaigns) | Introduce ImageKit CDN behind the existing `<Image />` wrapper. Enable Vercel/Netlify analytics (paid). Consider edge functions for geolocation-based FSSAI/Hinglish variants if ever needed (not likely). |
| **500k+ visitors/mo** | Re-evaluate whether React Router 7 framework mode + SSR adds enough SEO/perf lift to justify the operational cost. Likely still no — Shopify owns the commerce funnel, this site is top-of-funnel only. |

### Scaling Priorities

1. **First bottleneck: image bytes.** 16 full-res PNG flavor shots + hero imagery = multi-megabyte Lighthouse pain. Fix order: WebP conversion → `<picture>` with `srcset` → CDN. Each step buys 2–3x. Hit it in Phase 4 before SEO/perf pass.
2. **Second bottleneck: Framer Motion bundle size.** `framer-motion` ships ~50KB gzipped. If bundle gets tight, use `motion` (the Framer successor) or import only `motion/react/mini` where possible. Monitor but don't preempt.
3. **Third bottleneck: analytics scripts.** Meta Pixel + GA4 can add 100ms+ to TTI. Load them with `strategy="lazyOnload"` or `defer`, and only after first interaction.

---

## Anti-Patterns

### Anti-Pattern 1: Hard-coding WhatsApp or Shopify URLs in Section Components

**What people do:** `<a href="https://wa.me/919203975762?text=...">Join Waitlist</a>` directly inside `Hero.tsx`, `FinalCTA.tsx`, bundle cards, etc. Also hard-coding the Shopify URL once Phase 6 starts.

**Why it's wrong:** The Phase 6 commerce swap turns into a 15-file search-and-replace with inevitable misses. The whole architectural promise ("zero component refactor") collapses. Analytics loses a central event hook. Hinglish copy variations become copy-paste chores.

**Do this instead:** Every CTA renders `<PrimaryCTA />` or reads from `getCta('primary' | 'nav')`. No URL literal appears outside `src/config/cta.ts`.

---

### Anti-Pattern 2: Introducing a Global Store "Just in Case"

**What people do:** Install Zustand/Redux in Phase 1 because "we'll probably need it later for cart state."

**Why it's wrong:** There is no cart on this site, ever — the hybrid architecture explicitly delegates cart/checkout to Shopify. Theme state is a Context (which is correct for an infrequently-changing global value). Filter state belongs in the URL (shareable). A store is architectural weight paid for no feature.

**Do this instead:** Context for theme. `useSearchParams` for filters. `useState` for local UI. When (and only when) a *fifth* genuinely cross-cutting state emerges, adopt Zustand — not before.

---

### Anti-Pattern 3: Fetching Shopify Data from the Marketing Site

**What people do:** In Phase 6, decide to "enrich" flavor cards with live inventory from Shopify Storefront GraphQL. Adds a client, adds env vars, adds error states.

**Why it's wrong:** The hybrid redirect architecture is explicitly "no shared runtime." The moment the marketing site fetches Shopify data, you've imported Shopify's uptime, API rate limits, and auth model into a static site that was previously trivially cacheable at the edge. For a stock-out label on a flavor card, you've added 90% more operational surface.

**Do this instead:** Keep `available: boolean` in `src/data/flavors.ts` and update it on redeploy when a flavor runs out. Weekly cadence is fine. If true live inventory ever becomes essential, revisit — but default to static.

---

### Anti-Pattern 4: Framer Motion in Primitives

**What people do:** Put `motion.div` with scroll triggers inside `components/primitives/Section.tsx` so "every section animates."

**Why it's wrong:** Primitives are supposed to be opinion-free atoms. Baking Framer Motion in means every consumer pays the cost even if the section is a static legal page. Also makes the primitive hard to unit-test and locks the project to Framer Motion forever.

**Do this instead:** Primitives are plain DOM. Section components opt into motion explicitly: `<Section><motion.div whileInView={...}>...</motion.div></Section>`. Pay the cost where you want the effect.

---

### Anti-Pattern 5: Multiple `Image` Implementations

**What people do:** Use `<img>` directly in some places, a wrapper in others, Cloudinary SDK in a third set. Each with different lazy-loading defaults, different alt-text expectations.

**Why it's wrong:** When Phase 4 CDN upgrade lands, you now have three callsites to migrate, each with different signatures. Also makes CLS prevention inconsistent.

**Do this instead:** One `<Image />` primitive. All image renders go through it. The CDN swap is a one-component edit.

---

### Anti-Pattern 6: Letting the Flavors Page Grow Detail Routes Pre-Phase-6

**What people do:** Build `/flavors/:handle` detail pages in Phase 3 "so SEO can index each flavor."

**Why it's wrong:** Shopify owns product detail pages in Phase 6, and those pages will have their own SEO (Shopify Dawn theme ships OG/schema out of the box). Duplicating that on the marketing site creates URL conflicts, canonical confusion, and a Phase 6 migration decision ("do we 301 redirect our /flavors/orange to shop.capshot.co/products/orange?").

**Do this instead:** Phase 1–5 stops at the `/flavors` grid. Each flavor card is clickable but opens a lightweight in-page expansion (accordion or modal), not a route. Detail URLs live on Shopify's subdomain.

---

## Integration Points

### External Services

| Service | Integration pattern | Notes |
|---------|---------------------|-------|
| **WhatsApp Business** (Phase 1–5) | `wa.me/<number>?text=<URL-encoded>` link in `cta.ts`. No API. | Pre-filled message appears in user's WhatsApp app; conversation handled manually by client. Zero infra. |
| **Shopify Basic** (Phase 6) | Static external links from CTA to `shop.capshot.co/products/<handle>`. No SDK/API in marketing site. | Lives on subdomain. Dawn theme. Marketing site never calls Shopify APIs. |
| **Razorpay** (Phase 6) | Configured inside Shopify Admin only. Marketing site has zero Razorpay code. | Keys live in Shopify Payment settings. |
| **Shiprocket** (Phase 6) | Shopify App Store install. Marketing site has zero Shiprocket code. | Order fulfillment is a Shopify ↔ Shiprocket concern. |
| **Vercel/Netlify** | `git push` → auto-deploy from `main`. Static output. | No build-time env vars needed in Phase 1–5. In Phase 6, might add `VITE_SHOP_URL` for the few `shop.capshot.co` references in `cta.ts`. |
| **Google Analytics 4 + Meta Pixel** (Phase 5+) | Script tag loaded from `src/lib/analytics.ts`, initialized once in `App.tsx` with user-consent gate. | `data-cta` attribute on CTAs enables Meta Pixel's "InitiateCheckout" style events to fire on CTA click. |
| **ImageKit / Cloudinary** (Phase 4+, optional) | Resolver inside `<Image />` primitive. No SDK required — URL transforms are string-based. | Decision deferred. |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| **Pages → Sections** | Direct import + JSX composition | Pages own meta + layout; sections own scroll narrative |
| **Sections → UI** | Direct import of `PrimaryCTA`, `FlavorCard`, etc. | Sections NEVER import `data/*` directly for a product; always via a UI component that owns the data shape |
| **Sections → Primitives** | Direct import | Primitives are the leaf layer |
| **UI → Data** | Direct import of typed arrays | One-way; data has no React dependency |
| **UI → Config** | Direct import of `getCta`, `siteConfig` | One-way; config has no React dependency |
| **Everything → Theme** | `useTheme()` hook (rare); mostly implicit via Tailwind utilities | Theme context used by ThemeToggle; everything else just uses `bg-brand-cream` classes |
| **Marketing site ↔ Shopify store** | Plain HTML anchor links across subdomains | Explicitly NO shared JS. Separate deployments. Shared only via brand palette replicated in Shopify theme. |

---

## Sources

Verified against current (October 2026) documentation and community consensus:

- [React Router v7 Complete Guide — Framework Mode, Loaders & Actions](https://dev.to/stacknotice/react-router-v7-complete-guide-2026-framework-mode-loaders-actions-5f7a)
- [Library mode vs Framework mode — remix-run/react-router Discussion #12423](https://github.com/remix-run/react-router/discussions/12423)
- [A guide to React 19's new Document Metadata feature — LogRocket](https://blog.logrocket.com/guide-react-19-new-document-metadata-feature/)
- [Managing Metadata in React 19 — robslog.com](https://robslog.com/en/managing-metadata-in-react-19-no-more-react-helmet/)
- [vite-plugin-sitemap on npm](https://www.npmjs.com/package/vite-plugin-sitemap)
- [Cloudinary vs Uploadthing vs ImageKit — 2026 pricing](https://www.pkgpulse.com/guides/cloudinary-vs-uploadthing-vs-imagekit-image-storage-2026)
- [Vite public vs src assets — ThatSoftwareDude](https://www.thatsoftwaredude.com/content/14144/public-vs-src-assets-when-to-use-each-approach-in-vite)
- Project skills: `.claude/skills/capshot-brand/SKILL.md` (CTA centralization mandate)
- Project skills: `.claude/skills/capshot-catalog/SKILL.md` (Shopify-shaped data model)
- Project skills: `.claude/skills/capshot-commerce-rollout/SKILL.md` (Phase 6 swap specifics)
- Project skills: `.claude/skills/capshot-brand/references/sections-blueprint.md` (homepage order, phase build order)

**Confidence basis:** HIGH overall.
- Component boundaries + data flow: HIGH (standard React composition, verified against brand/catalog skill constraints).
- React Router 7 library mode choice: HIGH (verified against official v7 docs and framework-vs-library discussion).
- React 19 metadata hoisting: HIGH (native feature, documented, replaces react-helmet-async which has known React 19 incompatibility).
- Image pipeline strategy: HIGH (public folder works; CDN upgrade behind wrapper is a well-established pattern).
- CTA centralization: HIGH (already locked by `capshot-brand` skill; this doc operationalizes it).

---
*Architecture research for: Hybrid React/Vite marketing site + Shopify-hosted checkout D2C brand*
*Researched: 2026-10-09*
