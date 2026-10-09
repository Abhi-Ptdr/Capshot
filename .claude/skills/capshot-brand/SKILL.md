---
name: capshot-brand
description: Authoritative brand guide for the SHI-28 CAPSHOT D2C website — color palette, typography intent, logo usage, Hinglish copy policy, voice/tone, do's and don'ts, CTA conventions, mobile-first mandate. Load this skill whenever writing or reviewing CAPSHOT UI, copy, components, section layouts, marketing text, hero sections, or any user-facing content for this project. Trigger on any task touching src/, components, pages, sections, copy, headlines, CTAs, colors, theme tokens, or visual design for CAPSHOT.
---

# CAPSHOT Brand Guide

**Product:** SHI-28 CAPSHOT — pre-filled flavor powder caps that twist onto any 28mm water bottle. Tagline: **TWIST.SHAKE.BOOM**.

**Current stage (2026-10-09):** Pre-launch marketing site. Primary conversion goal = waitlist signup via WhatsApp. Shopify commerce comes in Phase 6.

## Positioning (locked)

**Hero narrative = refreshing hydration, NOT energy drinks.**

- Lead with "turn any water bottle into instant flavor" — broad appeal, all 16 flavors fit.
- Premium Sports range (Matcha, Black Pump, Java Pump, Coffee) gets its own dedicated section lower on the page for the caffeine/energy story.
- DO NOT use "Ditch Unhealthy Energy Drinks!" as a homepage headline — only 4 of 16 flavors are energy-coded; it dilutes the fruity majority.

## Color palette (locked)

| Token | Hex | Role (light mode) | Role (dark mode) |
|---|---|---|---|
| `brand-deep` | `#594545` | Body text, headings | Background |
| `brand-mid` | `#815B5B` | Accent, surfaces | Elevated surfaces |
| `brand-rose` | `#9E7676` | Soft accents, borders | Accents |
| `brand-cream` | `#FFF8EA` | Background | Body text, headings |

**Rules:**
- Swap intelligently between modes, always maintaining WCAG AA contrast (4.5:1 for body text).
- NEVER introduce colors outside this palette for brand surfaces. Flavor-specific accents are allowed only inside flavor cards (see `capshot-catalog` skill for per-flavor hex codes).
- Use `brand-cream` as the primary light-mode background — pure white (`#FFFFFF`) is permitted ONLY for elevated cards/surfaces where separation is needed.

## Typography intent

- **Display/headlines:** A strong geometric sans with slight weight (think Inter Display, Satoshi, Clash Display, or similar). The SHI-28 logo wordmark is a bold industrial treatment — headline type should feel adjacent, not competing.
- **Body:** Clean humanist sans (Inter, Geist) — maximize readability on mobile at 16px+.
- **No decorative/handwritten fonts.** Premium/elegant feel.
- Default to tight letter-spacing on display, slightly open on all-caps section labels.

## Logo usage

Logos live in `/Media/`:

- `Logo_SHI-28.png` — horizontal metallic black wordmark with "TWIST.SHAKE.BOOM" subtitle. Use in **top nav** and **footer**.
- `Logo_Square.png` — circular black "SHI-28" badge with ring tagline. Use for **favicon**, **social share avatar**, and **product-cap overlay graphics**.
- `capshot-B_dqd1eG.png` — orange-cap product shot with floating oranges (lifestyle hero image candidate).

**Rules:**
- On dark backgrounds, if a white/inverted logo variant is not yet available, use the logo at full opacity on a cream (`#FFF8EA`) rounded surface — do NOT recolor the logo file.
- Minimum clear space around logo = height of the "S" in SHI-28.
- Never stretch, rotate, or recolor the logos.

## Voice & tone

- **Confident, playful, premium.** We're not shouting; we're inviting.
- **Hinglish is approved** where it fits naturally. Approved patterns:
  - "Twist karo. Shake karo. **BOOM** — drink ready."
  - "Kisi bhi bottle pe lagao."
  - "Fresh. Instant. Portable."
- Hinglish goes in **punchy headlines, sub-heads, and micro-copy**. Keep body copy mostly English for scannability.
- **Avoid:** generic D2C clichés ("game-changer", "revolutionary", "disrupting"), excessive exclamation marks, hard-sell energy-drink tropes ("unleash your power!"), medical/health claims we can't substantiate.
- **Hinglish test:** if an Indian millennial would roll their eyes at the phrasing, cut it.

## CTA conventions

**All conversion CTAs must route through one centralized config file** — `src/config/cta.ts` (to be created in Phase 1). This file owns the destination URL and prefilled message. Do NOT hard-code WhatsApp or future Shopify URLs inside sections.

**Phase 1 destination (current):**
```
https://wa.me/919203975762?text=Hi%20CAPSHOT!%20I%20want%20to%20join%20the%20waitlist.
```

**Phase 6 destination (future):** Shopify product/bundle URLs. The swap is done in `cta.ts` only — components stay untouched.

**Primary CTA label (Phase 1):** "Join the Waitlist" or "Notify Me on WhatsApp" (NOT "Buy Now" — nothing to buy yet).
**Secondary CTA:** "See All Flavours" → `/flavors`.

Build one `<PrimaryCTA>` component. Every section imports it. No exceptions.

## Mobile-first mandate

- 95% of expected traffic is mobile (Instagram/Facebook ads).
- Design mobile layouts FIRST, then adapt up to tablet and desktop.
- Minimum tap target: 44×44px. Primary CTAs: 56px+ height on mobile.
- Hero section must render first meaningful paint under 2s on 4G.
- Lighthouse mobile score target: >90 across all four metrics.

## Do / Don't quick reference

| Do | Don't |
|---|---|
| Use `brand-cream` as default light bg | Use pure white as default background |
| Centralize CTAs in `src/config/cta.ts` | Hard-code wa.me URLs in sections |
| Lead with "refreshing hydration" story | Lead with "energy drinks" messaging |
| Mobile-first layouts, scale up | Desktop-first then shrink |
| Hinglish headlines, English body | Hinglish body copy (noisy, hard to scan) |
| Use the two logo files as-is | Recolor or restyle logos |
| Build phase-by-phase, pause for review | Generate everything at once |

## Reference files

- `references/sections-blueprint.md` — section-by-section homepage order with intent per section (load when planning or editing a homepage section).

## Related skills

- `capshot-catalog` — authoritative source for the 16 flavors, their colors, and the Shopify-shaped product data model.
- `capshot-commerce-rollout` — Phase 6 Shopify/Razorpay/Shiprocket integration playbook (load only when wiring commerce).
