# Project Research Summary

**Project:** SHI-28 CAPSHOT — India-first D2C beverage brand marketing site
**Domain:** Premium mobile-first React SPA (waitlist now) → Shopify-backed D2C commerce (Phase 6)
**Researched:** 2026-10-09
**Confidence:** HIGH

---

## Roadmap-Shaping Findings

These findings override or sharpen the current 6-phase sketch. Each one must be addressed in phase definitions before those phases are written.

### 1. "Energy drink" language is a 2026 FSSAI violation

FSSAI ordered Red Bull, Monster, and others to strip "energy drink" from labels by September 2026. The underlying regulatory position — that "energy drink" has no notified standard under India's Food Category System — is unchanged even after the Delhi HC procedural stay. Any CAPSHOT copy using "energy drink" in customer-facing surfaces (hero, ads, Premium Sports section) exposes the brand to Section 53 penalties up to ₹10 lakh per SKU.

**Roadmap action:** CI grep from Phase 1 blocks any use: `grep -rniE "energy drink" src/ && exit 1`. Premium Sports flavors must be described as "caffeinated beverages" — never "energy drinks." Mandatory caffeine warning on all caffeinated flavor cards.

### 2. Phase 6 commerce fee stack is understated by 50%+

The current `capshot-commerce-rollout` skill cites "₹1,994/mo Shopify + 2% Razorpay." Real blended variable cost:

| Payment method | True blended cost |
|---|---|
| Prepaid UPI (order ≤ ₹2,000) | ~4.5% (0% MDR + 2% Shopify surcharge + 18% GST on gateway fee) |
| Prepaid UPI (order > ₹2,000) | ~4.8–5% (0.4% Razorpay MDR from Oct 15 2026 + 2% Shopify + GST) |
| Prepaid card | ~4.5–5% |
| COD (if enabled) | 7–10% before RTO shrinkage |

Critical detail: Razorpay charges 0.4% MDR (capped ₹300) on UPI payments above ₹2,000 effective October 15 2026. The Fitness Pack is currently specced at ₹2,000 — pricing it at ₹1,999 avoids the MDR entirely.

**Roadmap action:** Build per-order margin model before pricing bundles. Phase 6 planning must include a margin checkpoint before Shopify goes live.

### 3. COD must be disabled at launch — enable only after order #500

The `capshot-commerce-rollout` skill lists COD as "optional but recommended." Research contradicts this. India D2C 2026 COD RTO averages 25–30%, and on a ₹500 trial pack each RTO costs ₹180–₹415 all-in. Launching prepaid-only for 30–60 days is the single biggest Phase 6 margin lever.

**Roadmap action:** Phase 6 entry definition must state: COD disabled at launch. Enable after order #500 with OTP verification + ₹1,500 max order value cap + pincode gate. "Save ₹49 — Pay Online" prepaid incentive at checkout.

### 4. Meta Pixel + Conversions API must be in Phase 1, not Phase 6

Pixel-only attribution is ~60% accurate on iOS in 2026 (WKWebView strips cookies). Installing only at Phase 6 launch loses 2–3 months of retargeting and lookalike audience data built during the waitlist phase. The waitlist `Lead` event fired on WhatsApp CTA click is the only Phase 1 conversion signal, and it must be deduplicated between Pixel and CAPI.

**Roadmap action:** Phase 1 must include: (a) Meta Pixel snippet in `index.html`, (b) Vercel/Netlify edge function to fire `Lead` via server-side CAPI on waitlist CTA click, (c) shared `event_id` between Pixel and CAPI.

### 5. Instagram WKWebView detect-and-nudge banner is a Phase 1 scaffold

95% of CAPSHOT's traffic comes from Instagram/Facebook ads. Inside Instagram's iOS WKWebView: conversion drops 40%+, analytics captures only ~10% of ad clicks, Razorpay UPI Intent fails silently, autofill is broken. The banner must be present from the first paid campaign.

**Roadmap action:** Phase 1 must include `src/lib/detectInAppBrowser.ts` + a sticky "Open in Safari for best experience" banner inside the Instagram webview. Android can force-open Chrome via `intent://`; iOS requires the nudge only.

### 6. Stack install names have shifted — scaffold commands will fail with old names

| Spec says | Install instead | Why |
|---|---|---|
| `framer-motion` | `motion@14` | Renamed; old package is maintenance-only |
| `react-router-dom` | `react-router@8` | `react-router-dom` removed in v8 (June 2026) |
| Tailwind config with `tailwind.config.js` | `tailwindcss@4.3` + CSS-first `@theme` | v4 has no JS config file |

**Roadmap action:** Phase 0 scaffold must use corrected names. Boilerplate using old names produces a broken starting point.

### 7. Phase 6 is confirmed as near-zero refactor — component tree is frozen from Phase 1

Architecture research confirms Phase 6 touches exactly: 3 files edited (`cta.ts`, `flavors.ts`, `features.ts`) + 2 files added (`bundles.ts`, `public/og/bundles.jpg`) + 1 section rendered for the first time (`Bundles.tsx`). This guarantee collapses if Phase 1–5 introduce hard-coded `wa.me` URLs, a non-Shopify-shaped flavor data model, or a cart widget.

**Roadmap action:** Phase 1 must establish `src/config/cta.ts` and `<PrimaryCTA>` before any section is built. CI must grep for `wa.me` outside `cta.ts`.

### 8. FSSAI license is on the Phase 6 critical path

FSSAI license blocks: (a) Razorpay food-category KYC, (b) the `<TrustBadge>` `evidenceUrl` contract in production, (c) the "FSSAI Licensed" badge on PDPs. The component must require `evidenceUrl` and refuse to render in `import.meta.env.PROD` without it. "FSSAI Approved" is incorrect — the legal text is "FSSAI Licensed – [14-digit number]."

**Roadmap action:** Flag FSSAI license as a client deliverable in the Phase 6 entry checklist. Add `data-pending-fssai` attribute so a lint rule blocks production builds until the real number is supplied.

### 9. Trust badge component must enforce evidence at build time

FSSAI served notices to 20+ clean-label D2C brands in 2026 (The Whole Truth, Neuherbs, Raw Pressery) for unsubstantiated claims. Penalties reach ₹10 lakh per SKU. "Vegan" requires FSSAI's official green "V + sprout" logo — not a generic "V." "Non-GMO" requires a NABL lab test.

**Roadmap action:** `<TrustBadge>` requires `evidenceUrl` prop and blocks production render without it. Label text: "FSSAI Licensed" (not "Approved"), "Plant-based ingredients" (not "Vegan") until official approval arrives.

### 10. Mobile performance non-negotiables belong in Phase 1

Four items that sound like polish are conversion blockers if deferred:

| Item | Why it is Phase 1, not Phase 5 |
|---|---|
| `LazyMotion` + `m.*` wrapper | `motion.div` adds 34 KB gzip to the entry chunk; ships on every ad visitor's first hero load |
| `100dvh` / `dvh` fallback | `100vh` crops the primary CTA on every iPhone with dynamic Safari toolbar — hides the conversion button on first paint |
| Inline blocking head script for dark-mode FOUC | Every cold-cache ad visitor sees a cream flash before dark theme loads; destroys the premium hero moment |
| `vite-imagetools` responsive `srcset` | Unprocessed hero image at 2 MB kills LCP on Jio 4G before the hero animates |

**Roadmap action:** Phase 1 story list must include all four. `LazyMotion` provider and ESLint rule (`no motion.div`) are Phase 1 bootstrap steps.

---

## Executive Summary

CAPSHOT is a pre-launch India D2C beverage brand building a premium mobile-first marketing site that must convert Instagram/Facebook ad traffic into WhatsApp waitlist signups now, then seamlessly flip to Shopify-backed commerce when inventory ships. The entire architecture is designed around one property: Phase 6 must be a near-zero refactor. Research confirms this is achievable — exactly 3 files edited + 2 added + 1 section un-gated — but only if Phase 1 builds the correct scaffold: centralized CTA config, Shopify-shaped flavor data model, `<TrustBadge>` evidence contract, `LazyMotion` setup, `dvh` hero height, inline dark-mode FOUC script, and Meta Pixel + Conversions API.

The stack is React 19 + TypeScript 7 + Vite 8 + Tailwind 4.3 + Motion 14 + React Router 8 — all of which have shifted names since the original spec was written and must be installed under their current identifiers. The architecture is a strict 4-layer component tree (Pages → Sections → UI → Primitives) over a pure-TS data layer. No global store is needed; the site never fetches data at runtime, which is what makes Lighthouse 90+ achievable on Jio 4G.

The highest-risk area is the India-specific commerce stack at Phase 6: Shopify Payments does not exist in India (Razorpay mandatory, adds 2% Shopify surcharge on top of gateway fees), FSSAI license is a hard Razorpay KYC blocker, COD RTO averages 30% and must be disabled at launch, and the October 15 2026 Razorpay UPI MDR change makes the current Fitness Pack price (₹2,000) costlier than planned.

---

## Key Findings

### Recommended Stack

The locked spec is correct. Three package names have migrated and must be adopted in current form.

**Core:**
- `react@19.3.0` — required by React Router v8 peer dep; built-in metadata hoisting
- `vite@8.3.4` + `@vitejs/plugin-react@6.1.2` — rolldown + Oxc
- `tailwindcss@4.3.3` + `@tailwindcss/vite@4.3.3` — CSS-first; no JS config
- `motion@14.0.0` (not `framer-motion`) — 4.6 KB with LazyMotion vs 34 KB with full
- `react-router@8.4.0` (not `react-router-dom`) — Declarative mode only
- `typescript@7.0.2` — Rust-port compiler
- `vite-imagetools@12.0.1` — build-time AVIF/WebP/JPG `srcset`
- `@unhead/react@2.0.1` — replaces react-helmet-async (React 19 compatible)

Do NOT install `@shopify/storefront-api-client` until Phase 6.

### Expected Features

**Must have — Phase 1:** Hero (Hinglish + cap-on-bottle visual + single WhatsApp CTA), "How It Works" 3-step, 16 flavors + range filters, variant/dosage explainer, trust badge strip with `evidenceUrl` contract, FAQ accordion, About page, Contact page, centralized `src/config/cta.ts`, Lighthouse ≥90, light/dark mode WCAG AA, OG tags + sitemap.xml, Meta Pixel + Conversions API

**Should have — Phase 2–5:** Cinematic Motion scroll storytelling, per-flavor accent-color system, USP comparison grid (labeled "caffeinated beverages"), Premium Sports showcase, Instagram WKWebView detect-and-nudge banner, floating WhatsApp button

**Defer to Phase 6:** 3 bundle SKUs, Shopify + Razorpay + Shiprocket, pincode serviceability check, visual UGC reviews, Instagram Shopping catalog sync, sticky "Buy Now" bar

**Defer to v2+:** Flavor-finder quiz, WhatsApp cart-recovery via BSP, loyalty/referral, subscription

**Anti-features (never build):** Newsletter popup on page load, embedded cart on marketing site, "energy drink" positioning, COD at Phase 6 launch

### Architecture Approach

4-layer component tree: Pages (route composition) → Sections (full-width slabs) → UI (brand-aware: `<PrimaryCTA>`, `<FlavorCard>`, `<TrustBadge>`) → Primitives (unopinionated atoms). Below that: pure-TS data layer (`src/data/flavors.ts`, Shopify-shaped from Phase 1) and config layer (`src/config/cta.ts`, `features.ts`) — the only files Phase 6 touches.

**Major components:**
1. `src/config/cta.ts` — single CTA destination; Phase 1 WhatsApp, Phase 6 Shopify
2. `src/data/flavors.ts` — 16 flavors typed TS, Shopify-shaped
3. `src/config/features.ts` — boolean flags (`ENABLE_BUNDLES`, `ENABLE_SHOPIFY_CTAS`)
4. `src/sections/*` — homepage slabs, each self-contained
5. `src/components/ui/TrustBadge.tsx` — requires `evidenceUrl`
6. `src/components/primitives/Image.tsx` — single wrapper for CDN swap

Phase 6 migration surface area: 3 files edited + 2 added + 1 section un-gated.

### Critical Pitfalls

1. **"Energy drink" language triggers FSSAI enforcement** — CI grep blocks use from Phase 1
2. **Instagram WKWebView kills 40%+ of conversion silently** — in-app browser detect banner Phase 1; CAPI dedup mandatory
3. **iOS Safari `100vh` hides the primary CTA on first paint** — use `100dvh` with `vh` fallback
4. **Dark mode FOUC degrades the hero impression** — inline blocking `<script>` in `<head>`
5. **COD at launch wipes Phase 6 margin** — prepaid-only for first 30–60 days
6. **Phase 6 fee stack understated** — real blended prepaid 4.5–5%; price Fitness Pack at ₹1,999
7. **Trust badge over-claims trigger ₹10 lakh penalties** — require `evidenceUrl`, "FSSAI Licensed" not "Approved"
8. **Framer Motion full bundle (34 KB) in entry chunk** — `LazyMotion` + `m.*` only

---

## Implications for Roadmap

The 6-phase sketch is structurally sound. Research adds: constraint additions to Phase 1 (mobile perf, Pixel+CAPI, in-app browser), language enforcement across Phases 1–4 (energy drink CI grep), a client deliverable gate before Phase 6 planning begins, and a COD/pricing correction to Phase 6.

### Phase 1: Foundation + Hero + Conversion Infrastructure

**Rationale:** Hero cannot be built correctly without its supporting infrastructure. `cta.ts`, `PrimaryCTA`, `LazyMotion` provider, `dvh` hero height, inline FOUC script, in-app browser detection, and Meta Pixel + CAPI are correctness conditions for the first component written.

**Delivers:** Nav, Hero, Footer; all primitives; `ThemeProvider`; `src/config/cta.ts`; `<PrimaryCTA>`; `<TrustBadge>` component contract; `LazyMotion` + `MotionProvider`; dark-mode FOUC inline script; `dvh` Tailwind utility; in-app browser detect banner; Meta Pixel snippet + CAPI edge function; `src/data/flavors.ts` stub (Shopify-shaped)

**Must avoid:** iOS `dvh` omission; `useEffect`-based dark mode (FOUC); `motion.div` (full bundle in entry); hard-coded `wa.me` in any component

### Phase 2: How It Works + Flavor Catalog + Range Filter

**Rationale:** "How It Works" is the second most important section. Flavor catalog is the brand's breadth story.

**Delivers:** `HowItWorks.tsx`; `FlavorsPage.tsx` with 16 flavors + range filters; `FlavorCard.tsx`; `RangeFilter.tsx`; `src/data/flavors.ts` fully populated with accent hex + dosage; `src/data/ranges.ts`

### Phase 3: Scroll Storytelling + Section Polish

**Rationale:** Cinematic animations are the reason a custom React site exists. Layer them on complete content, not in parallel.

**Delivers:** Full Motion scroll choreography across all existing sections (parallax hero cap-twist, section entrances, stagger on flavor cards); `prefers-reduced-motion` fallbacks; Hinglish copy review pass

### Phase 4: USP + Variants + Premium Sports + Lighthouse Perf Pass

**Rationale:** These three sections complete the homepage's commercial argument. Lighthouse perf pass must happen before any paid campaign scales.

**Delivers:** `USPComparison.tsx` (caffeinated beverage framing); `Variants.tsx`; `PremiumSports.tsx` with caffeine warning; hero image AVIF/WebP/JPG srcset via `vite-imagetools`; Lighthouse 90+ mobile verified

### Phase 5: Trust + FAQ + About + Contact + SEO + Legal Scaffold

**Rationale:** Trust signals, legal pages, and SEO metadata must be complete before any serious paid ad spend. Also includes the copy audit.

**Delivers:** `TrustSafety.tsx` (real `evidenceUrl` where available, `data-pending-fssai` placeholder); `FAQ.tsx` with Radix accordion; `AboutPage.tsx`; `ContactPage.tsx`; OG images per route 1200×630; `vite-plugin-sitemap`; `@unhead/react` per-route metadata; DPDP-compliant privacy policy; full Hinglish + energy-drink copy audit

### Phase 6: Commerce (Shopify + Razorpay + Shiprocket)

**Entry gate (all required before Phase 6 planning starts):**
- FSSAI 14-digit license number delivered by client
- Inventory warehoused with verified pickup address
- Shopify Basic budget approved (~₹2,000/mo)
- Per-order margin model completed with real fee stack
- Bundle pricing finalized: Fitness Pack at ₹1,999 (not ₹2,000)

**Delivers:** Shopify Basic at `shop.capshot.co`, 16 flavor products + 3 bundle products, Razorpay live keys (international cards disabled, UPI Intent over Collect), Shiprocket connected, legal pages, GST invoice app, tax-inclusive pricing, COD disabled (prepaid-only launch), `cta.ts` swapped, `flavors.ts` populated, `features.ts` flipped, `Bundles.tsx` rendered

### Research Flags

**Needs deeper research during Phase planning:**
- **Phase 6:** GST HSN code (2106 vs 2202); Razorpay food-category KYC document checklist; logistics provider comparison for the format; cash flow modeling for COD remittance D+8

**Standard patterns (skip additional research):**
- Phases 1–5: React + Vite + Tailwind + Motion stack is fully verified in this cycle

---

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Versions verified via npm registry 2026-10-08/09 |
| Features | HIGH (patterns) / MEDIUM (specific conversion %) | India D2C patterns well-researched |
| Architecture | HIGH | Component boundaries standard; Phase 6 migration deterministic |
| Pitfalls | HIGH (regulatory, Shopify India, in-app browser) / MEDIUM (RTO rates) | FSSAI regulatory posture verified against 2026 enforcement |

**Overall confidence:** HIGH

### Gaps

- **FSSAI license timeline** — client dependency
- **Nutrition data for 16 flavors** — client dependency; stub nullable in Phase 1
- **Founder photo + bio** — content dependency for Phase 5
- **Product shots for 8 remaining flavors** — placeholders OK through Phase 2
- **HSN code classification** — needs CA input before Phase 6
- **Hinglish copy user review** — 2–3 representative users before Phase 5 ships

---

## Suggested phases: 6

1. **Phase 1: Foundation + Hero + Conversion Infrastructure** — Hero + all scaffolding (CTA, LazyMotion, dvh, FOUC, Pixel+CAPI, in-app browser)
2. **Phase 2: How It Works + Flavor Catalog** — Product understanding + brand breadth
3. **Phase 3: Scroll Storytelling Polish** — Cinematic animations on complete content
4. **Phase 4: USP + Variants + Premium Sports + Lighthouse Perf Pass** — Complete commercial argument + perf baseline
5. **Phase 5: Trust + FAQ + About + Contact + SEO + Legal Scaffold** — All trust/legal/SEO before Phase 6 KYC
6. **Phase 6: Commerce (Shopify + Razorpay + Shiprocket)** — Gated on FSSAI license + inventory + budget

---

*Research completed: 2026-10-09*
*Ready for roadmap: yes*
