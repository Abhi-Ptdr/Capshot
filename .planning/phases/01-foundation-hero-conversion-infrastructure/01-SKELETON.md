# Walking Skeleton — SHI-28 CAPSHOT

**Phase:** 1
**Generated:** 2026-10-09

## Capability Proven End-to-End

A visitor landing on `/` from an Instagram ad on mobile sees the TWIST.SHAKE.BOOM Hero inside 100dvh, taps the TRY CAPSHOT button, and WhatsApp opens with the pre-filled waitlist message — on a theme-aware, FOUC-free SPA that also handles `/flavors`, `/about`, `/contact`, and a true-404 fallback as client-side routes, with a sticky in-app browser nudge for Instagram/Facebook WKWebView traffic, and a deduplicated Meta `Lead` event via Pixel + Conversions API.

## Architectural Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Framework | **Vite 8.3.4 + React 19.3.0 + TypeScript 7.0.2** | Locked by CLAUDE.md Tech Stack; TS 7 Rust-port compiler for faster typecheck; Vite 8 default `baseline-widely-available` target covers 95%+ Indian mobile |
| Routing | **React Router 8.4.0 Declarative mode** (`BrowserRouter`) | CLAUDE.md pin; declarative keeps the "deploy a `dist/` folder to Vercel" simplicity — framework mode would replace Vite's dev server |
| Styling | **Tailwind CSS 4.3.3 CSS-first (`@theme` in `src/index.css`) + `@tailwindcss/vite@4.3.3`** | v4 CSS-first; no JS config file; 10× faster than v3; `@theme` block holds brand palette tokens from UI-SPEC |
| Animation | **Motion 14.0.0** via `LazyMotion` + `m.*` wrapper at `src/lib/motion.ts` | CONV-05 locked; keeps entry Motion bundle under 10 KB gzip (full `motion.div` ships ~34 KB) |
| State | **No global store.** `ThemeContext` for theme, `useSearchParams` for future filter state, local `useState` for everything else | Research/ARCHITECTURE.md Pattern 3; this site has no business state. Zustand/Redux is premature architecture |
| Theme | **CSS variables under `@theme` + `.dark` class strategy driven by inline FOUC `<script>` in `index.html`** | CONV-04 locked; `useEffect`-based toggles cause cream-to-dark flash on cold-cache loads |
| Images | **`src/components/primitives/Image.tsx` wrapper** emitting plain `<img>` in Phase 1; upgrade path to `vite-imagetools` AVIF/WebP srcset in Phase 4 (PERF-02) | CONV-03 Hero LCP needs eager/high-priority preload hint; wrapper lets Phase 4 swap formats without touching sections |
| Analytics | **Meta Pixel (`fbq`) in `index.html` + `/api/track-lead` edge function** firing `Lead` with shared `event_id = crypto.randomUUID()` | CONV-01 locked; iOS WKWebView strips cookies, Pixel-only attribution is ~60% on iOS → CAPI dedup is correctness, not polish |
| In-app browser handling | **`src/lib/detectInAppBrowser.ts` + `<InAppBrowserBanner>` sticky-top** (session-dismissible) + Android `intent://` auto-forward | CONV-02 locked; 95% ad traffic lands in Instagram/Facebook WKWebView |
| CTA destination | **`src/config/cta.ts` as the single swap point** consumed by `<PrimaryCTA>` + CI grep (`wa.me` outside `cta.ts` fails) | INFRA-03, INFRA-06 locked; Phase 6 commerce is a 3-file edit, no component refactor |
| Flavors schema | **`src/data/flavors.ts` with Shopify-shaped type** (handle/title/description/images/range/accentHex/dosage + nullable `priceInr`/`shopifyProductId`/`available`) | INFRA-04 locked; Phase 1 scaffolds 16 stubs with handle+title+range+accentHex, Phase 6 fills commerce fields with zero schema change |
| Feature flags | **`src/config/features.ts`** with `ENABLE_BUNDLES: false`, `ENABLE_SHOPIFY_CTAS: false` | INFRA-05 locked; Phase 6 flips flags, un-gates `Bundles.tsx` |
| Deployment target | **Vercel static + Vercel Edge Functions** (`api/track-lead.ts`) | CAPI dedup needs edge runtime; Vercel named first in CONTEXT; India edge PoPs match 95% mobile traffic |
| Directory layout | **4-layer tree: `src/pages/` → `src/sections/` → `src/components/ui/` → `src/components/primitives/`** + pure-TS `src/data/`, `src/config/`, `src/lib/` | Research/ARCHITECTURE.md locked; Phase 6 migration surface = 3 files edited, 2 added, 1 un-gated |

## Stack Touched in Phase 1

- [x] Project scaffold — Vite 8 + React 19 + TS 7 + Tailwind 4.3 + Motion 14 + React Router 8 + ESLint 10 flat config + Prettier 3.9 + `prettier-plugin-tailwindcss`
- [x] Routing — 4 real routes (`/`, `/flavors`, `/about`, `/contact`) + true-404 fallback (`*`) via `BrowserRouter` + `vercel.json`/`_redirects` rule
- [x] Data — Phase 1 ships `src/data/flavors.ts` with all 16 flavor stubs typed against the Shopify-aligned schema (nullable commerce fields); no DB in Phase 1 by design
- [x] UI — Interactive `<PrimaryCTA>` wired to `src/config/cta.ts`, `<ThemeToggle>`, `<InAppBrowserBanner>` dismiss, hero image preload
- [x] API — `api/track-lead.ts` Vercel Edge Function receiving `{ event_id, event_source_url, user_data }` and POSTing to `https://graph.facebook.com/v21.0/<DATASET_ID>/events` with the server-side access token
- [x] Deployment — `npm run build && npm run preview` serves the SPA locally; `vercel deploy` publishes to a preview URL (documented in `README.md`)
- [x] CI guardrails — Two grep gates fail commits that (a) reference `wa.me` outside `src/config/cta.ts`, (b) reference the string `energy drink` anywhere in `src/` (INFRA-06)
- [x] Threat model — Phase 1 STRIDE register covers CAPI token leakage, WhatsApp open-redirect, FOUC-script XSS, CI secret handling

## Out of Scope (Deferred to Later Slices)

Explicit so no later phase re-litigates Phase 1's minimalism:

- **How It Works 3-step section** (HOW-01) — Phase 2
- **16-flavor grid + range filters** (FLAV-01, FLAV-02, FLAV-03) — Phase 2 (data stubs exist in Phase 1 but no `/flavors` grid; `/flavors` renders the coming-soon shell)
- **Cinematic Motion scroll choreography** (hero cap-twist parallax, section entrances, flavor-card stagger) — Phase 3 (LazyMotion wrapper is wired in Phase 1 but no scroll animations yet)
- **USP comparison, variants explainer, Premium Sports showcase, Lighthouse 90+ formal pass** (VAR-01, USP-01, SPORTS-01, PERF-01, PERF-02) — Phase 4 (Phase 1 target is Perf ≥80, A11y 100, BP ≥90, SEO ≥90 so Phase 4 pass is reachable)
- **Trust badge strip, FAQ, About content, Contact content, per-route OG tags via `@unhead/react`, `sitemap.xml`** (TRUST-01, TRUST-02, FAQ-01, ABOUT-01, CONTACT-01, UI-01 full audit, UI-02, UI-03 full audit, SEO-01, SEO-02) — Phase 5 (`<TrustBadge>` declaration is scaffolded in Phase 1 but not rendered; `index.html` has hard-coded home-page OG tags only)
- **Shopify + Razorpay + Shiprocket + Bundles.tsx + live checkout** (COM-01..04) — Phase 6 (gated by FSSAI/inventory/budget/nutrition deliverables)
- **Flavor detail pages (`/flavors/:handle`)** — explicitly never on marketing site; Shopify owns product URLs
- **Blog, newsletter popup, embedded cart, native app, SSR/Hydrogen** — Out of Scope v1 per REQUIREMENTS.md

## Subsequent Slice Plan

Each later phase adds one vertical slice on top of this skeleton without altering its architectural decisions:

- **Phase 2** — Visitor can scroll past Hero to a 3-step TWIST → SHAKE → BOOM section, then browse all 16 flavors on `/flavors` with range filters that survive share-link reloads
- **Phase 3** — Every section shipped in Phases 1–2 gains cinematic Motion scroll choreography (hero cap-twist, section entrances, flavor-card stagger) honoring `prefers-reduced-motion`
- **Phase 4** — Homepage carries full commercial argument (USP vs regular bottled drinks, variant/dosage explainer, Premium Sports "caffeinated beverages" showcase); hero image upgraded to AVIF/WebP/JPG srcset; Lighthouse mobile ≥90 verified
- **Phase 5** — Trust strip, FAQ accordion, About/Contact content, per-route OG tags, `sitemap.xml`, full WCAG AA palette audit, Hinglish copy audit
- **Phase 6** — Phase 1 architecture inherits unchanged: edit `src/config/cta.ts` + `src/data/flavors.ts` + `src/config/features.ts`, add `src/data/bundles.ts` + `public/og/bundles.jpg`, un-gate `src/sections/Bundles.tsx`
