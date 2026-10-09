import { describe, it, expect } from 'vitest';
import { flavors } from '@/data/flavors';

/**
 * Phase 1 Plan 02 — Shopify-shaped flavors stub (INFRA-04).
 *
 * 16 flavors in capshot-catalog SKILL order. Phase 6 fields (priceInr,
 * shopifyProductId, available) are nullable until Shopify goes live.
 */

const FRUITY_BLAST_HANDLES = [
  'orange',
  'mixed-berry',
  'mango',
  'pineapple',
  'watermelon',
  'guava',
  'pomegranate',
  'strawberry',
  'apple',
];

const DESI_COOL_HANDLES = ['citrus-mint', 'jaljeera', 'ors-electrolyte'];

const PREMIUM_SPORTS_HANDLES = [
  'japanese-matcha',
  'black-pump',
  'java-pump',
  'coffee',
];

describe('flavors — Shopify-shaped stub (INFRA-04)', () => {
  it('contains exactly 16 flavors (capshot-catalog SKILL §Flavor count)', () => {
    expect(flavors.length).toBe(16);
  });

  it('every flavor has Phase 6 fields set to null', () => {
    for (const f of flavors) {
      expect(f.priceInr).toBeNull();
      expect(f.shopifyProductId).toBeNull();
      expect(f.available).toBeNull();
    }
  });

  it('the 9 fruity-blast handles appear in capshot-catalog SKILL order', () => {
    const got = flavors.filter((f) => f.range === 'fruity-blast').map((f) => f.handle);
    expect(got).toEqual(FRUITY_BLAST_HANDLES);
  });

  it('the 3 desi-cool handles appear in capshot-catalog SKILL order', () => {
    const got = flavors.filter((f) => f.range === 'desi-cool').map((f) => f.handle);
    expect(got).toEqual(DESI_COOL_HANDLES);
  });

  it('the 4 premium-sports handles appear in capshot-catalog SKILL order', () => {
    const got = flavors
      .filter((f) => f.range === 'premium-sports')
      .map((f) => f.handle);
    expect(got).toEqual(PREMIUM_SPORTS_HANDLES);
  });

  it('every flavor carries a non-empty description, title, and accentHex', () => {
    for (const f of flavors) {
      expect(f.description.length).toBeGreaterThan(0);
      expect(f.description.length).toBeLessThanOrEqual(140);
      expect(f.title.length).toBeGreaterThan(0);
      expect(f.accentHex).toMatch(/^#[0-9A-Fa-f]{6}$/);
    }
  });

  it('every flavor carries the canonical two-dosage strings', () => {
    for (const f of flavors) {
      expect(f.dosage.light).toBe('3–4 g for 200–250 ml bottle');
      expect(f.dosage.strong).toBe('7–8 g for 350–500 ml bottle');
    }
  });

  it('every flavor images.cap path matches /flavors/<handle>.png', () => {
    for (const f of flavors) {
      expect(f.images.cap).toBe(`/flavors/${f.handle}.png`);
    }
  });
});
