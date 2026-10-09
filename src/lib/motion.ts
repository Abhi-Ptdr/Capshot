/**
 * Phase 1 Plan 02 — Centralized Motion re-export (CONV-05).
 *
 * This is the ONLY file in `src/` allowed to import from `motion/react`.
 * Every section/component imports `m`, `LazyMotion`, `domAnimation` from
 * `@/lib/motion` — never `motion.div` directly. This keeps the entry
 * bundle Motion footprint under ~10 KB gzip because LazyMotion defers
 * the DOM features chunk until it's needed.
 *
 * Plan 03's CI grep blocks any `motion.(div|a|button|span|...)` reference
 * outside this file.
 *
 * The LazyMotion provider is MOUNTED in `src/App.tsx` around `<Routes>`
 * so downstream phases can drop `<m.div>` primitives in without
 * refactoring App.tsx (CONV-05 provider contract closed in Phase 1).
 */

export { LazyMotion, m, domAnimation, AnimatePresence } from 'motion/react';
