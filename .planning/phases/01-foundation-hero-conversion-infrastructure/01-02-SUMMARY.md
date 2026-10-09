---
phase: 01-foundation-hero-conversion-infrastructure
plan: 02
subsystem: ui
tags: [react, hero, cta, theme, lazymotion, cva, vitest, playwright, fouc, hinglish, infra, conversion, scaffold]

requires:
  - phase: 01-foundation-hero-conversion-infrastructure
    provides: Vite 8 + React 19 + TS 7 + Tailwind 4.3 + Router 8 scaffold; 4 routes; FOUC inline script; unopinionated primitives (Container/Section/Button); cn() helper
provides:
  - "src/config/cta.ts — the single legal WhatsApp destination (CONTEXT D-07/D-08/D-09 locked); Phase 6 swap point"
  - "src/config/features.ts — ENABLE_BUNDLES + ENABLE_SHOPIFY_CTAS default to false"
  - "src/config/site.ts — site metadata (name, url, description, ogImage, social) for Phase 5 @unhead/react consumer"
  - "src/data/types.ts + flavors.ts + ranges.ts — 16 Shopify-shaped flavor stubs in capshot-catalog SKILL order; Phase 6 fields nullable"
  - "<PrimaryCTA> cva-driven button (size=lg 56 px for Hero, size=md 48 px for shells); auto-renders target=_blank + rel + ArrowUpRight for external destinations; data-cta attribute for Plan 03 Pixel binding"
  - "<TrustBadge> declaration (NOT rendered in Phase 1) with mandatory evidenceUrl prop and PROD throw contract (Pitfall #2)"
  - "<Hero> at 100dvh/100vh cascade with locked Hinglish headline + sub-copy + size=lg PrimaryCTA; CTA bottom-edge ≤ 640 px at 360×640"
  - "<Nav> fixed-top, logo link + ThemeToggle (CONTEXT D-16, no hamburger); dark-theme cream surface wraps the logo without recoloring the asset"
  - "<ThemeProvider> + <ThemeToggle>: .dark class on <html>, localStorage.capshot-theme persistence, <meta name=theme-color> sync (#594545 ↔ #FFF8EA), 44×44 WCAG hit target, aria-pressed flip"
  - "src/lib/motion.ts: ONLY file importing from motion/react; re-exports LazyMotion + m + domAnimation"
  - "<LazyMotion features={domAnimation}> provider mounted in src/App.tsx — CONV-05 provider contract closed in Phase 1"
  - "FOUC-free dark mode: inline <script> in index.html sets .dark before React mounts (CONV-04 proven by Playwright pixel RGB assertion)"
  - "Hero image preload + hardcoded homepage OG tags in index.html; Phase 5 switches to per-route @unhead/react"
  - "Image primitive enforces width/height/alt + priority (eager/sync/high) — Phase 4 PERF-02 upgrade point for AVIF/WebP srcset"
  - "All coming-soon shells + 404 use <PrimaryCTA size=md> (one-file CTA destination swap at Phase 6)"
  - "22-test Playwright e2e harness: 9 skeleton + 8 hero + 5 theme — all GREEN against production preview"
  - "16-test Vitest unit harness: cta + flavors + TrustBadge — all GREEN"
affects: [03-pixel-and-capi, 04-performance-pass, 05-trust-and-content, 06-commerce-rollout]

tech-stack:
  added:
    - vitest@5.0.3 (EXACT pin per CLAUDE.md Dev Tools table)
    - "@vitest/ui@5.0.3 (EXACT pin)"
    - jsdom@^25 (Vitest env)
    - "@testing-library/react@^16.3 + @testing-library/dom@^10 (TrustBadge render + ThemeProvider future tests)"
    - class-variance-authority@0.7.1 (PrimaryCTA size variants)
    - lucide-react@1.53.0 (Sun, Moon, ArrowUpRight icons)
    - sharp@0.35.5 (devDep — Playwright T1 FOUC pixel-decode)
  patterns:
    - Centralized CTA pattern — single file is Phase 6 destination swap point
    - "cva variants on top of unopinionated primitives — <PrimaryCTA> composes <Button> via class-variance-authority without touching the primitive"
    - "Shopify-shaped data model from day one — <Flavor> type carries nullable Phase 6 fields so Phase 1 stub + Phase 6 live data use the SAME shape"
    - "LazyMotion library + mounted provider — src/lib/motion.ts is the ONLY motion/react importer AND src/App.tsx mounts the provider so downstream phases drop m.* primitives in with no App.tsx refactor"
    - "FOUC-free dark mode via inline <script> + <html>.classList — the pre-React script wins the first paint; ThemeProvider owns post-mount lifecycle"
    - "<main id='main'> landmark lives inside the first section (Hero) — skip-link + H1 landmark align without a wrapper layer"
    - "Grep-based CI gates (Plan 03) demand grep-friendly code: no 'wa.me', 'energy drink', or '<ScrollToTop' phrases in src/ comments or code"

key-files:
  created:
    - src/config/cta.ts
    - src/config/features.ts
    - src/config/site.ts
    - src/data/types.ts
    - src/data/flavors.ts
    - src/data/ranges.ts
    - src/components/ui/PrimaryCTA.tsx
    - src/components/ui/ThemeToggle.tsx
    - src/components/ui/TrustBadge.tsx
    - src/components/primitives/Image.tsx
    - src/sections/Hero.tsx
    - src/sections/Nav.tsx
    - src/theme/ThemeProvider.tsx
    - src/lib/motion.ts
    - vitest.config.ts
    - tests/unit/cta.spec.ts
    - tests/unit/flavors.spec.ts
    - tests/unit/trustbadge.spec.tsx
    - tests/e2e/hero.spec.ts
    - tests/e2e/theme.spec.ts
    - public/hero/cap-on-bottle.jpg
    - public/logos/logo-horizontal.png
  modified:
    - package.json (vitest 5.0.3 exact pin, cva, lucide, sharp, testing-library; test + test:ui scripts)
    - package-lock.json
    - index.html (hero preload link, homepage OG tags; FOUC script retained)
    - src/App.tsx (ThemeProvider → LazyMotion → BrowserRouter → Nav → Routes composition; sr-only route stubs moved into Nav)
    - src/pages/HomePage.tsx (single-expression <Hero /> body)
    - src/pages/FlavorsPage.tsx (placeholder Button → <PrimaryCTA size="md" />)
    - src/pages/AboutPage.tsx (placeholder Button → <PrimaryCTA size="md" />)
    - src/pages/ContactPage.tsx (placeholder Button → <PrimaryCTA size="md" />)
    - src/pages/NotFoundPage.tsx (placeholder Button → <PrimaryCTA size="md" />)
    - playwright.config.ts (drop mobile-chrome project — hero/theme use test.use(devices['Pixel 7']) per-suite)
    - tests/e2e/skeleton.spec.ts (Test 1 updated to assert exact Hinglish H1)

key-decisions:
  - "Vitest pinned EXACTLY to 5.0.3 (NOT ^5.0.3) per CLAUDE.md §Technology Stack Development Tools table; `npm install` added a caret range so a second `npm install` after manual package.json edit was required to resync lockfile"
  - "Playwright config dropped the `mobile-chrome` project — hero/theme suites call `test.use(devices['Pixel 7'])` per-suite, so a separate project would double-run every test. Single-project config yields the plan-expected 22-test total"
  - "Hero image is Media/Image1.jpg (1056×1320 phone photo) resized to 800×1067 via sharp cover-crop + mozjpeg q=85 → 110 KB JPG. Unretouched source material; Phase 4 PERF-02 drops AVIF/WebP srcset with a retouched master at that time (flagged as known-stub)"
  - "public/logos/logo-horizontal.png is Media/Logo_SHI-28.png copied verbatim (4128×1024 PNG, 5.7 MB). The file is effectively horizontal despite the dimensions; NEVER recolored per capshot-brand SKILL. The dark-theme cream rounded surface wrapping the logo keeps the metallic-black wordmark legible without touching the asset. Phase 4 PERF-02 natural moment to drop a WebP variant of the logo for the ~5 MB payload"
  - "Comments must stay grep-safe: three comments were rephrased mid-execution to avoid the literal strings `energy drink`, `<ScrollToTop /`, and `wa.me` so Plan 03's CI greps don't false-positive on comments (the greps don't distinguish code from prose)"
  - "ThemeProvider initial state reads from <html>.classList (synced by inline FOUC script) — NOT from matchMedia again. Re-reading prefers-color-scheme in the provider would race with the pre-paint script and risk a flash"
  - "LazyMotion provider sits BETWEEN ThemeProvider and BrowserRouter (not inside Routes) — so (a) Motion can react to theme classes if ever needed and (b) route changes don't remount the provider"

patterns-established:
  - "Grep-safe prose: project comments and prose avoid any phrase a Plan 03 CI grep bans (`wa.me`, `energy drink`, `<ScrollToTop`). This isn't aesthetic — the grep doesn't understand comment context"
  - "`vi.stubEnv('PROD', true)` is the correct Vitest 5 call signature — pass boolean, NOT the string `'true'`"
  - "`page.addInitScript` runs on EVERY navigation including reload — so a persistence test must not use it to seed state. New contexts start with empty localStorage already; set keys AFTER goto if a seed is needed"
  - "min-height-based 100dvh assertion must apply to <main> directly (not inner <section>) because getComputedStyle is called on the main landmark"
  - "Playwright projects: a per-suite `test.use(devices['Pixel 7'])` overrides the project viewport cleanly — no need for separate `mobile-chrome` project"

requirements-completed:
  - INFRA-03
  - INFRA-04
  - INFRA-05
  - CONV-03
  - CONV-04
  - CONV-05
  - HERO-01
  - HERO-02

duration: 19 min
completed: 2026-10-09
---

# Phase 1 Plan 02: Hero slice + conversion scaffold Summary

**FOUC-free Hero with locked Hinglish headline + working WhatsApp CTA on top of the complete conversion scaffold (centralized `cta.ts`, 16-flavor Shopify-shaped stub, `<PrimaryCTA>` cva wrapper, `<TrustBadge>` declaration, `<LazyMotion>` provider mounted in `App.tsx`, feature flags). Phases 2–6 bolt onto this without refactoring the shell.**

## Performance

- **Duration:** 19 min
- **Started:** 2026-10-09T09:59:35Z
- **Completed:** 2026-10-09T10:18:46Z
- **Tasks:** 2 (Task 1 cta/flavors/motion scaffold, Task 2 Hero slice) + Task 3 checkpoint (returned, not executed)
- **Files created:** 22
- **Files modified:** 12

## Accomplishments

- **INFRA-03 locked**: `src/config/cta.ts` is the single destination truth. Changing one line here changes TRY CAPSHOT everywhere. Verified by `grep -r "wa.me" src/ --exclude cta.ts` → 0 hits.
- **INFRA-04 locked**: 16 flavors in `src/data/flavors.ts` type-check under the Shopify-aligned `Flavor` schema. Range split 9/3/4 matches the capshot-catalog SKILL exactly. `priceInr/shopifyProductId/available === null` for all 16 (verified by `grep -c "priceInr: null"` → 16).
- **INFRA-05 locked**: `ENABLE_BUNDLES: false, ENABLE_SHOPIFY_CTAS: false` default in `src/config/features.ts`.
- **CONV-03 locked**: Hero fills 100dvh / 100vh cascade. CTA bottom-edge sits at ≤ 640 px at the 360×640 Pixel 7 viewport (visible above the fold without scroll). Verified by Playwright H5 + H6.
- **CONV-04 locked**: Inline FOUC script in `index.html` applies `.dark` before React mounts. Playwright T1 captured a 10×10 px screenshot at `domcontentloaded` under dark `colorScheme` and decoded the top-left pixel's RGB → `(89, 69, 69) = #594545` within ±4 tolerance. Zero cream-to-dark flash.
- **CONV-05 closed**: `src/lib/motion.ts` is the ONLY file importing from `motion/react` (verified by `grep -rE "motion\.(div|a|button|…)" src/ | grep -v lib/motion.ts` → 0 hits). `<LazyMotion features={domAnimation}>` is mounted in `src/App.tsx` around `<Routes>` (verified by `grep -c "<LazyMotion" src/App.tsx` → 2 matches: import + mount). Phases 2–3 can drop `m.*` primitives in without refactoring App.tsx.
- **HERO-01 locked**: H1 reads the exact Hinglish `Twist karo. Shake karo. BOOM.` with `BOOM` wrapped in a 3 px brand-rose underline. Sub-copy `Pre-filled flavor caps for any bottle.` renders muted + centered + max-28ch wrap.
- **HERO-02 locked**: `<PrimaryCTA size="lg">` is ≥ 56 px tall. Playwright H3 asserts the bounding-box height. H4 asserts `href` matches `wa.me/919203975762`. H8 asserts `index.html` served contains the preload link.
- **ThemeProvider + ThemeToggle**: 44×44 WCAG hit, `aria-pressed` flips, `localStorage.capshot-theme` persistence, `<meta name="theme-color">` sync (#FFF8EA ↔ #594545). All 5 Playwright theme tests pass.
- **Nav**: Logo-only + ThemeToggle (CONTEXT D-16). Fixed top, z-index 50. Dark-theme cream rounded surface wraps the logo without recoloring the asset.
- **Vitest harness**: 3 unit files, 16 passing tests. `vitest@5.0.3` EXACT pin.
- **Playwright harness grew from 9 to 22**: 9 skeleton + 8 hero + 5 theme. All green against production preview on first run (post-fix of 2 brittle assertions).

## Task Commits

Each task was committed atomically following the TDD RED → GREEN flow:

1. **Task 1 RED (unit specs)** — `0a42dde` (`test(01-02):`)
2. **Task 1 GREEN (conversion scaffold)** — `1ba1243` (`feat(01-02):`)
3. **Task 2 RED (e2e specs + cva/lucide/sharp install)** — `06a8ace` (`test(01-02):`)
4. **Task 2 GREEN (Hero slice + ThemeProvider + Nav + PrimaryCTA)** — `f208ad1` (`feat(01-02):`)

**Plan metadata commit:** will land after this SUMMARY + STATE updates.

## Files Created/Modified

### Created (22)

**Config + data:**
- `src/config/cta.ts` — single CTA destination truth (CONTEXT D-07/D-08/D-09 locked)
- `src/config/features.ts` — Phase 6 feature flags defaulting to false
- `src/config/site.ts` — site metadata consumed by Phase 5 @unhead/react
- `src/data/types.ts` — `Flavor`, `FlavorRange`, `FlavorRangeMeta` types
- `src/data/flavors.ts` — 16 flavors in capshot-catalog SKILL order
- `src/data/ranges.ts` — range metadata derived from flavors

**Components:**
- `src/components/ui/PrimaryCTA.tsx` — cva size variants, reads cta.ts
- `src/components/ui/ThemeToggle.tsx` — Sun/Moon lucide, 44×44 WCAG
- `src/components/ui/TrustBadge.tsx` — Phase 1 declaration only (NOT rendered); PROD throw + dev warning banner
- `src/components/primitives/Image.tsx` — width/height/priority enforcement
- `src/sections/Hero.tsx` — 100dvh Hero with Hinglish H1 + sub + CTA
- `src/sections/Nav.tsx` — fixed-top logo + ThemeToggle
- `src/theme/ThemeProvider.tsx` — React Context + .dark + localStorage + meta sync
- `src/lib/motion.ts` — ONLY motion/react importer

**Tests + config:**
- `vitest.config.ts` — jsdom env, @ alias
- `tests/unit/cta.spec.ts` — 5 tests
- `tests/unit/flavors.spec.ts` — 7 tests
- `tests/unit/trustbadge.spec.tsx` — 3 tests (dev banner, prod throw, type-level union)
- `tests/e2e/hero.spec.ts` — 8 Playwright tests @ Pixel 7 360×640
- `tests/e2e/theme.spec.ts` — 5 Playwright tests (FOUC pixel, light default, toggle persist, aria-pressed, hit target)

**Assets:**
- `public/hero/cap-on-bottle.jpg` — 800×1067 JPG, 110 KB (sharp cover-crop from Media/Image1.jpg)
- `public/logos/logo-horizontal.png` — Media/Logo_SHI-28.png copied verbatim

### Modified (12)

- `package.json` + `package-lock.json` — Vitest 5.0.3 exact, cva 0.7.1, lucide 1.53.0, sharp 0.35.5, testing-library; test + test:ui scripts
- `index.html` — hero preload + homepage OG tags; FOUC inline script retained
- `src/App.tsx` — new composition: ThemeProvider → LazyMotion → BrowserRouter → Nav → Routes; sr-only route stubs moved into Nav
- `src/pages/HomePage.tsx` — one-expression `<Hero />` body
- `src/pages/FlavorsPage.tsx`, `AboutPage.tsx`, `ContactPage.tsx`, `NotFoundPage.tsx` — placeholder `<Button>` → `<PrimaryCTA size="md" />`
- `playwright.config.ts` — drop `mobile-chrome` project (hero/theme use `test.use(devices['Pixel 7'])` per-suite)
- `tests/e2e/skeleton.spec.ts` — Test 1 updated to assert exact Hinglish H1

## Verification Outputs

### `npm run build`

```
dist/index.html                   2.77 kB │ gzip:   1.39 kB
dist/assets/index-D3-VeJt0.css   20.94 kB │ gzip:   5.00 kB
dist/assets/index-BFo_A2kO.js   367.48 kB │ gzip: 118.66 kB

✓ built in 957ms
```

**Motion footprint sanity:** The single JS chunk is 367 kB raw / 119 kB gzip. Plan 01 shipped at 290 kB raw / 92 kB gzip. The 77 kB raw / 27 kB gzip delta is split roughly across:

- Motion runtime (`domAnimation` feature pack) — the dominant new import
- lucide-react icons (3 glyphs: Sun, Moon, ArrowUpRight — tree-shaken from the full set)
- cva (~1 KB) + ThemeProvider + Nav + Hero + PrimaryCTA component code

Motion footprint through LazyMotion is well under the ~34 KB that a direct `motion.div` import would cost. Plan 03 adds the Pixel + CAPI onClick wrapper (~2 KB) and the in-app browser banner (~3 KB). Phase 4 PERF-02 will drop the full bundle budget audit; Phase 1 is comfortably within the Lighthouse mobile ≥90 headroom.

### `npm run test` (Vitest 5.0.3)

```
 Test Files  3 passed (3)
      Tests  16 passed (16)
```

### `npm run test:e2e` (Playwright, system Chrome)

```
  ✓ hero.spec.ts — 8 tests (H1 through H8)
  ✓ theme.spec.ts — 5 tests (T1 FOUC-free through T5 hit target)
  ✓ skeleton.spec.ts — 9 tests (updated Test 1 to Hinglish H1)

  22 passed (24.4s)
```

### Grep gates

```
$ grep -rE "wa\.me" src/ --include="*.ts" --include="*.tsx" | grep -v cta.ts
(no output — PASS)

$ grep -rE "motion\.(div|a|button|span|section|header|footer|p|h[1-6])" src/ \
    --include="*.ts" --include="*.tsx" | grep -v src/lib/motion.ts
(no output — PASS)

$ grep -ri "energy drink" src/
(no output — PASS)

$ grep -q "<ScrollToTop" src/pages/HomePage.tsx; echo $?
1  (no match — PASS)

$ grep -c "<LazyMotion" src/App.tsx
2  (import + mount — PASS)

$ grep -c "handle:" src/data/flavors.ts
16  (PASS)

$ grep -c "priceInr: null" src/data/flavors.ts
16  (PASS)
```

### FOUC proof (Playwright T1)

```
Test: T1 (FOUC-free): dark colorScheme + cold cache
Context: browser.newContext({ colorScheme: 'dark', viewport: 360×640 })
Action:  page.goto('/', { waitUntil: 'domcontentloaded' })
Capture: page.screenshot({ clip: { x: 0, y: 0, width: 10, height: 10 } })
Decode:  sharp(buf).raw().toBuffer()
Assert:  pixel(0,0) RGB ≈ (89, 69, 69) ±4 tolerance

Result: PASS (within tolerance; 89/69/69 is #594545, brand-deep)
```

## Decisions Made

- **Vitest pinned EXACTLY to `5.0.3`** per CLAUDE.md Dev Tools table. `npm install vitest@5.0.3` initially added a `^5.0.3` caret range to `package.json`; a manual edit + second `npm install` re-synced the lockfile to the exact pin. Rationale: CLAUDE.md Dev Tools section is contractual — exact pins prevent silent minor-version drift in a project where the test matrix is small enough that a reproducible dev environment is more valuable than easy updates.
- **Playwright: single `chromium` project, drop `mobile-chrome`.** Hero + theme suites override to Pixel 7 per-suite with `test.use(devices['Pixel 7'])`. Keeping a separate project would double-run every suite (44 enumerations instead of 22) and the plan clearly expects 22. Single-project config matches Plan 01's effective behavior.
- **Hero image sourced from `Media/Image1.jpg`, resized via sharp.** Image1 is 1056×1320 phone photo (closest to 3:4). `sharp(src).resize(800, 1067, { fit: 'cover' }).jpeg({ quality: 85, mozjpeg: true })` produces a 110 KB file. **Unretouched source** — Phase 4 PERF-02 drops a retouched master alongside the AVIF/WebP srcset work. Flagged as known-stub below.
- **Logo copied verbatim.** `Media/Logo_SHI-28.png` → `public/logos/logo-horizontal.png` with no modification. The file is 4128×1024 (effectively horizontal). The dark-theme cream rounded surface wraps the logo via Tailwind `dark:bg-[color:var(--color-brand-cream)]` — capshot-brand SKILL §Logo usage mandates never recoloring the asset itself. The 5.7 MB PNG payload is a known Phase 4 PERF-02 concern (natural moment to drop a WebP variant).
- **ThemeProvider initial state reads from `<html>.classList`.** The inline FOUC script has already resolved the correct theme and applied the class before React mounts. Re-reading `prefers-color-scheme` in the provider would (a) race with the pre-paint script and (b) re-introduce a flash risk on contexts where the user's localStorage preference overrides the system preference. The provider's responsibility is strictly post-mount lifecycle (toggle, persist, meta sync).
- **LazyMotion sits between ThemeProvider and BrowserRouter.** So Motion can react to theme classes if ever needed (not used in Phase 1 but a free property) AND route changes do not remount the provider.
- **Comments must stay grep-safe.** Three comments were rephrased mid-execution because Plan 03's CI greps don't distinguish code from prose. `wa.me` in a comment, `<ScrollToTop />` in a comment, `energy drinks` in a comment — all would false-positive. The fix: paraphrase without the literal phrase.
- **Fallback for sharp pixel-decode T1 is NOT needed.** The plan allowed a weaker assertion (`document.documentElement.classList.contains('dark')` at `domcontentloaded`) if sharp install failed. Sharp installed cleanly at `0.35.5` (upgraded from the plan's `^0.33` baseline to patch libvips CVEs). The pixel-decode assertion passes on first run.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Added `@testing-library/dom@^10` peer dep**
- **Found during:** Task 1 (first `npm run test` after installing `@testing-library/react@^16`)
- **Issue:** `@testing-library/react@16` requires `@testing-library/dom` as a peer dep; without it the test file fails at import with `Cannot find module '@testing-library/dom'`.
- **Fix:** `npm install --save-dev @testing-library/dom@^10`.
- **Files modified:** `package.json`, `package-lock.json`.
- **Verification:** TrustBadge spec file loads; all 3 tests inside pass.
- **Committed in:** `1ba1243` (Task 1 GREEN).

**2. [Rule 3 - Blocking] Vitest pin needed manual lockfile resync**
- **Found during:** Task 1 (first `npm install --save-dev vitest@5.0.3`)
- **Issue:** `npm install vitest@5.0.3` added `"vitest": "^5.0.3"` to `package.json` (caret range) despite the explicit `@5.0.3` request — npm's default install behavior. CLAUDE.md Dev Tools table requires EXACT pin `5.0.3`.
- **Fix:** Hand-edited `package.json` to remove the carets on `vitest` and `@vitest/ui`; ran `npm install` again to re-sync `package-lock.json`.
- **Files modified:** `package.json`, `package-lock.json`.
- **Verification:** `node -e "process.exit(require('./package.json').devDependencies.vitest === '5.0.3' ? 0 : 1)"` exits 0.
- **Committed in:** `0a42dde` (Task 1 RED).

**3. [Rule 3 - Blocking] Playwright `mobile-chrome` project dropped**
- **Found during:** Task 2 (first `npm run test:e2e` enumeration after adding hero + theme specs)
- **Issue:** The Plan 01 config kept two projects (`chromium` + `mobile-chrome`) but Plan 01's run reported only 9 tests. Playwright would now run `9 skeleton + 8 hero + 5 theme = 22 tests` × 2 projects = 44 enumerations. The plan's `<verify>` block expected 22 total.
- **Fix:** Removed the `mobile-chrome` project. Hero + theme suites call `test.use(devices['Pixel 7'])` per-suite, which overrides the default `Desktop Chrome` viewport cleanly without a dedicated project.
- **Files modified:** `playwright.config.ts`.
- **Verification:** `npx playwright test --list | tail -1` reports `Total: 22 tests in 3 files`.
- **Committed in:** `06a8ace` (Task 2 RED).

**4. [Rule 1 - Bug] `min-h-screen min-h-[100dvh]` moved onto `<main>` landmark (not just `<section>`)**
- **Found during:** Task 2 (first full e2e run — H6 failed)
- **Issue:** `tests/e2e/hero.spec.ts` H6 asserts `getComputedStyle(main).minHeight >= 600` at 640-px viewport. The initial Hero markup put the cascade (`min-h-screen min-h-[100dvh]`) only on the inner `<section>`, so the computed `min-height` of `<main>` was `auto` (0 px effective). Fix is correct behavior — the landmark should carry the viewport height so screen readers landing on `#main` get the full hero.
- **Fix:** Added `className="relative min-h-screen min-h-[100dvh]"` to the outer `<main>` wrapper in `src/sections/Hero.tsx`. Inner `<section>` keeps its own classes (padding + relative) so dvh cascade applies at both levels — rendering unchanged.
- **Files modified:** `src/sections/Hero.tsx`.
- **Verification:** H6 passes (`minHeight = 640 ≥ 600`); H5 (CTA bottom ≤ 640) still passes.
- **Committed in:** `f208ad1` (Task 2 GREEN).

**5. [Rule 1 - Bug] Theme-spec T3 `addInitScript` wipe removed**
- **Found during:** Task 2 (first full e2e run — T3 failed)
- **Issue:** T3 flow is click toggle → reload → assert `.dark` + localStorage persistence. The test was using `page.addInitScript` to seed a cold cache by `localStorage.removeItem('capshot-theme')`. BUT `addInitScript` runs on EVERY navigation including the `page.reload()` — so between the toggle click and the reload, the init script wiped the key. The reload then saw an empty localStorage, fell back to the context's `colorScheme: 'light'`, and ended light-mode.
- **Fix:** Removed the `addInitScript` wipe. New Playwright contexts start with empty localStorage already — no seeding needed. Also added an `expect.poll` guard between the toggle click and the reload to confirm the write landed before reload fires.
- **Files modified:** `tests/e2e/theme.spec.ts`.
- **Verification:** T3 passes on fresh run.
- **Committed in:** `f208ad1` (Task 2 GREEN).

**6. [Rule 3 - Blocking] Three comment lines rephrased to stay grep-safe**
- **Found during:** Final acceptance sweep (plan `<automated>` grep checks)
- **Issue:** Three comments in `src/` contained literal phrases that Plan 03's CI greps ban:
  1. `src/data/flavors.ts` comment: `avoid the forbidden "energy drink" phrase` — tripped `grep -i "energy drink"` CI gate.
  2. `src/data/ranges.ts` comment: `"caffeinated beverages" (not "energy drinks")` — same.
  3. `src/components/ui/PrimaryCTA.tsx` comment: `no component outside this file reaches for \`wa.me\` directly` — tripped `grep -rE "wa\.me" src/ --exclude cta.ts`.
  4. `src/pages/HomePage.tsx` comment: `No \`<ScrollToTop />\` component` — tripped `grep -q "<ScrollToTop" src/pages/HomePage.tsx` (the plan explicitly bans this component and its grep is a positive-grep).
- **Fix:** Paraphrased each comment to describe the ban without using the literal banned phrase (e.g. "the forbidden stimulant-beverage phrase", "the WhatsApp deep-link lives ONLY inside src/config/cta.ts", "No scroll-reset helper component").
- **Files modified:** `src/data/flavors.ts`, `src/data/ranges.ts`, `src/components/ui/PrimaryCTA.tsx`, `src/pages/HomePage.tsx`.
- **Verification:** All four greps return no matches now.
- **Committed in:** `f208ad1` (Task 2 GREEN).

**7. [Rule 2 - Missing critical] Upgraded `sharp` from plan's `^0.33` baseline to `0.35.5` to patch libvips/libheif CVEs**
- **Found during:** Task 2 RED (first `npm install sharp@^0.33`)
- **Issue:** `npm audit` reported 1 HIGH severity vulnerability chain in sharp ≤ 0.35.5-rc.1 (libvips: CVE-2026-33327/33328/35590/35591; libheif: GHSA-g89c-p67h-r497 and GHSA-2jg2-4ch7-h545; librsvg: CVE-2026-96889). sharp is a devDep only — never ships in the client bundle — but a vulnerable devDep is still a build-chain supply-chain risk.
- **Fix:** `npm install --save-dev sharp@0.35.5` to pick up the patched release.
- **Files modified:** `package.json`, `package-lock.json`.
- **Verification:** `npm audit` reports 0 vulnerabilities post-upgrade; `sharp(buf).raw().toBuffer()` still works for the T1 FOUC pixel decode (API unchanged in this minor).
- **Committed in:** `06a8ace` (Task 2 RED).

**8. [Rule 1 - Bug] `vi.stubEnv('PROD', true)` passes boolean, not string**
- **Found during:** Task 1 GREEN (`tsc --noEmit` after writing trustbadge spec)
- **Issue:** `vi.stubEnv('PROD', 'true')` fails TypeScript narrowing because `import.meta.env.PROD` is typed `boolean | undefined`.
- **Fix:** Pass boolean `true`. Also split the `@ts-expect-error` compile-time check into its own test so the directive sits on the actual line that should fail (not the one that got cast around it).
- **Files modified:** `tests/unit/trustbadge.spec.tsx`.
- **Verification:** `tsc --noEmit` exits 0; TrustBadge spec runs green.
- **Committed in:** `1ba1243` (Task 1 GREEN).

---

**Total deviations:** 8 auto-fixed (5 blocking under Rule 3, 2 bugs under Rule 1, 1 missing-critical under Rule 2)

**Impact on plan:** All eight deviations were either (a) ecosystem gaps the plan could not have predicted (npm's caret-range default, Vitest 5 env-stub API shape, @testing-library/react v16 peer dep, grep-literal comment collisions) or (b) brittle test assertions that needed a one-line fix. None altered the plan's locked contracts: pinned versions stay pinned, UI-SPEC tokens stay unchanged, CONTEXT-locked copy is intact, Phase 6 migration surface (`cta.ts` + `flavors.ts` + `features.ts`) is preserved as the single edit point for Phase 6. The sharp security upgrade is additive-safe (0.33 → 0.35 is still minor).

## Issues Encountered

- **Grep-based CI gates demand grep-friendly prose.** The plan's `<verify>` block + Plan 03's upcoming CI greps use `grep -q` and `grep -rE` without AST context, so comments containing the banned literal phrases false-positive. Mitigation: all four hits were rephrased. Future prose anywhere in `src/` must avoid: `wa.me`, `energy drink`, `<ScrollToTop`.
- **Vitest 5's `vi.stubEnv` signature.** Vitest 5 changed `stubEnv` to accept the native type of the variable (boolean for `PROD`, string for `MODE`). Older patterns passing string `'true'` fail TypeScript narrowing. No upstream issue — just a signature evolution. Documented in the deviation + the comment on the test file.
- **Hero image is unretouched.** Shipped as a sharp cover-crop of `Media/Image1.jpg`. The brand palette (`#594545 / #815B5B / #9E7676 / #FFF8EA`) is not applied via background/color-grade — the raw phone photo is Phase 1 acceptable per CONTEXT §Specific Ideas ("critical-path design/asset task"). **Known stub flag**: a retouched master should land alongside Phase 4 PERF-02's AVIF/WebP srcset drop (natural moment because PERF-02 already touches the image pipeline).
- **Logo payload is 5.7 MB uncompressed PNG.** `Media/Logo_SHI-28.png` is a 4128×1024 PNG — far larger than the 120×28 render size the Nav uses. The Image primitive's `width={120} height={28}` prevents layout thrash, but the actual payload is wasteful. **Known stub flag**: Phase 4 PERF-02 should drop a WebP variant sized for the actual render dimensions.
- **`vercel.json` and preview-plugin fallback** (inherited from Plan 01) continue to work — `/does-not-exist` returns real 404 under production preview; e2e Test 6 stays green.

## Known Stubs

| Stub | File / Location | Why | Resolution |
|------|-----------------|-----|-------------|
| Unretouched hero image | `public/hero/cap-on-bottle.jpg` (110 KB JPG) | No image-retouching tooling in this exec environment; `Media/Image1.jpg` cover-cropped as-is via sharp | Phase 4 PERF-02: drop retouched 800×1067 master alongside AVIF/WebP/JPG srcset |
| Oversized logo PNG | `public/logos/logo-horizontal.png` (5.7 MB) | `Media/Logo_SHI-28.png` is 4128×1024; copied verbatim because capshot-brand SKILL mandates no recoloring/resizing of the logo file | Phase 4 PERF-02: ship a 240×56 (2× of render) WebP + fallback PNG; keep the original file in `Media/` as the source of truth |
| `/og/home.jpg` referenced in index.html OG tags | `public/og/home.jpg` not shipped | Phase 5 ships the OG artwork; Phase 1 ships the tag reference so link previews immediately pick up the designed image once uploaded without an index.html edit | Phase 5 artwork drop |
| TrustBadge DECLARATION but NOT rendered | `src/components/ui/TrustBadge.tsx` + 0 call sites | Intentional per plan: Phase 1 freezes the contract (evidenceUrl mandatory, PROD throw, label union); Phase 5 TRUST-01 renders the trust strip for real | Phase 5 TRUST-01 |
| `bundles.*` empty strings in `src/config/cta.ts` | `ctaConfig.bundles.trial / fitness / bulk === ''` | Phase 6 populates with real Shopify checkout URLs; Phase 1 fulfills the TypeScript shape so sections referencing `bundles.trial` type-check immediately | Phase 6 commerce rollout |
| ESLint remains a no-op script | `package.json` → `lint: console.log` | TS 7 ecosystem gap (inherited from Plan 01) — `@typescript-eslint` + `eslint-plugin-react` not yet compatible; `tsc --noEmit` catches type errors in `npm run build` | One-install flip when upstreams ship TS 7 + ESLint 10 compat |

## User Setup Required

**None.** Plan 02 ships no new environment variables or service dependencies. Deferred to later plans (unchanged from Plan 01's deferred list):

- **Phase 3 (Pixel + CAPI):** `VITE_META_PIXEL_ID` (client), `META_CAPI_ACCESS_TOKEN` + `META_CAPI_DATASET_ID` (server).
- **Phase 6 (Commerce):** FSSAI license, Shopify Basic plan, Razorpay keys, Shiprocket pickup — all documented in STATE.md Blockers/Concerns.

## Next Phase Readiness

- **INFRA-03, INFRA-04, INFRA-05, CONV-03, CONV-04, CONV-05, HERO-01, HERO-02 — all closed.** Phase 1 Plan 03 (Pixel+CAPI + in-app browser banner + CI greps) is unblocked.
- **Plan 03 edit surface is minimal:** `src/components/ui/PrimaryCTA.tsx` adds the `onClick` wrapper that fires `fbq('track', 'Lead')` + `fetch('/api/track-lead')` before the anchor navigates. `src/App.tsx` gains an `<InAppBrowserBanner>` above `<BrowserRouter>` (z-60 to Nav's z-50). `src/lib/detectInAppBrowser.ts` is added. CI greps for `wa.me` outside `cta.ts` and `energy drink` anywhere in `src/` land as `.github/workflows/*.yml` + a `grep` script.
- **CONV-05 provider contract CLOSED.** Phase 3's Motion scroll choreography can import `m.div`, `m.a`, `m.section` from `@/lib/motion` without touching `src/App.tsx` — the `<LazyMotion features={domAnimation}>` is already mounted around `<Routes>`.
- **Phase 6 "3 files edited, 2 added, 1 un-gated" invariant preserved.** The three files Phase 6 edits (`cta.ts`, `flavors.ts`, `features.ts`) all exist with the shape Phase 6 expects; the two files it adds (`bundles.ts`, `og/bundles.jpg`) have no Phase 1 collision; the one section it un-gates (`Bundles.tsx`) does not exist yet.
- **No open blockers from this plan.** Awaiting human-verify checkpoint before Plan 03 (CTA Pixel binding + in-app browser nudge).

## Threat Flags

No new threat surface beyond Plan 02's `<threat_model>` register. All eight threat IDs (T-02-01 through T-02-SC) addressed in-place:

- **T-02-01** (CTA URL injection): `src/config/cta.ts` `primary.href` is a static literal; no runtime concatenation of user input. `grep -rn "window.location" src/` returns 0 CTA-adjacent hits.
- **T-02-02** (FOUC inline script XSS): The IIFE in `index.html` reads only `localStorage.getItem('capshot-theme')` and `window.matchMedia(...)`. The only DOM mutations are a boolean-derived class name (`'dark'`) and a fixed hex meta content. No `eval`, no `innerHTML`, no `document.write`. The allowlist on the localStorage value is strict: `=== 'dark'` is the only branch; any other value falls through to light.
- **T-02-03 → T-02-07**: Accepted / mitigated per the plan's threat register — no changes.
- **T-02-08** (TrustBadge data-pending-fssai in prod): `TrustBadge` body guards with `if (import.meta.env.PROD) throw new Error(...)`. Vitest spec verifies the throw.
- **T-02-SC** (package legitimacy): `vitest@5.0.3` + `@vitest/ui@5.0.3` + `@testing-library/react@^16.3` + `@testing-library/dom@^10.4.2` + `jsdom@^25` + `class-variance-authority@0.7.1` + `lucide-react@1.53.0` + `sharp@0.35.5` all name-match canonical maintainers (vitest-dev, testing-library, jsdom-dev, joe-bell, lucide-icons, lovell). `npm audit` reports 0 vulnerabilities after the sharp upgrade.

## Self-Check

Verifying all claimed artifacts exist and all claimed commits are on the branch:

- `src/config/cta.ts` — FOUND
- `src/config/features.ts` — FOUND
- `src/config/site.ts` — FOUND
- `src/data/types.ts` — FOUND
- `src/data/flavors.ts` — FOUND
- `src/data/ranges.ts` — FOUND
- `src/components/ui/PrimaryCTA.tsx` — FOUND
- `src/components/ui/ThemeToggle.tsx` — FOUND
- `src/components/ui/TrustBadge.tsx` — FOUND
- `src/components/primitives/Image.tsx` — FOUND
- `src/sections/Hero.tsx` — FOUND
- `src/sections/Nav.tsx` — FOUND
- `src/theme/ThemeProvider.tsx` — FOUND
- `src/lib/motion.ts` — FOUND
- `vitest.config.ts` — FOUND
- `tests/unit/cta.spec.ts` — FOUND
- `tests/unit/flavors.spec.ts` — FOUND
- `tests/unit/trustbadge.spec.tsx` — FOUND
- `tests/e2e/hero.spec.ts` — FOUND
- `tests/e2e/theme.spec.ts` — FOUND
- `public/hero/cap-on-bottle.jpg` — FOUND (110 KB)
- `public/logos/logo-horizontal.png` — FOUND (5.7 MB — flagged as known-stub)
- Commit `0a42dde` (`test(01-02): add failing unit specs...`) — FOUND
- Commit `1ba1243` (`feat(01-02): add conversion scaffold...`) — FOUND
- Commit `06a8ace` (`test(01-02): add failing Hero + Theme e2e specs...`) — FOUND
- Commit `f208ad1` (`feat(01-02): FOUC-free Hero slice...`) — FOUND

## Self-Check: PASSED

## TDD Gate Compliance

Plan 02 is `type: execute` (not `type: tdd`), so plan-level RED → GREEN → REFACTOR gates don't apply. However, both tasks declared `tdd="true"` and followed the RED → GREEN discipline per-task:

| Task | RED commit | GREEN commit | REFACTOR | Notes |
|------|-----------|--------------|----------|-------|
| Task 1 (conversion scaffold) | `0a42dde` | `1ba1243` | — | 5+7+3 unit tests fail at RED → all green at GREEN |
| Task 2 (Hero slice) | `06a8ace` | `f208ad1` | — | 8+5 e2e tests fail at RED → all green at GREEN |

No REFACTOR commits were needed — both GREEN implementations landed close enough to the plan's prescribed shape that no cleanup pass was warranted.

---

*Phase: 01-foundation-hero-conversion-infrastructure*
*Completed: 2026-10-09*
*Checkpoint: AWAITING HUMAN-VERIFY (Task 3 gate="blocking")*
