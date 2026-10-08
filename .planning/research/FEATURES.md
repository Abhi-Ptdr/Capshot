# Feature Research

**Domain:** India-first D2C beverage brand — premium creative marketing site (now, waitlist) → Shopify-backed commerce (Phase 6)
**Researched:** 2026-10-09
**Confidence:** HIGH (ecosystem patterns), MEDIUM (specific brand conversion lifts)

## Scope Note

Two conversion funnels are in scope:

- **Phase 1 (now):** Instagram/Facebook mobile ad → CAPSHOT marketing site → WhatsApp Business waitlist signup. **No cart, no checkout.** The only "purchase" surface is the WhatsApp CTA.
- **Phase 6 (later):** Same mobile ad → marketing site → Shopify product/bundle page → Razorpay (UPI/COD/cards) checkout → Shiprocket fulfillment.

Features below are tagged `[P1]` (needed now for waitlist), `[P6]` (needed only when commerce goes live), or `[P1→P6]` (needed now, deepens at P6).

## Feature Landscape

### Table Stakes (Users Expect These — Missing = Bounce)

| # | Feature | Phase | Why Expected | Complexity | Notes |
|---|---------|-------|--------------|------------|-------|
| 1 | **<5s hero concept clarity** (headline + sub + looping video/graphic of the twist-shake moment) | P1→P6 | 95% mobile ad traffic; attention budget is ~3–5s. Food/bev D2C conversion is 2.4–4% precisely because consideration is low — but only if the proposition registers instantly. | LOW | Hinglish headline approved ("Twist karo. Shake karo. BOOM"). Must be legible on 360px viewport. One primary CTA only. |
| 2 | **Single primary CTA, visually loud, repeated at scroll checkpoints** | P1→P6 | Waitlist/landing pages hiding nav + collapsing to one CTA lift conversion 10–15% and cut bounce 20–30%. | LOW | Phase 1: "Join the Waitlist" → `wa.me` link. Phase 6: "Shop Now" → Shopify. Centralized in `src/config/cta.ts` per existing architecture decision. |
| 3 | **"How It Works" 3-step section (Twist / Shake / Boom)** | P1→P6 | Novel form factor (cap on bottle) needs explanation or users assume it's a bottle itself. Blueprint spec explicitly mandates this. | LOW–MED | 3-second looping GIFs or Framer Motion stepped sequence. Icon fallback for slow 4G. |
| 4 | **All 16 flavors browsable, range-filterable** | P1→P6 | Catalog is the brand's breadth story (3 ranges × 16 flavors). "Where are the flavors?" is the top expected page-2 action after hero. | MED | Range pills (All • Fruity Blast • Desi & Cool • Premium Sports). Per-flavor accent wash from `capshot-catalog`. |
| 5 | **Variant/dosage explainer (200–250ml vs 350–500ml)** | P1→P6 | The cap works on "any 28mm bottle" is the differentiator — but users immediately ask "how much powder for my bottle?" If unanswered, trust evaporates. | LOW | Table or toggle: Light & Refreshing (3–4g) vs Strong & Punchy (7–8g). |
| 6 | **FSSAI + Vegan + Non-GMO + Made in India trust strip** | P1→P6 | Veg/non-veg symbol is "the single deciding factor for a large share of Indian consumers." FSSAI license + logo is legally required for F&B sale online in India. | LOW | Horizontal badge strip above footer. FSSAI license number must be real at Phase 6 (currently pending from client). FSSAI's official Vegan Logo (notified in FSS Vegan Food Regulations, June 2022) is the only legal "vegan" claim in India. |
| 7 | **WhatsApp Business as primary conversion channel (P1)** | P1 | Client's existing channel; zero infra; CTWA (Click-to-WhatsApp) ads deliver 3–7× ROI of lead ads in India; Meta's first 72h of chat is free. | LOW | `wa.me/919203975762?text=...` with pre-filled waitlist intent. Reply bot flow is a Phase 1.5 nice-to-have (manual replies work day one). |
| 8 | **Mobile-first responsive, Lighthouse ≥90, FMP <2s on 4G** | P1→P6 | 85% of Indian D2C traffic is mobile, often on mid-range Androids on patchy networks. Every 1s delay on mobile cuts conversion ~20%. | MED | Already a locked constraint in PROJECT.md. Framer Motion must stay on transform/opacity only; avoid animating width/height/blur. |
| 9 | **FAQ accordion (6–8 Qs)** | P1→P6 | Novel product → "Is it safe?" / "Does it fit my bottle?" / "How much sugar?" / "Shelf life?" / "Shipping to my pincode?" are predictable. | LOW | Accordion pattern; expand-one-at-a-time keeps mobile scroll clean. |
| 10 | **About + founder story page** | P1→P6 | Indian F&B D2C: brand marketing's job is to "reduce hesitation, create credibility, and turn the first order into repeat behaviour." Founder photo + ethos is table stakes. | LOW | Placeholder OK until founder bio/photo arrives (currently in "outstanding info" in PROJECT.md). |
| 11 | **Contact: WhatsApp Business + Instagram handle + email** | P1→P6 | Expected. WhatsApp + IG are where Indian D2C audiences actually reach out. Phone number optional. | LOW | Already specified. |
| 12 | **OG tags + sitemap.xml per route** | P1→P6 | Required for IG/FB ad previews and basic SEO. | LOW | Already in PROJECT.md Active requirements. |
| 13 | **UPI as the loudest payment option at checkout** | P6 | UPI = 50–60% of prepaid online checkout in India. Not surfacing it costs 40–50% of potential prepaid conversion. | LOW (Shopify-side) | Razorpay handles the method surfacing on Shopify checkout. Our job on the marketing site: display UPI logo lockup alongside Secure Checkout badge pre-checkout. |
| 14 | **COD support with safeguards** | P6 | Indian D2C audience expects COD — removing it entirely tanks top-of-funnel. But COD RTO averages 30%+ and 3–5× prepaid RTO. | MED (policy, not code) | Enable COD in Shopify with max order value cap (₹2,000 recommended) and IVR/WhatsApp order confirmation before dispatch. Consider "prepaid-only" for first 30 days then phase in. |
| 15 | **Pincode serviceability check on PDP / pre-checkout** | P6 | Discovering non-serviceability at the payment step is a top cause of checkout abandonment. Shiprocket exposes EDD (Estimated Delivery Date) by pincode. | LOW–MED | Shiprocket's native Shopify app surfaces this on product page. Enable at Phase 6. |
| 16 | **3 bundle SKUs: Trial 5 / Fitness 15 + Shaker / Bulk 30** | P6 | Explicit in blueprint. Bundles offset shipping cost and lift AOV. "Fitness Pack" = Most Popular is the pricing-psychology anchor. | LOW (data) | Already specified in `capshot-commerce-rollout`. |
| 17 | **Visual UGC/photo reviews** | P6 | Judge.me on 52.7% of all Shopify stores with UGC; Loox is the F&B favorite. "Visual reviews are the strongest form of social proof" for first-time buyers. | LOW (install app) | Install Loox or Judge.me on Shopify at Phase 6; seed with 10–20 real customer photos from pre-launch waitlist audience. |
| 18 | **Legal pages: Privacy, Terms, Refund, Shipping** | P6 | Required for Razorpay KYC, Shopify go-live, FSSAI compliance. | LOW | Shopify provides generators; client reviews before publishing. |
| 19 | **Meta Pixel + GA4 installed on both marketing site AND Shopify** | P1→P6 | Pixel on marketing site day 1 so lookalike/retargeting pools build during waitlist phase. Install BEFORE first paid campaign — retrofitting loses data. | LOW | Pixel + GA4 tags via `<script>` + Shopify checkout events at Phase 6. Server-side tagging (Conversions API) is a P6 nice-to-have. |

### Differentiators (Where CAPSHOT Earns Share-of-Mind)

| # | Feature | Phase | Value Proposition | Complexity | Notes |
|---|---------|-------|-------------------|------------|-------|
| D1 | **Cinematic Framer Motion scroll-driven storytelling** (hero cap-twist, parallax, scroll-triggered 3-step reveal) | P1→P6 | This is the project's locked creative direction — the *reason* a custom React site exists instead of a Shopify theme. Positions CAPSHOT closer to Liquid Death / Olipop premium-brand feel vs typical Indian D2C "big product grid" look. | HIGH | Keep animations transform/opacity-only. Reduce or remove parallax on <768px — mobile scroll is fast and heavy parallax feels janky. Fallback to static for `prefers-reduced-motion`. |
| D2 | **Per-flavor accent-color system (16 unique hex washes)** | P1→P6 | Already defined in `capshot-catalog`. A grid of 16 color-washed cards is instantly scannable AND photogenic — turns the flavor page itself into shareable content. Very few Indian beverage D2Cs do this systematically. | LOW–MED | Accent is used for card wash + hover + selected-filter chip only. Never recolor the SHI-28 logo/cap. |
| D3 | **28mm bottle-compatibility affordance** (hero shows cap twisting onto a *regular* water bottle) | P1→P6 | THE core "aha." Users don't buy a bottle, they buy a cap. Not showing a real-world existing bottle wastes the pitch. Blueprint explicitly spec's "custom cap being twisted onto a standard transparent water bottle." | MED | Hero video/graphic must feature a plain generic bottle (Bisleri-esque) — not a branded CAPSHOT bottle, which would confuse the format. |
| D4 | **USP comparison grid (CAPSHOT vs Regular Energy Drinks)** | P1→P6 | Table lands the freshness/portability/nutrient story in <5s of scanning. Blueprint spec'd this; it's the single section that makes the premium pricing feel justified. | LOW | Place NEAR Premium Sports section (energy framing), not top of homepage — hero stays "refreshing hydration" per `capshot-brand`. |
| D5 | **Hinglish headlines ("Twist karo. Shake karo. BOOM")** | P1→P6 | Audience-coded voice. Most Indian D2Cs over-index English or over-index Hindi; Hinglish headline + English body = IG-native feel. | LOW | Already approved in `capshot-brand`. Headlines Hinglish, body copy English for scannability. |
| D6 | **Dedicated Premium Sports range showcase** | P1→P6 | 4 of 16 flavors are high-margin energy-coded (Matcha / Black Pump / Java Pump / Coffee). Separate section = higher AOV upsell path without turning the whole site into "energy drink." | LOW | Darker color treatment per `capshot-catalog` accents (#1A1A1A, #3E2817, #5B8A3A). |
| D7 | **Light/dark mode with WCAG AA across brand palette** | P1→P6 | Rare in Indian D2C; signals premium design maturity. Mobile users on OLED Androids notice. | MED | Palette is already locked. Audit contrast ratios at build time, not runtime. |
| D8 | **Flavor-finder quiz ("What's your CAPSHOT?")** | P6 (defer from P1) | Quizzes deliver 25–40% conversion vs ~2.86% baseline for standard product pages. Beverage brands with many flavors (Skinny Mixes, coffee-finder quizzes) see 41% quiz conversion. 16 flavors + 3 ranges is the ideal quiz surface. | MED | 4–6 questions: taste preference (fruity/desi/strong), use occasion (workout/office/travel), caffeine Y/N, flavor adventure level. Output: 2–3 recommended caps → "Add to Trial Pack." Defer to Phase 6 — needs real purchase flow to pay off. |
| D9 | **WhatsApp cart-recovery + waitlist nurture via BSP** | P1.5→P6 | CTWA + WhatsApp cart recovery in India achieves 68%+ recovery rates when sent within 7 minutes of abandonment. Phase 1: use for "we launched!" announcement to waitlist. Phase 6: use for abandoned Shopify checkouts. | MED | Needs a BSP (Business Service Provider) subscription — Zoko, Wati, AiSensy, Interakt are common. Not needed day one; add once waitlist crosses ~500 or Phase 6 commerce goes live. |
| D10 | **Sticky "Buy Now" bar on mobile PDP/bundle pages** | P6 | 3–7% add-to-cart lift on mobile with no other changes; some sources report 8–15%. Standard mobile commerce move; absence is noticed by trained D2C shoppers. | LOW | 64–80px tall, variant selector + Add to Cart. Appears after user scrolls past hero. Only on Shopify side at Phase 6 — not needed on P1 marketing site. |
| D11 | **Centralized CTA config (`src/config/cta.ts`)** | P1→P6 | Technical differentiator for the *team*, not users — but it's the reason Phase 6 is a swap not a rewrite. | LOW | Already in PROJECT.md Active requirements. |
| D12 | **Instagram Shopping tags synced to Shopify catalog** | P6 | Mamaearth, Sugar, Plum tag 90%+ of organic content; 8–15% of their site traffic comes from IG Shopping tags. Pure gain once catalog is live. | LOW (operational) | Set up Meta Commerce Manager with Shopify feed sync. Required fields: id, title, description, availability, price, link, image_link, brand, currency=INR. |

### Anti-Features (Commonly Requested, Explicitly Don't Build)

| # | Feature | Why Requested | Why Problematic | Alternative |
|---|---------|---------------|-----------------|-------------|
| A1 | **Newsletter popup wall (modal "Enter email for 10% off" on page load)** | "Everyone does it; captures email list." | Pop-ups shown before user engages increase bounce significantly on mobile; nav/popups on paid landing pages lift bounce 20–30%. CAPSHOT's P1 channel is WhatsApp not email anyway. Email captures live inside Shopify from Phase 6 (post-purchase + abandoned cart automated flows). | WhatsApp CTA stays primary. If an exit-intent email capture is tried, delay 10s minimum, mobile only on exit gesture, and never on first page view. |
| A2 | **Chatbot widget (Intercom-style bubble on every page)** | "Looks like we offer support." | Live chat has an ongoing cost (BSP seats or staffing) and adds 50–150KB of JS that hurts Lighthouse. WhatsApp CTA already is "chat with us" — don't fragment the channel. | WhatsApp Business floating button in bottom-right (optional, mobile only, lazy-loaded) that opens `wa.me` link. No embedded chat UI. |
| A3 | **Blog / content hub in v1** | "SEO and thought leadership." | Already in PROJECT.md Out of Scope. Pre-revenue, pre-FSSAI brand; blog is editorial debt not traffic. SEO for food/bev D2C is driven by product/flavor pages + brand searches, not editorial. | Defer to post-Phase 6 after brand validation. Pour that effort into IG Reels + CTWA ads instead. |
| A4 | **Embedded cart on marketing site** | "Fewer clicks to buy." | Already in PROJECT.md Out of Scope. Running cart state on the React site + Shopify would require sync logic + the Buy SDK + payment PCI scope. The hybrid redirect to Shopify checkout keeps the two concerns clean and is what the Phase 6 architecture is built around. | "Shop Now" button → Shopify product URL. Shopify checkout handles cart/payment/order/inventory. |
| A5 | **International shipping / multi-currency at launch** | "Reach NRIs / global." | Already in PROJECT.md Out of Scope. Int'l cards drive fraud risk in India; shipping F&B abroad has customs + FSSAI equivalence issues; distracts from India unit economics. | Disable Razorpay international methods and Shopify intl shipping zones at Phase 6 launch. Revisit after 6 months of India-only metrics. |
| A6 | **Native mobile app (iOS/Android)** | "Everyone has an app." | Already in PROJECT.md Out of Scope. ~₹5–15L to build, ongoing maintenance, app store review friction, no retention loop that mobile web can't do. | Mobile web with PWA manifest + add-to-homescreen is sufficient for ad-driven D2C. |
| A7 | **Loyalty program / referral codes in v1** | "Reward early customers." | Already in PROJECT.md Out of Scope. No repeat-purchase base to activate yet. Loyalty mechanics are tuned to cohorts you don't have. | Add via Shopify app (Smile.io, LoyaltyLion) 3–6 months after Phase 6 go-live, once repeat-rate data exists. |
| A8 | **Email marketing capture in Phase 1** | "Build the launch list on email." | Already in PROJECT.md Out of Scope. Email requires an ESP (Mailchimp/Klaviyo) + opt-in compliance + a send cadence; WhatsApp Business is faster, cheaper, higher open rate (90%+ vs email 20–25%) for Indian audiences. | WhatsApp Business waitlist in P1. Shopify + Klaviyo-equivalent email flows (abandoned cart, post-purchase) at P6, where email is a *retention* channel not an acquisition one. |
| A9 | **"Energy drink" hero positioning / dark neon aesthetic** | "Energy drinks are a hot category." | Already in PROJECT.md Out of Scope. Only 4 of 16 flavors are energy-coded; a Red Bull-style hero alienates the 9 fruity + 3 desi SKUs. | Hero = "refreshing hydration + flavor on demand." Dedicated Premium Sports section carries the energy story. |
| A10 | **Desktop-first design that scales down** | Historical web habit. | Already overridden in PROJECT.md Constraints. 95% mobile traffic reality means desktop-first = designing for 5%. | Mobile-first (360–430px), scale up to tablet, then desktop as max-width constrained. |
| A11 | **Autoplay sound on hero video** | "More immersive." | Browsers block it; users mute it; bounce spike. | Silent looping video or scroll-triggered keyframe animation. If audio exists, require explicit tap. |
| A12 | **Full-Hindi or full-English copy** | "Pick a language." | Full Hindi alienates English-first urban buyers; full English feels corporate. | Hinglish headlines + English body copy (already locked in `capshot-brand`). |
| A13 | **Blog + CMS backend / Sanity/Contentful** | "We'll want to publish articles." | CMS adds cost + runtime complexity for content that doesn't exist yet and isn't in scope. | Static TypeScript data files (`src/data/flavors.ts`) — zero infra, versioned in git. Migrate to CMS if/when content volume justifies. |
| A14 | **"Live inventory" counter on waitlist page** | "Create urgency." | Fake urgency gets called out; real inventory ("17 left!") requires real inventory, which pre-launch brands don't have. Erodes trust if detected. | Honest "Launching Soon — Join [N] others on the waitlist" counter, updated manually or from a WhatsApp Business list export. |

## Feature Dependencies

```
Hero (<5s clarity) ────┐
                       ├──> Everything downstream only matters if hero works
"How It Works" 3-step ─┘

CTA config (src/config/cta.ts) ───requires──> WhatsApp link (P1) OR Shopify URL (P6)
                                      │
                                      └──> swap target at Phase 6, zero component changes

Flavor data model (Shopify-shaped) ──enables──> Phase 6 commerce migration (data swap, not refactor)
                     │
                     └──enables──> Flavor-finder quiz (needs structured flavor/range/accent/dosage data)

FSSAI license (client-provided) ──BLOCKS──> Phase 6 commerce go-live
                                       │
                                       └──> trust badge strip (badge is placeholder until number arrives)

Razorpay KYC approval ──BLOCKS──> UPI/COD/cards checkout at Phase 6
                              │
                              └──> requires FSSAI for food-category KYC

Shiprocket pickup verified ──BLOCKS──> order fulfillment at Phase 6
                                   │
                                   └──> enables pincode serviceability check on PDP

Meta Pixel + GA4 ──must-exist-before──> first paid IG/FB campaign
                                   │
                                   └──> otherwise lookalike/retargeting pools don't build during P1 waitlist

Visual UGC reviews (Loox/Judge.me) ──requires──> real customer photos
                                            │
                                            └──> can be seeded from P1 waitlist audience post-launch

WhatsApp cart recovery (BSP) ──requires──> live Shopify checkout events
                                       │
                                       └──> only payoff is at P6
```

### Dependency Notes

- **Hero → everything else:** If the hero fails the 5-second concept test, no other feature compensates. All design/dev iteration priority goes here first.
- **CTA config is the Phase 6 pivot point:** The single file `src/config/cta.ts` is what makes "waitlist site → commerce site" a one-line edit instead of a rewrite. Already decided in PROJECT.md; just reinforcing why it's load-bearing.
- **FSSAI blocks three things:** Phase 6 commerce go-live, Razorpay food-category KYC, and the credibility of the trust-badge strip. It's the single highest-leverage client-provided artifact.
- **Pixel installation before ads, not after:** Pools built during the P1 waitlist phase become the retargeting + lookalike seed for Phase 6 commerce launch. Installing after launch loses 2–3 months of audience data.
- **Flavor-finder quiz needs commerce to pay off:** On a waitlist-only P1 site, the quiz output ("your flavor is Mango") has nowhere to convert to. Build at Phase 6 when there's a cart to drop recommendations into.

## MVP Definition

### Launch With (v1 — Phase 1 Marketing Site)

Minimum to open a WhatsApp waitlist from mobile ad traffic. Ruthless cut; everything else waits.

- [ ] **Hero section** — Hinglish headline, cap-on-bottle visual, one primary CTA → WhatsApp
- [ ] **How It Works** 3-step (Twist / Shake / Boom) with icons or lightweight animation
- [ ] **16 flavors browsable** with range filters (All / Fruity Blast / Desi & Cool / Premium Sports) and per-flavor accent washes
- [ ] **Variant/dosage explainer** (200–250ml vs 350–500ml)
- [ ] **Trust badges strip** (FSSAI placeholder, Vegan, Non-GMO, Made in India) — real FSSAI number before Phase 6
- [ ] **FAQ accordion** (6–8 Qs covering safety, bottle fit, sugar/caffeine, pricing-TBD, shipping-TBD, launch date)
- [ ] **About + founder story** (placeholder bio OK)
- [ ] **Contact page** (WhatsApp Business + IG handle + email)
- [ ] **Centralized `src/config/cta.ts`** routing all CTAs through one destination
- [ ] **Mobile-first, Lighthouse ≥90**, FMP <2s on 4G
- [ ] **Light/dark mode** with WCAG AA across brand palette
- [ ] **OG tags per route + sitemap.xml**
- [ ] **Meta Pixel + GA4 installed** (so waitlist traffic builds pixel pools from day one)

### Add After Validation (v1.x — Phase 2–5 Polish, Still Pre-Commerce)

- [ ] **USP comparison grid** (CAPSHOT vs Regular Energy Drinks) — adds polish; defer if hero/catalog eating time
- [ ] **Premium Sports range dedicated showcase** — separate section with darker treatment
- [ ] **Framer Motion scroll-driven storytelling** polished across sections — add once content is in place; animate transform/opacity only
- [ ] **Floating WhatsApp CTA button** (mobile only, bottom-right, lazy-loaded)
- [ ] **Waitlist counter** (honest "N people joined") — pulled manually or from WhatsApp Business list
- [ ] **PWA manifest + add-to-homescreen prompt**
- [ ] **Instagram feed embed on homepage** (via oEmbed, lazy-loaded) — only if content cadence can sustain it

### Phase 6 (Commerce Launch — Separate Milestone)

Only triggered by: FSSAI license in hand + inventory warehoused + client approves ~₹2k/mo Shopify spend.

- [ ] **Shopify Basic** active, `shop.capshot.co` domain mapped
- [ ] **16 flavor products** + **3 bundle products** (Trial 5 / Fitness 15 + Shaker / Bulk 30) in Shopify
- [ ] **Razorpay** live keys installed, UPI prioritized, cards + COD (with ₹2000 cap) enabled
- [ ] **Shiprocket** connected, pickup verified, pincode serviceability on PDP
- [ ] **Legal pages** published (Privacy / Terms / Refund / Shipping)
- [ ] **FSSAI license number** on trust badges + footer
- [ ] **CTA swap** in `src/config/cta.ts` from WhatsApp → Shopify
- [ ] **Flavor data populated** with `shopifyProductId` and `priceInr`
- [ ] **Pixel + GA4 on Shopify checkout** (events: AddToCart, InitiateCheckout, Purchase)
- [ ] **Instagram Shopping catalog sync** via Meta Commerce Manager
- [ ] **Visual UGC reviews** (Loox or Judge.me) installed, seeded with 10–20 real customer photos
- [ ] **Sticky "Buy Now" bar** on Shopify PDP (via theme customization or app)
- [ ] **COD order confirmation flow** (IVR or WhatsApp) before dispatch to curb RTO

### Future Consideration (v2+ — After Phase 6 Has Traction)

- [ ] **Flavor-finder quiz** ("What's your CAPSHOT?") — build once there's a cart to convert into
- [ ] **Subscription SKU** (monthly auto-ship) — once repeat-purchase cohort exists
- [ ] **Loyalty / referral program** (Smile.io, LoyaltyLion) — once repeat rate is measurable
- [ ] **WhatsApp cart-recovery automation** via BSP (Zoko / Wati / AiSensy / Interakt)
- [ ] **Server-side pixel tracking** (Conversions API) — once ad spend justifies attribution investment
- [ ] **White-labeled Shiprocket tracking page** (`track.capshot.co`) — once shipment volume justifies paid Shiprocket plan
- [ ] **Blog / editorial** — only once brand is validated and content-market fit established
- [ ] **International shipping** — only after 6+ months of India-only unit economics
- [ ] **Content partnerships / UGC campaign hashtag** — amplify after a seed base of customers exists

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Hero (<5s concept) | HIGH | MEDIUM | **P1** |
| How It Works 3-step | HIGH | LOW | **P1** |
| 16 flavors + range filter | HIGH | MEDIUM | **P1** |
| Variant/dosage explainer | HIGH | LOW | **P1** |
| Trust badges strip | HIGH | LOW | **P1** |
| WhatsApp CTA + centralized config | HIGH | LOW | **P1** |
| Mobile perf (Lighthouse ≥90) | HIGH | MEDIUM | **P1** |
| FAQ accordion | MED | LOW | **P1** |
| About + founder story | MED | LOW | **P1** |
| Pixel + GA4 install | HIGH (business) | LOW | **P1** |
| USP comparison grid | MED | LOW | **P2** |
| Framer Motion storytelling polish | HIGH (brand) | HIGH | **P2** |
| Light/dark mode | MED | MEDIUM | **P2** |
| Premium Sports showcase | MED | LOW | **P2** |
| Floating WhatsApp button | MED | LOW | **P2** |
| Hinglish headlines | HIGH | LOW | **P1** (copy-only) |
| OG tags + sitemap | MED | LOW | **P1** |
| Shopify + Razorpay + Shiprocket | HIGH | HIGH | **P6** |
| 3 bundle SKUs | HIGH | LOW (data) | **P6** |
| Pincode serviceability check | HIGH | LOW | **P6** |
| Visual UGC reviews (Loox/Judge.me) | HIGH | LOW | **P6** |
| Sticky "Buy Now" bar (mobile) | HIGH | LOW | **P6** |
| COD + prepaid incentive | HIGH | MED (policy) | **P6** |
| IG Shopping catalog sync | MED | LOW | **P6** |
| Flavor-finder quiz | MED | MEDIUM | **P6+** |
| WhatsApp cart recovery (BSP) | MED | MEDIUM | **P6+** |
| Loyalty / referral | MED | MEDIUM | **Future** |
| Subscription SKU | HIGH | HIGH | **Future** |

**Priority key:**
- **P1** — Must ship in Phase 1 (marketing site + waitlist)
- **P2** — Phase 2–5 polish, same codebase, pre-commerce
- **P6** — Phase 6 commerce launch (triggered by FSSAI + inventory + budget)
- **P6+ / Future** — Post-commerce, after retention/repeat data exists

## Competitor Feature Analysis

| Feature | Sleepy Owl (coffee D2C) | Blue Tokai (coffee D2C) | Liquid Death / Olipop (US bev) | CAPSHOT Approach |
|---------|-------------------------|-------------------------|-------------------------------|------------------|
| Hero clarity | Impactful hero + packaging-forward | Clean, modern, product-forward | Brand-personality-forward (humor / nostalgia) | Concept-forward (TWIST.SHAKE.BOOM); product + hinglish |
| Flavor browsing | Grid with filters | Grid with brewing-method filters | Flavor-tile grid, bright accents | 16 flavors × 3 range filters + per-flavor accent hex |
| Subscription | Yes, prominent | Yes | Yes (DTC) | Deferred to v2+ (needs repeat-base) |
| Checkout | Popup/fast mobile checkout | Standard Shopify | US-standard | Shopify + Razorpay (UPI prioritized), COD gated |
| Reviews | Judge.me-style verified reviews | Yes, long-form | Yes, extensive UGC | Loox/Judge.me at P6, seeded from waitlist |
| Trust badges | FSSAI + certifications visible | FSSAI + sourcing stories | FDA-equivalent + ingredient callouts | FSSAI + Vegan + Non-GMO + Made in India |
| WhatsApp channel | Secondary | Secondary | N/A (US market) | **Primary** in P1 (waitlist), secondary at P6 |
| Scroll animation / storytelling | Minimal | Minimal | High on brand site (Liquid Death) | **High** — the project's locked creative direction |
| Hinglish copy | Mostly English | English-first | English (US) | **Hinglish headlines + English body** |
| COD | Yes | Yes | N/A | Yes with ₹2000 cap + confirmation flow at P6 |
| Loyalty | Yes | Yes | Olipop: emerging | v2+ after repeat data |

## India D2C-Specific Nuances (Called Out)

These do not exist in US/EU D2C playbooks and must be deliberately designed in:

1. **UPI is 50–60% of prepaid online checkout.** Not optional; must be loudest payment option. Razorpay handles the surface, but marketing site should display "UPI accepted" lockup alongside Secure Checkout.
2. **COD is a double-edged sword.** Expected by audience, but 30%+ RTO rates are a margin killer. Required mitigations: order confirmation (IVR/WhatsApp) before dispatch, max COD order value cap, prepaid discount incentive (₹30–100 or free shipping converts 68–74% of COD intents to prepaid).
3. **Shopify Payments is NOT available in India.** Razorpay (or PayU/Cashfree) is mandatory. Shopify's 2% non-Shopify-Payments transaction fee is unavoidable on Basic plan.
4. **FSSAI license + logo is legally required** for F&B online sale in India. Without it, Razorpay won't approve food-category KYC, and penalties are real.
5. **FSSAI Vegan Logo (notified June 2022)** is the only legally recognized "vegan" claim in India. Generic "V" symbols from US/EU vegan societies aren't compliant.
6. **Veg/Non-Veg symbol is a hard legal requirement** and a top purchase-decision factor for Indian consumers. Must appear on product packaging and ideally on PDP.
7. **WhatsApp Business + Click-to-WhatsApp Ads deliver 3–7× ROI vs Meta lead ads** in India. This is why Phase 1 uses WhatsApp as the conversion channel (not email).
8. **Pincode serviceability varies dramatically** across tier 2/3/4 cities and remote states. Discovering non-serviceability at checkout is a top abandonment cause; surface on PDP via Shiprocket at Phase 6.
9. **Mobile = 85% of D2C traffic**, often mid-range Androids on patchy 4G. "Mobile-first" is not a design preference; it's an engineering constraint. Every 1s delay costs ~20% of mobile conversion.
10. **Hinglish is audience-coded.** Full English feels corporate; full Hindi alienates urban buyers. Headline Hinglish + body English is the Indian D2C sweet spot — but copy choices are brand-specific, not formulaic.
11. **COD remittance via Shiprocket takes ~7 days.** Factor into cashflow modeling; not a feature per se but shapes checkout UX (do we message about remittance delay? No — surface payment method differently).
12. **Instagram Shopping tags on 90%+ of organic content** is the Mamaearth/Sugar/Plum playbook — 8–15% of site traffic comes from IG tags once operational. Requires Meta Commerce Manager + Shopify catalog feed sync (P6).

## Sources

### Indian D2C ecosystem + commerce patterns
- [Shopify for Indian D2C Brands: The Complete 2026 Guide](https://projectsupply.in/blog/shopify-for-indian-d2c-brands) — HIGH confidence; Shopify-India specifics
- [Conversion Rate Optimization for D2C Shopify Stores: 2026 CRO Guide](https://creatorcity.in/blog/conversion-rate-optimization-d2c-shopify-stores/) — HIGH; mobile conversion data
- [Ecommerce Conversion Rate India 2026: D2C Benchmarks](https://cognitoitconsultancy.com/ecommerce-conversion-rate/) — HIGH; conversion rate benchmarks
- [D2C Beverage Brand India: Sell on Blinkit & Amazon](https://www.flavorcatalyst.com/insights/d2c-beverage-brand/) — MEDIUM; F&B D2C specifics
- [Top 25 D2C Food & Beverage Brands in India 2026](https://foodsure.co.in/blog/top-25-d2c-food-and-beverage-brands-in-india/) — MEDIUM; competitor landscape
- [49 F&B D2C Brands Reshaping Indian Consumer Market (Inc42)](https://inc42.com/features/fb-d2c-brands-in-india/) — HIGH; F&B D2C landscape

### COD/RTO + payments
- [How to Reduce RTO in Ecommerce: 2026 Guide (Hillteck)](https://www.hillteck.com/blog/reduce-rto-ecommerce-india.html) — HIGH; RTO mitigation playbook
- [Shopify D2C India RTO: True Cost Model](https://projectsupply.in/blog/shopify-d2c-india-rto-true-cost-model) — HIGH; RTO economics
- [How to Reduce RTO on COD Orders — India D2C Playbook (Marqet)](https://marqet.in/resources/reduce-rto-cod-orders) — HIGH; prepaid incentive data
- [Razorpay Shopify Payment Gateway Pricing 2026](https://razorpay.com/blog/razorpay-shopify-payment-gateway-pricing-explained/) — HIGH; payment gateway cost
- [Razorpay × Shopify Integration Guide 2026](https://dctechnolabs.in/blog/razorpay-shopify-setup-guide/) — MEDIUM; setup details

### WhatsApp + Click-to-WhatsApp Ads
- [Click-to-WhatsApp Ads India Guide (Mark360)](https://mark360.ai/blog/click-to-whatsapp-ads-india-2026) — MEDIUM; CTWA ROI benchmarks
- [WhatsApp Commerce in India 2026 (Behaf)](https://www.behaf.co/whatsapp-commerce-india) — MEDIUM; D2C WhatsApp patterns
- [Best WhatsApp Business API Providers in India (Zoko)](https://www.zoko.io/post/best-whatsapp-business-api-india) — MEDIUM; BSP landscape

### FSSAI + trust/certifications
- [India Vegan Logo Guidelines (Regask)](https://regask.com/india-vegan-logo-guidelines/) — HIGH; FSSAI vegan regulation
- [Vegan Certification in India (Food Safety Genie)](https://foodsafetygenie.com/vegan-certification-in-india-complete-guide-to-vegan-food-fssai-endorsement-logo-approval/) — HIGH; FSSAI vegan compliance
- [Packaging Labeling Requirements India (Confetti)](https://confetti.design/blog/packaging-labeling-requirements-india) — MEDIUM; label compliance

### Waitlist / pre-launch pages
- [15 Waitlist Landing Page Examples That Convert (LaunchList)](https://getlaunchlist.com/blog/waitlist-landing-page-examples-that-convert) — MEDIUM; waitlist UX patterns
- [Waitlist Page Strategy 2026 (Unicorn Platform)](https://unicornplatform.com/blog/waitlist-page-strategy-in-2026/) — MEDIUM; qualified-signup patterns
- [6 Common Mistakes on D2C Landing Pages (Slixta)](https://slixta.com/articles/mistakes-to-avoid-on-your-d2c-landing-page) — MEDIUM; D2C LP anti-patterns

### Mobile CRO + sticky CTA
- [Shopify Sticky Add-to-Cart Bar (Cartylabs)](https://cartylabs.com/blog/shopify-sticky-add-to-cart-bar/) — MEDIUM; sticky bar conversion lift
- [Sticky ATC Best Practices + 8–15% Lift (EasyApps)](https://easyappsecom.com/guides/sticky-add-to-cart-best-practices) — MEDIUM; mobile sticky conversion data
- [27 Popup Best Practices (Wisepops)](https://wisepops.com/blog/popup-best-practice) — MEDIUM; popup timing

### Product quiz / interactive flavor finder
- [Shopify Quiz Guide 2026 (Outgrow)](https://outgrow.co/blog/shopify-quiz-funnel-guide) — MEDIUM; quiz conversion data
- [Ecommerce Product Quizzes (Digioh)](https://www.digioh.com/ecommerce-product-recommendation-quiz) — MEDIUM; quiz benchmarks

### Framer Motion + mobile performance
- [Scroll Video Hero — Framer Marketplace](https://www.framer.com/marketplace/components/scroll-video-hero/) — HIGH; scroll hero pattern reference
- [Framer Scroll Animations Guide](https://framerwebsites.com/blog/framer-scroll-animations-guide) — MEDIUM; mobile animation performance

### Shiprocket / fulfillment
- [Shiprocket FAQ](https://www.shiprocket.in/faq/) — HIGH; serviceability + pricing specifics
- [DIY Shipping & Fulfillment for Indian D2C (Growwwtech)](https://growwwtech.com/blog/diy-shipping-fulfillment-setup-for-indian-d2c-brands-2026-complete-guide) — MEDIUM; integration playbook

### UGC reviews
- [Loox Product Reviews App (Shopify App Store)](https://apps.shopify.com/loox) — HIGH; app positioning
- [Best Shopify UGC Apps 2026 (StoreInspect)](https://storeinspect.com/blog/best-shopify-ugc-apps) — MEDIUM; Judge.me / Loox market share

### Competitor references
- [Blue Tokai Website Design Analysis (DesignRush)](https://www.designrush.com/best-designs/websites/blue-tokai-coffee) — LOW–MEDIUM; marketing review
- [Sleepy Owl UI/UX Audit (Confetti Design)](https://confetti.design/audit/sleepy-owl) — LOW–MEDIUM; marketing audit
- [How Olipop Became a Billion-Dollar Brand (OMR)](https://omr.com/en/daily/liquid-death-olipop-celsius-vc) — LOW; US-market context (not India)

### Analytics
- [Instagram Shopping + Meta Ads India D2C Playbook 2026 (Wittelsbach)](https://www.wittelsbach.ai/post/instagram-shopping-meta-ads-india-d2c-playbook-for-2026) — MEDIUM; IG Shopping setup
- [State of Indian D2C 2026 (Impuls8)](https://www.impuls8.com/blog/state-of-indian-d2c-2026) — MEDIUM; D2C analytics patterns

---
*Feature research for: India-first D2C beverage brand (SHI-28 CAPSHOT) — marketing site now, Shopify commerce at Phase 6*
*Researched: 2026-10-09*
