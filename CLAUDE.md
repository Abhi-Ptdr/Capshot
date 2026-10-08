<!-- GSD:project-start source:PROJECT.md -->
## Project

**SHI-28 CAPSHOT**

A premium D2C beverage brand selling pre-filled flavor powder caps that twist onto any standard 28mm water bottle. Twist → shake → instant drink. India-first, targeting mobile-savvy young adults who want portable, zero-waste, flavor-on-demand alternatives to pre-mixed bottled drinks. The project is the brand's marketing website, launching pre-sales via waitlist and evolving into a live Shopify-backed D2C store once inventory ships.

**Core Value:** **Convert a mobile ad-driven visitor into an engaged pre-launch waitlist signup — and later, a buyer — through premium, scroll-driven brand storytelling that makes the "twist, shake, boom" moment feel inevitable to try.**

If the hero section fails to communicate the concept in <5 seconds on mobile, nothing else matters.

### Constraints

- **Tech stack**: React + TypeScript + Vite + Tailwind + Framer Motion + React Router — Locked by original spec; preserves creative control and keeps bundle sizes tight
- **Performance**: Lighthouse mobile ≥ 90 across all four metrics; first meaningful paint < 2s on 4G — 95% mobile traffic from paid ads; bounce rate kills conversion
- **Design**: Palette locked to `#594545` / `#815B5B` / `#9E7676` / `#FFF8EA`; light/dark swap with WCAG AA — Client-locked brand identity
- **Mobile-first**: Design mobile layouts first, scale up — Blueprint overrides original spec's "desktop-first" wording based on traffic reality
- **Positioning**: Hero narrative = refreshing hydration (NOT energy drinks) — Only 4 of 16 flavors are energy-coded; broad appeal protects the catalog
- **Build cadence**: Phase-by-phase, pause for client review between phases — Explicit client requirement in original spec
- **Budget**: Shopify ~₹2,000/mo deferred until Phase 6; Phase 1–5 are free to host (Vercel/Netlify static) — Client is pre-revenue; infra cost must track revenue readiness
- **Legal**: FSSAI license mandatory before Phase 6 commerce go-live; cannot sell food/beverage online in India without it
<!-- GSD:project-end -->

<!-- GSD:stack-start source:research/STACK.md -->
## Technology Stack

## Executive Summary (read this first)
## Recommended Stack
### Core Technologies
| Technology | Version | Purpose | Why Recommended |
|---|---|---|---|
| **Node.js** | **22.12 LTS** (min 22.22 if adopting React Router v8 immediately) | Build runtime | Vite 8 minimum is 20.19+/22.12+; React Router v8 bumps the floor to 22.22. Pick the Router floor so we never have to re-pin. |
| **React** | **19.3.0** | UI library | React Router v8 peer-requires `>=19.2.7`. React 19 ships Actions, built-in `use()`, and improved hydration — all useful for the Phase 6 cart-redirect UX. |
| **TypeScript** | **7.0.2** | Type system | TS 7 (released 2026) is the Rust-port of the compiler; roughly 10× faster builds, same semantics. Perfect for a Vite project where typecheck is the slow step. |
| **Vite** | **8.3.4** | Dev server + bundler | Default build target is now `baseline-widely-available` (Chrome 111+, Safari 16.4+ — covers 95%+ of Indian mobile traffic). Uses rolldown + Oxc under the hood → noticeably faster builds vs Vite 5. |
| **@vitejs/plugin-react** | **6.1.2** | React fast refresh + JSX | Default pick. SWC variant (`plugin-react-swc`) is slightly faster but has smaller plugin ecosystem; not worth it for a project this size. |
| **Tailwind CSS** | **4.3.3** | Styling | v4 is CSS-first (`@import "tailwindcss"` + `@theme` block in CSS, no JS config file). ~10× faster builds than v3, OKLCH color space by default, built-in container queries, `starting-style` support. Mandatory for the dark-mode token swap we need. |
| **@tailwindcss/vite** | **4.3.3** | Tailwind Vite plugin | The ONLY recommended install path for Tailwind v4 + Vite. Do NOT use the PostCSS plugin — slower and the official docs call it out. |
| **Motion** (ex-Framer Motion) | **14.0.0** | Animation library | Same team, same API as Framer Motion, but renamed and leaner. Core bundle starts at ~4.6 KB gzip with `LazyMotion` + `m` component; full `motion` import is ~34 KB. Essential for the hero + "Twist / Shake / Boom" scroll choreography. |
| **React Router** | **8.4.0** | Client-side routing (Declarative mode) | v8 is ESM-only, consolidated: `react-router-dom` no longer exists. Use **Declarative mode** (`BrowserRouter`) — NOT framework mode. Framework mode wants `react-router dev` to replace Vite's dev server, which breaks the "just a static SPA on Vercel" deployment model this project requires. |
### Supporting Libraries
| Library | Version | Purpose | When to Use |
|---|---|---|---|
| **clsx** | **2.1.1** | Conditional className strings | Always. Pair with tailwind-merge. |
| **tailwind-merge** | **3.7.0** | Resolve conflicting Tailwind classes | Always — in `<Button variant>` style components where consumers may override classes. |
| **class-variance-authority (cva)** | **0.7.1** | Variant-driven component APIs | For `<PrimaryCTA>`, `<FlavorCard>`, `<Section>` — anywhere we need `variant="primary\|secondary\|ghost"` style props with strict TS types. |
| **lucide-react** | **1.53.0** | Icon set | Pure SVG, tree-shaken, 1000+ icons. Matches the clean geometric aesthetic in the brand guide. Avoid heroicons (fewer glyphs) and react-icons (ships whole packs, bad for bundle). |
| **@radix-ui/react-accordion** | **1.2.21** | FAQ accordion primitive | Required by the FAQ section in `PROJECT.md`. Headless + accessible + 2 KB. Pick ONLY the accordion package — don't pull all of Radix. |
| **@radix-ui/react-dialog** | **1.x** | Flavor detail modal (optional) | If any flavor card needs a modal zoom view. Install only when a section actually requires it. |
| **@unhead/react** | **2.0.1** | `<head>` tag management (SEO/OG) | Replaces react-helmet-async. Smaller (~2 KB vs 5.8 KB), actively maintained, SSR-ready when/if we migrate. Required for per-route OG/Twitter/canonical tags. |
| **vite-plugin-sitemap** | **0.8.2** | Build-time `sitemap.xml` + `robots.txt` | Generates sitemap at build. Point it at our route table. |
| **vite-imagetools** | **12.0.1** | Build-time image transforms (resize, AVIF/WebP, srcset) | **This is the right pick, NOT vite-plugin-image-optimizer.** imagetools runs per-import with query-string transforms (`import hero from './hero.jpg?w=400;800;1200&format=avif;webp;jpg&as=srcset'`), lets us emit proper `<picture>` elements with AVIF+WebP+JPG fallback. image-optimizer only compresses the originals — no responsive variants. |
| **sharp** | **0.35.5** | Image processing engine (used by imagetools) | Dev-dependency only — runs at build time. |
| **react-intersection-observer** | **11.0.1** | Scroll-triggered animation triggers | Simpler API than Motion's `useInView` for one-off "animate when visible" sections. Use for the trust-badge strip, the FAQ reveal, the comparison table. |
| **embla-carousel-react** | **8.6.0** | Flavor carousel (if needed) | Lighter than Swiper (14 KB vs ~90 KB), touch-first, excellent momentum feel on mobile. Only install if the 16-flavor grid moves to a carousel on mobile. |
### Phase 6 Only — Do NOT install in Phase 1
| Library | Version | Purpose | When to Install |
|---|---|---|---|
| **@shopify/storefront-api-client** | **2.0.1** | Typed Storefront GraphQL client | Phase 6, and ONLY if we decide to show live price/stock on the marketing site. If the "Shop Now" button just redirects to `shop.capshot.co/products/<handle>`, we don't need this at all. |
| **graphql** | **17.0.2** | Peer dep of storefront-api-client | Only if the above is installed. |
### Development Tools
| Tool | Version | Purpose | Notes |
|---|---|---|---|
| **ESLint** | **10.12.0** | Linting | Use flat config (`eslint.config.js`). The legacy `.eslintrc` format is deprecated in v10. |
| **Prettier** | **3.9.9** | Formatting | — |
| **prettier-plugin-tailwindcss** | **0.8.1** | Auto-sort Tailwind classes | Mandatory for consistency across contributors. |
| **Vitest** | **5.0.3** | Unit/component testing | Phase-later. For Phase 1–5 the component surface is mostly visual; manual Lighthouse testing is more valuable than unit tests. |
| **@vite-pwa/assets-generator** | **2.2.10** | Generate app icons / favicon set from `Logo_Square.png` | Run once to produce favicon.ico, apple-touch-icon, maskable PWA icons. |
| **@vitejs/plugin-react-swc** | **4.3.3** | Alternative to plugin-react | Keep in reserve. Only switch if HMR/build becomes a bottleneck. |
### Hosting + Deploy
| Service | Purpose | Notes |
|---|---|---|
| **Vercel** (preferred) or **Netlify** | Static hosting + CDN | Both have India edge PoPs (Mumbai). Vercel's image optimization is irrelevant here because we're pre-transforming at build via vite-imagetools. Pick whichever the client already has an account on. |
| **Cloudflare** (DNS) | Domain management for `capshot.co` | Not required but strongly recommended — free, fast India DNS, needed later for `shop.capshot.co` CNAME to Shopify. |
## Installation
# Core framework
# Styling
# Animation
# Supporting libs
# Dev dependencies
### Minimal `vite.config.ts`
### Minimal `src/index.css` (Tailwind v4)
## Alternatives Considered
| Recommended | Alternative | When to Use Alternative |
|---|---|---|
| **Motion 14** | **framer-motion 12** | If a legacy codebase can't do an atomic import rename today. For a greenfield build, there is no reason to pick the deprecated name. |
| **Motion 14** | **GSAP 3** | If we needed scrubbed-timeline scroll choreography far beyond "fade/slide in on view" (e.g., full cinematic SVG morphing). We don't — Motion's `useScroll` + `useTransform` is more than enough for twist/shake/boom. GSAP is also commercial for business sites in some jurisdictions since the Webflow acquisition — avoid the license question. |
| **React Router 8 Declarative** | **React Router 8 Framework mode** | If this site becomes SSR'd (Phase 7+). Framework mode replaces the Vite dev server with `react-router dev` and expects loader/action semantics — overkill for a static marketing site and incompatible with "deploy a dist/ folder to Vercel" simplicity. |
| **React Router 8 Declarative** | **TanStack Router** | If we needed strict type-safe search-param routing and route-level data loaders. Not needed for 4 marketing routes. React Router 8 is the ecosystem default and matches the locked spec. |
| **vite-imagetools** | **vite-plugin-image-optimizer** | If all we needed was lossless compression of originals. We need responsive srcsets + AVIF/WebP output — imagetools is the right tool. |
| **@unhead/react** | **react-helmet-async** | Still works, 1.5M weekly downloads, but 2× the bundle size and slower maintenance cadence. Pick unhead for greenfield. |
| **@unhead/react** | **power-seo-react** | Newer and bundle-lighter, but tiny ecosystem (unproven on real projects). Not worth the risk on a client build. |
| **Vercel/Netlify static** | **Cloudflare Pages** | Also excellent. Picked Vercel/Netlify for familiarity and because `PROJECT.md` names them explicitly. Cloudflare is a drop-in later if we want. |
| **Hybrid redirect (Phase 6)** | **Shopify Hydrogen** | Already explicitly rejected in `PROJECT.md` Out of Scope. Hydrogen is now a "framework-agnostic toolkit" in 2026, but it still constrains the premium creative direction and complicates hosting (Oxygen). Hybrid redirect is the right call. |
## What NOT to Use
| Avoid | Why | Use Instead |
|---|---|---|
| **`framer-motion` package name** | Renamed to `motion` in 2024; the old name is maintenance-only. Mixing both in one project will double-ship animation code. | `motion@^14`, import from `motion/react`. |
| **`react-router-dom`** | Removed in React Router v8 (June 2026). The package still publishes v7.x security patches but the API has moved. | `react-router@^8` — components live at `react-router/dom`. |
| **Tailwind v3 + `tailwind.config.js`** | v4 is CSS-first and 10× faster. v3 is still supported but new features (OKLCH, container queries, `@theme`) land in v4 only. | `tailwindcss@^4.3` with `@theme` in CSS. |
| **PostCSS plugin for Tailwind v4** | Slower than the Vite plugin; official docs recommend the Vite plugin specifically. | `@tailwindcss/vite`. |
| **`vite-plugin-pwa` service worker** | Overkill for a 4-route marketing site; adds complexity around cache invalidation and offline fallback that hurts more than it helps for ad-driven traffic (users land once, bounce or convert, don't come back for weeks). | Skip. Static CDN caching + aggressive image preloading achieves the same mobile LCP goal. |
| **`react-helmet` (non-async)** | Not SSR-safe, officially unmaintained. | `@unhead/react`. |
| **Styled-components / Emotion** | Runtime CSS-in-JS adds 10–20 KB and hurts mobile paint time. The locked stack uses Tailwind — don't dual-stack. | Tailwind utility classes + CSS variables for theme tokens. |
| **Material UI / Chakra / Mantine** | Opinionated design systems collide with the premium brand aesthetic and ship 50+ KB of base. The brand guide specifies custom typography and palette. | Headless primitives from Radix UI + Tailwind styling. |
| **Shopify Hydrogen** | Already Out of Scope per `PROJECT.md`. Also conflicts with the hybrid-redirect architecture. | Phase 6: hybrid redirect to `shop.capshot.co`; optionally `@shopify/storefront-api-client` for live price/stock. |
| **react-icons** | Ships entire icon packs even with tree-shaking in some bundlers; large. | `lucide-react` — true tree-shaking, modern geometric style matches brand. |
| **Swiper** | ~90 KB, overkill for a flavor carousel. | `embla-carousel-react` (14 KB) if a carousel is needed at all. |
| **GSAP (ScrollTrigger)** | Great library, but overlaps 100% with Motion for our use case and introduces a second animation runtime. Also check license. | Motion's `useScroll` + `useInView`. |
| **Next.js** | Would require ejecting from the locked Vite stack and brings SSR complexity the project doesn't need (marketing site is static-first). | Stay on Vite. If SEO/SSR becomes critical later, use React Router v8 framework mode with pre-rendering (`ssr: false`). |
| **Email waitlist tools (ConvertKit, Mailchimp) in Phase 1** | `PROJECT.md` explicitly chose WhatsApp Business as Phase 1 conversion channel. Email arrives via Shopify in Phase 6. | A single `wa.me` URL in `src/config/cta.ts`. |
## Stack Patterns by Variant
- Wrap `<App>` in `UnheadProvider` from `@unhead/react`.
- Each route component calls `useHead({ title, meta, link })`.
- `vite-plugin-sitemap` reads the static route list at build and emits `sitemap.xml` + `robots.txt`.
- **Important:** react-helmet-async / unhead update the DOM *after* hydration. Google renders JS now (since 2019), but Facebook/Twitter/WhatsApp link-preview crawlers do NOT — so we also pre-render the critical OG tags into `index.html` at build time via `vite-plugin-html` substitution OR hand-maintain them in `index.html` for the homepage specifically (good enough for Phase 1).
- Inline the hero's AVIF `<img>` as a `<link rel="preload" as="image">` in `index.html`.
- Enable Vite's `experimental.renderBuiltUrl` to prefix the CDN origin so the image fetches start before JS parse completes.
- Audit font loading: self-host Satoshi/Inter as WOFF2 subsets, `font-display: swap`.
- Install `@shopify/storefront-api-client` + `graphql`.
- Fetch at build time (`vite build` prerender script) → write JSON into `src/data/flavors.generated.ts` → import normally. Avoid runtime fetches on the marketing site; keep the SPA fast.
- Revalidate on each deploy (trigger Vercel rebuild from Shopify webhook).
- No new deps. Edit `src/config/cta.ts` destination and `src/data/flavors.ts` to add `shopifyProductHandle` field. Done.
## Version Compatibility
| Package A | Compatible With | Notes |
|---|---|---|
| `vite@8.3.4` | Node `20.19+` or `22.12+` | Pin to Node 22 LTS for the Router v8 floor. |
| `react-router@8.4.0` | React `>=19.2.7`, React-DOM `>=19.2.7`, Node `>=22.22`, Vite `>=7` | This drives the entire stack's minimum versions. |
| `motion@14.0.0` | React `^18.0.0 \|\| ^19.0.0` | Compatible with the React 19 we're pinning. |
| `@tailwindcss/vite@4.3.3` | `vite@^5.2 \|\| ^6 \|\| ^7 \|\| ^8` | Explicitly supports Vite 8. |
| `tailwindcss@4.3.3` | No peer deps on React — just the Vite plugin | — |
| `@unhead/react@2.0.1` | React 18/19 | v3 is in beta/RC (released Sept–Oct 2026); stay on v2 stable for Phase 1. Upgrade when v3 goes GA. |
| `typescript@7.0.2` | Node 18+ | Native Rust compiler; drop-in replacement for TS 5.x semantics-wise. If any tool complains about TS 7 (unlikely), fall back to TS 5.8 — same semantics, slower builds. |
| `@shopify/storefront-api-client@2.0.1` | GraphQL `^16 \|\| ^17` | Phase 6 only. |
### Known Gotchas
- **`react-router` v8 is ESM-only.** If any tool in the build chain still CommonJS-requires it, the build will fail. All of the above packages (Vite 8, plugin-react 6, Vitest 5) are ESM-native, so this is not a risk — but it IS a risk if we add a stray older plugin.
- **TypeScript 7** is new (released 2026). If any VS Code extension or ts-node consumer breaks, downgrade that one tool, don't downgrade TS. Monitor for 2–3 weeks post-launch.
- **Motion `LazyMotion` + `m`** requires feature imports (`domAnimation` or `domMax`). If a dev imports `motion.div` from `motion/react` and ALSO uses `LazyMotion`, the bundle gets both runtimes. Pick one pattern per project — recommend `LazyMotion` + `m` component everywhere, imported via a wrapper (`src/lib/motion.ts`).
## Architecture Decisions That Protect the Phase 6 Migration
## Confidence Breakdown
| Area | Confidence | Reason |
|---|---|---|
| Core version numbers (React, Vite, Tailwind, Motion, React Router) | **HIGH** | All verified against npm registry on 2026-10-08/09 and Context7 docs. |
| React Router v8 adoption vs v7 | **HIGH** | Multiple sources (official release notes, InfoQ, Netlify changelog) confirm v8 is the default as of June 2026. |
| Motion rename & Tailwind v4 adoption | **HIGH** | Official docs confirm; npm `latest` tag is on the new names. |
| vite-imagetools over vite-plugin-image-optimizer | **HIGH** | Comes down to feature set (srcset vs no srcset); not a close call. |
| @unhead/react over react-helmet-async | **MEDIUM** | Both work. unhead is objectively smaller + more maintained but react-helmet-async's install base is larger. Either is a defensible choice. |
| Phase 6 hybrid-redirect architecture | **HIGH** | Explicitly locked in `PROJECT.md` and `capshot-commerce-rollout`. Shopify's own docs recommend `cart.checkoutUrl` redirect for this exact use case. |
| TypeScript 7 adoption | **MEDIUM** | TS 7 is production-ready but new (2026). If a toolchain quirk shows up, falling back to TS 5.8 is zero-risk and loses only build speed. |
| Skip PWA / service worker | **MEDIUM** | Opinionated call. Could be revisited post-launch if analytics show meaningful return visits. |
## Sources
- `/vitejs/vite` (Context7) — Vite 8 release notes, Node version floor, build target defaults
- `/websites/motion_dev` (Context7) — Motion install, React compatibility, framer-motion→motion upgrade guide
- `/tailwindlabs/tailwindcss.com` (Context7) — Tailwind v4 Vite plugin install, CSS-first config
- `/remix-run/react-router` (Context7) — React Router v8 modes (Declarative vs Framework vs Data), ESM-only migration
- npm registry (verified 2026-10-08/09) — exact `latest` versions for every package in this doc
- [React Router v8: A Deliberately Boring Release — InfoQ (June 2026)](https://www.infoq.com/news/2026/08/react-route-v8/) — v8 breaking changes, package consolidation
- [Framer Motion / Motion: React Animations Complete Guide (2026) — DEV](https://dev.to/stacknotice/framer-motion-motion-react-animations-complete-guide-2026-3e7l) — bundle size data, LazyMotion patterns
- [Comparing the best React animation libraries for 2026 — LogRocket](https://blog.logrocket.com/best-react-animation-libraries/) — Motion vs GSAP comparison
- [Shopify Storefront API — Cart object (shopify.dev)](https://shopify.dev/docs/api/storefront/latest/objects/Cart) — `cart.checkoutUrl` redirect pattern
- [Shopify Checkout Issues: Fixes for Indian Merchants (2026) — Razorpay](https://razorpay.com/blog/shopify-checkout-issues-india-fixes/) — Razorpay as Shopify payment method via official app
- [The Best SEO npm Package for React in 2026 — DEV](https://dev.to/mitudas/the-best-seo-npm-package-for-react-in-2026-tested-on-a-real-app-3bc6) — react-helmet-async vs unhead vs power-seo bundle sizes
- `.planning/PROJECT.md` — locked constraints: Hydrogen rejected, hybrid redirect, Vercel/Netlify static, Lighthouse 90+ mobile
- `.claude/skills/capshot-brand/SKILL.md` — centralized CTA pattern, palette tokens, mobile-first mandate
- `.claude/skills/capshot-commerce-rollout/SKILL.md` — Phase 6 swap procedure (two files change: `cta.ts` + `flavors.ts`)
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->
## Conventions

Conventions not yet established. Will populate as patterns emerge during development.
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->
## Architecture

Architecture not yet mapped. Follow existing patterns found in the codebase.
<!-- GSD:architecture-end -->

<!-- GSD:skills-start source:skills/ -->
## Project Skills

| Skill | Description | Path |
|-------|-------------|------|
| capshot-brand | Authoritative brand guide for the SHI-28 CAPSHOT D2C website — color palette, typography intent, logo usage, Hinglish copy policy, voice/tone, do's and don'ts, CTA conventions, mobile-first mandate. Load this skill whenever writing or reviewing CAPSHOT UI, copy, components, section layouts, marketing text, hero sections, or any user-facing content for this project. Trigger on any task touching src/, components, pages, sections, copy, headlines, CTAs, colors, theme tokens, or visual design for CAPSHOT. | `.claude/skills/capshot-brand/SKILL.md` |
| capshot-catalog | Authoritative source of truth for the SHI-28 CAPSHOT product catalog — all 16 flavors across 3 ranges (Fruity Blast, Desi & Cool, Premium Sports), per-flavor accent colors, bottle size variants, powder weights, and the canonical Shopify-shaped TypeScript data model used across the site. Load this skill when creating or editing flavor data, flavor cards, flavor grids, flavor pages, product variants, color-coded accents, or any component that renders CAPSHOT product information. Trigger on tasks mentioning flavors, catalog, variants, product cards, product data, Shopify migration, or flavor filtering. | `.claude/skills/capshot-catalog/SKILL.md` |
| capshot-commerce-rollout | Phase 6 playbook for turning the CAPSHOT marketing site into a live D2C store by integrating Shopify (storefront + checkout), Razorpay (payment gateway for India — UPI/cards/COD), and Shiprocket (multi-courier shipping aggregator with tracking). Covers account setup, Shopify theme vs headless decision, bundle SKU structure (Trial 5 / Fitness 15 + shaker / Bulk 30), trust-badge content, pricing math, CTA swap procedure from WhatsApp waitlist to Shopify checkout, and launch checklist. Load this skill ONLY when actively wiring commerce — Shopify account creation, Razorpay keys, Shiprocket integration, bundle pricing, FSSAI badges, 'Buy Now' CTA switch, or any live-store work. Do NOT load for general site development. | `.claude/skills/capshot-commerce-rollout/SKILL.md` |
| react-perf-optimizer | > React and animation performance optimization for Vite/React apps. Diagnose and fix jank, lag, re-render issues, and animation stuttering. Use when (1) animations are laggy or stuttering (Framer Motion, CSS, canvas), (2) components re-render excessively, (3) scroll performance is poor, (4) WebGL/Three.js/canvas frame drops, (5) bundle size or load time needs reduction, (6) user reports lag or jank in UI interactions, (7) card swap/carousel animations feel slow. Triggers on optimize, laggy, stuttering, jank, slow animation, performance, re-renders, frame drops. | `.claude/skills/react-perf-optimizer/SKILL.md` |
| skill-creator | Guide for creating effective skills. This skill should be used when users want to create a new skill (or update an existing skill) that extends Claude's capabilities with specialized knowledge, workflows, or tool integrations. | `.claude/skills/skill-creator/SKILL.md` |
<!-- GSD:skills-end -->

<!-- GSD:workflow-start source:GSD defaults -->
## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `/gsd-quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd-debug` for investigation and bug fixing
- `/gsd-execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->



<!-- GSD:profile-start -->
## Developer Profile

> Profile not yet configured. Run `/gsd-profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
