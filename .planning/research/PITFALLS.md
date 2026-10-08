# Pitfalls Research

**Domain:** India-first D2C beverage brand (pre-launch marketing React/Vite site → Phase 6 Shopify+Razorpay+Shiprocket commerce)
**Researched:** 2026-10-09
**Confidence:** HIGH (regulatory, Shopify India stack, Instagram in-app browser), MEDIUM (RTO rates, Framer Motion specifics)

---

## Critical Pitfalls

### Pitfall 1: Using "Energy Drink" language on a beverage you plan to sell online in India

**What goes wrong:**
Any product sold in India that calls itself an "energy drink" on the pack, in ad copy, or in product listings is now in direct FSSAI violation. On 30 June 2026 FSSAI ordered Red Bull, Sting, Monster, Hell Energy, Campa Gold Boost and Adrenaline Rush to strip the word "energy" from their labels within 90 days (deadline 29 September 2026) and relabel as "Caffeinated beverage." The Delhi High Court set aside that specific order on procedural grounds on 29 September 2026, but the underlying regulatory position — that "energy drink" has no notified standard under India's Food Category System — remains unchanged, so FSSAI can and will re-issue. For a brand launching in late 2026 / early 2027 the safe default is: do not use the words "energy drink" anywhere customer-facing.

**Why it happens:**
Legacy D2C templates (including the original CAPSHOT blueprint spec) still copy the "Ditch Unhealthy Energy Drinks!" headline pattern that was common 2022–2024. Teams import the headline without checking current FSSAI/ASCI enforcement posture.

**How to avoid:**
- Hero positioning stays "refreshing hydration / instant flavor" (already locked in `capshot-brand`). Enforce it with a CI grep that fails the build if `/energy drink/i` appears outside `src/pages/Legal/` or the dedicated Premium Sports section's prose: `grep -rniE "energy drink" src/ && exit 1`.
- Premium Sports range (Matcha / Black Pump / Java Pump / Coffee) must be described as **"caffeinated beverages"** or **"caffeinated functional drinks"** — never "energy drinks." Caffeine content per serving must be printed on the pack and the product page.
- Add the mandatory warning text next to Premium Sports flavor cards: *"Not recommended for children, pregnant or lactating women, or persons sensitive to caffeine."*
- Keep the comparison table (regular energy drinks vs CAPSHOT) in the Premium Sports section only, and phrase CAPSHOT's column as "caffeinated hydration cap" — never "energy drink."

**Warning signs:**
- Copy drafts contain "energy," "boost," "power," "unleash" as homepage headlines
- Instagram ad creatives repurpose Red Bull / Monster visual vocabulary
- Trust badges include "Energy Approved" or similar non-existent certifications

**Phase to address:**
Phase 1 (hero + copy), re-verified in Phase 4 (Premium Sports section), hard-gated in Phase 6 (before Razorpay KYC, which requires FSSAI license and will cross-check label claims).

---

### Pitfall 2: Trust-badge over-claim ("100% Natural", "Vegan", "Non-GMO", "FSSAI Approved") without substantiation

**What goes wrong:**
FSSAI served notices to **20+ clean-label D2C food brands between May and August 2026** including The Whole Truth, MasterChow, Pluckk, Raw Pressery, Two Brothers Organic Farms, Troovy, Healthy Master and Neuherbs — almost all for front-of-pack claims the regulator judged unsubstantiated. Penalties for misbranding reach ₹3 lakh per violation (per SKU); misleading claims escalate to Section 53 of the FSS Act with fines up to ₹10 lakh. "Vegan" is now a **regulated label with a mandatory logo** under the 2026 amendment to the Food Safety and Standards (Vegan Foods) Regulations, 2022 — green "V" with a sprout plus the word "VEGAN" below. Using the word without the approval + logo is a labeling violation. "FSSAI Approved" is also incorrect phrasing — FSSAI issues *licenses*, it does not "approve" products; the correct badge is "FSSAI Licensed" with the 14-digit number visible.

**Why it happens:**
Shopify theme templates and D2C blueprints (including the one in this project) list trust badges as a generic row — "FSSAI Approved / 100% Vegan & Non-GMO / Made in India / Secure Checkout" — without any guidance that each term is now regulated or that each needs supporting evidence (lab reports, certification bodies, FSSAI license number).

**How to avoid:**
- Replace "FSSAI Approved" with "FSSAI Licensed – [14-digit number]". Do not render the badge until the client provides the license number — leave a `data-pending-fssai` attribute so a lint rule can block production builds.
- Do not render the "Vegan" badge until the client has (a) applied for the FSSAI vegan logo approval and (b) supplied the standardized green "V + sprout" logo asset. Interim badge should read "Plant-based ingredients" instead.
- "Non-GMO" claim needs a supporting NABL-accredited lab test on file. If not available, drop the badge — do not render as placeholder.
- "100% Natural" — avoid entirely; the term is being actively scrutinized. Replace with specific factual claims ("No artificial colors," "No preservatives") each backed by an ingredient list.
- "Made in India" is safe if the product is actually manufactured in India (manufacturer address on the FSSAI license).
- Build a `TrustBadge` component that takes an `evidenceUrl` prop; refuses to render if `evidenceUrl` is missing in production (`import.meta.env.PROD`). Forces every badge to point to a verifiable document.

**Warning signs:**
- Badge row renders in production with placeholder license number ("FSSAI License: XXXXXXXXXXXXXX")
- Marketing copy uses "100% Natural" without an ingredient-sourcing claim nearby
- Any badge not traceable to a document the client could produce in a regulatory audit

**Phase to address:**
Phase 1 (component contract that requires `evidenceUrl`), Phase 5 (actual badge content review), hard-gated in Phase 6 (FSSAI license number required before Razorpay KYC can complete anyway).

---

### Pitfall 3: Mandatory nutrition & label data missing from online product listings

**What goes wrong:**
FSSAI's e-commerce labeling rules require online product pages to carry the **same mandatory disclosures as the physical pack**, visible *before* purchase. Mandatory fields: FSSAI logo + 14-digit license number, net quantity, batch/lot code, date of manufacture, best-before / expiry date, ingredients list in descending order, nutrition table per 100g/100mL **and per serving** (Energy, Protein, Total Carbohydrates with Added Sugars broken out separately, Total Fat with Saturated Fat and Trans Fat broken out separately, Sodium), manufacturer name & address, veg/non-veg symbol (green dot in square for CAPSHOT since all 16 flavors are vegetarian), country of origin, and allergen declarations. Launching a Shopify PDP in Phase 6 with just a hero image, "16 natural flavors" blurb, and price is a direct violation and a reason FSSAI enforcement starts.

**Why it happens:**
Marketing-first teams treat the Shopify PDP as a storytelling surface and forget it's a legal document. The nutrition table isn't glamorous so it gets deferred, then forgotten.

**How to avoid:**
- Extend `src/data/flavors.ts` (already Shopify-shaped per `capshot-catalog`) *now* in Phase 1 with required fields even if values are null until client provides them: `netQuantityG`, `servingSizeG`, `energyKcal`, `proteinG`, `carbsTotalG`, `carbsAddedSugarG`, `fatTotalG`, `fatSaturatedG`, `fatTransG`, `sodiumMg`, `caffeineMg` (Premium Sports only), `ingredients`, `allergens`, `manufactureDate`, `expiryMonths`, `fssaiLicense`, `batchCode`, `vegSymbol` (always `veg` for CAPSHOT).
- Build a `NutritionTable` component in Phase 1 that renders from this data model. In Phase 1–5 it renders a placeholder "Nutrition facts coming soon" block; in Phase 6 the data must be filled or the build fails.
- Both the marketing site's `/flavors/[handle]` page and the Shopify PDP must carry this. Keep them synchronized — ideally source both from the same JSON exported from `capshot-catalog`.
- The 2026 FSSAI labeling amendment also tightened "natural" claims and nutrition symbol display — add an Indian Nutrient Reference Value (NRV) percentage column where applicable.
- Allergen declaration mandatory even if "none" — print "Contains: none of the major allergens" rather than omitting the field.

**Warning signs:**
- Flavor data model doesn't have slots for nutrition fields
- "FSSAI License" placeholder in footer after Phase 5
- Product pages differ in content between marketing site and Shopify

**Phase to address:**
Phase 1 (data model + component scaffold with placeholder), Phase 4 (flavor detail pages), hard-blocker in Phase 6.

---

### Pitfall 4: Instagram/Facebook in-app browser silently killing conversion (the single biggest mobile-ad trap)

**What goes wrong:**
95% of CAPSHOT's traffic will be Instagram/Facebook paid ads. When a user taps a link in the Instagram or Facebook iOS app, the destination opens inside **Instagram's embedded WKWebView**, not Safari. Measured impact:
- Conversion rate drops **40%+** vs the same user on a real browser (real-browser sessions convert 2–3× in-app browser sessions)
- In-app browser is **up to 15% slower** than Safari
- iOS blocks cross-site cookies in WKWebView, so Meta Pixel / GA attribution breaks silently (one brand measured only **10% of ad clicks** showing up in analytics)
- Autofill doesn't work → users abandon at email/phone fields
- Razorpay UPI Intent (`upi://pay?...`) does not reliably hand off from WKWebView to the UPI app on iOS — the OS-level handoff that Universal Links depend on is suppressed inside the social app's webview
- "Add to home screen" / PWA install prompts don't fire inside in-app browsers

**Why it happens:**
Both Instagram and Facebook deliberately keep users in their app (session retention metric). The webview is sandboxed and strips iOS's normal browser affordances. Developers test on their own phones where they're already logged in on Safari and never see the problem.

**How to avoid:**
- Add an "Open in Browser" nudge for in-app browser detection. Detection snippet (place in `src/lib/detectInAppBrowser.ts`):
  ```ts
  export function isInAppBrowser(): 'instagram' | 'facebook' | 'tiktok' | null {
    const ua = navigator.userAgent || '';
    if (/Instagram/i.test(ua)) return 'instagram';
    if (/FBAN|FBAV/i.test(ua)) return 'facebook';
    if (/TikTok/i.test(ua)) return 'tiktok';
    return null;
  }
  ```
  On detect, show a small sticky banner: "For the best checkout experience, tap ⋮ → Open in Browser." On Android, you can force-open Chrome via `intent://` scheme; on iOS, Apple does not allow programmatic hand-off — the banner nudge is the only option.
- **Meta Pixel + Conversions API (CAPI) deduplication is mandatory in 2026 — Pixel-only is broken.** Running Pixel + CAPI with a shared `event_id` recovers 20–30% of lost conversion data and brings total capture from ~60% (Pixel only) to ~95%. In Phase 1 (marketing site), fire a `Lead` event via Pixel on waitlist click AND via server-side CAPI from a Vercel/Netlify edge function. In Phase 6 (Shopify), install the official Meta Pixel + CAPI app and verify dedup is active.
- Test all critical flows (waitlist CTA, Phase 6 UPI Intent) by (a) posting a shortened link to a story in `@capshot_twist`, (b) tapping it from a fresh phone with no cookies, (c) completing the flow. Never trust desktop or incognito-Safari testing to represent Instagram-in-app reality.
- For Phase 6 UPI payments on iOS inside Instagram's webview: force the Razorpay checkout to open in a top-level navigation (not an iframe/modal) via `window.location.assign(...)` so Razorpay's checkout.js has the best chance of using Universal Links. Add a visible fallback: "If UPI doesn't open, copy VPA: capshot@okhdfcbank".
- Keep server-side event IDs stable across Pixel and CAPI calls — a UUID generated client-side and sent to both.

**Warning signs:**
- Meta Ads Manager reports significantly fewer conversions than your server logs
- Razorpay dashboard shows UPI Intent initiations but no completions on iOS traffic
- WhatsApp Business signup conversions concentrated on desktop clicks, not mobile

**Phase to address:**
Phase 1 (in-app detect banner + CAPI event for waitlist clicks), Phase 6 (checkout flow stress-tested through Instagram app, both OSes).

---

### Pitfall 5: COD orders destroying margin via 30%+ RTO rate — launching with COD on day one

**What goes wrong:**
India D2C 2026 data: **prepaid RTO is 2–3%, COD RTO is 25–30%** (shipping-related reports put it at 28–35% for COD; fashion/footwear category can touch 40%). On a ₹500 trial pack with COD, every RTO costs ₹180–₹240 in direct logistics (outbound + return shipping + COD handling + fuel surcharge), or ₹250–₹415 all-in including working capital. For a beverage with ~45% gross margin that often wipes out profit on 3 orders to pay for 1 failed one. Shiprocket's "₹26/500g" headline price balloons to ₹73–₹86 after COD handling + GST + fuel + zone surcharge — surcharges can add 30–40% to the total shipping cost and are billed *after* shipment in buried invoice line items. COD remittance on Shiprocket's standard plan is **D+8** (8 days after delivery), which also kneecaps cash flow for a bootstrapped launch.

**Why it happens:**
"Indian customers prefer COD" is cargo-culted from 2018-era advice. In 2026 UPI dominates and the COD-preference customer is also the highest-RTO customer. D2C templates still check the COD box by default.

**How to avoid:**
- **Launch Phase 6 as prepaid-only for the first 30–60 days.** Only turn on COD after the first ~500 orders stress-test the fulfillment stack. This single decision is the biggest margin lever in Phase 6.
- When COD is enabled: set max COD order value to ₹1,500 (the Trial Pack range), gate COD behind pincode serviceability (Shiprocket API), require OTP verification (Shopify's native "COD OTP" or a Shiprocket add-on).
- Add a "Save ₹49 — Pay Online" discount visible at checkout for prepaid. Industry data: this converts 20–30% of COD intenders to prepaid and the converted orders rarely RTO.
- For orders that stay COD, send a WhatsApp payment link within 8 minutes of placement with a 2-hour window. Industry data: ~15–25% convert.
- Model margins with blended cost at **COD = 7–10% of order value, prepaid = 4–5% of order value** including Razorpay fee, Shiprocket fee, GST on both, fuel surcharge, and RTO shrinkage. Do not use the headline rates.
- Pay for Shiprocket Early COD (D+2 for 0.99%) only if cash flow justifies — compare against the ~1% cost of a Razorpay credit line.
- Weight-dispute avoidance: pack a 5-cap trial pack to come in under 500g dimensional weight (caps are small but a bulky mailer can push volumetric weight into the next slab). Use rigid envelope mailers, not boxes, where possible.

**Warning signs:**
- Launch checklist says "enable COD" without a prepaid-first-30-days gate
- Shipping zone configuration has single-slab pricing (ignores dimensional weight)
- No pincode-level COD serviceability check at checkout

**Phase to address:**
Phase 6 (commerce launch) — this is a hard-code into the Shopify + Razorpay + Shiprocket setup. Document the "prepaid-only first" decision in `capshot-commerce-rollout` skill (currently just lists COD as "optional but recommended" — change to "disabled at launch, enabled after order #500").

---

### Pitfall 6: Shopify India fee stack miscalculated — "Razorpay is 2%" assumption

**What goes wrong:**
The real fee stack on Shopify India + Razorpay is more layered than any single number. For a Basic plan merchant (which is what CAPSHOT will be):

| Layer | Rate | Notes |
|---|---|---|
| Shopify third-party transaction fee | **2%** (Basic) | Because Shopify Payments is NOT available in India, this surcharge applies on every online payment (card, UPI, netbanking, wallet). COD is exempt from this. |
| Razorpay gateway fee | **0% UPI (up to ₹2k), 0.4% UPI (above ₹2k, capped ₹300, from Oct 15 2026)**, ~2% domestic cards, ~3% international cards | NPCI changed MDR for UPI merchant payments above ₹2,000 effective 15 October 2026. |
| GST on gateway fee | **18%** | Turns Razorpay's 2% card rate into effective 2.36%, and 3% international into 3.54%. |
| COD handling fee (if COD enabled) | ₹60–100 flat per order OR % of order value — depends on Shiprocket plan | Separate from the above. |
| Shiprocket shipping | ~₹27+ per shipment base, +fuel surcharge, +zone surcharge, +GST on all of it | Headline rates are misleading; realistic blended ~₹73–86 per 500g shipment. |

Combined blended variable cost on a prepaid card order is **~4.5–5%**, on COD it's **7–10%** before even counting the RTO shrinkage. Spec documents (including this project's `capshot-commerce-rollout`) often cite "₹1,994/mo Shopify + 2% Razorpay" and understate by 50%+.

**Why it happens:**
Shopify's pricing page shows the plan cost; Razorpay's shows the gateway rate; GST on fees is in Shopify India help docs under a different page; Shiprocket surcharges only appear on monthly invoices. No single place sums it up.

**How to avoid:**
- Build a one-page margin spreadsheet in Phase 0 or Phase 6 Day 1 that models per-order economics across (a) prepaid-card, (b) prepaid-UPI-under-₹2k, (c) prepaid-UPI-over-₹2k, (d) COD. This drives bundle pricing — a ₹299 Trial Pack with 45% target gross margin needs cost-of-goods under ~₹130, otherwise COD orders lose money even without RTO.
- Prioritize UPI in checkout order on both marketing site and Shopify (UPI first, cards second, COD last). UPI is the cheapest rail AND has the highest success rate — Razorpay's data shows UPI Intent at ~98% success vs ~85% for cards.
- Disable international cards at launch (prevents the 3.54% + Shopify surcharge stack AND prevents fraud chargebacks).
- Watch the ₹2,000 UPI threshold: a Fitness Pack bundle priced at ₹1,999 avoids the 0.4% MDR; priced at ₹2,000+ pays it. May be worth pricing just under the threshold.
- Update `capshot-commerce-rollout` skill's pricing table to reflect the real stack with GST line items and the Oct 2026 UPI MDR change. Current table understates.

**Warning signs:**
- Bundle prices set on gut feel without a per-method margin calc
- "Shopify Payments" referenced anywhere in planning docs (it does not exist in India)
- Fitness Pack priced at exact ₹2,000 (crosses the UPI MDR threshold)

**Phase to address:**
Phase 6, with the margin model built BEFORE pricing bundles. Also update `capshot-commerce-rollout` skill now (Phase 1) so the correct numbers are canonical when Phase 6 arrives.

---

### Pitfall 7: GST not configured correctly on Shopify India — tax-inclusive vs tax-exclusive confusion

**What goes wrong:**
Shopify's Indian GST setup is **not automatic**. Default Shopify tax config shows tax-exclusive prices, which means a ₹299 bundle displays as "₹299 + GST" and the customer sees ₹299 → ₹353 at checkout (18% GST). Indian B2C expectation is tax-inclusive — the sticker price IS the final price. Mismatch causes 15–25% cart abandonment at the checkout page. Beyond display: a legally compliant GST invoice must show seller GSTIN, HSN code per product (beverages typically HSN 2202 at 18% GST, powdered drink mixes may fall under HSN 2106 at 18%), place of supply (customer's state), itemized CGST/SGST (intra-state) or IGST (inter-state) breakdown, and a sequential invoice number. Shopify doesn't generate this by default — merchants need GST invoice apps (GSTFLY, GST Pro, etc).

**Why it happens:**
Shopify is US-first; its tax engine assumes the US model (price + tax at checkout). India B2C runs opposite. The config switch is in Settings → Markets → India → Tax settings → "All prices include tax" — easy to miss.

**How to avoid:**
- Switch Shopify to **tax-inclusive pricing** before publishing any product: Settings → Taxes and duties → check "All prices include tax."
- Set every flavor + bundle to the correct HSN code. Verify with a chartered accountant whether CAPSHOT's powder caps fall under HSN 2106 or 2202.
- Install a GST invoice app (GSTFLY or GST Pro — ~₹500–₹1,500/mo) before launch. Mandatory for compliance; also saves the client's accountant hours per month.
- Place of supply must be the customer's state (not the merchant's). Shopify handles this automatically once you set up Indian tax zones correctly, but verify by placing a test order from a non-origin state.
- Price **after tax** when deciding bundle prices (customer-visible number). Then back-calculate to ex-tax wholesale price for inventory accounting.

**Warning signs:**
- Checkout shows prices rising at the final step
- No sequential invoice numbers in Shopify order confirmation emails
- Customers from other states see the merchant's state as "place of supply"

**Phase to address:**
Phase 6. Flag it in `capshot-commerce-rollout` launch checklist (currently missing).

---

### Pitfall 8: React/Vite dark mode flash of unstyled content (FOUC) on first paint

**What goes wrong:**
A naive dark-mode setup reads the user's preference from `localStorage` inside a `useEffect` hook. By the time React mounts and the effect fires, the browser has already painted the page in the default (light) theme — the user sees a bright-cream flash → dark swap. On a slow Jio 4G connection with a cold CDN cache the flash can be 400–800ms. On the brand's premium positioning this feels cheap, and it tanks the hero's "WOW" moment — the single most important ad-conversion signal on a mobile-first site.

**Why it happens:**
`useEffect` runs post-mount; the painted frame has already shipped. React 18 concurrent rendering can make this worse. CSS `@media (prefers-color-scheme: dark)` would prevent the flash but only works for OS-level dark mode — if the user has manually toggled, their choice (stored in localStorage) isn't readable from CSS.

**How to avoid:**
- Inject a **blocking inline script** in `index.html` `<head>` that runs before React boots. It reads the saved theme and applies the `dark` class on `<html>` before paint. In Vite, add to `index.html`:
  ```html
  <script>
    (function() {
      try {
        var saved = localStorage.getItem('capshot-theme');
        var systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        var isDark = saved === 'dark' || (!saved && systemDark);
        if (isDark) document.documentElement.classList.add('dark');
      } catch (e) {}
    })();
  </script>
  ```
  This is 20 lines of synchronous JS that run before the HTML body renders. Flash is eliminated.
- Use Tailwind's `class` dark-mode strategy (`darkMode: 'class'` in `tailwind.config.js`), NOT `media`. The `class` strategy respects the inline script above.
- Pair with CSS `color-scheme: light dark;` on `:root` so scrollbars and form controls also match. Set the browser-level color-scheme via a `<meta name="color-scheme" content="light dark">` tag.
- Set the page background color on `<html>` not `<body>` so the earliest paint doesn't flash cream even before CSS loads. Use `brand-cream` for light default, `brand-deep` for dark — matching the palette lock in `capshot-brand`.
- Also set `<meta name="theme-color">` with `prefers-color-scheme` media queries so the Instagram/Chrome mobile browser chrome also matches.

**Warning signs:**
- Lighthouse CLS score flagged "theme switch after load"
- User testing on mid-tier Android (Redmi Note, Realme) shows visible color flash
- Theme toggle lives inside a React component tree only — no inline head script

**Phase to address:**
Phase 1 (foundation + theming). Do not defer; retrofitting this later means auditing every page.

---

### Pitfall 9: Framer Motion bundle bloat — shipping 34 KB gzip to all mobile users on first load

**What goes wrong:**
Framer Motion's declarative, props-driven API means Rollup cannot tree-shake it below ~34 KB gzip when using `<motion.div>` directly. For a mobile-first site on Jio 4G that single library can push LCP past the 2.5s threshold. Default Vite config puts framer-motion in the vendor chunk, which blocks the critical path. There's a known Vite 8 / rolldown bug where `manualChunks` can leave framer-motion in the main entry stuck on the critical path even with LazyMotion.

**Why it happens:**
Framer Motion's full `<motion.div>` imports the entire features bundle (drag, layout, gestures, reorder). The site uses a tiny subset — fade/slide for section entrances. Teams use `<motion.div>` everywhere because it's the first example in the docs.

**How to avoid:**
- Use `LazyMotion` + `m` component pattern throughout:
  ```tsx
  // src/motion/MotionProvider.tsx
  import { LazyMotion, domAnimation } from 'motion/react';
  export const MotionProvider = ({ children }) => (
    <LazyMotion features={domAnimation} strict>{children}</LazyMotion>
  );
  // Everywhere else:
  import { m } from 'motion/react';
  <m.div animate={{ opacity: 1 }} />  // NOT <motion.div>
  ```
  This brings the initial render payload to ~4.6 KB (saves ~30 KB gzip vs full motion). Use `domMax` only in subtrees that need drag/pan/layout (likely none on this marketing site).
- Enable `strict` on `LazyMotion` so any accidental `<motion.div>` import throws loudly in dev.
- Add an ESLint rule or custom script: `grep -r "from 'framer-motion'" src/ && exit 1` to prevent regressions. Everything should import from `motion/react` (new package name) and use `m.*`.
- In `vite.config.ts`, explicitly split motion into its own async chunk:
  ```ts
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          motion: ['motion/react'],
          react: ['react', 'react-dom'],
        },
      },
    },
  },
  ```
  Verify with `vite build --mode production && npx vite-bundle-visualizer` that motion is in its own chunk and NOT in the entry.
- GSAP: the original spec allows GSAP "only where needed." Prefer CSS transforms + Intersection Observer for simple scroll triggers (free). Introduce GSAP ONLY for complex timelines; a single ScrollTrigger adds ~24 KB gzip.

**Warning signs:**
- Build output shows a chunk >100 KB gzip
- Lighthouse flags "Reduce unused JavaScript" with motion/react highlighted
- LCP on mobile 4G > 2.5s even on the hero section

**Phase to address:**
Phase 1 (set up the `MotionProvider` + lint rule from the first motion component), re-verified in Phase 7 (SEO + perf polish).

---

### Pitfall 10: iOS Safari `100vh` making the hero crop the CTA

**What goes wrong:**
On iOS Safari, `height: 100vh` doesn't account for the dynamic address bar. On initial load the viewport is small (toolbar expanded); after a scroll the toolbar collapses and the real viewport grows. The `100vh` CSS value stays fixed at the *expanded* viewport, which means a hero section sized `h-screen` has its bottom edge CROP the primary CTA button under Safari's address bar on first load. For a mobile-first site where 95% of users land on the hero from an Instagram ad, this literally hides the "Join Waitlist" button on first paint for a majority of visitors.

**Why it happens:**
`vh` was specified before mobile browsers had dynamic UI. Chrome Android and iOS Safari both have variable viewport, but implement it differently. Tailwind's `h-screen` → `height: 100vh` is the default and the problem.

**How to avoid:**
- Use `100dvh` (dynamic viewport height) with a `100vh` fallback. In Tailwind, add to `tailwind.config.js`:
  ```ts
  theme: {
    extend: {
      height: { 'screen-safe': ['100vh', '100dvh'] },
      minHeight: { 'screen-safe': ['100vh', '100dvh'] },
    },
  }
  ```
  Use `min-h-screen-safe` on the hero section. Caniuse: `dvh` has ~96% global support in 2026 — safe to use.
- Alternatively use `svh` (small viewport height = the smallest the viewport can be) if the hero must guarantee all content fits even with the address bar expanded.
- Add `-webkit-fill-available` as an extra fallback for older iOS Safari (`height: 100vh; height: -webkit-fill-available; height: 100dvh;`).
- Account for the iOS notch and bottom home indicator with `env(safe-area-inset-top)` and `env(safe-area-inset-bottom)` on the hero. The primary CTA should sit above `env(safe-area-inset-bottom)` so it's never hidden behind the home indicator.
- Add `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">` to enable safe-area-inset.
- Test on a real iPhone (not just DevTools emulation). The dynamic toolbar behavior is impossible to reproduce in Chrome DevTools.

**Warning signs:**
- Primary CTA cropped on first load on iPhone (any model with the Dynamic Island or notch)
- Hero image bottom edge visible AT page load but hidden after a scroll
- CSS uses `height: 100vh` anywhere on the hero or above-the-fold layout

**Phase to address:**
Phase 1 (hero section build). Non-negotiable — this hides the CTA which hides the conversion.

---

### Pitfall 11: Full-screen cookie banner / consent popup killing bounce rate

**What goes wrong:**
Full-screen cookie walls increase bounce rate by **up to 63%** per 2026 industry data. Combined with the Instagram in-app browser penalty (another 15% slower + 40% lower conversion), a cookie wall on an Instagram-ad landing page can erase 70%+ of ad spend before the user sees the hero. India doesn't yet mandate GDPR-style consent (DPDP Act 2023 is in force but doesn't require pre-interaction cookie banners for first-party analytics), so a US/EU-template cookie banner is often net-negative for India-only traffic.

**Why it happens:**
Shopify themes and marketing templates ship with cookie banners enabled by default (GDPR-safe stance). Marketing teams copy them without checking jurisdictional requirements.

**How to avoid:**
- For an India-only launch, **do not render a cookie banner for Indian IPs**. Only render for EEA/UK IPs if those regions are ever enabled (international shipping is already out of scope per PROJECT.md — "disable intl cards and shipping zones initially").
- When international is enabled: use a slim bottom-sheet banner (not a full-screen modal), with a clear "Accept All" that is ≥44px tap-target, and only block non-essential analytics (NOT first-party functional cookies). Default state should NOT block the hero.
- DPDP Act compliance: include a short privacy policy linked from the footer explaining what data is collected (name, email, phone, shipping address, order history), the purpose (fulfillment + marketing), and the user's rights (access, correction, erasure). This is required even without a banner.
- Meta Pixel + CAPI should fire for all users by default on India traffic. Shopify's "Customer privacy" app can be configured to geo-gate the banner.

**Warning signs:**
- Cookie banner renders on first paint on all traffic, including India
- Banner is a full-screen modal that blocks the hero
- No DPDP-compliant privacy policy linked in footer

**Phase to address:**
Phase 5 (legal/trust) for the DPDP privacy policy; Phase 6 (Shopify go-live) for geo-gated banner config.

---

### Pitfall 12: Hinglish copy that reads cringey — the "wokeness" trap

**What goes wrong:**
Hinglish done poorly is the single fastest way for an Indian millennial / Gen Z audience to roll their eyes and bounce. Approved patterns like "Twist karo. Shake karo. BOOM — drink ready." work because they're punchy, functional, and conversational. Patterns that fail: "Zara hatke, zara bachke," "Yaaron," over-use of "bhai"/"bhaiya" in brand voice, mixing Hinglish into every paragraph of body copy (noisy, hard to scan), using Devanagari and Latin alphabets inconsistently in the same block, forced slang that reads like a 40-year-old brand consultant imagining what a 22-year-old says. Indian D2C analysis in 2026: "When brands try to appeal to a broad audience, their messaging gets diluted and sounds like every other brand" — Hinglish done as "us too" rather than as voice.

**Why it happens:**
Hinglish is read-tested in the writer's head, not with representative users. The writer's reference set is Bollywood dialogue or Twitter trending topics, both lag indicators for Gen Z voice.

**How to avoid:**
- Keep Hinglish in **headlines + micro-copy only** (already policy per `capshot-brand`). Body copy stays English.
- The approved patterns are: "Twist karo. Shake karo. BOOM," "Kisi bhi bottle pe lagao," "Fresh. Instant. Portable." — stick close to this register. Short, verb-driven, punchline-shaped.
- **Avoid:** forced slang ("fire," "lit," "savage" in Hinglish mode), Hindi-film-ish phrases ("zindagi badal degi"), medical/benefit claims in Hinglish ("thakaan door, energy full" is both cringey AND an FSSAI claims violation), excessive exclamation marks, nested English brand jargon in Hindi words ("Shaandar hydration solution").
- **Hinglish test** (from `capshot-brand`): read the copy out loud. If an Indian millennial would roll their eyes, cut it.
- Review all Hinglish copy with 2–3 target-demo reviewers (18–35, metro, Instagram-active) before shipping. Not the client's family — representative strangers via a short Instagram story poll or WhatsApp panel.
- Keep Latin script for Hinglish headlines (not Devanagari) — the design system is Latin-serif/sans and Devanagari would break the metallic-industrial logo adjacency intent.
- A/B test headlines on actual ad traffic. The hero headline is the only piece of copy worth a formal test.

**Warning signs:**
- Hinglish appears in body paragraphs or FAQs
- Any headline uses "bhai," "yaaron," or filmy phrases
- Devanagari script mixed into otherwise Latin layouts
- Copy was approved by the client's family/friends but not representative strangers

**Phase to address:**
Phase 1 (hero copy), Phase 5 (full-site copy audit before Phase 6 launch).

---

### Pitfall 13: Shopify-later architecture that forces a rewrite — subdomain/data/CTA mistakes that lock in

**What goes wrong:**
The hybrid architecture (marketing site at root domain, Shopify at `shop.capshot.co`) is a good plan. It fails when teams:
1. **Hard-code the WhatsApp CTA URL in every section** — the Phase 6 swap becomes a 40-file find-and-replace, each file risks regression, and some bundle-specific CTAs get missed.
2. **Build a flavor data model that doesn't match Shopify's product schema** — Phase 6 migration becomes a data transformation, mismatched handles mean broken deep links from marketing site to Shopify PDPs.
3. **SEO: don't plan 301 redirects for `/flavors/orange` → `shop.capshot.co/products/orange`** — organic ranking loss on migration is the #1 cause of post-migration traffic drops.
4. **Mix the marketing site's cart intent with Shopify's — e.g., add an "Add to Cart" button on the marketing site in Phase 1 that fakes being a cart** — later becomes impossible to reconcile.
5. **Set canonical URLs incorrectly across the two domains** — both `/flavors/orange` (marketing) and `shop.capshot.co/products/orange` (Shopify) end up self-canonical, Google treats them as duplicates, both lose ranking.
6. **Instagram pixel installed on marketing site but not Shopify checkout** — attribution dies at the handoff; Meta cannot optimize for Purchase events because the pixel never fires on the thank-you page.

**Why it happens:**
Phase 6 feels distant. Teams optimize for "ship Phase 1 fast" and defer architectural decisions.

**How to avoid:**
- **Centralize CTAs in `src/config/cta.ts`** (already a locked decision in PROJECT.md). Enforce with an ESLint rule or CI grep: no `wa.me` or `shop.capshot.co` URLs allowed outside `src/config/cta.ts`.
  ```bash
  # In CI
  if grep -r "wa.me\|shop.capshot.co" src/ --exclude-dir=config; then
    echo "Hard-coded commerce URL found; use src/config/cta.ts"; exit 1;
  fi
  ```
- **Mirror Shopify's product schema in `src/data/flavors.ts` from day one** (already locked in `capshot-catalog`). Fields: `handle`, `title`, `description`, `images[]`, `variants[]` with `title`/`price`/`available`, `tags[]`, `vendor`, `product_type`. The `handle` must be URL-safe and match the eventual Shopify handle exactly. Nothing in the flavor model should block a direct JSON → Shopify import later.
- **Plan the 301 redirect map in Phase 1** even though it won't be deployed until Phase 6. Document `/flavors/[handle]` → `shop.capshot.co/products/[handle]` in `capshot-commerce-rollout`. Script it in `scripts/generate-redirects.ts` so the Phase 6 cutover is a single command.
- **No cart on marketing site, no "Add to Cart" buttons in Phase 1.** CTA label is "Join the Waitlist" or "Notify Me on WhatsApp" (already policy). Phase 6 label becomes "Shop Now" → Shopify PDP.
- **Canonical URL strategy for Phase 6:** marketing-site `/flavors/[handle]` becomes a storytelling page that `<link rel="canonical">` points to `shop.capshot.co/products/[handle]` (or vice-versa, decide once). The non-canonical should also 301 to the canonical if the content fully duplicates. Shopify sets its own domain as canonical automatically — verify this points to the custom domain, not the `*.myshopify.com` variant.
- **Install Meta Pixel + CAPI on BOTH marketing site AND Shopify** before first ad. Shared event IDs between the two for dedup. Pixel on the Shopify "thank-you" page is a one-click install via the Facebook & Instagram app in Shopify admin.
- **Deploy `shop.` subdomain in Phase 6, not before.** Setting it up early with a holding page can get indexed and compete with the marketing site. If needed before Shopify is live, use `robots.txt` noindex.

**Warning signs:**
- Grep for `wa.me` finds results outside `src/config/cta.ts`
- `src/data/flavors.ts` fields don't match Shopify's product schema
- No scripts/plan for 301 redirects at migration
- Facebook Pixel installed on marketing site but Phase 6 plan doesn't mention Shopify-side install

**Phase to address:**
Phase 1 (CTA centralization, data model, lint rules) prevents the lock-in. Phase 6 executes the swap.

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|---|---|---|---|
| Hard-code WhatsApp URL in each section | 10 min saved on Phase 1 setup | Phase 6 swap balloons from 5 min to a day; regression risk | Never (CTA centralization is explicit project policy) |
| Use `<motion.div>` instead of `LazyMotion` + `<m.div>` | Match Framer Motion docs directly | ~30 KB gzip extra on initial load, Lighthouse hit, slower LCP on 4G | Never on a mobile-first ad-driven site |
| Skip CAPI, Pixel only | Simpler initial install | 30–40% of iOS conversions never tracked, impossible to optimize ad spend | Prototype / internal testing only; never in production |
| Enable COD on Phase 6 day 1 | Captures "COD-only" buyer segment immediately | 25–30% RTO wipes margin; working capital bleeds; cash flow stressed | After order #500 with prepaid-first baseline established |
| Full-site Hinglish body copy | Feels "authentic" in writer's room | Scannability drops; audience eye-roll; brand loses premium feel | Hinglish headlines + micro-copy only; body stays English |
| Static trust badges without evidence URL | Visual completeness in Phase 1 | FSSAI notices; ₹3L–₹10L penalties per SKU | Dev-mode placeholders only; production renders require `evidenceUrl` prop |
| Shopify Payments assumption | Lower perceived fee in planning | Rewrite payment plumbing when discovered unavailable | Never (does not exist in India as of 2026) |
| Skip nutrition data model in Phase 1 | Faster MVP shipping | Phase 6 scramble to retrofit on 16 SKUs, legal violation if PDPs ship incomplete | Never (model nullable fields in Phase 1 instead) |
| `100vh` for hero height | Default Tailwind class, works on desktop | iOS Safari crops CTA — the single most important button on the page | Never — use `dvh` with `vh` fallback |
| Cookie banner on all traffic | Universal "safe" default | 60%+ bounce impact on IG ad traffic that didn't need it | EEA/UK traffic only after international launch; never for India-only |

---

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|---|---|---|
| **Shopify India** | Assuming Shopify Payments works | Install Razorpay (or PayU/CCAvenue); accept the 2% Shopify third-party transaction fee as unavoidable |
| **Shopify India** | Price shows pre-tax at checkout | Settings → Taxes → "All prices include tax" BEFORE publishing products |
| **Shopify India** | No GST invoice app installed | Install GSTFLY or GST Pro before launch; verify HSN codes with CA |
| **Razorpay** | COD orders go through Razorpay | COD is a Shopify-native payment method; Razorpay only processes online payments. Shiprocket collects COD cash from courier |
| **Razorpay** | International cards enabled by default | Disable in Razorpay dashboard until a fraud policy is in place |
| **Razorpay UPI** | UPI Collect flow instead of UPI Intent | Prefer UPI Intent (~98% success vs ~85% Collect). Enable on iOS as of 2026 release |
| **Razorpay UPI** | UPI Intent inside Instagram WKWebView fails silently | Force top-level navigation to checkout page; show VPA fallback copy-button |
| **Shiprocket** | Headline rate used in margin math | Realistic blended ~₹73–86/500g including fuel + GST + COD + zone surcharge |
| **Shiprocket** | Pickup address unverified | Verification call MUST complete before first order ships; schedule in Phase 6 week 1 |
| **Shiprocket** | COD remittance assumed instant | D+8 by default; D+2 costs 0.99%; model cash flow against D+8 |
| **Meta Pixel** | Pixel-only setup | Add Conversions API with shared `event_id` for dedup; recovers 20–30% iOS conversions |
| **Meta Pixel** | Pixel on marketing site only | Install on Shopify checkout + thank-you page too via Facebook & Instagram app |
| **WhatsApp Business** | wa.me URL with un-encoded text | Use `encodeURIComponent()` for the `text=` query param; broken message breaks the conversion |
| **WhatsApp Business** | No automated reply on inbound | Set up a Business Profile greeting + away message in WA Business app; auto-tag "waitlist" leads |
| **Instagram @capshot_twist** | Shopping tags not enabled | Enable Instagram Shopping tags in Phase 6 so product posts click directly to Shopify PDP |
| **FSSAI license** | License number entered as placeholder on live site | Build a prod-build check that fails if the FSSAI number is `XXXXXXXXXXXXXX` or missing |
| **Vite build** | `framer-motion` in main entry chunk | Explicit `manualChunks` in `vite.config.ts` splitting motion into its own async chunk |
| **Vite dev** | Dev server tested only, prod build not tested on 4G | Test `vite build && vite preview` on a throttled mobile network before every milestone demo |

---

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|---|---|---|---|
| **100vh crop on iOS Safari** | Primary CTA invisible on first paint | Use `dvh` with `vh` fallback | Immediately on every iPhone with dynamic Safari toolbar |
| **Framer Motion full bundle** | 100+ KB gzipped main chunk; LCP > 2.5s on 4G | `LazyMotion` + `m.*` throughout | Even on first paint; scales worse as sections grow |
| **Dark mode FOUC** | Cream → dark flash on load | Inline blocking script in `<head>` reads `localStorage` before React boots | On every cold-cache load (= all Instagram ad traffic) |
| **Un-optimized hero image** | LCP element is a 2 MB JPG | Convert to AVIF with WebP + JPG fallback, serve via `<picture>`, lazy-load everything below the fold | At first contentful paint; worsens on 3G |
| **Blocking Google Fonts** | FOIT (invisible text) during font swap | Self-host via `@fontsource/inter` or Vite font plugin; `font-display: swap` | On first paint if fonts hosted externally |
| **No code splitting on routes** | Entire site JS loads on hero visit | React.lazy per route + Suspense fallback | At scale when more routes are added |
| **Rolldown/Vite 8 `manualChunks` bug with Framer Motion** | Even with LazyMotion, motion still in main chunk | Verify with `vite-bundle-visualizer`; adjust manualChunks explicitly | Silently — only build-size analysis reveals it |
| **Jio 4G throttling** | Site tested on home Wi-Fi, prod feels slow | Chrome DevTools "Slow 3G" + "Fast 3G" throttling on every demo | At user acquisition — the slower-network segment that converts worst |
| **SPA with no SSG/pre-render** | Instagram's link preview shows blank/generic; Googlebot sees empty page | `vite-plugin-ssg` or `vite-plugin-prerender` for `/`, `/flavors`, `/about`, etc. Serve static HTML with OG tags filled | At the moment the first Instagram ad runs — no OG image, no preview card |
| **Instagram link preview missing OG tags** | Shared posts appear as plain text / wrong image | Pre-rendered OG + Twitter meta tags per route; dedicated OG hero image at 1200×630 | Every time the brand is shared or an ad is paused and relaunched |

---

## Security Mistakes

| Mistake | Risk | Prevention |
|---|---|---|
| Razorpay secret key committed to repo or exposed in client bundle | Full payment compromise; refund fraud | Secrets in Vercel/Netlify env vars; verify no `VITE_RAZORPAY_SECRET` in client bundle (`VITE_` prefix exposes to client) |
| WhatsApp Business number used as personal/support — spam exposure | Number harvested; spam/scams | Use the dedicated 9203975762 line only; do not render it in alt text of images unlinked (crawlable without `rel=nofollow`) |
| COD fraud: fake orders at the Trial Pack price | 3–5% of COD volume is fake; ~₹200+ loss per fake order | Shopify COD OTP (free), Shiprocket's RTO prediction add-on, max COD value ₹1,500, pincode-level serviceability check |
| Shopify admin accessed from unknown devices | Account takeover; stock + revenue theft | Mandatory 2FA on Shopify admin; staff accounts with scoped permissions; audit log review monthly |
| Razorpay webhook endpoint unauthenticated | Attacker triggers fake order-success events, Shopify dispatches shipping | Verify Razorpay webhook signature on every event; reject unsigned events |
| PII in URL query strings (`?email=user@...`) | Logged in CDN access logs, leaked | Use POST body or session storage; strip query strings from analytics |
| DPDP Act 2023 non-compliance | ₹250 crore penalty cap | Publish privacy policy with data categories, purpose, retention, user rights (access, erasure); appoint a Data Protection Officer when scale warrants |
| FSSAI license number used as a "trust prop" on the site but customer-side verifiable license status not checked | Expired/suspended license still displayed | Monthly cron / manual check against FSSAI's `foscos.fssai.gov.in` to confirm license status |

---

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---|---|---|
| Hero takes >5 seconds to communicate "what is this?" | 70%+ bounce on mobile ad traffic | Hero concept (TWIST.SHAKE.BOOM + cap-on-bottle visual) must be legible in <2s on 4G. Treat the hero as a billboard, not a story |
| CTA button under 44×44 tap target | Users miss the tap, bounce | Minimum 44×44; primary CTAs 56px+ height per `capshot-brand` |
| No sticky mobile CTA on scroll | User scrolls past CTA, has to scroll back | Sticky bottom bar with primary CTA on mobile after the hero scrolls off (test for not blocking content below) |
| Flavor variant toggle (200ml vs 350ml) buried below the fold on PDP | Confused dosing → wrong purchase → support ticket | Variant selector at top of PDP; "Which bottle size?" tooltip with visual |
| Infinite scroll for 16 flavors instead of range filters | User can't find Mango if they came specifically for it | Filter pills: Fruity Blast / Desi & Cool / Premium Sports (already in requirements). Default-open all; sticky filter bar on scroll |
| FAQ accordions all collapsed by default | Users skip them, questions remain unanswered → cart abandonment | Open the top 1–2 FAQs by default (shipping, is-it-safe); user discovers the pattern and expands others |
| Trust badges in a scrolling marquee | Users read none; just visual noise | Static 2×2 grid or horizontal strip with text labels — not animated |
| WhatsApp CTA opens WA on mobile but a QR / web.whatsapp on desktop that fails if user not logged in | Desktop user bounces | Use `wa.me/919203975762` which handles both (opens app on mobile, prompts chat on desktop) |
| Hinglish headlines in Devanagari | Hinglish is Latin-script Hindi; Devanagari changes read-pattern and breaks typographic adjacency to the SHI-28 logo | Hinglish always in Latin script |
| Dark/light toggle hidden in a hamburger menu | Users don't discover; theme preference ignored | Toggle in visible top nav; defaults to OS preference via `prefers-color-scheme` |

---

## "Looks Done But Isn't" Checklist

- [ ] **Hero section:** Often missing `dvh` fallback — verify primary CTA is fully visible on real iPhone (not DevTools) with address bar expanded on first load
- [ ] **Dark mode:** Often missing inline head script — verify no flash on a cold-cache load with throttled 4G
- [ ] **Framer Motion:** Often missing `LazyMotion` setup — verify bundle analyzer shows motion in a separate chunk, not entry
- [ ] **Meta Pixel:** Often missing CAPI dedup — verify both Pixel and CAPI fire for the same `event_id` in Meta Events Manager → Test Events
- [ ] **In-app browser handling:** Often missing — verify an Instagram story link opens with the "Open in Browser" nudge visible
- [ ] **Trust badges:** Often missing evidence links — verify every badge in production has an `evidenceUrl` prop; FSSAI badge shows actual license number
- [ ] **Nutrition data:** Often missing — verify every flavor PDP (Phase 4+) renders full nutrition table + ingredient list + allergen declaration + veg symbol
- [ ] **COD:** Often enabled by default — verify Shopify payments has COD DISABLED for launch; prepaid-only toggle plan documented
- [ ] **Razorpay:** Often missing — verify international cards DISABLED, UPI Intent enabled, Razorpay in Shopify is `key_id` + `key_secret` from Razorpay dashboard (not Shopify-generated)
- [ ] **GST:** Often missing — verify Shopify tax config shows "All prices include tax"; HSN codes set per product; GST invoice app installed
- [ ] **Shipping:** Often missing — verify Shiprocket pickup address verified via confirmation call; courier priority ranked; dimensional weight checked on actual trial pack
- [ ] **FSSAI license:** Often missing — verify 14-digit license number rendered in footer AND on every PDP; license checked against FOSCOS live status
- [ ] **DPDP privacy policy:** Often missing — verify link in footer; policy covers data categories, purpose, retention, user rights
- [ ] **SEO:** Often missing — verify every route has pre-rendered HTML with unique `<title>`, `<meta description>`, OG + Twitter tags, canonical URL
- [ ] **301 redirects:** Often missing — verify Phase 6 cutover plan has a documented redirect map from marketing-site flavor pages to Shopify PDPs
- [ ] **CTA centralization:** Often missing — verify grep finds zero `wa.me` or `shop.capshot.co` outside `src/config/cta.ts`
- [ ] **Hinglish copy:** Often missing — verify no Hinglish in body copy, only headlines/micro-copy; verify no Devanagari mixed in Latin layouts
- [ ] **Energy drink language:** Often missing — verify grep for `energy drink` finds zero in `src/` outside explicit anti-pattern copy
- [ ] **Caffeine warning:** Often missing — verify "Not recommended for children, pregnant or lactating women" visible on Premium Sports flavor pages

---

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---|---|---|
| Hard-coded CTAs in Phase 1 | MEDIUM (1–2 days) | Grep + sed replacement, add CI lint rule, test every CTA in Phase 6 pre-launch |
| Framer Motion bundled in entry | LOW (1–2 hours) | Introduce `LazyMotion` provider; find/replace `motion.` → `m.`; verify with bundle visualizer |
| Dark mode FOUC in production | LOW (1 hour) | Add inline head script; redeploy; verify on throttled network |
| FSSAI violation (energy drink / unsubstantiated claim) | HIGH (regulatory + rework) | Immediately pull copy; relabel; respond to FSSAI notice with corrective action evidence; rebuild creative — expect 2–4 week delay |
| COD RTO wiping margin after launch | MEDIUM (1 week) | Disable COD immediately via Shopify toggle; roll out prepaid-only; keep COD disabled until a serviceability + OTP + prepaid-nudge stack is live |
| Instagram ad clicks not tracked | MEDIUM (1 week) | Install CAPI with event dedup; backfill isn't possible — accept the data loss and start fresh |
| Nutrition data missing on PDPs at launch | MEDIUM (requires client data) | Collect from manufacturer; publish within 7 days; add build-time check that fails if any product has nullable required fields |
| Shopify Payments assumption in planning | LOW (plan-only) | Update `capshot-commerce-rollout` fee table; adjust bundle pricing math |
| GST not configured, prices shown pre-tax | LOW (1 hour) | Switch to tax-inclusive in Shopify; verify customer-facing prices unchanged |
| 100vh hero cropping on iOS | LOW (1 hour) | Add `dvh` with fallback in Tailwind config; redeploy; verify on real iPhone |

---

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---|---|---|
| Energy-drink language | Phase 1 (hero copy) + Phase 4 (Premium Sports section) | CI grep for `/energy drink/i` fails build if found outside allowlist |
| Trust-badge over-claim | Phase 1 (component contract) + Phase 5 (badge content) + Phase 6 (FSSAI license) | `TrustBadge` component refuses to render in prod without `evidenceUrl` |
| Missing nutrition / FSSAI label data | Phase 1 (data model) + Phase 4 (PDP) + Phase 6 (go-live) | Build-time check: all 16 flavors have required nullable-OK fields filled before Phase 6 build |
| In-app browser conversion loss | Phase 1 (detect banner + Meta CAPI for waitlist) + Phase 6 (checkout stress-test) | Verify in-app banner shows in Instagram WKWebView; verify Pixel + CAPI dedup in Events Manager |
| COD RTO margin kill | Phase 6 (prepaid-only launch) | Shopify payment methods list excludes COD at launch; `capshot-commerce-rollout` skill updated |
| Shopify India fee stack misread | Phase 6 (margin model) + update skill in Phase 1 | Spreadsheet shows blended cost per order per payment method before bundle pricing is set |
| GST tax-inclusive config | Phase 6 (Shopify setup) | Test order from an Indian pincode shows the sticker price unchanged at checkout |
| Dark mode FOUC | Phase 1 (foundation) | Lighthouse CLS score + manual cold-cache load test |
| Framer Motion bundle bloat | Phase 1 (motion provider) + ongoing | `vite-bundle-visualizer` shows motion in separate chunk ≤5 KB in entry |
| iOS Safari 100vh crop | Phase 1 (hero) | Real-iPhone test: CTA fully visible with toolbar expanded |
| Cookie banner killing bounce | Phase 5 (DPDP policy) + Phase 6 (banner config) | India IPs do not see a modal cookie banner |
| Cringey Hinglish | Phase 1 (hero) + Phase 5 (full-site audit) | Third-party target-demo review before Phase 6 launch |
| Phase 6 rewrite risk | Phase 1 (CTA centralization, Shopify-shaped data model, redirect plan) | Grep CI gate; `src/data/flavors.ts` fields match Shopify schema; redirect map documented |

---

## Sources

**FSSAI / Regulatory (HIGH confidence — verified across multiple official-adjacent sources)**
- [FSSAI Food Labelling Requirements 2026](https://aurigaresearch.com/blog/food-labelling-requirements-fssai/)
- [FSSAI New Rules 2026: Latest Updates & Compliance Guide](https://vishaalconsultancy.com/fssai-new-rules-2026/)
- [FSSAI Compliance Checklist For Beverage Brands 2026](https://foodsure.co.in/blog/fssai-compliance-checklist-beverage-brands/)
- [Towards Uniform Vegan Labelling In India: Legal And Regulatory Implications Of The 2026 FSSAI Amendment](https://www.mondaq.com/india/consumer-law/1798008/towards-uniform-vegan-labelling-in-india-legal-and-regulatory-implications-of-the-2026-fssai-amendment)
- [Not enough time? India gives 90-day deadline to re-label energy drinks (FoodNavigator)](https://www.foodnavigator.com/Article/2026/08/27/not-enough-time-india-gives-90-day-deadline-to-re-label-energy-drinks/)
- [No more 'energy drink' labels: What FSSAI's 90-day order means for Red Bull, Sting, Monster (BestMediaInfo)](https://bestmediainfo.com/mediainfo/mediainfo-marketing/no-more-energy-drink-labels-what-fssais-90-day-order-means-for-red-bull-sting-monster-12203644)
- [What's The Whole Truth? India's Clean Label D2C Brands Vs FSSAI (Inc42)](https://inc42.com/features/whats-the-whole-truth-indias-clean-label-d2c-brands-vs-fssai/)
- [FSSAI Labelling Amendment 2026: Natural Claims, Nutrition, Symbols](https://www.ingredicheck.app/blog/fssai-labelling-amendment-2026-what-changes-for-indian-consumers)

**Shopify India + Razorpay + Shiprocket (HIGH confidence — primary sources)**
- [Razorpay Shopify Payment Gateway Pricing Explained (Razorpay)](https://razorpay.com/blog/razorpay-shopify-payment-gateway-pricing-explained/)
- [UPI Intent vs Collect: Which One Actually Works Better in 2026? (Razorpay)](https://razorpay.com/blog/upi-intent-vs-collect-success-rates/)
- [The UPI Intent Flow for iOS Users is Now on Razorpay (Razorpay)](https://razorpay.com/blog/upi-intent-ios/)
- [Shopify Checkout Issues: Fixes for Indian Merchants 2026 (Razorpay)](https://razorpay.com/blog/shopify-checkout-issues-india-fixes/)
- [Shopify Pricing India 2026: Plans, Fees & Hidden Costs Explained](https://bybtraction.com/shopify-pricing-india-plans-fees-hidden-costs/)
- [Shopify GST Invoicing Setup for India](https://www.customfit.ai/blog/shopify-cro/shopify-gst-invoicing-india)
- [How to Set Up GST, Shipping & COD on Shopify India 2026](https://bybtraction.com/shopify-gst-shipping-cod-india/)
- [Hidden Shipping Surcharges: Fees Killing Your D2C Margins](https://metaport.in/hidden-shipping-surcharges-d2c/)
- [COD vs Prepaid: RTO Rates, Cost & Profitability for D2C 2026](https://shipprime.live/resources/blogs/cod-vs-prepaid-rto-profitability)
- [Average RTO Rate in India by Category 2026 (Base Blog)](https://base.com/en-IN/blog/rto-rates-in-india/)
- [COD Return Rates by Product Category in India: 2026 Report (Base Blog)](https://base.com/en-IN/blog/cod-return-rates-by-product-category-in-india-2026-report/)
- [Shiprocket Pricing 2026: Plans, Costs & Hidden Fees](https://checkthat.ai/brands/shiprocket/pricing)

**Mobile ad / In-app browser / Meta Pixel (HIGH confidence)**
- [Deep Links in Instagram, TikTok, and Facebook In-App Browsers (Airbridge)](https://www.airbridge.io/en/blog/deep-link-opened-in-social-app-browser-what-breaks)
- [Why Your Facebook Ads Aren't Converting — In-App Browser (Urlgenius)](https://app.urlgeni.us/blog/why-facebook-ads-arent-converting-in-app-browser)
- [Why Instagram Links Lose 40% of Sales: The In-App Browser Problem](https://blog.bouncy.ai/blog/instagram-links-lose-sales/)
- [Meta Conversions API (CAPI) + iOS 14 Attribution Playbook 2026](https://aknigam.com/insights/meta-capi-ios-playbook/)
- [Fix Meta Ads iOS Attribution in 2026 (40-60% Recovery)](https://www.get-ryze.ai/blog/meta-ads-ios-tracking-issues-fix-attribution)
- [The Ultimate How To Reduce Bounce Rate From Cookie Banners 2026](https://elementor.com/blog/ultimate-how-reduce-bounce-rate-from/)

**React / Vite / Framer Motion / Core Web Vitals (HIGH confidence)**
- [Reduce bundle size of Framer Motion (Motion official docs)](https://motion.dev/docs/react-reduce-bundle-size)
- [Framer Motion / Motion: React Animations Complete Guide 2026 (DEV)](https://dev.to/stacknotice/framer-motion-motion-react-animations-complete-guide-2026-3e7l)
- [Fixing Dark Mode Flickering (FOUC) in React and Next.js — Not A Number](https://www.notanumber.in/blog/fixing-react-dark-mode-flickering)
- [Dark mode with no flash: the data-theme init pattern (DEV)](https://dev.to/omkarsahu/dark-mode-with-no-flash-the-data-theme-init-pattern-4mc8)
- [Fix 100vh Layout Bugs on Mobile Safari — dvh/svh/lvh Guide](https://us.corejsc.com/blog/fixing-100vh-mobile-safari-dynamic-viewport-bug/)
- [What Are the Core Web Vitals? LCP, INP & CLS Explained 2026](https://www.corewebvitals.io/core-web-vitals)
- [SEO for SPAs (React, Vue, Angular) — 2026 Developer Guide](https://digitelia.co/blog/seo-for-single-page-applications-react-vue/)

**D2C India brand/positioning (MEDIUM confidence — industry commentary)**
- [Experts Say 2026 Will Reward Discipline, Not Scale, in India's D2C Sector (Entrepreneur India)](https://www.entrepreneur.com/en-in/news-and-trends/experts-say-2026-will-reward-discipline-not-scale-in/501635)
- [D2C Branding Mistakes That Are Killing Your Growth in 2026](https://decodegrowth.in/blogs/d2c-branding-mistakes-that-are-killing-your-growth-in-2026-and-how-to-fix-them/)
- [What Actually Drives D2C Brand Marketing in India in 2026](https://mantle.international/insights/what-actually-drives-d2c-brand-marketing-in-india-in-2026/)
- [FSSAI says six cos rectified misleading claims, trademarks after crackdown (Business Standard)](https://www.business-standard.com/amp/india-news/fssai-says-six-cos-rectified-misleading-claims-trademarks-after-crackdown-126081600372_1.html)

**Shopify migration / SEO (HIGH confidence)**
- [Shopify SEO Migration: How To Preserve Organic Traffic 2026 (Shopify)](https://www.shopify.com/blog/shopify-seo-migration)
- [Migrating to Shopify: Data, Redirects & Testing in 2026](https://ifgecommerce.com/en/blogs/shopify-guides-francesco-guiducci/migrating-to-shopify-data-redirects-testing-2026)
- [Shopify SEO Migration Guide 2026 (Charle Agency)](https://www.charleagency.com/articles/shopify-seo-migrations-guide/)

---
*Pitfalls research for: India-first D2C beverage brand, React/Vite pre-launch marketing site transitioning to Shopify+Razorpay+Shiprocket*
*Researched: 2026-10-09*
