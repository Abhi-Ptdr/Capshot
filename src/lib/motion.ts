/**
 * Phase 1 Plan 02 — Centralized Motion re-export (CONV-05 static half).
 *
 * This is ONE of three files in `src/` allowed to import from `motion/react`:
 *   - `src/lib/motion.ts` (this file) — static primitives: m, LazyMotion, AnimatePresence
 *   - `src/lib/useReducedMotion.ts` (Phase 3 Plan 01) — reduced-motion hook
 *   - `src/lib/motion-features.ts` (Phase 3 Plan 03) — async-only domAnimation
 *
 * Every section/component imports `m`, `LazyMotion`, `AnimatePresence`
 * from `@/lib/motion` — never `motion.div` directly.
 *
 * **`domAnimation` is INTENTIONALLY NOT re-exported here.** It lives in
 * `src/lib/motion-features.ts` so `src/App.tsx` can dynamically import
 * it and have Rollup code-split it into an async chunk fetched after
 * first paint:
 *   `<LazyMotion features={() => import('@/lib/motion-features').then(m => m.domAnimation)} strict>`
 *
 * Phase 3 Plan 03 Wave 4 bundle check caught the original static import
 * costing ~24 KB extra gzip at entry (CONV-05 trip). Keeping
 * `domAnimation` out of this file's re-export is the structural guard —
 * TypeScript will error at any attempt to statically import it from here.
 *
 * Phase 1 Plan 03's CI grep blocks any `motion.(div|a|button|span|...)`
 * reference outside this file.
 *
 * The LazyMotion provider is MOUNTED in `src/App.tsx` around `<Routes>`
 * so downstream phases can drop `<m.div>` primitives in without
 * refactoring App.tsx (CONV-05 provider contract closed in Phase 1).
 * `strict={true}` on the provider enforces that only lazy `m.*` primitives
 * are used (never the eager `motion.*`), catching stray eager usage at
 * runtime in dev.
 */

export { LazyMotion, m, AnimatePresence } from 'motion/react';
