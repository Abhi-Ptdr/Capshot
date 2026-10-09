# Phase 1: Foundation + Hero + Conversion Infrastructure - Context

**Gathered:** 2026-10-09
**Status:** Ready for planning

<domain>
## Phase Boundary

Deliver a deployable `/` route with a working Hero + WhatsApp waitlist CTA on top of the full conversion scaffold that Phase 6 will inherit unchanged.

**Scope anchor — this phase ships:**
- The four client-side routes (`/`, `/flavors`, `/about`, `/contact`) resolve with a 404 fallback.
- `/` renders a complete, mobile-first Hero section that reads TWIST.SHAKE.BOOM in <5 seconds and converts into a WhatsApp waitlist signup.
- `/flavors`, `/about`, `/contact` render branded "coming soon" shells with the TRY CAPSHOT CTA (full content lands in Phases 2 and 5).
- All conversion infrastructure for the entire site, so Phases 2–5 never have to retrofit: `src/config/cta.ts`, `<PrimaryCTA>`, `LazyMotion` provider + ESLint rule, `100dvh` hero height, inline FOUC dark-mode script, Meta Pixel + Conversions API edge function, in-app browser detect-and-nudge banner, Shopify-shaped flavor stub (`src/data/flavors.ts`), `src/config/features.ts` feature flags, CI greps for `wa.me` outside `cta.ts` and "energy drink" anywhere in `src/`.

**Explicitly NOT in this phase (belongs elsewhere):**
- How It Works 3-step section → Phase 2
- 16-flavor grid, range filters, flavor cards → Phase 2
- Cinematic Motion scroll choreography → Phase 3
- USP comparison, variants explainer, Premium Sports showcase, Lighthouse 90+ pass → Phase 4
- Trust badge strip, FAQ, About content, Contact content, OG tags per route via `@unhead/react`, sitemap.xml → Phase 5
- Bundles, Shopify, Razorpay, Shiprocket, live checkout → Phase 6 (gated)

</domain>

<decisions>
## Implementation Decisions

### Hero Visual
- **D-01:** Hero visual is a **static product hero shot** of the CAPSHOT cap on a water bottle. Motion polish (parallax, cap-twist on scroll) is layered in Phase 3 — Phase 1 ships without it. This keeps LCP tight and the Lighthouse 90+ target in Phase 4 reachable.
- **D-02:** Asset source for Phase 1 ship = **best photo from `Media/`** (WhatsApp/Image1–3.jpg), retouched to brand palette (clean background, color-grade to `#594545`/`#815B5B`/`#9E7676`/`#FFF8EA`). Phase 1 does not block on a studio shoot — the file is behind the `src/components/primitives/Image.tsx` wrapper so a later studio asset is a one-file swap. Prefer vertical/portrait crop since 95% traffic is mobile.
- **D-03:** Hero layout on 360×640 = **visual above, headline + sub-copy + primary CTA stacked below**. Hero fills `100dvh` with `100vh` fallback. CTA must be visible above the iOS Safari dynamic toolbar on first paint (success criterion #2).
- **D-04:** Hero carries **no secondary element** besides the product shot. The 16-flavor breadth story lives in the Flavor Teaser section coming in Phase 2 — don't dilute the first-paint moment.

### Hero Copy + CTA + WhatsApp
- **D-05:** Hero headline (H1) = **`Twist karo. Shake karo. BOOM.`** Three Hinglish beats mapped 1:1 to the TWIST → SHAKE → BOOM three-step section that lands in Phase 2. This is also the project's brand tagline voice.
- **D-06:** Sub-headline = **`Pre-filled flavor caps for any bottle.`** Plain English, scannable in <1 second. Explains the physical product for a visitor who has never seen a cap-shot before.
- **D-07:** Primary CTA button label = **`TRY CAPSHOT`**. This label is **phase-invariant**: Phase 1 destination is WhatsApp waitlist, Phase 6 destination flips to Shopify bundles — the visible string stays the same, so the swap is literally one line in `src/config/cta.ts`. User explicitly chose this ("option A — keep Phase 1 scope locked") after a scope-mismatch discussion where the Blueprint's `SHOP NOW` label was flagged as deceptive during the pre-launch phase (no shop exists until Phase 6).
- **D-08:** Phase 1 WhatsApp pre-filled message = **`Hi! Add me to the CAPSHOT waitlist.`** Short, English, easy to triage in the brand's WhatsApp inbox at ad-driven scale.
- **D-09:** Phase 1 WhatsApp Business destination number = **`+91 9203975762`** (verified WhatsApp Business account). Stored raw in `src/config/cta.ts` as the single source of truth. The `wa.me` URL builder formats it as `https://wa.me/919203975762?text=<url-encoded message>` — no leading `+`, no spaces per `wa.me` URL spec. CI grep blocks any `wa.me` reference outside `cta.ts` (success criterion #5).

### In-App Browser Nudge UX
- **D-10:** Banner position = **sticky top**. Pushes hero content down by banner height when visible — this is intentional, the warning is conversion-critical for the 95% of visitors arriving via Instagram/Facebook WKWebView.
- **D-11:** Dismiss persistence = **session-only (`sessionStorage`)**. Dismissed banner stays dismissed until the tab closes; re-shown on the next ad click so visitors who dismiss once and bounce back don't suppress the warning permanently.
- **D-12:** iOS copy = **`For the best experience, open in Safari →`**. Plain English per the Hinglish-headline-only policy. The right-arrow glyph signals action. iOS WKWebView cannot programmatically redirect to Safari — this instruction is the only mechanism.
- **D-13:** Android behavior = **auto-redirect to Chrome on load via `intent://` scheme** on first paint. Android WebView honors the intent scheme and hands off to Chrome within ~500ms. If Chrome isn't installed, the intent falls back to the default browser; if that fails, the sticky-top banner remains visible as a fallback instruction.

### Non-Home Routes Shell
- **D-14:** `/flavors`, `/about`, `/contact` all render a **branded "coming soon" page per route** with the TRY CAPSHOT CTA. Routes resolve as proper client-side routes (success criterion #1), not redirects to `/`, so share links don't rewrite.
- **D-15:** Per-route coming-soon copy = **plain English** (headline Hinglish stays reserved for the hero route):
  - `/flavors` → "All 16 flavors coming soon."
  - `/about` → "Our story is on the way."
  - `/contact` → "Say hi on WhatsApp — we're here now."
- **D-16:** Phase 1 navigation = **logo-only nav** (link to `/` + theme toggle). No visible menu, no hamburger, no in-nav links to the coming-soon routes. Keeps the hero focus singular. Phase 2+ introduces the hamburger once there's real content behind the links.
- **D-17:** 404 fallback (any path not in the four known routes) = **branded 404 page with TRY CAPSHOT CTA**. Playful on-brand headline (TBD by designer during execution — e.g. "404 — looks like you took a wrong twist."), home link, and the primary CTA so even bad-link traffic can convert. Returns a true HTTP 404 to crawlers (not a soft-redirect to `/`).

### Claude's Discretion
Items the user didn't explicitly weigh in on; planner/executor picks the sensible default consistent with locked constraints:
- **Hosting target** (Vercel vs Netlify): planner picks per CAPI edge function ergonomics; research doc preferred Vercel for familiarity + India edge PoPs. Either works.
- **Edge function runtime**: match the hosting choice (Vercel Edge Functions or Netlify Edge Functions on Deno).
- **Theme toggle UX** in Phase 1 nav: small sun/moon icon button to the right of the logo; follows `prefers-color-scheme` on first load; selection persisted in `localStorage` under `capshot-theme`.
- **Default theme on first load**: follow `prefers-color-scheme`. Both light and dark must pass WCAG AA (final audit in Phase 5).
- **Pixel ID + CAPI access token delivery**: stored in Vercel/Netlify environment variables (`VITE_META_PIXEL_ID` client-side, `META_CAPI_ACCESS_TOKEN` + `META_CAPI_DATASET_ID` server-side). Scaffold wires the plumbing; actual values provided at deploy time by client/dev.
- **Favicon + app icon set**: generated from `Media/Logo_Square.png` via `@vite-pwa/assets-generator`. Not blocking Phase 1 ship.
- **Exact Hero image crop/aspect ratio**: planner/executor picks during implementation; constraint is "visible CTA above iOS Safari toolbar on 360×640 at 100dvh".
- **Branded 404 illustration/headline**: executor picks final copy within the on-brand playful tone (e.g. "wrong twist" / "cap didn't fit here").

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project context (always read first)
- `.planning/PROJECT.md` — core value, locked constraints, out-of-scope, key decisions table
- `.planning/REQUIREMENTS.md` — 36 v1 REQ-IDs with phase mapping; Phase 1 owns INFRA-01..06, CONV-01..05, HERO-01..02
- `.planning/ROADMAP.md` §Phase 1 — goal statement, 5 success criteria, requirement list for this phase
- `.planning/STATE.md` — current project position, Phase 6 gate blockers to carry forward

### Research (produced during roadmap creation — must inform planning)
- `.planning/research/SUMMARY.md` — 10 roadmap-shaping findings; items 4, 5, 6, 10 directly scope Phase 1 (Pixel+CAPI, in-app browser nudge, package name shifts, mobile-perf-as-correctness)
- `.planning/research/STACK.md` — exact package versions and install commands (React 19.3 / TS 7.0.2 / Vite 8.3.4 / Tailwind 4.3.3 / Motion 14 / React Router 8.4 / vite-imagetools / @unhead/react)
- `.planning/research/ARCHITECTURE.md` — 4-layer component tree (Pages → Sections → UI → Primitives); Phase 6 migration surface
- `.planning/research/FEATURES.md` — must-have / should-have / defer feature partitioning
- `.planning/research/PITFALLS.md` — iOS `100vh` crop, dark-mode FOUC, Motion full-bundle risk, Instagram WKWebView attribution loss, FSSAI copy violations

### Project-local skills (brand/catalog authority — must load when applicable)
- `.claude/skills/capshot-brand/SKILL.md` — palette tokens, logo rules, Hinglish policy, voice/tone, CTA conventions, mobile-first mandate
- `.claude/skills/capshot-catalog/SKILL.md` — 16-flavor catalog + canonical Shopify-shaped TypeScript product model (defines the shape of `src/data/flavors.ts`)
- `.claude/skills/capshot-commerce-rollout/SKILL.md` — Phase 6 playbook; informs the Phase 1 "future-proof" invariants (e.g. the 3-files-edited migration surface)
- `.claude/skills/react-perf-optimizer/SKILL.md` — load when working on LazyMotion, hero LCP, or any perf-sensitive animation code

### Project root (also authoritative)
- `CLAUDE.md` — technology stack recommendations and version compatibility matrix (reconfirms STACK.md with install commands + "what NOT to use" table)
- `product_specs_short` — original brand/product spec; variant/dosage source of truth; 16-flavor list (coffee is #16, intentional)
- `D2C E-commerce Website Blueprint` — commerce layer blueprint for Phase 6; useful context for understanding the Phase 6 end-state the Phase 1 architecture must gracefully flip into (NOTE: Blueprint uses "FSSAI Approved" and "energy drinks" phrasing that is Out of Scope — do NOT copy copy verbatim from this doc)

### Media/assets
- `Media/` — Logo_SHI-28.png, Logo_Square.png, Image1–3.jpg, WhatsApp Image/Video files. Phase 1 hero visual comes from here (best WhatsApp/Image1–3 shot, retouched).

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- **Nothing exists yet.** Repo currently contains only `.planning/`, `Media/`, `CLAUDE.md`, `product_specs_short`, `D2C E-commerce Website Blueprint`, and the three project-local skills under `.claude/skills/`. No `src/`, no `package.json`, no `index.html`. Phase 1 is greenfield scaffold work.

### Established Patterns (external — from skills + research)
- **4-layer component tree** (research/ARCHITECTURE.md): `src/pages/` → `src/sections/` → `src/components/ui/` → `src/components/primitives/`. Phase 1 establishes all four layers with at least one component in each.
- **Config-and-data separation**: `src/config/*.ts` for destinations/flags, `src/data/*.ts` for Shopify-shaped product data. These are the only files Phase 6 touches.
- **Centralized CTA pattern** (capshot-brand skill + research): every "Buy/Join/Try" button in the site reads destination + label-overrides from `src/config/cta.ts`. One file, one swap at Phase 6.
- **Shopify-shaped flavor model from day one** (capshot-catalog skill): `{ handle, title, description, images, range, accentHex, dosage, priceInr: null, shopifyProductId: null, available: null }` — nullable fields reserved for Phase 6 population.
- **TrustBadge evidence contract** (research): `<TrustBadge>` component declaration lands in Phase 1 UI layer but is NOT rendered until Phase 5. Prop requirement: `evidenceUrl` mandatory; component refuses to render in `import.meta.env.PROD` without it.
- **LazyMotion + `m.*` only** (research + CLAUDE.md): entire Motion footprint routed through `src/lib/motion.ts` wrapper that exports `LazyMotion` provider + feature imports + `m` primitives. ESLint rule blocks `motion.div` / `motion.*` imports anywhere in `src/`.

### Integration Points (where this phase bolts the scaffold the future bolts onto)
- `src/config/cta.ts` — Phase 1 WhatsApp destination; Phase 6 flips to Shopify checkout URL. Phase 2 reads this for Flavor cards' CTAs. Phase 5 reads this for the trust strip's Contact CTA.
- `src/config/features.ts` — booleans like `ENABLE_BUNDLES`, `ENABLE_SHOPIFY_CTAS` default to `false` in Phase 1; Phase 6 flips to `true`.
- `src/data/flavors.ts` — Phase 1 scaffold-only (1 placeholder flavor or 16 stubs with handle/title/range/accentHex populated, Phase 6 fields `null`). Phase 2 populates descriptions + dosage + images for all 16. Phase 6 populates `priceInr` + `shopifyProductId` + `available`.
- `index.html` — Phase 1 inlines the dark-mode FOUC `<script>`, the Meta Pixel snippet, hero preload hints, and the hardcoded homepage OG tags (per-route OG tags via `@unhead/react` land in Phase 5).
- `src/lib/motion.ts` — Phase 1 LazyMotion provider; Phase 3 reuses it for the cinematic scroll choreography.
- `src/lib/detectInAppBrowser.ts` — Phase 1 Instagram/FB WKWebView detector + Android `intent://` auto-forward; reused in Phase 6 to re-warn visitors at checkout.
- `/api/track-lead` (edge function) — Phase 1 CAPI endpoint fires `Lead` event; Phase 6 may add `Purchase` and `InitiateCheckout` endpoints alongside it with the same shared-`event_id` dedup pattern.

</code_context>

<specifics>
## Specific Ideas

- **Button label continuity across phases**: user explicitly chose a Phase-invariant CTA label (`TRY CAPSHOT`) so Phase 6 is a destination swap, not a copy change. This reinforces the "3 files edited, 2 added, 1 un-gated" Phase 6 invariant.
- **Blueprint reference**: user cited the `D2C E-commerce Website Blueprint` document twice during discussion, requesting Blueprint-aligned CTA treatment. Blueprint describes the Phase 6 end-state; the Phase 1 CTA label was aligned to it, but the Phase 1 destination/scope stays as planned (WhatsApp waitlist, no bundles in Phase 1). Flag for the planner: when phases past 1 reference the Blueprint, cross-check against ROADMAP.md and research findings — Blueprint pre-dates the FSSAI language research and uses non-compliant terms ("FSSAI Approved", "energy drinks") that are explicitly Out of Scope.
- **Hero asset from `Media/`**: user wants to ship Phase 1 using the best existing WhatsApp/Image1–3 photo rather than block on a studio shoot. Expect retouch work (background clean-up, color-grade to brand palette) as part of Phase 1 execution — not a code task, but a design/asset task that lives on the Phase 1 critical path.
- **WhatsApp Business account**: `+91 9203975762` is already Business-verified. No "upgrade to Business before scale" prerequisite needed.

</specifics>

<deferred>
## Deferred Ideas

- **On-site Bundles section with buy buttons** — Surfaced during CTA discussion when user cited the Blueprint. Belongs in Phase 6 (requires FSSAI license + inventory + Shopify budget + per-flavor nutrition data). The `Bundles.tsx` component is explicitly the "section rendered for the first time in Phase 6" per the Phase 6 migration surface in ROADMAP.md.
- **"SHOP NOW" CTA label** — Blueprint-aligned but deceptive during Phase 1 pre-launch (no shop exists). Not adopted. Phase 6 may still choose to flip the label when the destination becomes a real Shopify checkout — that's a Phase 6 decision; `TRY CAPSHOT` works for both phases so no label swap is strictly required.
- **Phase 2+ navigation hamburger** — Once `/flavors`, `/about`, `/contact` have real content, the logo-only Phase 1 nav expands to a hamburger with the four routes. Phase 2 should decide on hamburger vs tab-bar on mobile.
- **Hero cap-twist on-scroll Motion polish** — The illustrated/animated cap-on-bottle direction was offered and declined for Phase 1. Phase 3 (Scroll Storytelling Polish) layers Motion `useScroll` + `useTransform` on top of the static hero shot to produce the cap-twist effect — zero asset change needed.
- **Flavor-swap visual in hero** — Offered as a hero direction (cycling flavor accent colors) and declined. Could be revisited in Phase 3 if a tasteful cinematic treatment emerges.

</deferred>

---

*Phase: 1-Foundation + Hero + Conversion Infrastructure*
*Context gathered: 2026-10-09*
