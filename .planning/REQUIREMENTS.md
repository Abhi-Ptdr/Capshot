# REQUIREMENTS

**Project:** SHI-28 CAPSHOT
**Milestone:** v1 — Pre-launch marketing site → live Shopify commerce
**Last updated:** 2026-10-09

---

## v1 Requirements

### Infrastructure & Scaffold

- [ ] **INFRA-01**: Developer can build the site locally with `npm install && npm run dev` using React 19 + TypeScript 7 + Vite 8 + Tailwind 4.3 + Motion 14 + React Router 8 on current package names
- [ ] **INFRA-02**: Visitor can access `/`, `/flavors`, `/about`, `/contact` as client-side routes with a 404 fallback for unknown paths
- [ ] **INFRA-03**: Developer can change the primary CTA destination for the entire site by editing one file (`src/config/cta.ts`) — no component modifications required
- [ ] **INFRA-04**: Developer can read all 16 flavors from `src/data/flavors.ts` typed to a Shopify-aligned schema (handle, title, description, images, range, accentHex, dosage, nullable priceInr/shopifyProductId/available)
- [ ] **INFRA-05**: Developer can toggle Phase 6 commerce features via boolean flags in `src/config/features.ts` without changing component code
- [ ] **INFRA-06**: CI pipeline fails any commit that introduces `wa.me` outside `src/config/cta.ts` or the string "energy drink" anywhere in `src/`

### Conversion Infrastructure (Phase 1 non-negotiables)

- [ ] **CONV-01**: Site fires a `Lead` event via Meta Pixel (client-side) AND Conversions API (server-side edge function) with a shared `event_id` whenever a visitor clicks a primary waitlist CTA
- [ ] **CONV-02**: Visitors arriving inside the Instagram or Facebook in-app WKWebView see a sticky, dismissible banner recommending they open the site in Safari (iOS) or auto-redirecting to Chrome via `intent://` (Android)
- [ ] **CONV-03**: Hero section uses `100dvh` with `100vh` fallback so the primary CTA remains visible on iPhones with dynamic Safari toolbars
- [ ] **CONV-04**: Dark mode preference is applied before React mounts via an inline blocking `<script>` in `index.html`, preventing cream-to-dark flash on cold-cache loads
- [ ] **CONV-05**: Motion animations use `LazyMotion` + `m.*` primitives (never `motion.div`) so the entry bundle stays under 10 KB gzip for Motion

### Hero & Conversion

- [ ] **HERO-01**: Visitor can understand the TWIST.SHAKE.BOOM concept and primary action within 5 seconds of landing on `/` on a 360×640 mobile viewport
- [ ] **HERO-02**: Visitor can tap one visible CTA button in the hero (≥56 px tap target) to open WhatsApp Business with a pre-filled waitlist message

### How It Works

- [ ] **HOW-01**: Visitor can see a 3-step visual explanation (TWIST → SHAKE → BOOM) with animated illustrations on scroll, with `prefers-reduced-motion` fallback to static graphics

### Flavors Catalog

- [ ] **FLAV-01**: Visitor can browse all 16 flavors on `/flavors` with each flavor rendered as a color-washed card using its accent hex
- [ ] **FLAV-02**: Visitor can filter the flavor grid by range (All / Fruity Blast / Desi & Cool / Premium Sports) via URL-synced filter state (`?range=…`)
- [ ] **FLAV-03**: Visitor can see a flavor teaser section on `/` that previews 6–8 flavors and links to the full `/flavors` page

### Product Education

- [ ] **VAR-01**: Visitor can read the variant/dosage guidance (200–250 ml = 3–4 g "Light & Refreshing", 350–500 ml = 7–8 g "Strong & Punchy") on `/`
- [ ] **USP-01**: Visitor can compare CAPSHOT against regular bottled drinks across freshness, nutrient value, and portability in a scannable grid on `/`
- [ ] **SPORTS-01**: Visitor can view a dedicated Premium Sports range showcase (Matcha / Black Pump / Java Pump / Coffee) using the phrase "caffeinated beverages" (NEVER "energy drinks") with a mandatory caffeine advisory

### Trust & Safety

- [ ] **TRUST-01**: Visitor can see a trust badge strip near the footer with badges rendered only via a `<TrustBadge>` component that requires an `evidenceUrl` prop and refuses to render in production without it
- [ ] **TRUST-02**: Trust badges use regulator-correct phrasing: "FSSAI Licensed – [14-digit number]" (not "Approved"), "Plant-based ingredients" (not "Vegan") until FSSAI vegan logo approval arrives, "Made in India", "Secure Checkout"

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

<!-- Updated by roadmapper after ROADMAP.md creation. Each REQ-ID maps to exactly one phase. -->

(Pending roadmap)

---

## Definition of Done (per requirement)

A requirement is **done** when:
1. Implementation shipped to production (Vercel/Netlify) or merged to `main`
2. UAT criterion from the phase plan passes manually in a real browser
3. For UI requirements: verified on real iPhone + Android Chrome (not DevTools emulation)
4. For PERF requirements: Lighthouse mobile score captured and committed to `.planning/`
5. For TRUST / COM requirements: evidence URL / legal reference recorded in `.planning/evidence/`
