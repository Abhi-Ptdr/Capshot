/**
 * Phase 3 Plan 03 — Motion features lazy-load surface (CONV-05 async half).
 *
 * This file EXCLUSIVELY exists so `src/App.tsx` can dynamically import
 * `domAnimation` and have Rollup code-split it into its own async chunk.
 * The sibling `src/lib/motion.ts` is statically imported by every section
 * that uses `m.*` / `AnimatePresence` — if `domAnimation` were re-exported
 * there, those static imports would pull it into the entry graph and
 * defeat the lazy load.
 *
 * Usage (ONLY in `src/App.tsx`):
 *
 *   <LazyMotion features={() => import('@/lib/motion-features').then(m => m.domAnimation)} strict>
 *
 * Do NOT statically import from this file ANYWHERE — doing so collapses the
 * lazy load. Phase 3 Plan 03 Wave 4 bundle check verifies the Motion
 * features chunk emits as its own gzip asset in `dist/stats.html`.
 *
 * Together with `src/lib/motion.ts` and `src/lib/useReducedMotion.ts`,
 * this is the third and final file in `src/lib/` allowed to import
 * from `motion/react`.
 */

export { domAnimation } from 'motion/react';
