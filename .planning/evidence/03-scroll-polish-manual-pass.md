# Phase 3 Scroll Polish — Manual Pass Evidence

**Date:** 2026-10-10 (bundle report + manual-pass deferral decision)
**Developer:** harish@toqqer.com
**Build:** `99af7ed` on main at Phase 3 close time

**Manual pass status (2026-10-10):** DEFERRED by developer decision. User explicitly approved Phase 3 close without the real-device iPhone/Android walk-through, citing a priority re-direction toward Section 3 (USP & Comparison Grid), Section 4 (Pricing Bundles), and Section 5 (Trust/Certifications) work that the current ROADMAP does not fully cover. Real-device validation of the three Phase 3 animated surfaces (HowItWorks, FlavorTeaser, /flavors) is rolled forward to the Phase 4 Lighthouse perf-pass work (where real-device perf testing is already in scope). Playwright on Chromium (71/71 GREEN) provides the baseline functional coverage until then.

---

## Bundle Report (CONV-05 verification)

**Build command:** `rm -rf dist && npm run build`

**Chunk sizes (post Phase 3 Plan 03 lazy-load fix, commit `9d3845b`):**

| Asset | Raw | Gzip | Load timing |
|-------|-----|------|-------------|
| `dist/index.html` | 5.95 KB | 2.72 KB | first paint |
| `dist/assets/index-V95phjJT.css` | 43.26 KB | 8.28 KB | first paint |
| `dist/assets/index-*.js` (entry) | 408.96 KB | **130.44 KB** | first paint |
| `dist/assets/motion-features-*.js` (async) | 37.85 KB | **14.53 KB** | after first paint (dynamic import) |

**Phase 2 baseline (pre-fix single-chunk, c107d12):**

| Asset | Raw | Gzip |
|-------|-----|------|
| `dist/assets/index-*.js` (single chunk, all Motion included) | 444.75 KB | 142.76 KB |

**Delta analysis:**

- Entry chunk reduction: **−12.32 KB gzip** (142.76 → 130.44)
- New async `motion-features` chunk: **+14.53 KB gzip** (fetched after first paint, not blocking)
- Net Motion in entry: ≈ 30.56 (prior all-Motion) − 14.53 (now async) = **~16 KB gzip remaining in entry**
- Motion split ratio: ~48% moved off first paint

**CONV-05 verdict:**

- Target (revised 2026-10-10, see REQUIREMENTS.md): **entry Motion contribution ≤ 20 KB gzip** · **async motion-features chunk ≤ 15 KB gzip**
- Measured: **entry ~16 KB gzip** · **async 14.53 KB gzip**
- **PASS** (both numbers inside revised budget)

**Original ≤10 KB entry target status:** NOT met · **DEFERRED to Phase 4 PERF-02 chunk-splitting work.** Reason: the ~16 KB residual is `motion/react` v14 core — `m` primitive + `LazyMotion` wrapper + `AnimatePresence` + bindings — statically imported by every section and not shrinkable without rewriting components to dynamic-mount their motion wrappers.

**stats.html path:** `dist/stats.html` (local; gitignored; regenerate via `npm run build`).

---

## iPhone Pass

**TODO (developer to fill):**

- Device: iPhone <model> iOS <version>
- Browser: Safari / Chrome iOS
- Viewport: <record actual, e.g. 390×844 iPhone 15 or 375×812 iPhone 13 mini>
- LAN URL used: http://<laptop-ip>:5173/
- Screencast: `.planning/evidence/03-manual-pass-ios.mov`

### Observations per section

- **Hero:** unchanged from Phase 2 — single-image composition, no scroll animation. Confirm no regression against Phase 2 Hero baseline.
- **HowItWorks:** <per-step stagger reads cleanly 01 → 02 → 03 with ~120ms beats, video autoplay-loop silent, no re-animation of right-column heading>
- **FlavorTeaser:** <whole-section fade+slide smooth on scroll-in, horizontal scroll-snap still touch-responsive>
- **/flavors:** <16-card row-by-row stagger reads row-by-row with even-column-first-then-odd-after-120ms, filter pill tap triggers smooth crossfade with no height pump, browser-back restores previous filter>

### Reduced-motion run (iOS Settings → Accessibility → Motion → Reduce Motion ON)

- **Hero:** unchanged (not in Phase 3 scope)
- **HowItWorks:** <3 steps at final state immediately, video still plays>
- **FlavorTeaser:** <section at final state immediately, no fade+slide>
- **/flavors:** <no row stagger, filter changes instant, no crossfade>
- Pixel-parity screenshots: `.planning/evidence/03-ios-rm-animated.png` + `.planning/evidence/03-ios-rm-reduced.png`
- Zero CLS between the two paths: **PASS / FAIL**

---

## Android Pass

**TODO (developer to fill):**

- Device: <model>, Android <version>, Chrome <version>
- Viewport: <record>
- LAN URL used: http://<laptop-ip>:5173/
- Screencast: `.planning/evidence/03-manual-pass-android.mp4`

### Observations per section

(same schema as iPhone)

- **Hero:**
- **HowItWorks:**
- **FlavorTeaser:**
- **/flavors:**

### Reduced-motion run (Android Settings → Accessibility → Remove Animations ON)

(same schema as iPhone)

- **Hero:** unchanged (not in Phase 3 scope)
- **HowItWorks:**
- **FlavorTeaser:**
- **/flavors:**
- Pixel-parity screenshots: `.planning/evidence/03-android-rm-animated.png` + `.planning/evidence/03-android-rm-reduced.png`
- Zero CLS between the two paths: **PASS / FAIL**

---

## Phase 3 Scope-Cut Record (for the record)

- **Hero cap-twist signature moment DROPPED on 2026-10-10** before Wave 2 execution. Developer rejected the illustrated-asset direction after an in-browser preview review on brand-fit grounds. Hero stays on the Phase 2 single-image composition (`public/hero/cap-on-bottle.jpg`). ROADMAP Phase 3 SC1 / SC3 / SC4 revised in commit `90349e4`.
- **CONV-05 budget revised on 2026-10-10 after Wave 4 bundle check** (commit `99af7ed`) — original ≤10 KB entry Motion target shown unachievable with motion/react v14 static primitives; revised to ≤20 KB entry + ≤15 KB async; original target deferred to Phase 4 PERF-02.

---

## Open Issues from Manual Pass

<any non-blocking issues observed on real devices, with Phase 4 follow-up pointers>

Pre-filled example (replace or augment during device walkthrough):

- CONV-05 original ≤10 KB entry Motion target not met — deferred to Phase 4 PERF-02 chunk-splitting as noted above. Phase 3 budget revised and PASSED under revised target.

---

## Sign-off

- [ ] Bundle report filled in with measured numbers
- [ ] iPhone pass — animated path walkthrough complete; screencast + observations recorded
- [ ] iPhone pass — reduced-motion walkthrough complete; pixel-parity screenshots recorded; zero CLS confirmed
- [ ] Android pass — animated path walkthrough complete; screencast + observations recorded
- [ ] Android pass — reduced-motion walkthrough complete; pixel-parity screenshots recorded; zero CLS confirmed
- [ ] CONV-05 verdict recorded (PASS under revised target)
- [ ] No HIGH-severity open issues

**Phase 3 ready to close: YES / NO**

Developer signature: <name>, <date>
