/**
 * Phase 1 Plan 02 — Shopify-aligned flavor data model (INFRA-04).
 *
 * Mirrors `.claude/skills/capshot-catalog/SKILL.md §Canonical TypeScript
 * data model`. Phase 6 fields (`shopifyProductId`, `priceInr`, `available`)
 * are declared nullable so Plan 02's stub satisfies the type without
 * reserved values. When Shopify goes live, Plan 6 populates these fields
 * — no shape change required.
 */

export type FlavorRange = 'fruity-blast' | 'desi-cool' | 'premium-sports';

/**
 * Phase 3.1 Plan 01 — Bundle tier handle union (D3.1-03 locks).
 *
 * Mirrors the FlavorRange string-literal union convention. Single source of
 * truth for the three bundle handles. `bulk-energy-pack` is intentionally
 * NOT a stimulant-beverage phrase (CI grep regex is `/energy\s+drink/i`,
 * not `/energy/i` — "energy pack" is permitted per RESEARCH §Pitfall 1).
 */
export type BundleTier = 'trial-pack' | 'fitness-pack' | 'bulk-energy-pack';

export type Flavor = {
  // Shopify-aligned fields
  handle: string; // kebab-case, URL slug, matches Shopify product handle
  title: string; // display name, e.g. "Mixed Berry"
  description: string; // short tagline (<140 chars)
  images: {
    cap: string; // product cap shot (transparent bg preferred)
    lifestyle?: string; // optional lifestyle shot
  };

  // CAPSHOT-specific fields
  range: FlavorRange;
  accentHex: string; // card wash + hover tint
  dosage: {
    light: string; // "3–4 g for 200–250 ml bottle"
    strong: string; // "7–8 g for 350–500 ml bottle"
  };

  // Phase 6 placeholders — null in Phase 1, populated when Shopify goes live
  shopifyProductId: string | null;
  priceInr: number | null; // single-cap MRP
  available: boolean | null;
};

export type FlavorRangeMeta = {
  id: FlavorRange;
  label: string; // "Fruity Blast"
  tagline: string; // short section intro
  flavors: Flavor[];
};
