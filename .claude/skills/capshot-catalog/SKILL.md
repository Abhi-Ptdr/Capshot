---
name: capshot-catalog
description: Authoritative source of truth for the SHI-28 CAPSHOT product catalog — all 16 flavors across 3 ranges (Fruity Blast, Desi & Cool, Premium Sports), per-flavor accent colors, bottle size variants, powder weights, and the canonical Shopify-shaped TypeScript data model used across the site. Load this skill when creating or editing flavor data, flavor cards, flavor grids, flavor pages, product variants, color-coded accents, or any component that renders CAPSHOT product information. Trigger on tasks mentioning flavors, catalog, variants, product cards, product data, Shopify migration, or flavor filtering.
---

# CAPSHOT Catalog

**Scope:** 16 flavors across 3 ranges. Two bottle-size variants per flavor. Shopify-shaped data model that migrates with zero refactor when Phase 6 commerce lands.

## Flavor count & ranges

16 flavors total. The split is:

| Range | Count | Flavors |
|---|---|---|
| **Fruity Blast** | 9 | Orange, Mixed Berry, Mango, Pineapple, Watermelon, Guava, Pomegranate, Strawberry, Apple |
| **Desi & Cool** | 3 | Citrus Mint, Jaljeera, ORS (Electrolyte) |
| **Premium Sports** | 4 | Japanese Matcha, Black Pump, Java Pump, Coffee |

**Coffee is #16 and is intentional** — do NOT drop it as a typo. The original spec listed 15 then added coffee below; the client confirmed 16.

## Bottle size variants

Every flavor ships as a single cap SKU. The cap works on any 28mm bottle. Powder dosage guidance:

| Bottle size | Powder dose | Intensity label |
|---|---|---|
| 200–250 ml | 3–4 g | **Light & Refreshing** |
| 350–500 ml | 7–8 g | **Strong & Punchy** |

These are usage guidelines, not separate SKUs. In the Shopify model (Phase 6) they'll be bundle options, not product variants.

## Per-flavor accent colors (suggested — client can override)

Each flavor gets ONE accent hex used for card background wash, hover state, and selected-filter chip. All accents are tuned to coexist with the warm brand palette.

### Fruity Blast
| # | Flavor | Handle | Accent | Note |
|---|---|---|---|---|
| 1 | Orange | `orange` | `#F57C1F` | citrus pop |
| 2 | Mixed Berry | `mixed-berry` | `#6E3482` | deep berry |
| 3 | Mango | `mango` | `#F9B233` | ripe mango |
| 4 | Pineapple | `pineapple` | `#F7CA18` | sunny yellow |
| 5 | Watermelon | `watermelon` | `#E63950` | melon pink-red |
| 6 | Guava | `guava` | `#F297B1` | soft guava pink |
| 7 | Pomegranate | `pomegranate` | `#B4213B` | pomegranate red |
| 8 | Strawberry | `strawberry` | `#E85A75` | strawberry pink |
| 9 | Apple | `apple` | `#8FC13E` | green apple |

### Desi & Cool
| # | Flavor | Handle | Accent | Note |
|---|---|---|---|---|
| 10 | Citrus Mint | `citrus-mint` | `#7ED6A5` | mint green |
| 11 | Jaljeera | `jaljeera` | `#7A5A36` | earthy brown |
| 12 | ORS (Electrolyte) | `ors-electrolyte` | `#4FA3D1` | hydration blue |

### Premium Sports
| # | Flavor | Handle | Accent | Note |
|---|---|---|---|---|
| 13 | Japanese Matcha | `japanese-matcha` | `#5B8A3A` | matcha green |
| 14 | Black Pump | `black-pump` | `#1A1A1A` | industrial black |
| 15 | Java Pump | `java-pump` | `#3E2817` | dark coffee |
| 16 | Coffee | `coffee` | `#6B4423` | mid coffee brown |

**If the client provides official per-flavor colors, replace these.** These are design-informed defaults based on the brand palette and flavor identity.

## Canonical TypeScript data model

Shape flavor data to mirror Shopify's product schema so Phase 6 migration = swap data source, keep components.

```ts
// src/data/flavors.ts
export type FlavorRange = 'fruity-blast' | 'desi-cool' | 'premium-sports';

export type Flavor = {
  // Shopify-aligned fields
  handle: string;              // kebab-case, URL slug, matches Shopify product handle
  title: string;               // display name, e.g. "Mixed Berry"
  description: string;         // short tagline (<140 chars)
  images: {
    cap: string;               // product cap shot (transparent bg preferred)
    lifestyle?: string;        // optional lifestyle shot
  };

  // CAPSHOT-specific fields
  range: FlavorRange;
  accentHex: string;           // card wash + hover tint
  dosage: {
    light: string;             // "3–4 g for 200–250 ml bottle"
    strong: string;            // "7–8 g for 350–500 ml bottle"
  };

  // Phase 6 placeholders (populated when Shopify goes live)
  shopifyProductId?: string;
  priceInr?: number;           // single-cap MRP, populated at Phase 6
  available?: boolean;
};

export type FlavorRangeMeta = {
  id: FlavorRange;
  label: string;               // "Fruity Blast"
  tagline: string;             // short section intro
  flavors: Flavor[];
};
```

## Component usage rules

- **Flavor cards** must use `accentHex` for the color wash — do NOT recolor the SHI-28 logo or cap illustration.
- **Range filters** on `/flavors` page: pills labeled "All • Fruity Blast • Desi & Cool • Premium Sports" (in that order).
- **Flavor order within range:** keep the order listed in the tables above (matches the client's spec sheet).
- **Images:** flavor cap shots live in `/public/flavors/<handle>.png` (to be created in Phase 3). Until then, use color-washed placeholders generated from `accentHex`.

## Phase 6 migration path

When Shopify goes live:
1. Create one Shopify product per flavor (handle = our `handle`).
2. Populate `shopifyProductId` and `priceInr` in `flavors.ts`.
3. Bundle SKUs (Trial 5 / Fitness 15 + shaker / Bulk 30) become separate Shopify products — load them via a sibling `src/data/bundles.ts` with the same shape.
4. CTAs swap from WhatsApp → Shopify product URLs in `src/config/cta.ts` (see `capshot-brand` skill).
5. No component changes required.

## Related skills

- `capshot-brand` — brand palette, logo usage, CTA centralization.
- `capshot-commerce-rollout` — the actual Phase 6 Shopify setup walkthrough.
