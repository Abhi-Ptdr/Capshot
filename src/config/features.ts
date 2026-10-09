/**
 * Phase 1 Plan 02 — Feature flags (INFRA-05).
 *
 * Both flags default to `false` in Phase 1 and flip to `true` in Phase 6
 * when Shopify + Razorpay + Shiprocket wire up. Treat these as the ONLY
 * on/off switches that gate commerce surface — downstream components
 * (Bundles section, Shop Now CTAs) short-circuit when the relevant flag
 * is `false`.
 */

export const features = {
  ENABLE_BUNDLES: false,
  ENABLE_SHOPIFY_CTAS: false,
} as const;

export const ENABLE_BUNDLES = features.ENABLE_BUNDLES;
export const ENABLE_SHOPIFY_CTAS = features.ENABLE_SHOPIFY_CTAS;
