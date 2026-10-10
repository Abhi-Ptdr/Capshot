# REQUIREMENTS

**Project:** SHI-28 CAPSHOT
**Milestone:** v1 — Pre-launch marketing site → live Shopify commerce
**Last updated:** 2026-10-09

---

## v1 Requirements

### Infrastructure & Scaffold

- [x] **INFRA-01**: Developer can build the site locally with `npm install && npm run dev` using React 19 + TypeScript 7 + Vite 8 + Tailwind 4.3 + Motion 14 + React Router 8 on current package names
- [x] **INFRA-02**: Visitor can access `/`, `/flavors`, `/about`, `/contact` as client-side routes with a 404 fallback for unknown paths
- [x] **INFRA-03**: Developer can change the primary CTA destination for the entire site by editing one file (`src/config/cta.ts`) — no component modifications required
- [x] **INFRA-04**: Developer can read all 16 flavors from `src/data/flavors.ts` typed to a Shopify-aligned schema (handle, title, description, images, range, accentHex, dosage, nullable priceInr/shopifyProductId/available)
- [x] **INFRA-05**: Developer can toggle Phase 6 commerce features via boolean flags in `src/config/features.ts` without changing component code
- [x] **INFRA-06**: CI pipeline fails any commit that introduces `wa.me` outside `src/config/cta.ts` or the string "energy drink" anywhere in `src/`

### Conversion Infrastructure (Phase 1 non-negotiables)

- [x] **CONV-01**: Site fires a `Lead` event via Meta Pixel (client-side) AND Conversions API (server-side edge function) with a shared `event_id` whenever a visitor clicks a primary waitlist CTA
- [x] **CONV-02**: Visitors arriving inside the Instagram or Facebook in-app WKWebView see a sticky, dismissible banner recommending they open the site in Safari (iOS) or auto-redirecting to Chrome via `intent://` (Android)
- [x] **CONV-03**: Hero section uses `100dvh` with `100vh` fallback so the primary CTA remains visible on iPhones with dynamic Safari toolbars
- [x] **CONV-04**: Dark mode preference is applied before React mounts via an inline blocking `<script>` in `index.html`, preventing cream-to-dark flash on cold-cache loads
- [x] **CONV-05**: Motion animations use `LazyMotion` + `m.*` primitives (never `motion.div`); `domAnimation` features are loaded via dynamic import so Rollup code-splits them into an async chunk fetched after first paint. **Budget target (revised 2026-10-10 during Phase 3 Plan 03 Wave 4 bundle check):** entry-chunk Motion contribution ≤ 20 KB gzip (achieved: ~16 KB — `motion/react` core: `m`, `LazyMotion` wrapper, `AnimatePresence`, bindings). Async `motion-features` chunk ≤ 15 KB gzip (achieved: 14.53 KB). The original ≤ 10 KB entry target is unachievable with motion/react v14's static primitive surface; tightening to that number requires rewriting components to dynamic-mount motion wrappers (deferred to Phase 4 PERF-02 chunk-splitting work).

### Hero & Conversion

- [x] **HERO-01**: Visitor can understand the TWIST.SHAKE.BOOM concept and primary action within 5 seconds of landing on `/` on a 360×640 mobile viewport
- [x] **HERO-02**: Visitor can tap one visible CTA button in the hero (≥56 px tap target) to open WhatsApp Business with a pre-filled waitlist message

### How It Works

- [x] **HOW-01**: Visitor can see a 3-step visual explanation (TWIST → SHAKE → BOOM) with animated illustrations on scroll, with `prefers-reduced-motion` fallback to static graphics

### Flavors Catalog

- [x] **FLAV-01**: Visitor can browse all 16 flavors on `/flavors` with each flavor rendered as a color-washed card using its accent hex
- [x] **FLAV-02**: Visitor can filter the flavor grid by range (All / Fruity Blast / Desi & Cool / Premium Sports) via URL-synced filter state (`?range=…`)
- [x] **FLAV-03**: Visitor can see a flavor teaser section on `/` that previews 6–8 flavors and links to the full `/flavors` page

### Product Education

- [ ] **VAR-01**: Visitor can read the variant/dosage guidance (200–250 ml = 3–4 g "Light & Refreshing", 350–500 ml = 7–8 g "Strong & Punchy") on `/`
- [ ] **USP-01**: Visitor can compare CAPSHOT against regular bottled drinks across freshness, nutrient value, and portability in a scannable grid on `/` *(scope moved from Phase 4 to Phase 3.1 on 2026-10-10)*
- [ ] **SPORTS-01**: Visitor can view a dedicated Premium Sports range showcase (Matcha / Black Pump / Java Pump / Coffee) using the phrase "caffeinated beverages" (NEVER "energy drinks") with a mandatory caffeine advisory

### Product Catalog & Bundles

- [x] **CATALOG-01** *(new 2026-10-10)*: Visitor on `/` sees a combined **Product Catalog & Pricing Bundles** section with the existing "Pick your flavour" FlavorTeaser (relocated from its current standalone homepage slot) as "Step 1" above three pricing bundle cards as "Step 2" — Trial Pack (5 caps), Fitness Pack (15 caps + 1 Free Smart Shaker, "Best Value / Most Popular" badge), Bulk Energy Pack (30 caps). Each bundle card has a "Join waitlist for early access" primary CTA that opens WhatsApp with a `?tier=trial|fitness|bulk` query. CTAs route exclusively through `src/config/cta.ts` (Phase 6 commerce swap compliance). FlavorTeaser's existing scroll-snap + chevron + routing-to-/flavors behavior preserved byte-identically; only its parent-section wrapper changes.

### Trust & Safety

- [x] **TRUST-01** *(scope moved from Phase 5 to Phase 3.1 on 2026-10-10)*: Visitor can see a trust badge strip near the footer with badges rendered only via a `<TrustBadge>` component that requires an `evidenceUrl` prop and refuses to render in production without it
- [x] **TRUST-02** *(scope moved from Phase 5 to Phase 3.1 on 2026-10-10)*: Trust badges use regulator-correct phrasing: "FSSAI Licensed – [14-digit number]" (not "Approved"), "Plant-based ingredients" (not "Vegan") until FSSAI vegan logo approval arrives, "Made in India", "Secure Checkout"

### Content Pages

- [ ] **FAQ-01**: Visitor can expand/collapse 6–8 FAQs on `/` or a dedicated section, with accordion built on Radix UI primitives (top 1–2 questions open by default)
- [ ] **ABOUT-01**: Visitor can read the founder story on `/about` with a founder photo (placeholder acceptable until client provides)
- [ ] **CONTACT-01**: Visitor can contact the brand on `/contact` via WhatsApp Business, Instagram (@capshot_twist), and email (shi28.capshot@gmail.com)

### Design System & Accessibility

- [ ] **UI-01**: Visitor can toggle between light and dark mode; both modes pass WCAG AA contrast (≥4.5:1 body text) across the locked palette (`#594545` / `#815B5B` / `#9E7676` / `#FFF8EA`)
- [ ] **UI-02**: All interactive elements expose focus states and work with keyboard-only navigation
- [ ] **UI-03**: Site uses Hinglish for headlines/micro-copy and English for body copy per the `capshot-brand` skill policy

### Performance & SEO

- [ ] **PERF-01**: Site achieves Lighthouse mobile scores ≥90 for Performance, Accessibility, Best Practices, and SEO on a mid-tier device + 4G throttle
- [ ] **PERF-02**: Hero images are served as responsive `<picture>` with AVIF/WebP/JPG srcsets via `vite-imagetools`
- [ ] **SEO-01**: Each route exposes unique `<title>`, `<meta description>`, and Open Graph tags (image, title, description, URL) via `@unhead/react`; hero OG tags are additionally hard-coded in `index.html` for crawlers that don't execute JS
- [ ] **SEO-02**: Site exposes a `sitemap.xml` generated at build time via `vite-plugin-sitemap`

### Phase 6 Commerce (deferred, planning entry-gated)

- [ ] **COM-01**: Visitor can purchase Trial (5-cap), Fitness (15-cap + shaker), or Bulk (30-cap) bundles via a Shopify-hosted checkout at `shop.capshot.co`, redirected from the marketing site's "Shop Now" CTA
- [ ] **COM-02**: Checkout accepts UPI Intent, cards, and net-banking via Razorpay; international cards disabled; COD disabled at launch (prepaid-only for first 500 orders)
- [ ] **COM-03**: Each order flows automatically from Shopify to Shiprocket for courier selection, label printing, and tracking email delivery
- [ ] **COM-04**: Fitness Pack is priced at ₹1,999 (not ₹2,000) to avoid the Razorpay ≥₹2,000 UPI MDR effective Oct 15 2026

### Entry gates (not features — client/external deliverables)

- [ ] **GATE-FSSAI**: Client delivers 14-digit FSSAI license number before Phase 6 planning starts
- [ ] **GATE-INVENTORY**: Client confirms inventory warehoused with verified pickup address before Phase 6 planning starts
- [ ] **GATE-BUDGET**: Client approves ~₹2,000/mo Shopify Basic budget before Phase 6 planning starts
- [ ] **GATE-NUTRITION**: Client delivers nutrition facts + caffeine content per flavor before Phase 5 Trust section ships to production

---

## v2 Requirements (deferred — users expect but not v1)

- Pincode serviceability check on PDP (Phase 6+)
- Visual UGC/review widget (Loox/Judge.me) on PDPs (Phase 6+)
- Sticky "Buy Now" bar on mobile PDPs (Phase 6+)
- Instagram Shopping tag sync (Phase 6+)
- "Save ₹49 — Pay Online" prepaid incentive at COD toggle (Phase 6 after order #500)
- COD enablement with OTP + pincode gate + ₹1,500 cap (Phase 6 after order #500)
- GST invoice generation per order (Phase 6+)

---

## Out of Scope (explicit exclusions)

- Flavor-finder quiz — No cart in Phase 1–5; quiz output has nowhere to drop recommendations; defer to post-launch
- WhatsApp cart-recovery via BSP (Zoko/Wati/AiSensy) — Requires >500 waitlist to justify integration cost
- Loyalty / referral program — No repeat-purchase base yet
- Email marketing capture (Phase 1) — Client chose WhatsApp; email arrives with Shopify in Phase 6
- Blog / editorial content — Defer until brand validated and traffic justifies investment
- Native mobile app — Mobile web + PWA-adjacent is sufficient for ad-driven D2C
- Subscription SKU — Defer until repeat-purchase data exists
- International shipping — India-first; disable intl cards and shipping zones
- CMS backend (Sanity/Contentful) — Static TS data is sufficient at this content volume
- Server-side rendering (SSR) / Shopify Hydrogen — Explicitly rejected; static SPA + redirect-to-Shopify-checkout is the locked architecture
- Embedded shopping cart on marketing site — Keeps separation clean with Shopify-hosted checkout
- "Energy drink" positioning in hero or ads — 2026 FSSAI violation; also only 4 of 16 flavors fit
- Autoplay video with sound — User hostile; silent background video only if used
- Pre-launch newsletter popup wall — Hurts bounce rate on paid ad traffic
- Full-Hindi or full-English copy — Hinglish is the locked copy policy
- Chatbot widget — Non-brand aesthetic; WhatsApp Business is the direct channel instead
- Desktop-first design — 95% mobile traffic; mobile-first mandatory
- "FSSAI Approved" phrasing — Legally incorrect; "FSSAI Licensed" is the correct term
- "Vegan" claim without official FSSAI vegan logo approval — Regulatory risk; use "Plant-based ingredients" until approved

---

## Traceability

<!-- Each v1 REQ-ID maps to exactly one phase. GATE-* rows map to the phase they gate. -->

**Coverage:** 36/36 v1 requirements mapped. 4/4 entry gates assigned.

| REQ-ID | Phase | Status |
|--------|-------|--------|
| INFRA-01 | Phase 1 | Complete (Plan 01) |
| INFRA-02 | Phase 1 | Complete (Plan 01) |
| INFRA-03 | Phase 1 | Complete (Plan 02) |
| INFRA-04 | Phase 1 | Complete (Plan 02) |
| INFRA-05 | Phase 1 | Complete (Plan 02) |
| INFRA-06 | Phase 1 | Complete (Plan 03) |
| CONV-01 | Phase 1 | Complete (Plan 03) |
| CONV-02 | Phase 1 | Complete (Plan 03) |
| CONV-03 | Phase 1 | Complete (Plan 02) |
| CONV-04 | Phase 1 | Complete (Plan 02) |
| CONV-05 | Phase 1 | Complete (Plan 02) |
| HERO-01 | Phase 1 | Complete (Plan 02) |
| HERO-02 | Phase 1 | Complete (Plan 02) |
| HOW-01 | Phase 2 | Complete |
| FLAV-01 | Phase 2 | Complete |
| FLAV-02 | Phase 2 | Complete |
| FLAV-03 | Phase 2 | Complete |
| USP-01 | Phase 3.1 (moved from Phase 4 on 2026-10-10) | Pending |
| CATALOG-01 | Phase 3.1 (new 2026-10-10) | Complete |
| TRUST-01 | Phase 3.1 (moved from Phase 5 on 2026-10-10) | Complete |
| TRUST-02 | Phase 3.1 (moved from Phase 5 on 2026-10-10) | Complete |
| VAR-01 | Phase 4 | Pending |
| SPORTS-01 | Phase 4 | Pending |
| PERF-01 | Phase 4 | Pending |
| PERF-02 | Phase 4 | Pending |
| FAQ-01 | Phase 5 | Pending |
| ABOUT-01 | Phase 5 | Pending |
| CONTACT-01 | Phase 5 | Pending |
| UI-01 | Phase 5 | Pending |
| UI-02 | Phase 5 | Pending |
| UI-03 | Phase 5 | Pending |
| SEO-01 | Phase 5 | Pending |
| SEO-02 | Phase 5 | Pending |
| COM-01 | Phase 6 | Pending |
| COM-02 | Phase 6 | Pending |
| COM-03 | Phase 6 | Pending |
| COM-04 | Phase 6 | Pending |
| GATE-FSSAI | Phase 6 (entry gate) | Pending — client deliverable |
| GATE-INVENTORY | Phase 6 (entry gate) | Pending — client deliverable |
| GATE-BUDGET | Phase 6 (entry gate) | Pending — client deliverable |
| GATE-NUTRITION | Phase 6 (entry gate; also gates Phase 5 Trust production ship) | Pending — client deliverable |

**Note on Phase 3:** Phase 3 (Scroll Storytelling Polish) carries no directly-owned REQ-IDs. It is a cross-cutting polish layer that deepens Phases 1–2 output per the research finding that cinematic Motion scroll choreography is the project's locked creative direction and the whole reason this is a custom React site rather than a Shopify theme. Its success criteria are observable but no v1 REQ-ID uniquely owns them. CONV-05 (LazyMotion / `m.*` primitives) formally lives in Phase 1 but is re-verified in Phase 3.

---

## Definition of Done (per requirement)

A requirement is **done** when:
1. Implementation shipped to production (Vercel/Netlify) or merged to `main`
2. UAT criterion from the phase plan passes manually in a real browser
3. For UI requirements: verified on real iPhone + Android Chrome (not DevTools emulation)
4. For PERF requirements: Lighthouse mobile score captured and committed to `.planning/`
5. For TRUST / COM requirements: evidence URL / legal reference recorded in `.planning/evidence/`
