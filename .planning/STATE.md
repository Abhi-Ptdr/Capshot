---
gsd_state_version: 1.0
milestone: v1.0
milestone_name: milestone
status: executing
stopped_at: Phase 3.1 Plan 02 complete (USP comparison section + e2e spec)
last_updated: "2026-10-10T15:05:25.044Z"
last_activity: 2026-10-10
progress:
  total_phases: 6
  completed_phases: 3
  total_plans: 9
  completed_plans: 9
  percent: 50
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-10-09)

**Core value:** Convert a mobile ad-driven visitor into an engaged pre-launch waitlist signup — and later, a buyer — through premium, scroll-driven brand storytelling that makes the "twist, shake, boom" moment feel inevitable to try.
**Current focus:** Phase 03.1 — content-conversion-usp-bundles-trust

## Current Position

Phase: 03.1 (content-conversion-usp-bundles-trust) — EXECUTING
Plan: 4 of 4
Status: Ready to execute
Last activity: 2026-10-10

Progress: [██████████] 100%

## Performance Metrics

**Velocity:**

- Total plans completed: 4
- Average duration: ~27 min
- Total execution time: ~107 min

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 1 (Foundation) | 3 / 3 | ~99 min | ~33 min |
| 2 (How It Works + Flavor Catalog) | 1 / 3 | ~8 min | ~8 min |

**Recent Trend:**

- 2026-10-10 — Phase 03.1 Plan 02 Wave 1 (USP Comparison section + e2e spec) complete (~6 min, 2 commits + metadata, 2 files new + 1 modified; +7 Playwright GREEN; USP-01 locked)
- 2026-10-10 — Phase 02 Plan 03 Wave 2 (/flavors catalog + range filter with URL state sync) complete (~18 min, 2 commits + metadata, 5 files new + 2 modified; +3 Vitest + 11 Playwright GREEN; FLAV-01 + FLAV-02 locked)
- 2026-10-09 — Phase 02 Plan 01 Wave 1 (FlavorCard + FlavorCapGraphic + lightenHex + HamburgerMenu + Nav upgrade) complete (~8 min, 2 feat commits + metadata, 8 files new + 6 modified; +15 Vitest + 7 Playwright GREEN)
- 2026-10-09 — Phase 01 Plan 03 Pixel+CAPI dedup + in-app banner + CI grep gates complete (~30 min, 6 commits, 12 files new + 9 modified, 36 Vitest + 32 Playwright GREEN; 20 new unit specs + 10 new e2e specs)
- 2026-10-09 — Phase 01 Plan 02 Hero slice + conversion scaffold complete (~19 min, 4 commits, 22 files new + 12 modified, 16 Vitest + 22 Playwright GREEN)
- 2026-10-09 — Phase 01 Plan 01 Walking Skeleton complete (~50 min, 2 commits, 25 files, 9/9 e2e GREEN)

*Updated after each plan completion*
| Phase 02 P03 | 18 min | - tasks | - files |
| Phase 02 P02 | 20 | 2 tasks | 10 files |
| Phase 03 P01 | 15 | 2 tasks | 5 files |
| Phase 03 P02 | 10 | 1 tasks | 2 files |
| Phase 03 P03 | 90 | 3 tasks | 13 files |
| Phase 03.1 P01 | 6 | 2 tasks | 8 files |
| Phase 03.1 P02 | 6 | 2 tasks | 3 files |
| Phase 03.1 P03 | 6 | 3 tasks | 4 files |

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.
Recent decisions affecting current work:

- Phase 1 scaffold uses current package names: `motion@14` (not `framer-motion`), `react-router@8` (not `react-router-dom`), `tailwindcss@4.3` with CSS-first `@theme` (no JS config)
- Mobile-perf items that sound like polish (`LazyMotion`, `100dvh`, FOUC inline script, `vite-imagetools`) are Phase 1 correctness conditions, not Phase 4+ polish
- Meta Pixel + Conversions API install in Phase 1 (not Phase 6) to build retargeting pools during the waitlist period
- Instagram/Facebook WKWebView detect-and-nudge banner is a Phase 1 scaffold (95% of traffic arrives through those webviews)
- Phase 6 is a near-zero-refactor swap: 3 files edited (`cta.ts`, `flavors.ts`, `features.ts`), 2 added (`bundles.ts`, `og/bundles.jpg`), 1 section un-gated (`Bundles.tsx`)
- **Plan 01 execution (2026-10-09):** `.npmrc legacy-peer-deps=true` required to bypass @typescript-eslint 8.71's stale TS <6.1.0 peer-range cap; keeps CLAUDE.md pinned versions intact
- **Plan 01 execution:** Vite preview `spa-fallback-with-404` plugin added to mirror `vercel.json` behavior locally so Playwright/curl verify true HTTP 404 (CONTEXT D-17) during development
- **Plan 01 execution:** Playwright drives system Google Chrome via `channel: 'chrome'` + `--proxy-bypass-list=<-loopback>` because the exec host's HTTP_PROXY env and the bundled-Chromium CDN block prevented the default `npx playwright install chromium` path from working
- **Plan 01 execution:** `npm run lint` is a no-op in Phase 1 pending @typescript-eslint TS 7 support (upstream issue typescript-eslint/typescript-eslint#10940) and eslint-plugin-react ESLint 10 compatibility; `tsc --noEmit` in `npm run build` catches type errors
- **Plan 01 execution:** TS 7 config adjustments: `baseUrl` removed (TS 7 removal), composite project reference dropped (noEmit incompatibility), `src/env.d.ts` added for CSS side-effect import
- **Plan 02 execution (2026-10-09):** Vitest pinned EXACTLY to `5.0.3` (NOT `^5.0.3`) per CLAUDE.md Dev Tools table — required a manual package.json edit after `npm install` added a caret range
- **Plan 02 execution:** Playwright config dropped the `mobile-chrome` project — hero/theme suites override to Pixel 7 per-suite via `test.use(devices['Pixel 7'])`, so a separate project would double-run every suite (44 instead of 22)
- **Plan 02 execution:** Hero image is Media/Image1.jpg cover-cropped to 800×1067 via sharp (110 KB JPG); UNRETOUCHED — Phase 4 PERF-02 drops a retouched master alongside AVIF/WebP srcset work
- **Plan 02 execution:** Logo copied verbatim from Media/Logo_SHI-28.png (5.7 MB PNG, 4128×1024); NEVER recolored per capshot-brand SKILL — Phase 4 PERF-02 should drop a right-sized WebP variant
- **Plan 02 execution:** Comments must stay grep-safe — Plan 03's CI greps (`wa.me`, `energy drink`, `<ScrollToTop`) don't distinguish code from comments. Project rule: paraphrase bans without using the banned literal phrase
- **Plan 02 execution:** ThemeProvider initial state reads from `<html>.classList` (synced by inline FOUC script), NOT from matchMedia — re-reading prefers-color-scheme risks a flash
- **Plan 02 execution:** LazyMotion provider mounted in src/App.tsx between ThemeProvider and BrowserRouter — Phase 3+ can drop `m.*` primitives in without refactoring App.tsx (CONV-05 provider contract closed in Phase 1)
- **Plan 03 execution (2026-10-09):** Nav switched from `fixed top-0` → `sticky top-0` so the InAppBrowserBanner (also sticky) sits ABOVE Nav in flow — satisfies CONTEXT D-10 "banner pushes hero content down" without a fixed/overlay dance
- **Plan 03 execution:** InAppBrowserBanner z-index uses inline `style={{ zIndex: 60 }}` NOT Tailwind arbitrary-value `z-[60]` — the JIT scanner is nondeterministic on utilities that appear only in conditionally-rendered components; inline style sidesteps JIT for this one critical property
- **Plan 03 execution:** Android `intent://` navigation attempt is observable via `window.__capshot_intent_attempted__` written BEFORE the `window.location.href = intent` line in `redirectAndroidToChromeIntent`. Chromium blocks the actual navigation at the renderer level (user-gesture gate); the attribute is the test observable. Real-device Chrome handoff outcome deferred to the Phase 1 close-out human checkpoint
- **Plan 03 execution:** CAPI edge function returns HTTP 200 on EVERY path (success, Meta error, env-missing). Fire-and-forget client semantics require the fetch promise to resolve, not reject. Response body shape (`{ok:true}` / `{ok:false,status,text}` / `{skipped:true,reason:'env-missing'}`) distinguishes outcomes without surfacing errors through HTTP status
- **Plan 03 execution:** `META_CAPI_ACCESS_TOKEN` + `META_CAPI_DATASET_ID` are server-side ONLY (NO `VITE_` prefix). CI step `grep -r "META_CAPI_ACCESS_TOKEN" dist/` is an invariant check in `.github/workflows/ci.yml` and ran green locally
- **Plan 03 execution:** GitHub Actions pins `node-version: "22.22"` exactly (NOT `>=22.22` or `lts/*`) per CLAUDE.md Version Compatibility table — float pins invite silent drift on a stack with a hard Router v8 floor
- **Plan 03 execution:** CI grep script (`scripts/ci-grep-forbidden-strings.mjs`) is pure-Node (no `grep` shell-out) for CI-runner portability across GNU/BSD/busybox. `wa.me` allowlisted ONLY in `src/config/cta.ts`; `/energy\s+drink/i` has NO allowlist
- **Phase 2 Plan 01 execution (2026-10-09):** `@radix-ui/react-dialog@1.2.0` installed with exact pin (NOT caret) per CLAUDE.md pin policy; 26 transitive packages added, zero postinstall scripts (T-02-SC Package Legitimacy Audit cleared)
- **Phase 2 Plan 01 execution:** Lucide 1.53.0 ships NO `Instagram` icon — swapped to `Camera` as a brand-neutral stand-in in HamburgerMenu; `@capshot_twist` text carries the social identity. Future lucide-react upgrade can swap in `Instagram` as a one-line change
- **Phase 2 Plan 01 execution:** Radix Dialog does NOT auto-set `aria-modal="true"` on `Dialog.Content` when `asChild`-wrapping a Motion `m.aside`. The attribute MUST be set explicitly on the host element; HM2 Playwright assertion caught this
- **Phase 2 Plan 01 execution:** SVG recoloring technique — parent sets `style={{ ['--cap-base']: hex, ['--cap-highlight']: lightenHex(hex, 15) }}` and the shared SVG consumes via `fill="var(--cap-base)"`. Zero per-flavor asset work, zero re-render on theme toggle, no prop drilling (RESEARCH §5)
- **Phase 2 Plan 01 execution:** FL3 locked-field invariant uses an inline literal array (NOT Vitest `toMatchSnapshot`) to catch handle/title/range/accentHex drift. Snapshot files can silently update; the inline literal fails loudly on diff
- **Phase 2 Plan 01 execution:** HamburgerMenu z-index 70 (overlay) / 71 (panel) via inline `style={{ zIndex: 70 }}` on the Motion components — matches the Phase 1 banner inline-zIndex pattern (JIT-safe for conditionally-rendered portals)
- **Phase 2 Plan 01 execution:** Phase 1 flavor descriptions already satisfy D2-14 (max 66 chars, no stimulant phrase); no refinement needed — FL1/FL2/FL3 all pass against unchanged Phase 1 data
- [Phase ?]: Phase 2 Plan 03 execution: VALID_RANGES tuple defined inline in BOTH FlavorsPage.tsx AND RangeFilter.tsx (NOT exported) — kept small, drift caught by TS 7 satisfies readonly FlavorRange[] + unit RF-U1/U2
- [Phase ?]: Phase 2 Plan 03 execution: RangeFilter owns invalid-param useEffect cleanup (replace: true) — FlavorsPage already resolves active to null; URL normalization lives alongside the pill UI
- [Phase ?]: Phase 2 Plan 03 execution: Doc comments rephrased to avoid literal react-router-dom package name — Phase 1 grep-safe prose convention; grep gate doesn't distinguish code from comments
- [Phase ?]: Phase 2 Plan 03 execution: full npm run test:e2e requires --workers=1 to avoid Vite preview server dying under parallel Chromium load — scoped Plan 02-03 e2e all GREEN (27/27)
- [Phase ?]: Phase 2 Plan 02 execution: Hero.tsx root demoted from <main> to plain <div> (NOT <section>); the inner <section aria-labelledby='hero-title'> already carries Hero's semantic identity. Outer div retains min-h-[100dvh]
- [Phase ?]: Phase 2 Plan 02 execution: H6 min-height Playwright assertion walks section.parentElement + Math.max of ancestor + self minHeight — landmark-position-agnostic across future refactors
- [Phase ?]: Phase 2 Plan 02 execution: FlavorTeaser scroller full-bleed OUTSIDE Container (mobile peek-of-next-card affordance requires bleeding past the 1200px lane); heading block stays inside Container to control paragraph measure
- [Phase ?]: Phase 2 Plan 02 execution: TWIST/SHAKE/BOOM are inline React SVGs (NOT svgr, NOT <img>) — Phase 3 Motion needs addressable paths for cap-twist + path-morph choreography without an svg-to-img boundary
- [Phase ?]: Phase 2 Plan 02 execution: Shake illustration's 4 shake-lines rendered OUTSIDE the rotated bottle <g transform='rotate(3 200 260)'> group — shake lines stay axis-aligned with viewBox rather than rotating with the bottle (visual-metaphor correctness)
- [Phase ?]: Phase 03 Plan 02 execution: HowItWorks right-column m.div wrapper demoted to plain div; 3 <li> upgraded to <m.li> with inline delay (0/0.12/0.24s) + viewport once + motion-reduce fallback. Video card m.div wrapper byte-identical to Phase 2 (D3-09 locked).
- [Phase ?]: Phase 03 Plan 02 execution: Playwright selector pattern for Motion-wrapper detection = direct-child 'ol > li[style]' (NOT 'section ol li[style]' which would over-match). Direct-child scoping fails loud if a future phase adds a secondary <li> list under the HowItWorks <section>.
- [Phase ?]: Phase 03 Plan 02 execution: Reduced-motion HW-P3-3 e2e iterates all 3 steps (not just the first) via h3.closest('li') + getComputedStyle — strictly stronger than Phase 2 HW5 which only checked one wrapper. Correctness check justifying the right-column wrapper demotion.
- [Phase ?]: Phase 03 Plan 02 execution: tests/e2e/banner.spec.ts B3 (Android Facebook intent://) flakes under full-suite execution with page.goto timeout. Verified pre-existing on main via git stash — NOT caused by Phase 3 changes. Deferred to future test-infra pass; this plan's scope boundary excludes it.
- [Phase 03.1]: TrustBadge discriminated-union keyed on `variant` prop — compile-time narrowing replaces runtime variant checks; visual-only arm className BYTE-IDENTICAL to linked arm so Phase 5 FSSAI-evidence migration is a zero-visual-change swap
- [Phase 03.1]: Chose MapPin over Flag for Made-in-India TrustBadge icon — vertical teardrop silhouette balances the strip row rhythm against ShieldCheck/Leaf/Lock geometric glyphs; iconFor() swap to Flag is a 1-line change if visual review requests
- [Phase 03.1]: getCta() kept single-signature with CtaSlot union (dotted-string bundle slots), NOT function overloads — overloads would force every PrimaryCTA.slot prop widening in Phase 6 Shopify-slot addition; single-signature preserves Phase 6 swap-point sealing
- [Phase 03.1]: BundleCountBadge SVG uses mandatory hex-fallback var() pattern (fill='var(--cap-base, #9E7676)') — bare var() can resolve to fill=none in some browsers if the custom property hasn't computed by paint time; fallback hex is defense per PATTERNS §Gotchas
- [Phase 03.1]: TrustBadge iconFor() exhaustive switch intentionally omits default branch — tsc fails loud if TrustBadgeLabel widens without updating iconFor() (adding 'default: ShieldCheck' would silently mask the gap); same pattern as RANGE_LABEL at FlavorCard.tsx:27
- [Phase 03.1]: TS 7 places JSX-prop errors on the specific prop line (not opening-tag line as TS 5.x did) — @ts-expect-error visual-only+evidenceUrl test collapsed to a single-line JSX call with // prettier-ignore so the directive covers the exact prop
- [Phase 03.1 P02]: UspComparison h2 copy chose English ("Why CAPSHOT, not a bottled drink.") over Hinglish — capshot-brand SKILL reserves Hinglish for punchy marketing hooks and allows English for longer explanatory headlines; a 3-row comparison intro falls in the explanatory bucket
- [Phase 03.1 P02]: Playwright test names for UC3/UC4 use descriptive labels ("reads the D3.1-01 locked competitor label") instead of embedding the literal locked strings — keeps `grep -c "<literal>" = 1` strict (per Plan 01 precedent treating literal-value grep counts as code-value counts, not test-name counts). The assertion still carries the literal.
- [Phase 03.1 P02]: UspComparison uses semantic `<table>` with `<thead>`/`<tbody>`/`<th scope="col">`/`<th scope="row">` (D3.1-02 lock) — the dimension name sits in `<th scope="row">` so screen readers announce "Freshness, Store-bought bottled drinks: ...", not a flat 3-column row. Row-prefix is structural, not a data column.
- [Phase ?]: [Phase 03.1 P03]: CatalogBundles wrapper uses plain <section aria-labelledby='catalog-heading'> as root (NOT the Section primitive) — Pitfall 5 defense; FlavorTeaser and Bundles both self-wrap in <Section>, so double-wrapping would stack py-8/sm:py-12/md:py-16 twice
- [Phase ?]: [Phase 03.1 P03]: Fitness-only 'Best Value / Most Popular' badge rendered as absolutely-positioned corner PILL overhanging the card top edge (-top-3 right-6) — mobile 360x640 readable without competing with the H4 title; md+ gets a complementary scale-[1.03] + brand-rose ring to pull the eye at desktop
- [Phase ?]: [Phase 03.1 P03]: Playwright CB4 uses 3 unrolled per-tier assertion blocks instead of a for-loop so each '&tier=trial|fitness|bulk' literal is grep-visible in-source — template-literal interpolation evades a literal grep gate (Pitfall 4 regression guard requires in-source literals)
- [Phase ?]: [Phase 03.1 P03]: CB6 asserts >=2 motion-reduce wrappers (not an exact count) — leaves headroom for Plan 04 TrustBadges to add a 5th wrapper without editing this spec; test-brittleness defense as composition grows

### Pending Todos

[From .planning/todos/pending/ — ideas captured during sessions]

None yet.

### Blockers/Concerns

[Issues that affect future work]

- **GATE-FSSAI** (client deliverable): 14-digit FSSAI license number required before Phase 6 Razorpay food-category KYC
- **GATE-INVENTORY** (client deliverable): Warehoused inventory + verified Shiprocket pickup address required before Phase 6
- **GATE-BUDGET** (client deliverable): ~₹2,000/mo Shopify Basic approval required before Phase 6
- **GATE-NUTRITION** (client deliverable): Per-flavor nutrition + caffeine content required for Phase 5 Trust section's permanent production state and Phase 6 PDPs
- Founder photo + 2–3 line bio pending for Phase 5 About page (placeholder acceptable)
- Final product shots for 8 of 16 flavors pending (placeholders acceptable through Phase 2)
- **ESLint plugin re-enablement**: `@typescript-eslint` and `eslint-plugin-react` plugin wiring deferred until upstreams ship TS 7 + ESLint 10 compatibility (tracked by typescript-eslint/typescript-eslint#10940). One-install migration when ready.

## Deferred Items

Items acknowledged and carried forward from previous milestone close:

| Category | Item | Status | Deferred At |
|----------|------|--------|-------------|
| tooling  | ESLint plugin wiring (@typescript-eslint, eslint-plugin-react) | Pending upstream TS 7 + ESLint 10 compat | Plan 01 (2026-10-09) |

## Session Continuity

Last session: 2026-10-10T15:04:29.204Z
Stopped at: Phase 3.1 Plan 02 complete (USP comparison section + e2e spec)
Resume file: None
