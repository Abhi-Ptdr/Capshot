import type { BundleTier } from './types';

/**
 * Phase 3.1 Plan 01 — Shopify-shaped 3-bundle stub (D3.1-03 locks).
 *
 * Source of truth: `.planning/phases/03.1-content-conversion-usp-bundles-trust/
 * 03.1-RESEARCH.md §Pattern 5` and `03.1-CONTEXT.md D3.1-03`.
 *
 * Mirrors the Shopify-aligned pattern of `src/data/flavors.ts` (INFRA-04).
 * Phase 6 field (`shopifyProductId`) is null until Shopify goes live; the
 * three bundles here are the SAME product slots Phase 6 populates with
 * live Shopify product IDs — no shape change required.
 *
 * Price lock (D3.1-03): Trial ₹120 / Fitness ₹349 / Bulk ₹600. Every bundle
 * carries `pricingNote: 'pending client final approval before Phase 6'` so
 * the display layer can surface the note consistently.
 *
 * `handle: 'bulk-energy-pack'` is SAFE for the CI grep gate — the regex is
 * `/energy\s+drink/i`, which does NOT match "energy pack". No bundle text
 * (description/audience/title) contains the forbidden stimulant-beverage
 * phrase; unit test `bundles.spec.ts` locks this invariant.
 */

export type Bundle = {
  // Shopify-aligned fields (clone of Flavor convention)
  handle: BundleTier;
  tier: 'trial' | 'fitness' | 'bulk'; // key into ctaConfig.bundles
  title: string;
  description: string;
  shopifyProductId: string | null; // populated in Phase 6

  // CAPSHOT-specific fields
  priceInr: number; // D3.1-03 locked (differs from Flavor.priceInr which is nullable)
  caps: 5 | 15 | 30;
  includes: string[];
  audience: string;
  badge: 'Best Value / Most Popular' | null; // Fitness only
  pricingNote: string;
};

export const bundles: Bundle[] = [
  {
    handle: 'trial-pack',
    tier: 'trial',
    title: 'Trial Pack',
    description: 'Try 5 flavors, see what sticks.',
    shopifyProductId: null,
    priceInr: 120,
    caps: 5,
    includes: ['5 caps'],
    audience: 'Ideal for first-time buyers',
    badge: null,
    pricingNote: 'pending client final approval before Phase 6',
  },
  {
    handle: 'fitness-pack',
    tier: 'fitness',
    title: 'Fitness Pack',
    description: '15 caps + a Smart Shaker Bottle, for daily hydration.',
    shopifyProductId: null,
    priceInr: 349,
    caps: 15,
    includes: ['15 caps', '1 Free Smart Shaker Bottle'],
    audience: 'For regulars and gym-goers',
    badge: 'Best Value / Most Popular',
    pricingNote: 'pending client final approval before Phase 6',
  },
  {
    handle: 'bulk-energy-pack',
    tier: 'bulk',
    title: 'Bulk Energy Pack',
    description: '30 caps for serious hydration habits.',
    shopifyProductId: null,
    priceInr: 600,
    caps: 30,
    includes: ['30 caps'],
    audience: 'For heavy gym-goers and athletes',
    badge: null,
    pricingNote: 'pending client final approval before Phase 6',
  },
];
