/**
 * Phase 1 Plan 02 — site metadata (SEO + social surfaces).
 *
 * Hardcoded homepage OG tags in `index.html` reference these values today;
 * Phase 5 switches per-route metadata to `@unhead/react` and reads from
 * this config without changing the shape.
 */

export const siteConfig = {
  name: 'CAPSHOT',
  url: 'https://capshot.co',
  description:
    'Pre-filled flavor caps for any bottle. Twist, shake, boom — drink ready.',
  ogImage: '/og/home.jpg',
  social: {
    instagram: '@capshot_twist',
    whatsapp: '+91 9203975762',
    email: 'shi28.capshot@gmail.com',
  },
} as const;
