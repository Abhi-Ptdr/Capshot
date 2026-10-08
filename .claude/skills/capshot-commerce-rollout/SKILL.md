---
name: capshot-commerce-rollout
description: Phase 6 playbook for turning the CAPSHOT marketing site into a live D2C store by integrating Shopify (storefront + checkout), Razorpay (payment gateway for India — UPI/cards/net-banking; COD disabled at launch), and Shiprocket (multi-courier shipping aggregator with tracking). Covers account setup, true blended-cost math (not the marketing-copy version), bundle SKU structure with MDR-safe pricing (Trial 5 / Fitness 15 + shaker / Bulk 30), the TrustBadge evidence contract, India-specific commerce reality (Shopify Payments unavailable, GST stacking, HSN code decision, COD RTO 30%, Instagram WKWebView UPI breakage), CTA swap procedure from WhatsApp waitlist to Shopify checkout, and launch checklist. Load this skill ONLY when actively wiring commerce — Shopify account creation, Razorpay keys, Shiprocket integration, bundle pricing, FSSAI badges, 'Buy Now' CTA switch, GST invoice setup, or any live-store work. Do NOT load for general site development.
---

# CAPSHOT Commerce Rollout (Phase 6)

**Status:** Deferred until inventory ships. Marketing site in Phases 1–5 is built so this phase is a near-zero-refactor swap: 3 files edited, 2 files added, 1 section un-gated.

## Entry gates (ALL required before Phase 6 planning starts)

1. **GATE-FSSAI** — Client delivers 14-digit FSSAI license number. Blocks Razorpay food-category KYC, `<TrustBadge>` production render, and legal "FSSAI Licensed" phrasing.
2. **GATE-INVENTORY** — Client confirms inventory warehoused with verified Shiprocket pickup address.
3. **GATE-BUDGET** — Client approves ~₹2,000/mo Shopify Basic recurring budget + payment-gateway signup commitment.
4. **GATE-NUTRITION** — Client delivers nutrition facts + caffeine content per flavor. Required for FSSAI-compliant PDP labels AND Premium Sports caffeine advisory.

Do not spawn `/gsd:plan-phase 6` until all four are confirmed.

## Architecture (locked)

**Hybrid:** Custom React marketing site at `capshot.co` + Shopify-hosted storefront at `shop.capshot.co` (or `shi28.myshopify.com`).

- Marketing site: brand storytelling, flavor browsing, trust-building.
- Shopify: product pages, cart, checkout, order management, inventory, discount codes, abandoned cart emails.
- "Shop Now" CTAs on marketing site redirect to Shopify product URLs.
- **NO embedded cart on marketing site.** No `@shopify/storefront-api-client` dependency unless live price/stock on marketing-site cards becomes a hard requirement.

## India commerce reality (what the official docs don't tell you)

### Shopify Payments is not available in India

Must use Razorpay (or PayU/CCAvenue). Shopify Basic therefore applies a **2% third-party transaction fee** on top of Razorpay's gateway fee — this is a hard architectural cost in India, not a Shopify-plan upgrade problem.

### Razorpay MDR change — Fitness Pack must be ₹1,999, not ₹2,000

Effective **October 15 2026**, Razorpay charges **0.4% MDR (capped ₹300) on UPI payments > ₹2,000**. Fitness Pack priced at ₹2,000 crosses the threshold. **Price at ₹1,999** to stay in the 0% UPI tier. Difference is ₹1 of revenue, worth ~₹8 of MDR per transaction and the right "feels under 2k" psychology.

### Real blended cost per order (not the brochure version)

| Order type | Razorpay | Shopify txn fee | GST on gateway | True blended |
|---|---|---|---|---|
| **Prepaid UPI ≤ ₹2,000** | 0% | 2% | 18% on gateway fee only | **~2.0–2.4%** |
| **Prepaid UPI > ₹2,000** | 0.4% (capped ₹300) | 2% | 18% on gateway fees | **~2.9–3.1%** |
| **Prepaid card (domestic)** | ~2% | 2% | 18% on gateway fees | **~4.4%** |
| **COD** (if enabled) | ₹60–100 flat + 1–2% Shiprocket COD fee | 2% | 18% on fees | **7–10% before RTO shrinkage** |

Shipping is on top: Shiprocket Lite ₹26/500g base balloons to **₹73–86 all-in** after fuel surcharge + zone + COD fee + GST. For a ₹500 trial pack this is 14–17% of order value.

**Build a per-order margin model BEFORE finalizing bundle prices.** Treat this as a Phase 6 planning prerequisite, not an afterthought.

### COD is disabled at launch

India D2C 2026: **prepaid RTO 2–3%, COD RTO 25–30%** (fashion up to 40%). On a ₹500 trial each COD RTO costs ₹180–₹415 all-in. Launching prepaid-only is the single biggest Phase 6 margin lever.

**COD enablement playbook (post-launch, not Phase 6 scope):**
- Keep disabled for first 500 orders / first 30–60 days
- Enable with: OTP phone verification before dispatch + ₹1,500 max order value cap + pincode gate (block high-RTO zones)
- Add "Save ₹49 — Pay Online" prepaid incentive at checkout
- Monitor RTO weekly; disable zones that cross 35% RTO

### GST handling (HSN code is a CA decision)

- GST registration mandatory once turnover crosses ₹40 lakh (or immediately for interstate sales).
- **HSN code**: powder beverage caps likely fall under HSN **2106** (food preparations n.e.s.) OR HSN **2202** (waters incl. flavored beverages). Both are 18% GST, but invoice classification differs. **Needs chartered accountant input before Shopify goes live.** Flag this during Phase 6 planning.
- Shopify prices must be configured **tax-inclusive** so UPI quick-checkout shows the final rupee amount, not pre-GST confusion.
- Install a GST invoice generator app (`GST Invoice India` or `Simple Invoices+GST`) — Shopify's default invoices are not India-GST-compliant.

### Instagram WKWebView breaks UPI Intent silently (iOS)

95% of traffic comes from Instagram/Facebook ads. Inside Instagram's iOS WKWebView:
- Razorpay UPI Intent (`upi://pay?...`) fails silently — iOS blocks third-party app launches from embedded webviews
- Autofill is broken; cookies are stripped; analytics captures only ~10% of ad clicks
- **Fix:** The marketing site's in-app browser detect banner (CONV-02, built in Phase 1) nudges users to Safari. On Shopify checkout page itself: force top-level navigation (`target="_top"` or `window.top.location`) and provide **VPA copy fallback** ("Copy UPI ID: capshot@kotak") when Intent fails.

## Shopify setup (step-by-step)

1. **Create Shopify account** at `shopify.com/in` → start trial (3 days + often ₹20/mo for 3 months promo).
2. **Pick Basic plan** (₹1,994/mo). Starter plan (₹399/mo) is social-selling only — NOT a storefront.
3. **Map domain:** Shopify Admin → Settings → Domains → "Connect existing domain." Use `shop.capshot.co`; marketing site stays on root.
4. **Pick theme:** Dawn (free, reference theme). Customize minimally — brand colors, logo, hero. Storytelling lives on the marketing site, not here.
5. **Create products** — one Shopify product per flavor (16 total) using `handle` from `capshot-catalog` skill. Attach images from `/public/flavors/`.
6. **Create bundle products** (3 total):
   - **Trial Pack** — Pack of 5 Caps. Mix-and-match at checkout.
   - **Fitness Pack** — Pack of 15 Caps + 1 Smart Shaker Bottle. Tag "Most Popular." **MRP ₹1,999** (NOT ₹2,000).
   - **Bulk Pack** — Pack of 30 Caps. (Name: "Bulk Pack", NOT "Bulk Energy Pack" — FSSAI "energy" language risk.)
7. **Pricing:** client provides per-cap MRP. Bundle discount ~10–20% vs single-cap price. Pass true blended cost + Shiprocket + target margin through the per-order model BEFORE setting prices.
8. **Tax config:** Settings → Taxes → set India GST, mark prices as "tax-inclusive." Confirm HSN code with CA before enabling.
9. **Install GST invoice app** from Shopify App Store.
10. **Shipping zones:** Settings → Shipping. India only (disable international). Free shipping threshold recommended at ~₹999.
11. **Legal pages:** Privacy, Terms, Refund, Shipping, DPDP-compliant data policy. Use Shopify generators; have client's legal counsel review before publishing.

## Razorpay integration (Shopify-side)

1. **Create Razorpay account** at razorpay.com. Business KYC requires: PAN, GST certificate (or declaration), bank account, **FSSAI license** (food category gate — this is why GATE-FSSAI blocks Phase 6 planning).
2. **KYC clearance:** 24–48 hrs typical; food category can take longer if FSSAI docs are flagged.
3. **In Shopify Admin:** Settings → Payments → Add payment method → "Razorpay" → paste `key_id` + `key_secret`.
4. **Enable methods:** UPI (prioritize, 0% fee under ₹2k), domestic cards, netbanking, wallets. **Disable international cards** (fraud + 3% MDR).
5. **UPI Intent, not UPI Collect** — Intent opens the UPI app via deep link; Collect sends a payment request to a VPA (slower, higher drop-off). In Razorpay dashboard: Payment Methods → UPI → prefer Intent flow.
6. **COD: DISABLED** at launch. (See "COD is disabled at launch" above.)
7. **Webhook signature verification** — Razorpay webhooks MUST verify `x-razorpay-signature` HMAC. Default Shopify integration handles this; verify in test.
8. **Test mode first.** Use Razorpay test keys to run a dummy order end-to-end before going live. Then real test with a real UPI payment on a real phone (test credentials behave differently from live).

## Shiprocket integration (Shopify-side)

1. **Create Shiprocket account** at shiprocket.in. Lite plan is free (no monthly fee).
2. **Shopify App Store** → install official Shiprocket app → authorize.
3. **Pickup address** — add warehouse address. Verification call from Shiprocket to confirm.
4. **Courier priority** — Settings → Courier Priority. Rank: Delhivery, Bluedart, DTDC commonly best for Indian D2C. Lower-priority: Ecom Express, Xpressbees.
5. **Automation** — enable "Auto-ship" so paid Shopify orders flow to Shiprocket automatically.
6. **COD remittance** — Shiprocket remits COD collections to your bank at **D+8** (default). This affects cash flow — do not price inventory assuming T+2. Early COD remittance is a paid upgrade; defer until volume justifies.
7. **Tracking page branding** — white-labeled tracking URLs on `track.capshot.co` are a paid Shiprocket plan feature. Skip until volume justifies.
8. **Weight disputes** — Shiprocket re-weighs packages at hub; disputes are common. Pack a representative sample and measure before high-volume shipping.

## Marketing site changes required at Phase 6

The Phase 1 architecture reduces this to a bounded, enumerated surface. **Any Phase 6 change outside this list is a scope regression.**

### Files edited (3)

**1. `src/config/cta.ts` — flip CTA destinations**

```ts
// Before (Phase 1):
export const ctaConfig = {
  primary: {
    label: 'Join the Waitlist',
    href: 'https://wa.me/919203975762?text=Hi%20CAPSHOT!%20I%20want%20to%20join%20the%20waitlist.',
    kind: 'whatsapp' as const,
  },
};

// After (Phase 6):
export const ctaConfig = {
  primary: {
    label: 'Shop Now',
    href: 'https://shop.capshot.co/products/fitness-pack',
    kind: 'shopify' as const,
  },
  bundles: {
    trial: 'https://shop.capshot.co/products/trial-pack',
    fitness: 'https://shop.capshot.co/products/fitness-pack',
    bulk: 'https://shop.capshot.co/products/bulk-pack',
  },
};
```

**2. `src/data/flavors.ts` — populate Shopify product IDs + prices**

For each of 16 flavors, fill in `shopifyProductId`, `priceInr`, and `available`. The `handle` field already matches Shopify's. No type changes.

**3. `src/config/features.ts` — flip feature flags**

```ts
export const features = {
  ENABLE_BUNDLES: true,        // was false
  ENABLE_SHOPIFY_CTAS: true,   // was false
};
```

### Files added (2)

**1. `src/data/bundles.ts`** — mirrors `flavors.ts` shape for the 3 bundle SKUs.

**2. `public/og/bundles.jpg`** — 1200×630 OG image for the `/` bundles section social share.

### Section un-gated (1)

**`src/sections/Bundles.tsx`** — built in Phase 1 as placeholder gated behind `features.ENABLE_BUNDLES`. Phase 6 flips the flag, rendering the three bundle cards (Trial / Fitness "Most Popular" / Bulk) on homepage.

**NO component refactors. NO new runtime libraries in marketing-site bundle. NO new routes.**

## Content additions for Phase 6

### Trust badges (regulator-correct phrasing — do not deviate)

Rendered via `<TrustBadge>` component (built in Phase 5) which requires `evidenceUrl` prop and refuses to render in `import.meta.env.PROD` without it.

| Badge text | Evidence requirement |
|---|---|
| **FSSAI Licensed – [14-digit number]** | Client's FSSAI license document |
| **Plant-based ingredients** | NABL lab report OR FSSAI vegan-logo approval (switch to "Vegan" ONLY after official FSSAI green-V-sprout logo approval under 2026 Vegan Foods amendment) |
| **Made in India** | Manufacturer address disclosure |
| **Secure Checkout** | Razorpay logo lockup + "SSL by Let's Encrypt" |

**DO NOT use:** "FSSAI Approved" (legally incorrect), "100% Vegan" (requires FSSAI logo approval), "Non-GMO" (requires NABL lab test documentation), "No preservatives" / "No artificial colors" (requires NABL per-flavor lab tests).

Why: FSSAI served notices to 20+ clean-label D2C brands in 2026 (The Whole Truth, Neuherbs, Raw Pressery, MasterChow, Troovy) for unsubstantiated front-of-pack claims. Penalties up to ₹10 lakh per SKU under Section 53.

### USP comparison (phrasing)

Compare against **"regular bottled drinks"** — NOT "regular energy drinks."

| Feature | Regular bottled drinks | CAPSHOT (SHI-28) |
|---|---|---|
| Freshness | Preserved for months | Activated instantly by you |
| Nutrient value | Degrades on shelves | 100% intact & sealed |
| Portability | Heavy to carry | Pocket-sized cap |

Place NEAR the Premium Sports section (not hero). Premium Sports copy uses **"caffeinated beverages"** with mandatory caffeine advisory — NEVER "energy drinks" (FSSAI violation, 2026 enforcement).

### Bundle section (new on homepage)

Three cards between `Flavors Teaser` and `Trust & Safety`:
- **Trial Pack** — 5 caps, best for first-timers, mix flavors
- **Fitness Pack** — 15 caps + Smart Shaker Bottle. **Most Popular** badge. **₹1,999.**
- **Bulk Pack** — 30 caps, for athletes and heavy users

## Launch checklist

### Pre-launch (before any paid campaign)
- [ ] All 4 entry gates confirmed (FSSAI, inventory, budget, nutrition)
- [ ] Per-order margin model complete; bundle prices locked (Fitness at ₹1,999)
- [ ] HSN code confirmed with CA (2106 vs 2202)
- [ ] Shopify Basic active; `shop.capshot.co` domain mapped
- [ ] All 16 flavor products created with handles matching `capshot-catalog`
- [ ] 3 bundle products created with correct names (NO "Bulk Energy Pack")
- [ ] Tax config set to tax-inclusive; GST invoice app installed
- [ ] Legal pages reviewed by client's counsel and published
- [ ] Razorpay live keys installed; UPI Intent + cards + netbanking ENABLED; **COD DISABLED**; international cards DISABLED
- [ ] Shiprocket connected; pickup address verified; courier priority ranked
- [ ] Marketing site: `src/config/cta.ts`, `src/data/flavors.ts`, `src/config/features.ts` updated
- [ ] Marketing site: `src/data/bundles.ts`, `public/og/bundles.jpg` added
- [ ] `src/sections/Bundles.tsx` renders via `features.ENABLE_BUNDLES: true`
- [ ] TrustBadge FSSAI shows real 14-digit license (not `data-pending-fssai`)
- [ ] Premium Sports flavor cards carry caffeine advisory with nutrition-data-sourced mg values
- [ ] Instagram WKWebView detect banner tested from within actual IG app on iOS + Android
- [ ] Meta Pixel + CAPI already installed on marketing site from Phase 1; add Pixel to Shopify checkout
- [ ] Instagram Shopping tags enabled on `@capshot_twist` (links to Shopify products)

### End-to-end test (on real phone, real UPI, inside actual Instagram app)
- [ ] Click Instagram ad → marketing site loads → in-app browser nudge shown
- [ ] Open in Safari → Hero → Shop Now → Shopify product page → Add to cart → checkout
- [ ] UPI Intent opens UPI app → payment completes → return to Shopify success page
- [ ] Order appears in Shopify Admin → auto-flows to Shiprocket → tracking email received
- [ ] GST-compliant invoice generated and emailed
- [ ] Meta `Purchase` event fires via Pixel + CAPI with deduplicated `event_id`

## Pitfalls to avoid

- **Shopify Payments is NOT available in India.** 2% third-party transaction fee is permanent on Basic plan — not a plan-upgrade problem.
- **COD at launch wipes margin.** 30% RTO + Shiprocket COD fees + capital lockup D+8 compounds. Prepaid-only for first 500 orders.
- **FSSAI license is MANDATORY** for selling food/beverage online in India AND for Razorpay food-category KYC. Phase 6 planning cannot start without it.
- **Fitness Pack at ₹2,000** triggers Razorpay 0.4% UPI MDR (effective Oct 15 2026). Price at ₹1,999.
- **"Energy drink" language anywhere** — FSSAI 2026 enforcement; use "caffeinated beverages." CI grep from Phase 1 (INFRA-06) blocks this at commit time.
- **"FSSAI Approved" / "100% Vegan" / "Non-GMO" without evidence** — ₹10 lakh per SKU penalty risk. TrustBadge component enforces `evidenceUrl` at build time.
- **Instagram WKWebView UPI Intent** — breaks silently on iOS. Force top-level navigation on Shopify checkout + VPA copy fallback.
- **UPI Collect instead of UPI Intent** — higher drop-off; always prefer Intent.
- **Razorpay webhook without signature verification** — order-paid webhooks can be forged; verify `x-razorpay-signature` HMAC.
- **Prices configured tax-exclusive** — UPI shows pre-GST amount, user pays different amount, bad UX. Set tax-inclusive.
- **HSN code picked without CA input** — invoice compliance risk; both 2106 and 2202 are 18% but misclassification is a notice risk.
- **Shiprocket weight disputes** — re-weighing at hub creates surprise charges. Pack sample + measure before high volume.
- **Mobile checkout flow tested only on desktop** — real phone, real UPI, inside actual Instagram app is the only valid test.
- **Meta Pixel installed late** — iOS WKWebView loses 30–40% of signals without CAPI. Pixel+CAPI already landed in Phase 1 (CONV-01); add Pixel to Shopify checkout at Phase 6.
- **GST invoice using Shopify default** — not India-compliant. Install dedicated GST invoice app.
- **COD enablement without zone-level RTO monitoring** — some pincodes have 50%+ RTO; blanket COD burns disproportionately. Enable per-zone after launch.

## Related skills

- `capshot-brand` — CTA centralization pattern (`src/config/cta.ts`) that makes the swap trivial; TrustBadge component contract.
- `capshot-catalog` — flavor data model with Shopify-aligned fields already in place.
- `.planning/research/PITFALLS.md` — full 13-pitfall technical reference; load if deep-diving a specific commerce bug.
