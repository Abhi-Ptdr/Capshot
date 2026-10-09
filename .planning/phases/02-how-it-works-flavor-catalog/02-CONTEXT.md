# Phase 2: How It Works + Flavor Catalog - Context

**Gathered:** 2026-10-10
**Status:** Ready for planning
**Mode:** mvp (per ROADMAP.md)
**Depends on:** Phase 1 (closed)

<domain>
## Phase Boundary

Deliver the two "what is this and what are my options" surfaces so visitors who got past the Hero can (1) understand the product in 3 beats and (2) browse all 16 flavors with range filtering that survives share-link reloads.

**Scope anchor — this phase ships:**

- **`/` homepage** gains two new sections BELOW the Hero:
  - **How It Works** — 3-step TWIST → SHAKE → BOOM section with per-step vector illustrations (HOW-01). Phase 3 later layers scroll choreography on top; Phase 2 ships the static, correct, reduced-motion-safe version.
  - **Flavor Teaser** — horizontal scroller of 8 curated flavors across all 3 ranges + a trailing "See all 16 flavors →" card routing to `/flavors` (FLAV-03).
- **`/flavors` page** replaces the Phase 1 "coming soon" shell with:
  - A grid of all 16 color-washed flavor cards using each flavor's `accentHex` (FLAV-01).
  - A pill-chip range filter above the grid (All / Fruity Blast / Desi & Cool / Premium Sports) with URL state sync via `?range=<slug>` (FLAV-02).
- **Nav evolution** — logo-only nav from Phase 1 (D-16) upgrades to logo + ThemeToggle + hamburger menu. Hamburger opens a slide-in panel with Flavors / About / Contact + socials.

**Explicitly NOT in this phase (belongs elsewhere):**

- Cinematic Motion scroll choreography / parallax / cap-twist morphs → **Phase 3** (Phase 2 may use `whileInView` fade/slide primitives, but the signature scroll storytelling is Phase 3's job)
- Per-flavor detail pages / modal zoom → not in v1 scope (deferred)
- Real product photography per flavor → deferred (Phase 4 or 5 when a studio shoot happens; Phase 2 ships color-washed cards with a shared cap SVG recolored per flavor)
- Nutrition facts / caffeine content per flavor on the cards → **Phase 5** (needs client-supplied data per GATE-NUTRITION)
- USP comparison grid / variants explainer / Premium Sports showcase → **Phase 4**
- Trust badge strip, FAQ, About content, Contact content → **Phase 5**
- "Energy drink" phrasing anywhere — INFRA-06 CI grep from Phase 1 enforces this; applies to the Premium Sports copy on cards

</domain>

<decisions>
## Implementation Decisions

### How It Works Section (HOW-01)

- **D2-01:** How It Works visual style = **vector/SVG illustrations per step**. Hand-crafted (or constructed from brand-rose/brand-mid shapes + Lucide primitives), one SVG per beat:
  - **TWIST** → bottle silhouette + cap being twisted on, subtle rotation indicator
  - **SHAKE** → bottle with motion lines / shake arcs
  - **BOOM** → filled vibrant bottle, bursting/sparkle accents
  Scales infinitely, tiny bundle footprint, animates cleanly in Phase 3 via Motion path/transform tweens. Illustrations use brand palette (brand-deep / brand-mid / brand-rose / brand-cream) exclusively — no out-of-palette colors.

- **D2-02:** How It Works copy per step = **Hinglish beat only** — the single word TWIST / SHAKE / BOOM in large display type (hero-scale, same display font family). No English explainer sentence. Rhythm matches the Hero's "Twist karo. Shake karo. BOOM." headline — the 3-step section is the visual realization of that promise. Hinglish-headline / English-body policy preserved.

- **D2-03 (Claude's call — flagged in review):** Section position = **immediately below Hero, above Flavor Teaser**, no interrupting content between. Logical reading order: hero promise → visual proof → "and here's the catalog". Planner may adjust vertical rhythm (spacing/padding) during execution.

### Flavor Catalog on `/flavors` (FLAV-01, FLAV-02)

- **D2-04:** Each of the 16 flavor cards = **color-washed card using the flavor's `accentHex` as background** + a **small shared cap SVG recolored to the accentHex family** + **flavor name in Title Case (brand-cream type)** + **1-line description** (from `src/data/flavors.ts`) + **small range tag** in a corner (e.g. "Fruity Blast"). The card is primarily its accent color — the grid reads as 16 vibrant tiles.

- **D2-05:** Flavor cap imagery = **ONE shared vector cap illustration** (likely a stylized top-down or 3/4 view of the cap), stored at `/public/flavors/cap-generic.svg` or inlined as a React component in `src/components/ui/FlavorCapGraphic.tsx`. The SVG uses `currentColor` or a `fill` prop so each card can recolor it to a shade of its own accentHex (e.g. 80%-opacity accent on top, 100% accent as the base). This keeps per-flavor asset work at ZERO while giving every card a product-like visual. Real cap photos remain **deferred** to a later phase (Phase 4 PERF-02 or Phase 5 content polish).

- **D2-06:** Grid density = **2 columns on mobile (<640 px), 3 columns on tablet (640–1024 px), 4 columns on desktop (≥1024 px)**. 16 cards split cleanly: 8 rows mobile, 6 rows (last row partial) tablet, 4 rows desktop. Planner may refine breakpoints if measured contrast of adjacent accentHex values clashes.

- **D2-07:** Range filter UI = **pill chips at the top of `/flavors`**, horizontally arranged (`All | Fruity Blast | Desi & Cool | Premium Sports`). Active pill = filled with `--color-fg` + text in `--color-bg`. Inactive pills = outlined with `--color-border`. Pills wrap on narrow mobile viewports (do NOT make them horizontally scrollable — they must all be visible at once). Pills are plain buttons (not links) that update React state + call `history.pushState`.

- **D2-08:** URL sync behavior = **clean URL when filter is "All", `?range=<slug>` when filtered**. Slugs match `src/data/types.ts` `FlavorRange` literal values: `fruity-blast`, `desi-cool`, `premium-sports`. Example URLs:
  - `/flavors` → All (16 cards visible)
  - `/flavors?range=fruity-blast` → 9 Fruity Blast cards
  - `/flavors?range=desi-cool` → 3 Desi & Cool cards
  - `/flavors?range=premium-sports` → 4 Premium Sports cards
  Invalid `?range=` values fall back to All (and the URL is cleaned via `replaceState`). Share links preserve the filter. Browser back/forward navigate between filter states. SEO-safe: canonical URL of each filtered view points at `/flavors` (base).

### Flavor Teaser on `/` (FLAV-03)

- **D2-09:** Teaser scope = **8 flavors curated across all 3 ranges**:
  - 4 Fruity Blast: pick highest-contrast + most mainstream (suggested: Orange, Mango, Watermelon, Strawberry — planner's final pick)
  - 2 Desi & Cool: Jaljeera + ORS-Electrolyte (the two most distinctive Indian flavors)
  - 2 Premium Sports: Japanese Matcha + Coffee (broadest appeal of the 4)
  This proves the catalog isn't one-note — fruity + Indian + sports in one scroll — without overwhelming the homepage.

- **D2-10:** Teaser layout = **horizontal scroller with snap-points**, mobile-friendly. Last card in the scroll (the 9th card visually) is a **"See all 16 flavors →" card** styled with the brand-rose background + arrow glyph, routing to `/flavors`. The scroller uses CSS scroll-snap (`scroll-snap-type: x mandatory`) so cards snap into view when the user flicks. On desktop (≥1024 px), the 8 flavor cards + "See all" card may fit without scrolling horizontally if viewport allows; the scroller still works if not.

### Nav Evolution

- **D2-11:** Nav upgrades from logo-only (Phase 1 D-16) to **logo + ThemeToggle + hamburger menu button**. The hamburger sits to the right of ThemeToggle (or replaces its position with ThemeToggle moving inside the slide-in panel — planner's call during execution).

- **D2-12:** Hamburger menu panel contents (slide-in from right on tap/click):
  - **Links:** `Flavors` → `/flavors`, `About` → `/about`, `Contact` → `/contact`
  - **Socials:** `Instagram @capshot_twist` link (opens Instagram), `WhatsApp` link (opens wa.me — reads from `src/config/cta.ts` `nav` slot, NOT `primary`), `Email shi28.capshot@gmail.com` link
  - **Close affordance:** X button in the top-right of the panel + Escape key + click-outside-panel
  - **Accessibility:** `role="dialog"`, `aria-modal="true"`, focus trap while open, focus returns to hamburger button on close
  - About + Contact still render Phase 1 coming-soon shells until Phase 5 — reaching them via the hamburger is intentional, visitors should know those pages exist even if the content is "coming soon"

### Routing + Data

- **D2-13 (Claude's call):** No new routes added in Phase 2. The 4 existing routes (`/`, `/flavors`, `/about`, `/contact`) stay as-is. `/flavors` body is replaced; `/`, `/about`, `/contact` are unchanged (About/Contact still coming-soon shells; `/` adds sections).

- **D2-14 (Claude's call):** `src/data/flavors.ts` **descriptions must be reviewed** before Phase 2 ships to ensure every entry has a <140-char tagline that reads well on a color-washed card. Phase 1 populated placeholder text; Phase 2 may refine but must not change `handle`, `title`, `range`, or `accentHex` (those are locked by the catalog SKILL). Also enforce the Phase 1 CI grep rule: no "energy drink" phrasing (Premium Sports descriptions use "caffeinated beverage" or similar).

### Carried Forward (from Phase 1 — do NOT re-decide)

- **D-05 (Phase 1):** TWIST / SHAKE / BOOM is the brand mantra — Phase 2 How It Works section is the 1:1 visual realization of this (locked)
- **D-07 (Phase 1):** `TRY CAPSHOT` CTA label is phase-invariant — reused unchanged on all Phase 2 pages
- **D-16 (Phase 1):** logo-only nav was Phase 1 only; D2-11 above overrides for Phase 2
- **Brand palette locked:** `#594545` / `#815B5B` / `#9E7676` / `#FFF8EA` — any new section backgrounds / illustrations stay in-palette; accentHex values from catalog SKILL are the ONLY out-of-palette colors permitted (and only inside flavor cards / per-flavor contexts)
- **Mobile-first mandate:** 95% mobile traffic — Phase 2 sections must be designed and tested mobile-first (360×640 baseline), scaled up for desktop
- **Hinglish policy:** headlines may use Hinglish, body copy stays English (per capshot-brand SKILL)
- **CTA sources from `src/config/cta.ts`:** no `wa.me` references anywhere in Phase 2 code outside that file (INFRA-06 CI grep enforces)
- **LazyMotion contract (CONV-05):** no `motion.div` imports — all animations use `m.*` primitives from `src/lib/motion.ts`. The `<LazyMotion>` provider is already mounted in `src/App.tsx` by Phase 1
- **Phase 6 invariant:** no refactor of `src/config/cta.ts`, `src/data/flavors.ts` schema, or `src/config/features.ts` surface — Phase 2 only ADDS consumers of these contracts

### Claude's Discretion

Items the user did not explicitly weigh in on; planner/executor picks the sensible default consistent with locked constraints:

- **How It Works section headline** (above the 3-step visuals): keep it minimal — maybe just "How it works" or no section headline at all, letting the 3 beats speak. Planner picks.
- **Vertical rhythm / section spacing** between Hero, How It Works, and Flavor Teaser on `/`: planner aligns to the brand's 8-point spacing scale.
- **Flavor card hover/tap state (desktop)**: subtle scale/elevation on hover is fine; no modal or detail popup in Phase 2.
- **Hamburger icon style**: Lucide `Menu` icon, same size/stroke as the ThemeToggle Sun/Moon.
- **Slide-in panel transition timing**: 240ms slide + 150ms fade overlay; `motion-reduce` honored.
- **Pill chip aria-pressed semantics**: active pill = `aria-pressed="true"` (planner may evolve if preferred role).
- **Specific curated-8 flavors for teaser**: planner's final pick within the "4 Fruity + 2 Desi + 2 Premium" ratio.
- **Shared cap SVG design**: planner/executor sketches a simple cap graphic consistent with the brand aesthetic. If this becomes a design-blocker during execution, fall back to a geometric cap outline (rounded top + rim band + flat base) in brand-mid stroke.
- **Reduced-motion fallback for How It Works**: static illustration with no entrance animation (per HOW-01 success criterion).

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project context (always read first)

- `.planning/PROJECT.md` — core value, locked constraints, out-of-scope, key decisions table
- `.planning/REQUIREMENTS.md` — v1 REQ-IDs; Phase 2 owns HOW-01, FLAV-01, FLAV-02, FLAV-03
- `.planning/ROADMAP.md` §Phase 2 — goal statement, 4 success criteria, requirement list for this phase
- `.planning/STATE.md` — current project position

### Phase 1 artifacts (what Phase 2 inherits)

- `.planning/phases/01-foundation-hero-conversion-infrastructure/01-CONTEXT.md` — all Phase 1 locked decisions (especially D-05 for TWIST/SHAKE/BOOM, D-07 for CTA label, D-16 for nav evolution baseline)
- `.planning/phases/01-foundation-hero-conversion-infrastructure/01-01-SUMMARY.md` — walking skeleton (routes, primitives, Tailwind tokens)
- `.planning/phases/01-foundation-hero-conversion-infrastructure/01-02-SUMMARY.md` — Hero, PrimaryCTA, ThemeProvider, LazyMotion wrapper, data model (flavors.ts, ranges.ts, types.ts)
- `.planning/phases/01-foundation-hero-conversion-infrastructure/01-03-SUMMARY.md` — Meta Pixel + CAPI dedup, in-app browser banner, CI greps
- `.planning/phases/01-foundation-hero-conversion-infrastructure/01-UI-SPEC.md` — design tokens, typography scale, interaction contracts (used as the baseline for Phase 2's visual decisions)

### Project-local skills (brand/catalog authority — must load when applicable)

- `.claude/skills/capshot-brand/SKILL.md` — palette tokens, Hinglish policy, voice/tone, CTA conventions, mobile-first mandate
- `.claude/skills/capshot-catalog/SKILL.md` — 16-flavor catalog + per-flavor `accentHex` values (REQUIRED read for Phase 2 — card colors come from here)
- `.claude/skills/react-perf-optimizer/SKILL.md` — load when wiring the horizontal scroller or any CSS scroll-snap work

### Research

- `.planning/research/ARCHITECTURE.md` — 4-layer component tree (Pages → Sections → UI → Primitives); Phase 2's new sections go in `src/sections/`, new primitives/UI in `src/components/`
- `.planning/research/STACK.md` — Motion 14, LazyMotion `m.*` only (CONV-05)
- `.planning/research/PITFALLS.md` — iOS 100vh (not applicable for Phase 2 sections but reference anyway), Motion full-bundle risk

### Project root (also authoritative)

- `CLAUDE.md` — technology stack recommendations, "what NOT to use" table
- `product_specs_short` — original brand/product spec; variant/dosage source of truth
- `D2C E-commerce Website Blueprint` — NOTE: uses "energy drinks" and "FSSAI Approved" phrasing that is FORBIDDEN in `src/`. Reference for context only; do NOT copy copy verbatim.

### Existing source files Phase 2 touches

- `src/data/flavors.ts` — 16 flavor entries with handle/title/description/range/accentHex/dosage (Phase 2 may REFINE descriptions but must not change handle/title/range/accentHex)
- `src/data/ranges.ts` — the 3 range metadata objects
- `src/data/types.ts` — `Flavor`, `FlavorRange`, `FlavorRangeMeta` types
- `src/sections/Nav.tsx` — upgraded in Phase 2 (hamburger added)
- `src/sections/Hero.tsx` — do NOT modify (user-approved current state)
- `src/pages/HomePage.tsx` — Phase 2 adds `<HowItWorks />` and `<FlavorTeaser />` sections below `<Hero />`
- `src/pages/FlavorsPage.tsx` — body replaced (coming-soon shell → real catalog + filter)
- `src/components/ui/PrimaryCTA.tsx` — reused unchanged (CTA label is phase-invariant per D-07)
- `src/config/cta.ts` — READ-ONLY (INFRA-06 CI grep enforces)

</canonical_refs>

<deferred>
## Deferred Ideas (captured, not acted on)

- Per-flavor detail page or modal zoom — not in v1 scope
- Real product photography for the 16 flavors — Phase 4 PERF-02 or Phase 5 content polish, when a studio shoot can happen
- Nutrition facts panel on flavor cards — needs client-supplied data (GATE-NUTRITION); Phase 5
- Random/rotating flavor teaser on homepage — rejected in discuss (hurts SEO consistency and testability)
- "Flavor of the week" or editorial callout — not in v1 scope
- Flavor comparison / "I like X, I'd probably like Y" recommender — not in v1 scope
</deferred>

<open_questions>
## Open Questions for Planning

None blocking. The planner can proceed to break Phase 2 into waves. Likely wave split (planner refines):

1. **Wave 1**: Data refinement (flavors.ts descriptions pass, cap SVG asset) + Nav upgrade (hamburger panel) — independent, parallelizable
2. **Wave 2**: How It Works section on `/` + Flavor Teaser section on `/` (both compose Nav + data from Wave 1; may be parallel)
3. **Wave 3**: `/flavors` page catalog + range filter + URL sync (depends on cap SVG from Wave 1; may be parallel with Wave 2 since different route)

Phase 2's natural plan count is likely 2–3 plans. Planner finalizes.

</open_questions>
