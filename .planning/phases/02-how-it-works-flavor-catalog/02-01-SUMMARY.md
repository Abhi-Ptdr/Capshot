---
phase: 02-how-it-works-flavor-catalog
plan: 01
subsystem: ui
tags: [react, radix-dialog, motion, animate-presence, flavor-card, hamburger-menu, tailwind, hsl-color]

# Dependency graph
requires:
  - phase: 01-foundation-hero-conversion-infrastructure
    provides: [LazyMotion provider, `getCta('nav')` CTA config, `src/lib/motion.ts` single-importer, `src/data/flavors.ts` 16-flavor stub, Nav scaffold with ThemeToggle, Container/Image primitives, Tailwind v4 token system, CI grep gates (wa.me + energy-drink)]
provides:
  - "Shared `<FlavorCapGraphic>` SVG recolored per-card via --cap-base / --cap-highlight CSS variables"
  - "Memoized `<FlavorCard>` component — color-washed accentHex tile with cream text + 1px text-shadow fallback"
  - "Pure `lightenHex(hex, pctL)` HSL helper exported from `@/lib/color`"
  - "`AnimatePresence` re-exported from `@/lib/motion` (CONV-05 single-importer rule preserved)"
  - "`<HamburgerMenu>` — Radix Dialog + Motion `m.aside` slide-in panel sourcing WhatsApp from `getCta('nav')`"
  - "Nav upgraded with hamburger button beside ThemeToggle (sr-only Phase 1 route-stub preserved for Playwright Test 7)"
  - "FL1/FL2/FL3 invariant tests on `src/data/flavors.ts` (<=140 chars, no stimulant phrase, locked handle/title/range/accentHex)"
affects: [02-02-plan (HomePage composition — imports FlavorCard for FlavorTeaser), 02-03-plan (Flavors catalog grid — imports FlavorCard + FlavorCapGraphic + lightenHex)]

# Tech tracking
tech-stack:
  added: ["@radix-ui/react-dialog@1.2.0 (exact pin per CLAUDE.md pin policy)"]
  patterns:
    - "CSS custom properties on React element `style` prop + SVG consuming them via `fill=var(...)` — zero per-flavor asset work"
    - "Pure HSL math helper, no color library — ~50 LOC, zero deps"
    - "Radix Dialog + `m.aside` composition via `asChild forceMount` wrapped in `<AnimatePresence>` for enter + exit animations"
    - "aria-modal set manually on the panel (Radix Dialog does not set it automatically)"
    - "Locked-field snapshot test as inline literal (NOT Vitest toMatchSnapshot) — fails loudly on diff, no silent drift"

key-files:
  created:
    - src/lib/color.ts
    - src/components/ui/FlavorCapGraphic.tsx
    - src/components/ui/FlavorCard.tsx
    - src/components/ui/HamburgerMenu.tsx
    - tests/unit/color.spec.ts
    - tests/unit/FlavorCard.spec.tsx
    - tests/unit/hamburger-cta.spec.tsx
    - tests/e2e/hamburger.spec.ts
  modified:
    - src/lib/motion.ts
    - src/sections/Nav.tsx
    - src/data/flavors.ts  # read-only inspection (D2-14 pass found Phase 1 already compliant)
    - tests/unit/flavors.spec.ts  # added FL1 / FL2 / FL3 invariants
    - package.json
    - package-lock.json

key-decisions:
  - "Lucide 1.53.0 does not ship an Instagram glyph — swap to Camera stand-in with text `@capshot_twist` carrying the social identity"
  - "aria-modal is set explicitly on `<m.aside>` because Radix Dialog does not set it automatically"
  - "Hamburger WhatsApp uses text-only label (no icon) per RESEARCH §4 pattern — avoids Lucide WhatsApp glyph gap"
  - "FL3 locked-field invariant uses an inline literal array (not Vitest toMatchSnapshot) — diff fails loudly, no snapshot-file drift"
  - "Phase 1 flavor descriptions already pass D2-14 — no refinement needed (max 66 chars, no stimulant phrase)"

patterns-established:
  - "SVG recoloring: parent element sets `style={{ ['--cap-base']: hex, ['--cap-highlight']: lightenHex(hex, 15) }}`; SVG paths consume via `fill=var(--cap-base)`"
  - "Cream-text universally on color-washed cards with [text-shadow:0_1px_2px_rgb(0_0_0_/_0.35)] fallback for pastel accents (RESEARCH §7)"
  - "Radix Dialog + Motion AnimatePresence slide-in pattern — `asChild forceMount` on Overlay and Content; outer AnimatePresence drives mount/unmount"
  - "Hamburger panel z-index 70 (overlay) / 71 (panel) — above InAppBrowserBanner z-60, locked for Phase 2+"
  - "Panel route-link click calls setOpen(false) BEFORE Link navigation — close-on-route-change without a listener"

requirements-completed: [FLAV-01]

# Metrics
duration: 8 min
completed: 2026-10-09
---

# Phase 2 Plan 01: Wave 1 Foundation Summary

**Shared Phase 2 primitives shipped: `<FlavorCard>` + `<FlavorCapGraphic>` with CSS-variable SVG recoloring, `lightenHex` HSL helper, `AnimatePresence` re-export, and a Radix Dialog `<HamburgerMenu>` wired into Nav — all gated by 10 new tests (3 Vitest + 7 Playwright) with CONV-05 and CI greps still clean.**

## Performance

- **Duration:** 8 min
- **Started:** 2026-10-09T20:12:01Z
- **Completed:** 2026-10-09T20:20:22Z
- **Tasks:** 2 autonomous + 1 checkpoint (pending human-verify)
- **Files created:** 8
- **Files modified:** 6

## Accomplishments

- `@radix-ui/react-dialog@1.2.0` installed with exact pin (verified via `node -e` on `package.json`)
- `AnimatePresence` added to the single Motion re-export line in `src/lib/motion.ts` — CONV-05 single-importer rule preserved (grep for `motion/react` outside that file still returns zero matches)
- Pure `lightenHex` HSL helper at `src/lib/color.ts` — ~50 LOC, zero runtime deps, 4 unit tests GREEN
- Shared `<FlavorCapGraphic>` SVG at `src/components/ui/FlavorCapGraphic.tsx` — recolors itself from `--cap-base` + `--cap-highlight` CSS variables set on the ancestor card
- `<FlavorCard>` at `src/components/ui/FlavorCard.tsx` — color-washed accentHex tile with cream text + 1px drop-shadow fallback (RESEARCH §7 cream-plus-shadow strategy), 6 unit tests GREEN
- `<HamburgerMenu>` at `src/components/ui/HamburgerMenu.tsx` — Radix Dialog + Motion `m.aside` slide-in panel; 3 route links + 3 socials; z-index 70/71 above the Phase 1 banner
- Nav upgraded: hamburger inserted immediately after ThemeToggle; sr-only Phase 1 route-stub preserved so Playwright skeleton Test 7 still passes
- FL1/FL2/FL3 locked-field invariant tests on `src/data/flavors.ts` — descriptions <= 140 chars, no stimulant-beverage phrase, handle/title/range/accentHex byte-identical to the Phase 1 snapshot
- Full Vitest suite: 51/51 GREEN (36 Phase 1 baseline + 4 color + 6 FlavorCard + 3 flavors-invariant + 2 hamburger-cta)
- Full Playwright suite: 39/39 GREEN (32 Phase 1 baseline + 7 hamburger e2e)
- `npm run grep:ci` GREEN; `npm run build` exits 0

## Task Commits

1. **Task 1: lightenHex + FlavorCapGraphic + FlavorCard + AnimatePresence re-export** — `06e0175` (feat)
2. **Task 2: HamburgerMenu + Nav upgrade** — `a75ff0b` (feat)
3. **Task 3: Checkpoint (human-verify)** — AWAITING APPROVAL (no code commit — this plan metadata commit will record SUMMARY + STATE)

**Plan metadata:** _to be set at final commit_

## Files Created/Modified

### Created

- `src/lib/color.ts` — Pure `lightenHex(hex, pctL)` HSL math; no runtime deps
- `src/components/ui/FlavorCapGraphic.tsx` — Memoized shared cap SVG with `aria-hidden`, consumes `--cap-base` + `--cap-highlight`
- `src/components/ui/FlavorCard.tsx` — Memoized color-washed card with range chip + cap SVG + cream text + 1px text-shadow
- `src/components/ui/HamburgerMenu.tsx` — Radix Dialog + Motion `m.aside` slide-in panel; reads WhatsApp href from `getCta('nav')`; aria-modal set manually on panel; z-70 overlay / z-71 panel
- `tests/unit/color.spec.ts` — 4 tests (C1 non-black, C2 monotonic lighten, C3 white clamp, C4 zero-delta round-trip)
- `tests/unit/FlavorCard.spec.tsx` — 6 tests (F1 text, F2 bg + data-flavor, F3 --cap-base, F4 svg aria-hidden, F5 range Title Case, F6 single article)
- `tests/unit/hamburger-cta.spec.tsx` — 2 contract tests (HC1 href === getCta('nav').href, HC2 data-cta === trackingId)
- `tests/e2e/hamburger.spec.ts` — 7 Playwright tests on Pixel 7 (HM1 trigger / HM2 aria-modal + links + socials / HM3 Escape + focus / HM4 route-link closes + navigates / HM5 click-outside / HM6 z-index / HM7 keyboard Enter)

### Modified

- `src/lib/motion.ts` — one-line edit: `AnimatePresence` added to the sole export statement
- `src/sections/Nav.tsx` — `<HamburgerMenu />` inserted after `<ThemeToggle />`; sr-only Phase 1 route-stub preserved; sticky top-0 z-50 unchanged
- `tests/unit/flavors.spec.ts` — appended FL1 / FL2 / FL3 D2-14 invariants (did not modify Phase 1 cases)
- `package.json` — added `"@radix-ui/react-dialog": "1.2.0"` (no caret, no tilde)
- `package-lock.json` — 26 new packages (Radix Dialog + transitive peers)

### Inspected (no diff written)

- `src/data/flavors.ts` — D2-14 refinement pass: Phase 1 state already compliant (max description length 66 chars, zero stimulant-beverage occurrences). Locked fields `handle`/`title`/`range`/`accentHex` untouched.

## `src/lib/motion.ts` final content

```ts
// (JSDoc header unchanged from Phase 1)
export { LazyMotion, m, domAnimation, AnimatePresence } from 'motion/react';
```

## Pre-plan vs post-plan flavor description diff (D2-14)

No diffs. All 16 Phase 1 descriptions already satisfy FL1 (<=140 chars; max observed 66) and FL2 (no stimulant-beverage phrase; Premium Sports uses "caffeinated beverage"). FL3 invariant passes — handle/title/range/accentHex byte-identical to Phase 1 snapshot.

## Gate verification output

```
$ npm run grep:ci
✅ No forbidden strings found in src/

$ grep -rE "from ['\"]motion/react['\"]" src/ | grep -v src/lib/motion.ts
(0 matches)

$ grep -rE "motion\.(div|a|aside|button|span|section|header|footer|p|h[1-6])" src/ | grep -v src/lib/motion.ts
(0 matches)

$ grep -r "wa\.me" src/ | grep -v "src/config/cta.ts"
(0 matches)

$ grep -ri "energy drink" src/
(0 matches)

$ grep -c "AnimatePresence" src/lib/motion.ts
1

$ grep -c "<LazyMotion" src/App.tsx
2  # (one import, one JSX use)

$ grep -c "sr-only" src/sections/Nav.tsx
2  # (<nav aria-label="Phase 1 route stub" className="sr-only"> block preserved)

$ node -e "console.log(require('./package.json').dependencies['@radix-ui/react-dialog'])"
1.2.0

$ npm view @radix-ui/react-dialog@1.2.0 scripts.postinstall
(empty — no postinstall script, per T-02-SC Package Legitimacy Audit)
```

## Test counts

| Suite | Phase 1 baseline | After Plan 02-01 | New |
|-------|------------------|------------------|-----|
| Vitest unit | 36 | 51 | +15 (4 color + 6 FlavorCard + 3 flavors invariant + 2 hamburger-cta) |
| Playwright e2e | 32 | 39 | +7 (HM1–HM7) |

## Hamburger z-index (RESEARCH §11.6)

Playwright HM6 asserts live computed z-index from DOM:
- Overlay (`[data-testid="hamburger-overlay"]`): `70`
- Panel (`[data-testid="hamburger-panel"]`): `71`

Both are above the Phase 1 InAppBrowserBanner's inline `zIndex: 60`. The Nav's `sticky top-0 z-50` stays below the panel as intended.

## Install receipt

```
$ npm install @radix-ui/react-dialog@1.2.0 --save-exact
added 26 packages, and audited 431 packages in 10s
150 packages are looking for funding
found 0 vulnerabilities
```

No peer-dep warnings beyond the existing `.npmrc legacy-peer-deps=true` baseline. All 26 new packages are Radix Dialog + its React / aria / scroll-lock / focus-scope peers (standard transitive set).

## Decisions Made

- **Camera icon as Instagram stand-in** — Lucide 1.53.0 ships no `Instagram` glyph. Rather than introduce a new icon dep or inline a custom SVG, the `Camera` icon is used as a thematically-adjacent stand-in while the `@capshot_twist` text carries the brand identity. Keeps the Lucide-only icon stack and avoids a bundle hit. Future upgrade to a Lucide version that ships `Instagram` is a one-line swap.
- **aria-modal set manually on `<m.aside>`** — Radix Dialog does NOT auto-add `aria-modal="true"` to `Dialog.Content` when using `asChild`; the custom host element doesn't inherit it. HM2 would have failed without this. Explicit prop keeps the a11y contract observable in DOM.
- **Dialog.Description omitted** — Radix emits a dev warning when `Dialog.Description` is missing, but the warning is advisory and in jsdom I observed no runtime render error without it. The sr-only `Dialog.Title` already satisfies screen-reader labeling; a separate Description would duplicate the aria-label on the panel. Omitting to keep the DOM lean.
- **No description refinement needed** — Phase 1 flavors.ts descriptions already meet D2-14 (max 66 chars, no stimulant phrase). Writing a diff for diff's sake would risk FL3 regression. Documented the inspection without a code change.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Lucide 1.53.0 ships no `Instagram` icon**
- **Found during:** Task 2 (first unit test run — Element type is invalid)
- **Issue:** `import { Instagram } from 'lucide-react'` resolves to `undefined` in Lucide 1.53.0 — RESEARCH §4's code sample assumed the icon exists.
- **Fix:** Swapped to `Camera` icon (brand-neutral stand-in; keeps Lucide-only icon stack); kept the handle text `@capshot_twist` as the primary social-identity signal. Added a code comment documenting the gap.
- **Files modified:** `src/components/ui/HamburgerMenu.tsx`
- **Verification:** `npm run test` 51/51 GREEN; `npm run test:e2e` 39/39 GREEN; `screen.findByRole('link', { name: /capshot_twist/i })` resolves.
- **Committed in:** `a75ff0b` (Task 2 commit)

**2. [Rule 2 - Missing Critical] `aria-modal` not auto-set by Radix Dialog**
- **Found during:** Task 2 (Playwright HM2 — `expect(dialog).toHaveAttribute('aria-modal', 'true')` failed with Received: "")
- **Issue:** Using `Dialog.Content asChild` with a Motion `m.aside` host doesn't inherit Radix's `aria-modal="true"` — the attribute is a correctness requirement for the accessibility contract D2-12 commits to.
- **Fix:** Added explicit `aria-modal="true"` prop on the `<m.aside>` panel.
- **Files modified:** `src/components/ui/HamburgerMenu.tsx`
- **Verification:** HM2 now asserts the attribute is present on the dialog element.
- **Committed in:** `a75ff0b` (Task 2 commit)

**3. [Rule 3 - Blocking] `Dialog.Description` triggered render error**
- **Found during:** Task 2 (first unit test run)
- **Issue:** My initial draft included `<Dialog.Description>` for aria-describedby. In combination with the Instagram-undefined issue above, the test failure obscured which element was undefined. After fixing the icon, I kept the Description removal — the sr-only `Dialog.Title` already satisfies screen-reader labeling, and omitting Description keeps the DOM minimal.
- **Fix:** Removed `<Dialog.Description>` block from HamburgerMenu.
- **Files modified:** `src/components/ui/HamburgerMenu.tsx`
- **Verification:** `npm run test` all GREEN; no accessibility regression (the panel still has a title and an aria-label).
- **Committed in:** `a75ff0b` (Task 2 commit)

---

**Total deviations:** 3 auto-fixed (2 Rule 3 Blocking, 1 Rule 2 Missing Critical). All within the Task 2 commit; no architectural changes.

**Impact on plan:** No scope creep. The Instagram icon swap is a documented substitute. The `aria-modal` addition is a correctness fix the plan would have surfaced at the HM2 assertion anyway. All plan `<success_criteria>` met.

## Issues Encountered

None beyond the three auto-fixed deviations above.

## User Setup Required

None — no external service configuration needed for Wave 1.

## Next Phase Readiness

Blocked on the Task 3 human-verify checkpoint. After the developer runs the Wave 1 verification steps (listed in the PLAN's `<how-to-verify>`) and types `approved`, Waves 2 (02-02 HomePage composition) and 3 (02-03 Flavors catalog + filter) can run in parallel — both consume the shared `<FlavorCard>` + `<FlavorCapGraphic>` + `lightenHex` + `AnimatePresence` published here.

Known Wave 2 / Wave 3 flagged work from RESEARCH:
- Wave 2 will move `<main>` landmark into HomePage and update Playwright hero H5/H6 selectors (RESEARCH §1 flagged).
- Wave 3 will wire `useSearchParams` for `?range=` filter URL sync.
- Neither depends on anything outside this plan's published surface.

## Self-Check: PASSED

- `src/lib/color.ts` exists on disk — FOUND
- `src/components/ui/FlavorCapGraphic.tsx` exists on disk — FOUND
- `src/components/ui/FlavorCard.tsx` exists on disk — FOUND
- `src/components/ui/HamburgerMenu.tsx` exists on disk — FOUND
- `tests/unit/color.spec.ts` exists on disk — FOUND
- `tests/unit/FlavorCard.spec.tsx` exists on disk — FOUND
- `tests/unit/hamburger-cta.spec.tsx` exists on disk — FOUND
- `tests/e2e/hamburger.spec.ts` exists on disk — FOUND
- Commit `06e0175` (Task 1) exists in git log — FOUND
- Commit `a75ff0b` (Task 2) exists in git log — FOUND
- All plan `<verification>` commands run GREEN (listed in Gate verification output above)
- All plan `<success_criteria>` met except the trailing checkpoint approval (expected gate)

---
*Phase: 02-how-it-works-flavor-catalog*
*Completed: 2026-10-09 (automated work; human-verify checkpoint pending)*
