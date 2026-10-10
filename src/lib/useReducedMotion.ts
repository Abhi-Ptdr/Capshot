/**
 * Phase 3 Plan 01 — Additive sibling to `src/lib/motion.ts` (CONV-05 contract).
 *
 * The Phase 1 CONV-05 contract requires that ALL `motion/react` imports funnel
 * through `src/lib/*.ts`. `src/lib/motion.ts` already centralizes the
 * `LazyMotion` / `m` / `domAnimation` / `AnimatePresence` re-exports. This file
 * is the ONLY sibling allowed to add another `motion/react` re-export — the
 * `useReducedMotion` hook — so section components can call it without widening
 * the Motion import surface or needing a direct `motion/react` import.
 *
 * ──────────────────────────────────────────────────────────────────────────
 * Behavior
 * ──────────────────────────────────────────────────────────────────────────
 *
 * Motion's `useReducedMotion()` returns `boolean | null`:
 *   - `true`  → user has set `(prefers-reduced-motion: reduce)` at the OS level
 *   - `false` → user has NOT requested reduced motion
 *   - `null`  → first-render frame on cold load, before `matchMedia` has settled
 *               (also the SSR path, though this project is a Vite SPA so SSR
 *                is not a runtime concern — see Phase 3 CONTEXT D3-19)
 *
 * ──────────────────────────────────────────────────────────────────────────
 * null-handling policy (Phase 3 CONTEXT D3-19 — RESEARCH §Pitfall 2)
 * ──────────────────────────────────────────────────────────────────────────
 *
 * Treat `null` as "assume reduced" during the first render to avoid a
 * flash-of-animation on cold load. The canonical consumer pattern for a
 * scroll-linked `useScroll` + `useTransform` branch is:
 *
 *     const shouldReduce = useReducedMotion();        // boolean | null
 *     const isReduced    = shouldReduce !== false;    // null → reduced
 *     if (isReduced) {
 *       return <StaticFallback />;                    // short-circuit
 *     }
 *     // ... useScroll / useTransform wiring below
 *
 * For `whileInView` elements the simpler Tailwind pattern remains preferred
 * — add `motion-reduce:!transform-none motion-reduce:!opacity-100` to the
 * `m.*` element so the fallback is a zero-remount CSS rule rather than a
 * React branch (keeps `AnimatePresence` behavior intact).
 */

export { useReducedMotion } from 'motion/react';
