# CAPSHOT Homepage Sections Blueprint

Canonical section order and intent for the long-scroll homepage (`/`). Load when planning, building, or editing a homepage section so narrative continuity is preserved.

## Section order (top to bottom)

1. **Nav** — Logo (horizontal) left, nav links right, theme toggle, mobile hamburger
2. **Hero** — "TWIST.SHAKE.BOOM" moment; product shot + waitlist CTA
3. **How It Works** — 3-step: TWIST → SHAKE → BOOM
4. **Flavor Teaser** — Grid of 16 flavors (visual tiles) + "See all" link to `/flavors`
5. **USP Comparison** — Why CAPSHOT beats regular drinks (table or 3-card format)
6. **Variants** — 200–250ml vs 350–500ml dosage split
7. **Premium Sports Highlight** — Dedicated moment for Matcha / Black Pump / Java Pump / Coffee
8. **Trust & Safety** — FSSAI (when live), Vegan, Non-GMO, Made in India badges
9. **FAQ** — 6–8 common questions, accordion
10. **Final CTA** — Hinglish punch headline + waitlist/WhatsApp CTA
11. **Footer** — Logo, nav mirror, social (IG), contact info, legal

## Section intent (one line each)

| Section | Primary intent | Secondary intent |
|---|---|---|
| Hero | Communicate concept in <5 seconds + drive CTA | Set premium tone |
| How It Works | Remove friction/confusion about the product | Make the concept memorable |
| Flavor Teaser | Showcase variety breadth | Pull users to `/flavors` for depth |
| USP Comparison | Build rational trust vs incumbents | Pre-empt "why not just buy a drink" objection |
| Variants | Educate on dosage | Signal product versatility |
| Premium Sports | Capture fitness/energy audience segment | Elevate perceived product tier |
| Trust & Safety | Lower purchase-hesitation for food category | Signal regulatory legitimacy |
| FAQ | Resolve last-mile objections | Reduce support DMs |
| Final CTA | Catch bounce-ready users with one last offer | Reinforce brand voice |
| Footer | Discoverability + legal | Social follow |

## Rules

- Every section's primary CTA (if any) uses the `<PrimaryCTA>` component from `src/config/cta.ts`.
- No section should repeat the TWIST.SHAKE.BOOM headline — hero owns it; other sections echo it only in micro-copy.
- Alternate background between `brand-cream` and `brand-mid`-washed sections to create vertical rhythm.
- Each section has a clear "scroll out" cue (next-section peek, directional arrow, or color transition).
- Mobile: each section should fit roughly within 1–1.5 viewport heights to maintain scroll momentum. Avoid dense walls of text.

## Build order (phases)

- **Phase 1:** Nav + Hero + Footer scaffold. Other sections = placeholder divs.
- **Phase 2:** How It Works + Final CTA
- **Phase 3:** Flavor Teaser + `/flavors` page
- **Phase 4:** USP Comparison + Variants + Premium Sports Highlight
- **Phase 5:** Trust & Safety + FAQ + About + Contact pages + SEO/perf pass
- **Phase 6:** Commerce integration (see `capshot-commerce-rollout` skill)
