# SHI-28 CAPSHOT

## What This Is

A premium D2C beverage brand selling pre-filled flavor powder caps that twist onto any standard 28mm water bottle. Twist → shake → instant drink. India-first, targeting mobile-savvy young adults who want portable, zero-waste, flavor-on-demand alternatives to pre-mixed bottled drinks. The project is the brand's marketing website, launching pre-sales via waitlist and evolving into a live Shopify-backed D2C store once inventory ships.

## Core Value

**Convert a mobile ad-driven visitor into an engaged pre-launch waitlist signup — and later, a buyer — through premium, scroll-driven brand storytelling that makes the "twist, shake, boom" moment feel inevitable to try.**

If the hero section fails to communicate the concept in <5 seconds on mobile, nothing else matters.

## Requirements

### Validated

<!-- Shipped and confirmed valuable. -->

(None yet — ship to validate)

### Active

<!-- Current scope. Building toward these. Each will be mapped to a phase in ROADMAP.md -->

- [ ] Mobile-first responsive marketing site with Lighthouse >90 on mobile
- [ ] Hero section communicating TWIST.SHAKE.BOOM concept in <5 seconds
- [ ] 3-step animated "How It Works" section (Twist / Shake / Boom)
- [ ] All 16 flavors browsable with range filters (Fruity Blast / Desi & Cool / Premium Sports)
- [ ] USP comparison vs regular bottled drinks (freshness, nutrient value, portability)
- [ ] Variant explainer (200–250 ml vs 350–500 ml dosage guidance)
- [ ] Dedicated Premium Sports range showcase (Matcha / Black Pump / Java Pump / Coffee)
- [ ] Trust & safety section (FSSAI, Vegan, Non-GMO, Made in India badges)
- [ ] FAQ section (6–8 common questions, accordion)
- [ ] About page with founder story
- [ ] Contact page with WhatsApp Business, Instagram, email
- [ ] Centralized CTA system (`src/config/cta.ts`) that routes all "Buy/Join" buttons through one destination config
- [ ] Light / dark mode with WCAG AA contrast across brand palette
- [ ] Hinglish headlines (English body) throughout
- [ ] SEO + OG meta tags per route; sitemap.xml
- [ ] Phase 6: Shopify + Razorpay + Shiprocket commerce layer with 3 bundles (Trial 5 / Fitness 15 + shaker / Bulk 30)

### Out of Scope

<!-- Explicit boundaries. Includes reasoning to prevent re-adding. -->

- Pure Shopify theme build — rejected because original spec locks a "premium creative Framer Motion storytelling" direction that Shopify Liquid themes constrain
- Shopify Hydrogen (headless Shopify + React) — more complex than needed; hybrid redirect model gets same creative control at lower surface area
- "Energy drink" hero positioning — only 4 of 16 flavors are energy-coded; dilutes the fruity majority. Energy story lives in a dedicated sub-section only
- Embedded shopping cart on marketing site — redirect to Shopify checkout keeps the two concerns clean
- International shipping at launch — India-first; disable intl cards and shipping zones initially
- Blog / content marketing — defer until brand is validated and traffic justifies editorial investment
- Native mobile app — PWA-adjacent mobile web is sufficient for ad-driven D2C
- Loyalty program / referrals in v1 — add once there's a repeat-purchase base to activate
- Email marketing capture in Phase 1 — WhatsApp Business is the client's preferred channel; email comes with Shopify in Phase 6
- Desktop-first design — 95% of traffic will be mobile (IG/FB ads); desktop is scale-up, not primary

## Context

**Product origin & stage**
- Client is a pre-launch D2C beverage brand (SHI-28 CAPSHOT). Inventory not yet shipping; website drives waitlist signups via WhatsApp Business until Phase 6.
- Two source specs: `product_specs_short` (brand + website direction) and `D2C E-commerce Website Blueprint` (commerce layer plan). Blueprint supersedes long-term; marketing site is built first with commerce hooks reserved.

**Market & audience**
- India-first market. 95% of traffic expected from Instagram/Facebook mobile ads targeting young adults 18–35.
- Hinglish ("Twist karo. Shake karo. BOOM — drink ready.") is approved for headlines/micro-copy.
- Price-sensitive market; COD support is critical for Phase 6 commerce (also a margin risk — Indian D2C averages 30%+ RTO).

**Brand assets available**
- Logos: `Logo_SHI-28.png` (horizontal metallic wordmark), `Logo_Square.png` (circular badge with "TWIST.SHAKE.BOOM" ring)
- Product/lifestyle shots: `Image1-3.jpg`, `capshot-B_dqd1eG.png`, WhatsApp-sourced photos in `/Media`
- Reference videos in `/Media` for internal context only — not for embed on site

**Existing project-local skills (`.claude/skills/`)**
- `capshot-brand` — brand palette, logo rules, voice, Hinglish policy, CTA conventions, mobile mandate
- `capshot-catalog` — 16 flavors × 3 ranges with per-flavor accent hex + Shopify-shaped TypeScript product model
- `capshot-commerce-rollout` — Phase 6 Shopify/Razorpay/Shiprocket playbook with launch checklist (loads only when commerce work is active)

**Outstanding information still needed from client**
- Founder photo + 2–3 line bio (for About section — can placeholder until provided)
- Nutrition/ingredients per flavor (sugar content, caffeine in Sports range — needed for trust + regulatory)
- Final per-flavor product shots for all 16 (initial shots cover only 8)
- FSSAI license number (required before Phase 6 go-live)
- Final domain purchase (`capshot.co` tentative)

## Constraints

- **Tech stack**: React + TypeScript + Vite + Tailwind + Framer Motion + React Router — Locked by original spec; preserves creative control and keeps bundle sizes tight
- **Performance**: Lighthouse mobile ≥ 90 across all four metrics; first meaningful paint < 2s on 4G — 95% mobile traffic from paid ads; bounce rate kills conversion
- **Design**: Palette locked to `#594545` / `#815B5B` / `#9E7676` / `#FFF8EA`; light/dark swap with WCAG AA — Client-locked brand identity
- **Mobile-first**: Design mobile layouts first, scale up — Blueprint overrides original spec's "desktop-first" wording based on traffic reality
- **Positioning**: Hero narrative = refreshing hydration (NOT energy drinks) — Only 4 of 16 flavors are energy-coded; broad appeal protects the catalog
- **Build cadence**: Phase-by-phase, pause for client review between phases — Explicit client requirement in original spec
- **Budget**: Shopify ~₹2,000/mo deferred until Phase 6; Phase 1–5 are free to host (Vercel/Netlify static) — Client is pre-revenue; infra cost must track revenue readiness
- **Legal**: FSSAI license mandatory before Phase 6 commerce go-live; cannot sell food/beverage online in India without it

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Hybrid architecture: custom React marketing site + Shopify checkout (Phase 6) | Preserves premium creative direction while leveraging Shopify's commerce backend when live | — Pending |
| Lead with "refreshing hydration" positioning, not "energy drinks" | Only 4 of 16 flavors are energy-coded; energy positioning dilutes the fruity majority | — Pending |
| WhatsApp Business as Phase 1 conversion channel (vs email waitlist) | Zero infra, works day one, client's existing channel | — Pending |
| Centralized `src/config/cta.ts` — single source of truth for all CTAs | Phase 6 commerce swap = edit one file, not every section | — Pending |
| Flavor data model mirrors Shopify product schema from day one | Phase 6 migration becomes a data swap, not a refactor | — Pending |
| Defer Shopify ₹2k/mo cost to Phase 6 (when inventory ships) | Client is pre-revenue; infra cost must track revenue readiness | — Pending |
| India-first with Hinglish headlines (not global-English or full-Hinglish) | Reflects target audience; keeps body copy scannable | — Pending |
| 16 flavors (coffee is #16, intentional) | Client confirmed — original spec listed 15 then added coffee below | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd:progress`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd:complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-10-09 after initialization*
