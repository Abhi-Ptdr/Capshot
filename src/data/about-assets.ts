/**
 * Phase 3.2 — Asset indirection module for the /about page (D3.2-12).
 *
 * Section JSX reads only from here; raster swaps (e.g. GATE-ASSET-RELABEL
 * per D3.2-13 — hero + boom rasters currently show SHI-Z8 instead of
 * SHI-28; client re-render pending) are a single-file edit.
 *
 * Pattern mirrors `src/data/flavors.ts` and `src/data/bundles.ts`:
 * typed exported constants with co-located alt text. Asset paths are
 * public-folder strings served by Vite static (same mechanism as
 * `src/sections/Hero.tsx` → `/hero/cap-on-bottle.jpg`).
 */

export type AboutAsset = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type AboutFounder = {
  name: string;
  caption: string;
  photo: string;
  alt: string;
};

export const aboutHero: AboutAsset = {
  src: '/about/about-section1-hero.png',
  alt: "A hand twisting a mint CAPSHOT cap onto a water bottle, with 'Twist Shake Boom' annotation.",
  width: 1200,
  height: 900,
};

export const aboutCollage: AboutAsset = {
  src: '/about/customer-problem-collage.png',
  alt: 'A four-photo collage illustrating the daily hydration hassle.',
  width: 1200,
  height: 800,
};

export const aboutTwist: AboutAsset = {
  src: '/about/step-twist.png',
  alt: 'Step 1 — twist the CAPSHOT cap onto a standard water bottle.',
  width: 800,
  height: 800,
};

export const aboutShake: AboutAsset = {
  src: '/about/step-shake.png',
  alt: 'Step 2 — shake the bottle to mix the flavor powder with water.',
  width: 800,
  height: 800,
};

export const aboutBoom: AboutAsset = {
  src: '/about/step-boom.png',
  alt: 'Step 3 — enjoy the ready-to-drink flavored water.',
  width: 800,
  height: 800,
};

export const aboutFlavors: AboutAsset = {
  src: '/about/infinite-flavor-variety.png',
  alt: 'Six CAPSHOT caps in different flavor colors.',
  width: 1000,
  height: 700,
};

export const aboutPlayWithFlavor: AboutAsset = {
  src: '/about/play-with-flavor.png',
  alt: 'Two bottles of CAPSHOT-flavored water side by side.',
  width: 1000,
  height: 700,
};

export const aboutPortability: AboutAsset = {
  src: '/about/portability.png',
  alt: 'A hand holding a CAPSHOT cap outdoors on a hike.',
  width: 1000,
  height: 700,
};

export const aboutConvenience: AboutAsset = {
  src: '/about/convenience.png',
  alt: 'A sepia-toned illustration of a hand picking a CAPSHOT cap.',
  width: 1000,
  height: 700,
};

// D3.2-08: S4 card 5 image sourced from Media/CapCloseUp.png as a tasteful
// substitute until the client supplies a dedicated Product Design raster.
export const aboutProductDesign: AboutAsset | null = {
  src: '/about/product-design.png',
  alt: 'A close-up of a CAPSHOT cap showing the product design detail.',
  width: 1000,
  height: 1000,
};

export const aboutFounder: AboutFounder = {
  name: 'Akhilesh Pateliya',
  caption: 'Meet Akhilesh, Founder of CAPSHOT',
  photo: '/about/akhilesh-portrait.png',
  alt: 'Akhilesh Pateliya, founder of CAPSHOT',
};
