# Phase 1: Foundation + Hero + Conversion Infrastructure - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-10-09
**Phase:** 1-Foundation + Hero + Conversion Infrastructure
**Areas discussed:** Hero visual direction + asset, Hero copy + CTA + WhatsApp message, In-app browser nudge UX, Non-home routes shell

---

## Hero visual direction + asset

### Q1 — Hero visual direction

| Option | Description | Selected |
|--------|-------------|----------|
| Static product hero shot | Premium still of cap screwed onto a water bottle; fastest LCP, safest Lighthouse, Motion polish layered in Phase 3 | ✓ |
| Silent muted autoplay video | 3–4s loop of twist → shake → color-change; highest emotional impact but biggest LCP risk on Jio 4G | |
| Illustrated/animated cap-on-bottle | SVG or 3D-rendered cap-on-bottle that animates via Motion; more brand-ownable but needs illustration work | |
| Flavor-swap visual | Single bottle with color-cycling cap through flavor accent hexes; showcases range but pulls attention off TWIST.SHAKE.BOOM | |

**User's choice:** Static product hero shot

### Q2 — Asset source for Phase 1

| Option | Description | Selected |
|--------|-------------|----------|
| Ship with best Media/ photo | Pick strongest WhatsApp/Image1–3 shot, retouch (bg clean, color-grade to palette) and ship; fastest, swappable later | ✓ |
| AI-upscaled/retouched Media photo | Hi-res upscale + brand retouch for premium feel without a real shoot | |
| Illustrated stand-in | Hand-draw/vector cap-on-bottle in brand palette as placeholder | |
| Studio shoot before Phase 1 ships | Block Phase 1 ship on proper product shoot; highest quality, 1–2 week dependency | |

**User's choice:** Ship with best Media/ photo

### Q3 — Hero layout on 360×640 mobile

| Option | Description | Selected |
|--------|-------------|----------|
| Visual above headline + CTA stacked below | Full-width hero takes top ~55–60% of 100dvh, headline/sub-copy/CTA stack below; clearest "first 5 seconds" story | ✓ |
| Headline overlay on hero visual | Hero fills 100dvh as background, headline + CTA overlay with gradient scrim; cinematic but careful contrast work needed | |
| Headline above, visual below, CTA pinned bottom | Headline top, visual middle, CTA pinned-bottom with safe-area-inset; CTA always thumb-reachable but may feel detached | |

**User's choice:** Visual above headline + CTA stacked below

### Q4 — Secondary element in hero

| Option | Description | Selected |
|--------|-------------|----------|
| Pure product, no extras | Hero shows only the cap-on-bottle; zero distraction, 16-flavor breadth lives in Phase 2 teaser | ✓ |
| Small flavor-color dots strip | Thin row of 6–8 per-flavor accent dots under headline or above CTA — hint at range without competing | |
| "16 flavors" micro-badge | Tiny text badge near headline establishing range in words | |
| You decide | Claude picks | |

**User's choice:** Pure product, no extras

---

## Hero copy + CTA + WhatsApp message

### Q1 — Hinglish hero headline

| Option | Description | Selected |
|--------|-------------|----------|
| Twist karo. Shake karo. BOOM. | PROJECT.md example trimmed; three Hinglish beats mapped 1:1 to the three-step section | ✓ |
| TWIST.SHAKE.BOOM. (tagline only) | Product-spec tagline alone; punchier but loses the Hinglish "karo" voice | |
| Twist. Shake. BOOM — drink ready. | Hybrid, adds payoff but less Hinglish | |

**User's choice:** Twist karo. Shake karo. BOOM.

### Q2 — Sub-headline

| Option | Description | Selected |
|--------|-------------|----------|
| Pre-filled flavor caps for any bottle. | Plain English, maximum clarity, explains the physical product in 7 words | ✓ |
| Kisi bhi bottle pe lagao — instant drink. | Fully Hinglish; brand voice says body copy stays English, this blurs that line | |
| 16 flavors. 1 twist. Zero waste. | Benefit-forward instead of product-forward; doesn't explain what it physically IS | |
| You decide | Claude picks | |

**User's choice:** Pre-filled flavor caps for any bottle.

### Q3 — Primary CTA button label

| Option | Description | Selected |
|--------|-------------|----------|
| Join the Waitlist | Clearest pre-launch pattern, pairs well with WhatsApp pre-fill | |
| Get Early Access | More aspirational; implies scarcity/privilege | |
| Be the First to Try | Puts the visitor at the center of the story; longer text may wrap at 320px | |
| Pre-order Now | Implies money/commitment, which is misleading in Phase 1 — flagged not recommended | |
| SHOP NOW / TRY CAPSHOT (user-proposed per Blueprint) | Blueprint-aligned label | partial ✓ |
| TRY CAPSHOT (chosen after scope-mismatch discussion) | Phase-invariant label — same string works for Phase 1 WhatsApp waitlist and Phase 6 Shopify bundles | ✓ |

**User's choice:** TRY CAPSHOT
**Notes:** User initially chose "SHOP NOW / TRY CAPSHOT" citing the D2C Blueprint. Claude flagged that the Blueprint describes the Phase 6 end-state and "SHOP NOW" is deceptive in Phase 1 (no shop exists). Three options were presented: (A) keep Phase 1 scope locked with TRY CAPSHOT, (B) add a Phase 1 Bundles preview section, (C) collapse Phase 1 and Phase 6. User chose (A) — Phase 1 scope stays locked, CTA label is TRY CAPSHOT, destination = WhatsApp waitlist in Phase 1 / Shopify bundles in Phase 6 (destination-only flip in cta.ts).

### Q4 — WhatsApp pre-filled message

| Option | Description | Selected |
|--------|-------------|----------|
| Hi! Add me to the CAPSHOT waitlist. | Clean, English, scannable in team's WA inbox; easy to triage at scale | ✓ |
| Hi CAPSHOT! Waitlist me — can't wait to twist, shake, boom. | Brand voice, Hinglish-tinged, playful; harder to triage at volume | |
| Hi! I want to try CAPSHOT. Please add me to the waitlist. | Longer, clearer intent; works if team wants to follow up on bottle-size/flavor preference | |
| You decide | Claude picks | |

**User's choice:** Hi! Add me to the CAPSHOT waitlist.

### Q5 — WhatsApp Business number

| Option | Description | Selected |
|--------|-------------|----------|
| I'll provide the number now | Store number in src/config/cta.ts; must be WhatsApp Business for ad-driven scale | ✓ |
| Stub it with an env var for later | Phase 1 ships with VITE_WA_NUMBER as env var; live site can't actually open WA until number set | |
| Blocker — WhatsApp Business account not set up yet | Flag as prerequisite for Phase 1 ship | |

**User's choice:** `+91 9203975762`, verified WhatsApp Business account

---

## In-app browser nudge UX

### Q1 — Banner position

| Option | Description | Selected |
|--------|-------------|----------|
| Sticky top | Pinned to top, pushes hero down; highest visibility, impossible to miss | ✓ |
| Sticky bottom | Pinned to bottom above safe-area-inset; less intrusive but competes with iOS Safari toolbar + primary CTA | |
| Floating card near top | Floating card below nav, scrolls away with content; prettier but low re-engagement | |

**User's choice:** Sticky top

### Q2 — Dismiss behavior

| Option | Description | Selected |
|--------|-------------|----------|
| Session-only (sessionStorage) | Dismissed stays dismissed until tab closes; re-shown on new ad click | ✓ |
| Persistent (localStorage, 7 days) | Dismissed for 7 days across visits; lower nag but Phase 6 UPI breakage risk | |
| Not dismissible | Banner stays until user actually opens the site in a real browser | |

**User's choice:** Session-only (sessionStorage)

### Q3 — iOS copy

| Option | Description | Selected |
|--------|-------------|----------|
| For the best experience, open in Safari → | Clean English, clear action, right-arrow glyph | ✓ |
| Safari mein kholo for the best experience → | Hinglish-tinged, matches hero voice but "kholo" less universal | |
| Open in Safari for UPI + faster checkout | Benefit-forward but only compelling in Phase 6 | |
| You decide | Claude picks | |

**User's choice:** For the best experience, open in Safari →

### Q4 — Android behavior

| Option | Description | Selected |
|--------|-------------|----------|
| Auto-redirect to Chrome on load | Fire intent:// on first render; visitor booted to Chrome within ~500ms | ✓ |
| Show same banner, user taps to open | Mirror iOS behavior; consistent UX but loses Android auto-handoff advantage | |
| Auto-redirect once, then show banner if they come back | Combine both; more logic to implement + test | |

**User's choice:** Auto-redirect to Chrome on load

---

## Non-home routes shell for Phase 1

### Q1 — What /flavors, /about, /contact show in Phase 1

| Option | Description | Selected |
|--------|-------------|----------|
| Branded "Coming soon" empty state per route | Each route renders a small page with logo, route-specific one-liner, and TRY CAPSHOT CTA | ✓ |
| Minimal real content now where cheap | /contact gets WA/IG/email links early; /flavors and /about get coming-soon | |
| All three redirect to / | Routes exist but redirect to home; share links confusing | |
| 404-styled page per route | Themed 404 with CTA; reads as broken | |

**User's choice:** Branded "Coming soon" empty state per route

### Q2 — Per-route coming-soon copy

| Option | Description | Selected |
|--------|-------------|----------|
| Honest short Hinglish copy | /flavors "16 flavors aa rahe hain...", /about "Hamari kahani jaldi aa rahi hai.", /contact "Humse WhatsApp pe baat karo — abhi." | |
| Plain English short copy | /flavors "All 16 flavors coming soon.", /about "Our story is on the way.", /contact "Say hi on WhatsApp — we're here now." | ✓ |
| You decide | Claude picks | |

**User's choice:** Plain English short copy

### Q3 — Phase 1 nav structure

| Option | Description | Selected |
|--------|-------------|----------|
| Logo-only nav in Phase 1 | Nav shows only logo + theme toggle; no visible menu links | ✓ |
| Logo + hamburger with all 4 routes | Standard mobile pattern; hamburger reveals Home/Flavors/About/Contact | |
| Logo + inline TRY CAPSHOT button | No menu; logo left, secondary TRY CAPSHOT right (mirrors hero CTA) | |

**User's choice:** Logo-only nav in Phase 1

### Q4 — 404 fallback

| Option | Description | Selected |
|--------|-------------|----------|
| Branded 404 with TRY CAPSHOT CTA | On-brand "wrong twist" headline, home link, primary CTA | ✓ |
| Auto-redirect to / | Simplest, but soft-404 to crawlers and share links fail silently | |
| Minimal "not found" + home link only | Plain text, honest but boring, sacrifices conversion opportunity | |

**User's choice:** Branded 404 with TRY CAPSHOT CTA

---

## Claude's Discretion

Items the planner/executor picks within the locked constraints:
- Hosting target (Vercel vs Netlify)
- Edge function runtime (match hosting choice)
- Theme toggle UX details and `localStorage` key
- Default theme on first load (`prefers-color-scheme`)
- Pixel ID + CAPI token env var naming
- Favicon + app icon generation workflow
- Hero image exact crop/aspect ratio
- Final 404 playful copy within on-brand tone

## Deferred Ideas

- On-site Bundles section with buy buttons (Phase 6 — gated on FSSAI license + inventory + Shopify budget + nutrition)
- "SHOP NOW" CTA label (Phase 6 may choose to flip; not required since TRY CAPSHOT works both phases)
- Phase 2+ navigation hamburger (introduced once /flavors, /about, /contact have real content)
- Hero cap-twist Motion polish on scroll (Phase 3 Scroll Storytelling Polish layer)
- Flavor-swap visual in hero (declined; could revisit in Phase 3 if tasteful cinematic treatment emerges)
