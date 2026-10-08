# Roadmap: SHI-28 CAPSHOT

## Overview

CAPSHOT is a pre-launch India D2C beverage brand. v1 ships a premium, mobile-first React marketing site that converts Instagram/Facebook ad traffic into WhatsApp waitlist signups — and later, when FSSAI license + inventory + Shopify budget are in hand, flips into a live D2C commerce site in a near-zero-refactor swap. The architecture is deliberately shaped so Phase 6 edits exactly 3 files, adds 2 files, and un-gates 1 section. Phases 1–5 build toward that invariant: Phase 1 scaffolds the entire conversion stack (CTA config, LazyMotion, dvh hero, FOUC-free theme, Pixel+CAPI, in-app browser nudge, Shopify-shaped flavor data) and ships a working Hero + waitlist CTA — a deployable vertical slice from day one. Phases 2–5 add flavor browsing, cinematic motion, the commercial argument (USP/variants/sports), and trust/SEO/legal. Phase 6 is a gated commerce slice.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Foundation + Hero + Conversion Infrastructure** — Deployable Hero + waitlist CTA on top of the full conversion scaffold (CTA config, LazyMotion, dvh, FOUC, Pixel+CAPI, in-app browser nudge, Shopify-shaped flavor stub)
- [ ] **Phase 2: How It Works + Flavor Catalog** — 3-step product explainer plus 16-flavor browsing with range filters live on `/` and `/flavors`
- [ ] **Phase 3: Scroll Storytelling Polish** — Cinematic Motion choreography layered across every shipped section, with `prefers-reduced-motion` honored throughout
- [ ] **Phase 4: USP + Variants + Premium Sports + Lighthouse Perf Pass** — Full homepage commercial argument plus verified Lighthouse mobile ≥90 before paid-ad scale
- [ ] **Phase 5: Trust + FAQ + About + Contact + SEO + Accessibility** — All trust/legal/SEO/a11y content complete and audited before Phase 6 KYC
- [ ] **Phase 6: Commerce (Shopify + Razorpay + Shiprocket)** — Live D2C store at `shop.capshot.co`, CTAs flipped from WhatsApp to Shopify checkout

## Phase Details

### Phase 1: Foundation + Hero + Conversion Infrastructure
**Mode:** mvp
**Goal**: Visitor landing on `/` from an Instagram ad on mobile sees a correct, premium Hero in under 2 seconds, understands TWIST.SHAKE.BOOM in under 5, taps one CTA that opens WhatsApp with a pre-filled waitlist message, and fires a deduplicated Meta `Lead` event via Pixel + Conversions API — all on top of a frozen architecture that will survive untouched into Phase 6.
**Depends on**: Nothing (first phase)
**Requirements**: INFRA-01, INFRA-02, INFRA-03, INFRA-04, INFRA-05, INFRA-06, CONV-01, CONV-02, CONV-03, CONV-04, CONV-05, HERO-01, HERO-02
**Success Criteria** (what must be TRUE):
  1. Developer can clone the repo and run `npm install && npm run dev` on the current package names (React 19 / Vite 8 / Tailwind 4.3 / Motion 14 / React Router 8 / TypeScript 7); build succeeds and `/`, `/flavors`, `/about`, `/contact` resolve as client-side routes with a 404 fallback.
  2. Visitor on a 360×640 iPhone viewport sees the Hero fill `100dvh` (CTA button visible above the Safari toolbar on first paint), reads the Hinglish TWIST.SHAKE.BOOM headline, and understands the concept within 5 seconds; the primary CTA button is ≥56 px tall and opens WhatsApp with a pre-filled waitlist message.
  3. Clicking the primary CTA fires a Meta `Lead` event via Pixel (client-side) AND Conversions API (server-side edge function) with a shared `event_id`, verifiable in Meta Events Manager as a single deduplicated event.
  4. Visitor arriving inside the Instagram or Facebook in-app WKWebView sees a sticky, dismissible banner recommending Safari (iOS) or auto-forwarding to Chrome via `intent://` (Android); dark-mode preference is applied before React mounts (no cream-to-dark FOUC on cold-cache loads).
  5. Developer can change the primary CTA destination for the entire site by editing `src/config/cta.ts` only; CI blocks any commit that introduces `wa.me` outside `cta.ts` or the string "energy drink" anywhere in `src/`; `src/data/flavors.ts` compiles with the Shopify-aligned schema (even with Phase 6 fields null).
**Plans**: TBD
**UI hint**: yes

### Phase 2: How It Works + Flavor Catalog
**Mode:** mvp
**Goal**: Visitor who gets past the Hero can learn how CAPSHOT works in three visual steps and browse all 16 flavors — on the homepage teaser and on a dedicated `/flavors` page — with range filtering that survives share-link reloads.
**Depends on**: Phase 1
**Requirements**: HOW-01, FLAV-01, FLAV-02, FLAV-03
**Success Criteria** (what must be TRUE):
  1. Visitor sees a 3-step TWIST → SHAKE → BOOM section on `/` with scroll-triggered animated illustrations; users with `prefers-reduced-motion: reduce` see static graphics instead of motion.
  2. Visitor can browse all 16 flavors on `/flavors`, each rendered as a color-washed card using its per-flavor `accentHex` from `src/data/flavors.ts` (fully populated with handle/title/description/range/dosage).
  3. Visitor can filter the flavor grid by range (All / Fruity Blast / Desi & Cool / Premium Sports), filter state is reflected in the URL (`?range=…`), and reloading or sharing the URL restores the filtered view.
  4. Visitor on `/` sees a flavor teaser section previewing 6–8 flavors with a visible link to the full `/flavors` page.
**Plans**: TBD
**UI hint**: yes

### Phase 3: Scroll Storytelling Polish
**Mode:** mvp
**Goal**: Every section shipped in Phases 1–2 gains the cinematic Motion scroll choreography that is the whole reason this is a custom React site rather than a Shopify theme — without breaking the LazyMotion bundle budget or the `prefers-reduced-motion` contract.
**Depends on**: Phase 2
**Requirements**: (none — cross-cutting polish layered over Phase 1–2 output; motion fidelity is observable but no v1 REQ-ID directly owns it)
**Success Criteria** (what must be TRUE):
  1. Hero cap-twist, section entrances, and the flavor-card stagger all animate on scroll using Motion's `useScroll` / `whileInView`; animations are limited to `transform` and `opacity` so first paint and scroll remain smooth on a mid-tier Android on 4G.
  2. All motion routes through `LazyMotion` + `m.*` primitives (no `motion.div`); the entry bundle Motion footprint stays under 10 KB gzip (verified via build report).
  3. Visitors with `prefers-reduced-motion: reduce` see static fallbacks across every section — including Hero cap-twist and flavor-card stagger — with no layout shift relative to the animated path.
  4. A manual pass across Hero, How It Works, Flavor Teaser, and `/flavors` on an iPhone and an Android device shows no jank, no CLS, and no bundle regression vs. the Phase 2 baseline.
**Plans**: TBD
**UI hint**: yes

### Phase 4: USP + Variants + Premium Sports + Lighthouse Perf Pass
**Mode:** mvp
**Goal**: The homepage carries a complete commercial argument — why CAPSHOT beats regular bottled drinks, how to dose per bottle size, and a dedicated Premium Sports showcase framed as "caffeinated beverages" — and the whole site clears Lighthouse mobile ≥90 before any paid campaign scales.
**Depends on**: Phase 3
**Requirements**: VAR-01, USP-01, SPORTS-01, PERF-01, PERF-02
**Success Criteria** (what must be TRUE):
  1. Visitor on `/` sees a scannable USP comparison between CAPSHOT and regular bottled drinks across freshness, nutrient value, and portability (grid or table), and reads variant/dosage guidance for 200–250 ml (3–4 g, "Light & Refreshing") and 350–500 ml (7–8 g, "Strong & Punchy").
  2. Visitor sees a dedicated Premium Sports range showcase featuring Matcha / Black Pump / Java Pump / Coffee, labeled "caffeinated beverages" (never "energy drinks") and carrying a visible mandatory caffeine advisory.
  3. Hero and above-the-fold images are served as responsive `<picture>` with AVIF/WebP/JPG srcsets generated at build time via `vite-imagetools`.
  4. Lighthouse mobile audit on a mid-tier device + 4G throttle reports ≥90 for Performance, Accessibility, Best Practices, and SEO on `/` and `/flavors`; the report is committed to `.planning/evidence/`.
**Plans**: TBD
**UI hint**: yes

### Phase 5: Trust + FAQ + About + Contact + SEO + Accessibility
**Mode:** mvp
**Goal**: The site carries every trust signal, legal page, SEO artifact, and accessibility contract required before paid-ad spend scales and before Phase 6 KYC begins — including a full Hinglish + regulator-correct copy audit.
**Depends on**: Phase 4
**Requirements**: TRUST-01, TRUST-02, FAQ-01, ABOUT-01, CONTACT-01, UI-01, UI-02, UI-03, SEO-01, SEO-02
**Success Criteria** (what must be TRUE):
  1. Visitor sees a trust badge strip near the footer rendered only via `<TrustBadge>` components that require an `evidenceUrl` prop (component refuses to render in `import.meta.env.PROD` without it); badge text uses regulator-correct phrasing — "FSSAI Licensed – [14-digit number]" (never "Approved"), "Plant-based ingredients" (never "Vegan" without official FSSAI vegan-logo approval), "Made in India", "Secure Checkout".
  2. Visitor can expand and collapse 6–8 FAQs built on Radix UI accordion primitives (top 1–2 questions open by default), read the founder story on `/about` (placeholder photo acceptable), and reach the brand on `/contact` via WhatsApp Business, Instagram (@capshot_twist), and email (shi28.capshot@gmail.com).
  3. Visitor can toggle between light and dark mode; both modes pass WCAG AA contrast (≥4.5:1 body text) across the full palette (`#594545` / `#815B5B` / `#9E7676` / `#FFF8EA`), every interactive element exposes a visible focus state and is reachable via keyboard-only navigation, and all headlines/micro-copy use Hinglish while body copy remains English per the `capshot-brand` skill.
  4. Each of `/`, `/flavors`, `/about`, `/contact` exposes a unique `<title>`, `<meta description>`, and Open Graph tag set (image 1200×630, title, description, URL) via `@unhead/react`; hero OG tags are additionally hard-coded in `index.html` for non-JS crawlers.
  5. The build emits a valid `sitemap.xml` via `vite-plugin-sitemap` listing all four routes; `robots.txt` references the sitemap.
**Plans**: TBD
**UI hint**: yes

### Phase 6: Commerce (Shopify + Razorpay + Shiprocket)
**Mode:** mvp
**Entry Gates (ALL required before Phase 6 planning starts):**
  - **GATE-FSSAI**: Client delivers 14-digit FSSAI license number (blocks Razorpay food-category KYC + `<TrustBadge>` production render + legal "FSSAI Licensed" phrasing)
  - **GATE-INVENTORY**: Client confirms inventory warehoused with verified Shiprocket pickup address
  - **GATE-BUDGET**: Client approves ~₹2,000/mo Shopify Basic recurring budget
  - **GATE-NUTRITION**: Client delivers nutrition facts + caffeine content per flavor (required for PDP labeling + caffeine advisory on Premium Sports flavors; also unblocks the Phase 5 Trust section's permanent production state)

**Goal**: Visitor who taps "Shop Now" on the marketing site reaches a live Shopify-hosted checkout at `shop.capshot.co`, pays via UPI Intent / cards / net-banking (international cards + COD disabled at launch), and the order flows automatically into Shiprocket for courier assignment and tracking — all delivered as a near-zero-refactor swap of the Phase 1 architecture (3 files edited, 2 added, 1 section un-gated).
**Depends on**: Phase 5 + all four entry gates
**Requirements**: COM-01, COM-02, COM-03, COM-04 (plus GATE-FSSAI, GATE-INVENTORY, GATE-BUDGET, GATE-NUTRITION as external gates)
**Success Criteria** (what must be TRUE):
  1. Visitor can purchase Trial Pack (5-cap), Fitness Pack (15-cap + Smart Shaker Bottle, "Most Popular"), or Bulk Pack (30-cap) via Shopify-hosted checkout at `shop.capshot.co`, redirected from the marketing site's "Shop Now" CTA; Fitness Pack is priced at ₹1,999 (not ₹2,000) to stay under the Razorpay ≥₹2,000 UPI MDR threshold effective Oct 15 2026.
  2. Checkout accepts UPI Intent, cards, and net-banking via Razorpay with international cards disabled and COD disabled at launch (prepaid-only for the first 500 orders); a real UPI test transaction completes end-to-end on a real phone.
  3. Each paid order flows automatically from Shopify to Shiprocket for courier selection and label printing; the customer receives a tracking email with a working courier tracking link.
  4. Marketing site changes are limited to the enumerated Phase 6 migration surface: edits to `src/config/cta.ts` (primary + nav + bundles destinations), `src/data/flavors.ts` (populated `shopifyProductId` / `priceInr` / `available` for all 16 flavors), and `src/config/features.ts` (`ENABLE_BUNDLES: true`, `ENABLE_SHOPIFY_CTAS: true`); plus one new `src/data/bundles.ts`, one new `public/og/bundles.jpg`, and `src/sections/Bundles.tsx` rendering for the first time — no component refactor, no new runtime library in the marketing site bundle.
  5. The TrustBadge FSSAI badge renders with the real 14-digit license number (not `data-pending-fssai`) and Premium Sports flavor cards carry the required caffeine advisory sourced from client-delivered nutrition data.
**Plans**: TBD
**UI hint**: partial

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5 → 6

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation + Hero + Conversion Infrastructure | 0/TBD | Not started | - |
| 2. How It Works + Flavor Catalog | 0/TBD | Not started | - |
| 3. Scroll Storytelling Polish | 0/TBD | Not started | - |
| 4. USP + Variants + Premium Sports + Lighthouse Perf Pass | 0/TBD | Not started | - |
| 5. Trust + FAQ + About + Contact + SEO + Accessibility | 0/TBD | Not started | - |
| 6. Commerce (Shopify + Razorpay + Shiprocket) | 0/TBD | Gated | - |
