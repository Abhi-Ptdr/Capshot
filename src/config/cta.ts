/**
 * Phase 1 Plan 02 — Centralized CTA destinations (INFRA-03).
 *
 * THE Phase 6 swap point. The "3 files edited, 2 added, 1 un-gated" Phase 6
 * invariant depends on this file: when Shopify goes live, we edit the
 * `href` of `primary` (and later `bundles.*`) here — no component source
 * change required.
 *
 * Rules:
 *  - CI grep blocks `wa.me` references anywhere in `src/` outside this file
 *    (added in Plan 03). This is the ONE legal site of the destination
 *    string.
 *  - `href` string is a static literal — never concatenated with runtime
 *    input. Mitigation for T-02-01 (URL-injection via query params).
 *  - WhatsApp message bodies MUST URL-encode `!` as `%21` per the wa.me
 *    URL spec (CONTEXT D-09).
 *
 * Locked values (CONTEXT):
 *  - D-07: label `TRY CAPSHOT` (phase-invariant)
 *  - D-08: pre-filled message `Hi! Add me to the CAPSHOT waitlist.`
 *  - D-09: WhatsApp Business number `+91 9203975762`
 *
 * Supersedes any older label / message / number in
 * `.claude/skills/capshot-brand/SKILL.md` (that skill shows
 * "Join the Waitlist" / "Notify Me on WhatsApp" — not used in Phase 1).
 */

export type CtaKind = 'whatsapp' | 'shopify' | 'external';

export type CtaDestination = {
  label: string;
  href: string;
  kind: CtaKind;
  ariaLabel?: string;
  trackingId?: string;
};

export const ctaConfig = {
  primary: {
    label: 'TRY CAPSHOT',
    href: 'https://wa.me/919203975762?text=Hi%21%20Add%20me%20to%20the%20CAPSHOT%20waitlist.',
    kind: 'whatsapp' as const,
    ariaLabel: 'Try CAPSHOT — join the waitlist on WhatsApp',
    trackingId: 'cta_primary_whatsapp',
  },
  secondary: {
    label: 'SEE FLAVORS',
    href: '/flavors',
    kind: 'external' as const,
    trackingId: 'cta_secondary_flavors',
  },
  nav: {
    label: 'NOTIFY ME',
    href: 'https://wa.me/919203975762?text=Hi%21%20Notify%20me%20when%20CAPSHOT%20launches.',
    kind: 'whatsapp' as const,
    trackingId: 'cta_nav_notify',
  },
  bundles: {
    trial: '',
    fitness: '',
    bulk: '',
  },
} satisfies {
  primary: CtaDestination;
  secondary: CtaDestination;
  nav: CtaDestination;
  bundles: Record<'trial' | 'fitness' | 'bulk', string>;
};

export const getCta = (slot: 'primary' | 'secondary' | 'nav'): CtaDestination =>
  ctaConfig[slot];
