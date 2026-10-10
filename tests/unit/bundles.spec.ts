import { describe, it, expect } from 'vitest';
import { bundles } from '@/data/bundles';

/**
 * Phase 3.1 Plan 01 — Shopify-shaped bundles stub (D3.1-03 locks).
 *
 * 3 bundles in the Trial / Fitness / Bulk tier order. Phase 6 field
 * (`shopifyProductId`) is null until Shopify goes live. Prices are
 * locked placeholder values (120 / 349 / 600) with every bundle
 * carrying `pricingNote: 'pending client final approval before Phase 6'`.
 *
 * Pattern cloned verbatim from tests/unit/flavors.spec.ts shape-invariants.
 */

describe('bundles — Shopify-shaped stub + D3.1-03 locks', () => {
  it('contains exactly 3 bundles', () => {
    expect(bundles.length).toBe(3);
  });

  it('every bundle has shopifyProductId: null (populated in Phase 6)', () => {
    for (const b of bundles) {
      expect(b.shopifyProductId).toBeNull();
    }
  });

  it('every bundle carries the "pending client final approval before Phase 6" pricingNote (D3.1-03)', () => {
    for (const b of bundles) {
      expect(b.pricingNote).toBe('pending client final approval before Phase 6');
    }
  });

  it('prices are locked at D3.1-03 values (Trial 120 / Fitness 349 / Bulk 600)', () => {
    const byTier = Object.fromEntries(bundles.map((b) => [b.tier, b]));
    expect(byTier.trial.priceInr).toBe(120);
    expect(byTier.fitness.priceInr).toBe(349);
    expect(byTier.bulk.priceInr).toBe(600);
  });

  it('Fitness bundle is the ONLY one with "Best Value / Most Popular" badge', () => {
    const withBadge = bundles.filter((b) => b.badge !== null);
    expect(withBadge.length).toBe(1);
    expect(withBadge[0].tier).toBe('fitness');
    expect(withBadge[0].badge).toBe('Best Value / Most Popular');
  });

  it('Fitness bundle includes "1 Free Smart Shaker Bottle"', () => {
    const fitness = bundles.find((b) => b.tier === 'fitness');
    expect(fitness).toBeDefined();
    expect(fitness!.includes).toContain('1 Free Smart Shaker Bottle');
  });

  it('no bundle description/audience/title contains the forbidden stimulant-beverage phrase (defense-in-depth for CI grep)', () => {
    const re = /energy\s+drink/i;
    const bad = bundles.filter(
      (b) => re.test(b.description) || re.test(b.audience) || re.test(b.title),
    );
    expect(bad).toEqual([]);
  });
});
