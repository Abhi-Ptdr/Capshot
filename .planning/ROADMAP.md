# Roadmap: SHI-28 CAPSHOT

## Overview

CAPSHOT is a pre-launch India D2C beverage brand. v1 ships a premium, mobile-first React marketing site that converts Instagram/Facebook ad traffic into WhatsApp waitlist signups — and later, when FSSAI license + inventory + Shopify budget are in hand, flips into a live D2C commerce site in a near-zero-refactor swap. The architecture is deliberately shaped so Phase 6 edits exactly 3 files, adds 2 files, and un-gates 1 section. Phases 1–5 build toward that invariant: Phase 1 scaffolds the entire conversion stack (CTA config, LazyMotion, dvh hero, FOUC-free theme, Pixel+CAPI, in-app browser nudge, Shopify-shaped flavor data) and ships a working Hero + waitlist CTA — a deployable vertical slice from day one. Phases 2–5 add flavor browsing, cinematic motion, the commercial argument (USP/variants/sports), and trust/SEO/legal. Phase 6 is a gated commerce slice.

## Phases

**Phase Numbering:**

- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Foundation + Hero + Conversion Infrastructure** — Deployable Hero + waitlist CTA on top of the full conversion scaffold (CTA config, LazyMotion, dvh, FOUC, Pixel+CAPI, in-app browser nudge, Shopify-shaped flavor stub)
- [x] **Phase 2: How It Works + Flavor Catalog** — 3-step product explainer plus 16-flavor browsing with range filters live on `/` and `/flavors` (completed 2026-10-09)
- [x] **Phase 3: Scroll Storytelling Polish** — Cinematic Motion choreography layered across every shipped section, with `prefers-reduced-motion` honored throughout (completed 2026-10-10)
- [x] **Phase 3.1 (INSERTED 2026-10-10): Content & Conversion — USP + Bundles + Trust** — Three conversion-critical marketing sections pulled forward from Phase 4/5/6: USP comparison grid (Regular Energy Drinks vs CAPSHOT), pricing bundle preview cards (Trial 5 / Fitness 15 + shaker / Bulk 30 — waitlist CTAs; actual purchase stays Phase 6), and trust badge strip (FSSAI/Plant-based/Made in India/Secure Checkout) (completed 2026-10-10)
- [ ] **Phase 4: Variants + Premium Sports + Lighthouse Perf Pass** — Dosage variants (3–4 g / 7–8 g per bottle size), Premium Sports range showcase, Lighthouse mobile ≥90 verification (USP moved to Phase 3.1)
- [ ] **Phase 5: FAQ + About + Contact + SEO + Accessibility** — FAQ accordion, founder story, contact routes, per-route SEO + OG, WCAG AA audit (Trust Badges moved to Phase 3.1)
- [ ] **Phase 6: Commerce (Shopify + Razorpay + Shiprocket)** — Live D2C store at `shop.capshot.co`, CTAs flipped from WhatsApp to Shopify checkout; Bundles section already shipped in 3.1 — Phase 6 just wires Shopify product handles + un-hides "Buy now" CTAs

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

**Plans:** 3 plans
Plans:
**Wave 1**

- [ ] 01-01-PLAN.md — Walking Skeleton: Vite+React 19+TS 7+Tailwind 4.3+Router 8+Motion 14 scaffold, 4 routes + true-404 fallback, primitives, Playwright e2e harness

**Wave 2** *(blocked on Wave 1 completion)*

- [ ] 01-02-PLAN.md — Conversion scaffold + real Hero: cta.ts/features.ts/flavors.ts/types.ts (16 stubs), PrimaryCTA, TrustBadge declaration, ThemeProvider+ThemeToggle+Nav, Hero at 100dvh with Hinglish headline, inline FOUC script, LazyMotion wrapper, hero image preload

**Wave 3** *(blocked on Wave 2 completion)*

- [ ] 01-03-PLAN.md — Pixel + CAPI dedup + In-app browser banner + CI greps: Meta Pixel in index.html, api/track-lead.ts Vercel Edge Function, src/lib/tracking.ts fire-and-forget wrapper, detectInAppBrowser + InAppBrowserBanner (iOS Safari nudge / Android intent:// redirect), GitHub Actions CI with wa.me and energy-drink grep gates

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

**Plans:** 3/3 plans complete
Plans:
**Wave 1**

- [x] 02-01-PLAN.md — Wave 1 foundation: install @radix-ui/react-dialog, add AnimatePresence re-export, write FlavorCapGraphic + FlavorCard + lightenHex helper (unit-tested), upgrade Nav with Radix Dialog hamburger panel reading WhatsApp href from getCta('nav'), refine flavors.ts descriptions *(automated work complete 2026-10-09; awaiting human-verify checkpoint)*

**Wave 2** *(blocked on Wave 1; 02-02 and 02-03 parallelizable)*

- [x] 02-02-PLAN.md — HomePage composition: 3 inline React SVGs (TWIST/SHAKE/BOOM) + HowItWorks section with whileInView fade+slide + reduced-motion fallback (HOW-01); FlavorTeaser horizontal scroll-snap scroller with 8 curated flavors + "See all" tile (FLAV-03); move <main id="main"> landmark from Hero to HomePage.tsx; update Phase 1 hero H5/H6 selectors
- [x] 02-03-PLAN.md — /flavors catalog: 16-card color-washed grid via Wave 1 FlavorCard (FLAV-01); pill-chip RangeFilter with URL state via useSearchParams (?range= sync, invalid-param cleanup, back-button restore, share-link resilience) (FLAV-02); update Phase 1 skeleton Test 2 for the new H1

**UI hint**: yes

### Phase 3: Scroll Storytelling Polish

**Mode:** mvp
**Goal**: Every section shipped in Phases 1–2 gains the cinematic Motion scroll choreography that is the whole reason this is a custom React site rather than a Shopify theme — without breaking the LazyMotion bundle budget or the `prefers-reduced-motion` contract.
**Depends on**: Phase 2
**Requirements**: (none — cross-cutting polish layered over Phase 1–2 output; motion fidelity is observable but no v1 REQ-ID directly owns it)
**Success Criteria** (what must be TRUE):

  1. Section entrances and the flavor-card stagger animate on scroll using Motion's `whileInView`; animations are limited to `transform` and `opacity` so first paint and scroll remain smooth on a mid-tier Android on 4G. (Hero cap-twist dropped mid-Phase per the brand-fit review on 2026-10-10 — Hero stays on the Phase 2 single-image composition.)
  2. All motion routes through `LazyMotion` + `m.*` primitives (no `motion.div`); `domAnimation` features are dynamically imported via `src/lib/motion-features.ts` so Rollup emits a `motion-features-*.js` async chunk fetched after first paint; entry-chunk Motion contribution stays under 20 KB gzip (verified via `dist/stats.html`; REQUIREMENTS.md CONV-05 revised 2026-10-10 — the original ≤10 KB entry target was unachievable with motion/react v14's static primitive surface and is deferred to Phase 4 PERF-02).
  3. Visitors with `prefers-reduced-motion: reduce` see static fallbacks across every animated section — HowItWorks, FlavorTeaser, and the `/flavors` grid + filter crossfade — with no layout shift relative to the animated path.
  4. A manual pass across How It Works, Flavor Teaser, and `/flavors` on an iPhone and an Android device shows no jank, no CLS, and no bundle regression vs. the Phase 2 baseline.

**Plans**: TBD
**UI hint**: yes

### Phase 3.1 (INSERTED 2026-10-10): Content & Conversion — USP + Bundles + Trust

**Mode:** mvp
**Inserted:** 2026-10-10 after Phase 3 close. Developer flagged that the three next-up conversion-critical marketing sections (USP comparison, pricing bundles, trust badges) were spread across Phase 4 (USP), Phase 5 (Trust), and Phase 6 (Bundles un-gate), buried alongside unrelated work (Variants, Premium Sports, Lighthouse perf, FAQ, About, commerce wiring). This phase pulls those three sections forward and sequences them together so the homepage carries a complete conversion-content story BEFORE the perf-pass and legal-content phases run.

**Goal**: Visitor on `/` reads a scannable USP comparison between CAPSHOT (SHI-28) and regular energy drinks across Freshness / Nutrient Value / Portability; scrolls into a combined **Product Catalog & Pricing Bundles** section that first lets them pick their flavor (relocated FlavorTeaser from its current position) and then scans three pricing-bundle preview cards (Trial 5 / Fitness 15 + Smart Shaker / Bulk 30) with "Join waitlist for early access" CTAs; and sees a near-footer trust-badge strip (FSSAI / Plant-based / Made in India / Secure Checkout) — all sections mobile-first, light/dark compliant, prefers-reduced-motion safe, and Hinglish per `capshot-brand`.
**Depends on**: Phase 3
**Requirements**: USP-01 (pulled from Phase 4), TRUST-01, TRUST-02 (pulled from Phase 5), CATALOG-01 (new — Product Catalog + Pricing Bundles combined section; actual purchase stays Phase 6)
**Success Criteria** (what must be TRUE):

  1. Visitor on `/` sees a USP & Comparison section containing a scannable table (or card-based equivalent) with 3 rows (Freshness / Nutrient Value / Portability) × 2 columns (Regular Energy Drinks / CAPSHOT SHI-28). Content uses regulator-safe phrasing — do NOT call CAPSHOT itself an energy drink (CI grep gate from Phase 1 still enforced). Semantic HTML; light/dark compliant; prefers-reduced-motion static fallback.
  2. Visitor on `/` sees a combined **Product Catalog & Pricing Bundles** section. The existing "Pick your flavour" FlavorTeaser (currently `src/sections/FlavorTeaser.tsx` with its horizontal scroll-snap of 8 curated flavors + "See all 16 flavors →" terminal tile + 02-02 FlavorTeaser SUMMARY contract) relocates INTO this section as its top half ("Step 1 — Pick your flavour"); directly below sits the Pricing Bundles tri-card lane ("Step 2 — Pick your pack") with: **Trial Pack** (5 caps — "Ideal for first-time buyers"); **Fitness Pack** (15 caps + 1 Free Smart Shaker Bottle — "Best Value / Most Popular" badge visually prominent); **Bulk Energy Pack** (30 caps — "For heavy gym-goers and athletes"). Each bundle card has a primary CTA labeled "Join waitlist for early access" that opens the WhatsApp waitlist flow with the tier phrase embedded in the `?text=` message body (`Interested in: trial|fitness|bulk`) so pre-launch attribution works — body-text ride-along adopted during Phase 3.1 code review because `wa.me` strips every param except `text`. CTAs route exclusively through `src/config/cta.ts` for Phase 6 commerce swap compliance. Prices either shown as "Pre-launch pricing" placeholder OR hidden pending client input — client-input decision captured in discuss-phase. **FlavorTeaser's existing scroll-snap + chevron + routing-to-/flavors behavior is preserved byte-identically** when relocated; only its parent-section wrapper changes.
  3. Visitor sees a near-footer Trust Badges strip rendered via `<TrustBadge>` components (declared in Phase 1 Plan 02; evidenceUrl requirement in PROD). Four badges: **FSSAI Licensed** (placeholder evidenceUrl + 14-digit number marker until GATE-FSSAI resolves; `import.meta.env.PROD` render-gate from Phase 1 enforced), **Plant-based ingredients** (regulator-safe swap for the blueprint's "Vegan & Non-GMO" per `capshot-brand` — avoids FSSAI vegan-logo approval requirement), **Made in India**, **Secure Checkout** (shown with a "Coming soon with Phase 6 commerce" context note OR rendered hidden until Phase 6 — decision captured in discuss-phase).
  4. All three sections render on 360×640 mobile with no horizontal overflow, honor light/dark + prefers-reduced-motion contracts, and the full Phase 1-3 e2e suite stays GREEN with ≥3 new e2e specs (one per section). The Phase 2 FT1–FT6 + Phase 3 FT-P3-1/FT-P3-2 flavor-teaser specs remain GREEN (relocated DOM still satisfies the heading + 8-handle enumeration + "See all" + scroll-snap + motion-reduce assertions).

**Plans:** 4/4 plans complete + 3 gap-closure plans (opened 2026-10-11 after real-device UAT; all Wave 1 — no inter-plan dependencies)
Plans:
**Wave 1** *(Plans 01 and 02 parallelizable; Plan 01 ships shared primitives, Plan 02 ships Section 3 USP)*

- [x] 03.1-01-PLAN.md — Shared infrastructure: TrustBadge discriminated-union variant extension (visual-only arm) + cta.ts bundle slots populated with &tier= attribution + getCta signature extension + src/data/types.ts BundleTier + src/data/bundles.ts (3-item Shopify-aligned tuple, locked prices ₹120/₹349/₹600) + BundleCountBadge SVG primitive + unit test extensions
- [x] 03.1-02-PLAN.md — Section 3 USP Comparison: new src/sections/UspComparison.tsx (semantic 3-row x 2-col table with lucide Clock/Leaf/Package icons, "Store-bought bottled drinks" vs "CAPSHOT (SHI-28)") + usp-comparison.spec.ts (UC1-UC6 + UC-RM-1) + HomePage insert

**Wave 2** *(blocked on Wave 1 completion)*

- [x] 03.1-03-PLAN.md — Section 4 Catalog + Bundles: new src/sections/CatalogBundles.tsx wrapper (plain <section aria-labelledby> NOT <Section> to avoid double-pad) + new src/sections/Bundles.tsx tri-card lane (reads bundles.ts, routes CTAs through getCta('bundles.*')) + catalog-bundles.spec.ts (CB1-CB6 + CB-RM-1) + HomePage swap (removes standalone FlavorTeaser, adds CatalogBundles). FlavorTeaser.tsx source file BYTE-IDENTICAL per D3.1-05a contract.

**Wave 3** *(blocked on Wave 2 completion)*

- [x] 03.1-04-PLAN.md — Section 5 Trust Badges + end-of-phase human-verify: new src/sections/TrustBadges.tsx (4 visual-only badges in locked order: FSSAI Licensed, Plant-based ingredients, Made in India, Secure Checkout, flex-wrap 2x2 on <375px) + trust-badges.spec.ts (TB1-TB6 + TB-RM-1) + HomePage insert + closing checkpoint:human-verify for real-device mobile approval

**Gap-closure Wave (opened 2026-10-11 after real-device UAT on 2026-10-11; all plans parallelizable — zero file overlap)**

- [ ] 03.1-05-PLAN.md — GAP-01 closure (TrustBadges reads as orphaned chrome): add `<h2>Why trust us.</h2>` heading above the 4-badge `<ul>` + flip `<Section background="bg">` → `<Section background="surface">` so the strip tonally separates from Bundles above; preserve D3.1-07a locked labels + visual-only variant + reduced-motion contract; extend trust-badges.spec.ts in-place with TB7/TB8 (heading + surface tone), preserving TB1-TB6 + TB-RM-1. Restores ROADMAP SC3.
- [ ] 03.1-06-PLAN.md — GAP-02 closure (CatalogBundles reads as 3 disconnected sub-sections): approach (a) — add explicit numbered step markers "01 / Step 1 — Pick your flavor" above FlavorTeaser and "02 / Step 2 — Pick your pack" above Bundles in CatalogBundles.tsx; remove the inline eyebrow+H3+intro paragraph band inside Bundles.tsx so the parent step marker is the sole Step 2 scaffolding; FlavorTeaser.tsx remains BYTE-IDENTICAL per D3.1-05a (sha256 verified); extend catalog-bundles.spec.ts in-place with CB7/CB8/CB9 (step markers + inner-H3 regression guard), preserving CB1-CB6 + CB-RM-1 + FT1-FT6 + FT-P3-1/FT-P3-2. Restores ROADMAP SC2.
- [ ] 03.1-07-PLAN.md — GAP-03 + GAP-04 closure (USP table missing first-column header + table too shallow): add `<th scope="col">Feature</th>` to the previously-blank top-left cell (GAP-03); append 2 new rows to ROWS tuple — Taste variety (icon: lucide `Repeat`; bottled: "1 flavor per bottle, locked"; CAPSHOT: "16 flavors, three ranges — swap any time") + Price per drink (icon: lucide `IndianRupee`; bottled: "₹30-₹50 per bottle"; CAPSHOT: "₹24-₹30 per cap*"; row carries `data-pricing-pending="true"`) + asterisk footnote `* CAPSHOT per-cap price range pending client final approval before Phase 6.` matching the Phase 3.1 bundles.ts pricingNote posture (GAP-04); extend usp-comparison.spec.ts in-place with UC3b/UC7/UC8/UC9 + update UC2 to 5-row order; preserve D3.1-02a locked rows + D3.1-11 motion contract + D3.1-12 mobile overflow contract + CI grep gate. Restores ROADMAP SC1.

**UI hint**: yes

**Locked homepage section order (per developer direction 2026-10-10):**

| # | Section | Source | Phase shipped |
|---|---------|--------|---------------|
| 1 | Hero | `src/sections/Hero.tsx` | Phase 1 |
| 2 | How It Works | `src/sections/HowItWorks/HowItWorks.tsx` | Phase 2 (+ Phase 3 per-step stagger) |
| **3** | **USP & Comparison Grid** | **NEW — `src/sections/UspComparison.tsx`** | **Phase 3.1 (this phase)** |
| **4** | **Product Catalog & Pricing Bundles** | **NEW wrapper + relocated `FlavorTeaser.tsx` + NEW `src/sections/Bundles.tsx`** | **Phase 3.1 (this phase)** |
| **5** | **Trust Badges strip** | **NEW — `src/sections/TrustBadges.tsx` (uses existing Phase 1 `<TrustBadge>` primitive)** | **Phase 3.1 (this phase)** |
| 6 | Footer | existing | — |

The three NEW Phase 3.1 sections insert in the exact order above. FlavorTeaser moves from its current standalone slot (position 3) into position 4's wrapper.

**Downstream impact:**
- Phase 4 scope reduces (USP SC1 moved here)
- Phase 5 scope reduces (Trust SC1 moved here)
- Phase 6 scope reduces (Bundles section + `<TrustBadge>` surfaces already shipped; Phase 6 is just Shopify handle wiring + un-hiding "Buy now" CTAs + flipping cta.ts destination)
- HomePage composition (`src/pages/HomePage.tsx`) changes: FlavorTeaser moves out of its current standalone slot and INTO the new combined Catalog+Bundles section wrapper

### Phase 4: Variants + Premium Sports + Lighthouse Perf Pass

**Mode:** mvp
**Goal**: The homepage carries variant/dosage guidance per bottle size, a dedicated Premium Sports showcase framed as "caffeinated beverages" (NEVER "energy drinks"), and the whole site clears Lighthouse mobile ≥90 before any paid campaign scales. Phase 4 ALSO folds in the real-device manual pass deferred from Phase 3 (iPhone + Android screencast evidence for all animated surfaces) since real-device perf testing is already in scope here.
**Depends on**: Phase 3.1
**Requirements**: VAR-01, SPORTS-01, PERF-01, PERF-02 (USP-01 moved to Phase 3.1)
**Success Criteria** (what must be TRUE):

  1. Visitor on `/` reads variant/dosage guidance for 200–250 ml (3–4 g, "Light & Refreshing") and 350–500 ml (7–8 g, "Strong & Punchy"). (USP comparison already shipped in Phase 3.1; cross-reference only.)
  2. Visitor sees a dedicated Premium Sports range showcase featuring Matcha / Black Pump / Java Pump / Coffee, labeled "caffeinated beverages" (never "energy drinks") and carrying a visible mandatory caffeine advisory.
  3. Hero and above-the-fold images are served as responsive `<picture>` with AVIF/WebP/JPG srcsets generated at build time via `vite-imagetools`.
  4. Lighthouse mobile audit on a mid-tier device + 4G throttle reports ≥90 for Performance, Accessibility, Best Practices, and SEO on `/` and `/flavors`; the report is committed to `.planning/evidence/`. Phase 3 deferred real-device manual pass (iPhone + Android screencast of HowItWorks / FlavorTeaser / /flavors animated surfaces) folds into this evidence capture.
  5. **CONV-05 chunk-splitting continuation (deferred from Phase 3 Plan 03):** investigate dynamic-mount of `AnimatePresence` + per-section motion wrappers to drop the entry Motion footprint from ~16 KB gzip (Phase 3 revised budget) back toward the original ≤10 KB target; document feasibility + size impact in the Lighthouse evidence doc.

**Plans**: TBD
**UI hint**: yes

### Phase 5: FAQ + About + Contact + SEO + Accessibility

**Mode:** mvp
**Goal**: The site carries every FAQ answer, founder story, contact route, SEO artifact, and accessibility contract required before paid-ad spend scales and before Phase 6 KYC begins — including a full Hinglish + regulator-correct copy audit.
**Depends on**: Phase 4
**Requirements**: FAQ-01, ABOUT-01, CONTACT-01, UI-01, UI-02, UI-03, SEO-01, SEO-02 (TRUST-01 + TRUST-02 moved to Phase 3.1)
**Success Criteria** (what must be TRUE):

  1. Visitor can expand and collapse 6–8 FAQs built on Radix UI accordion primitives (top 1–2 questions open by default), read the founder story on `/about` (placeholder photo acceptable), and reach the brand on `/contact` via WhatsApp Business, Instagram (@capshot_twist), and email (shi28.capshot@gmail.com).
  2. Visitor can toggle between light and dark mode; both modes pass WCAG AA contrast (≥4.5:1 body text) across the full palette (`#594545` / `#815B5B` / `#9E7676` / `#FFF8EA`), every interactive element exposes a visible focus state and is reachable via keyboard-only navigation, and all headlines/micro-copy use Hinglish while body copy remains English per the `capshot-brand` skill.
  3. Each of `/`, `/flavors`, `/about`, `/contact` exposes a unique `<title>`, `<meta description>`, and Open Graph tag set (image 1200×630, title, description, URL) via `@unhead/react`; hero OG tags are additionally hard-coded in `index.html` for non-JS crawlers.
  4. The build emits a valid `sitemap.xml` via `vite-plugin-sitemap` listing all four routes; `robots.txt` references the sitemap.
  5. **Trust badge audit (post-FSSAI number arrival):** when GATE-FSSAI resolves, revisit Phase 3.1's `<TrustBadge>` placeholder evidenceUrl values + swap in the real 14-digit FSSAI number + production evidence links. If GATE-FSSAI has not resolved by Phase 5 close, the audit rolls to Phase 6.

**Plans**: TBD
**UI hint**: yes

### Phase 6: Commerce (Shopify + Razorpay + Shiprocket)

**Mode:** mvp
**Entry Gates (ALL required before Phase 6 planning starts):**

  - **GATE-FSSAI**: Client delivers 14-digit FSSAI license number (blocks Razorpay food-category KYC + `<TrustBadge>` production render + legal "FSSAI Licensed" phrasing)
  - **GATE-INVENTORY**: Client confirms inventory warehoused with verified Shiprocket pickup address
  - **GATE-BUDGET**: Client approves ~₹2,000/mo Shopify Basic recurring budget
  - **GATE-NUTRITION**: Client delivers nutrition facts + caffeine content per flavor (required for PDP labeling + caffeine advisory on Premium Sports flavors; also unblocks the Phase 5 Trust section's permanent production state)

**Goal**: Visitor who taps "Shop Now" on the marketing site reaches a live Shopify-hosted checkout at `shop.capshot.co`, pays via UPI Intent / cards / net-banking (international cards + COD disabled at launch), and the order flows automatically into Shiprocket for courier assignment and tracking — all delivered as a near-zero-refactor swap of the Phase 1 architecture (3 files edited, 2 added, 1 section un-gated). **Scope reduced 2026-10-10:** the `Bundles.tsx` section and `<TrustBadge>` surfaces already ship in Phase 3.1; Phase 6 just wires Shopify product handles into `src/data/bundles.ts` + flips `ENABLE_SHOPIFY_CTAS` + swaps `src/config/cta.ts` destinations + un-hides the Phase 3.1 "Buy now" CTAs that were rendered hidden/disabled behind feature flags.
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
| 1. Foundation + Hero + Conversion Infrastructure | 3/3 | Awaiting human-verify checkpoint | - |
| 2. How It Works + Flavor Catalog | 3/3 | Complete   | 2026-10-09 |
| 3. Scroll Storytelling Polish | 3/3 | Complete   | 2026-10-10 |
| 3.1 (INSERTED 2026-10-10). Content & Conversion — USP + Catalog+Bundles + Trust | 4/4 | Complete   | 2026-10-10 |
| 4. Variants + Premium Sports + Lighthouse Perf Pass | 0/TBD | Not started | - |
| 5. FAQ + About + Contact + SEO + Accessibility | 0/TBD | Not started | - |
| 6. Commerce (Shopify + Razorpay + Shiprocket) | 0/TBD | Gated | - |
