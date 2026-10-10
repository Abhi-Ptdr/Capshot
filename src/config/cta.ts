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
 *
 * Phase 3.1 Plan 01 extension (D3.1-06):
 *  - `ctaConfig.bundles.{trial,fitness,bulk}` populated with WhatsApp URLs
 *    that ride-along the SAME pre-fill message as `primary` but add a
 *    `&tier=` attribution query so the WhatsApp Business inbox can bucket
 *    inbound leads by bundle tier.
 *  - CRITICAL: the `&tier=` prefix uses `&`, NOT a second `?`. The URL
 *    already has `?text=...`; a second `?` would make the URL malformed.
 *  - `getCta` signature extended to accept dotted-string slots
 *    (`'bundles.trial' | 'bundles.fitness' | 'bundles.bulk'`). On bundle
 *    slots it SYNTHESIZES a `CtaDestination` object with the phase-invariant
 *    label `'Join waitlist for early access'` (D3.1-06).
 *  - Phase 6 flips each bundle href to a Shopify checkout URL. No shape
 *    change in `CtaSlot` or `getCta`; the component surface is sealed.
 */

export type CtaKind = 'whatsapp' | 'shopify' | 'external';

export type CtaDestination = {
  label: string;
  href: string;
  kind: CtaKind;
  ariaLabel?: string;
  trackingId?: string;
};

export type CtaSlot =
  | 'primary'
  | 'secondary'
  | 'nav'
  | 'bundles.trial'
  | 'bundles.fitness'
  | 'bundles.bulk';

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
    trial:
      'https://wa.me/919203975762?text=Hi%21%20Add%20me%20to%20the%20CAPSHOT%20waitlist.&tier=trial',
    fitness:
      'https://wa.me/919203975762?text=Hi%21%20Add%20me%20to%20the%20CAPSHOT%20waitlist.&tier=fitness',
    bulk:
      'https://wa.me/919203975762?text=Hi%21%20Add%20me%20to%20the%20CAPSHOT%20waitlist.&tier=bulk',
  },
} satisfies {
  primary: CtaDestination;
  secondary: CtaDestination;
  nav: CtaDestination;
  bundles: Record<'trial' | 'fitness' | 'bulk', string>;
};

export function getCta(slot: CtaSlot): CtaDestination {
  if (slot.startsWith('bundles.')) {
    const key = slot.split('.')[1] as 'trial' | 'fitness' | 'bulk';
    return {
      label: 'Join waitlist for early access',
      href: ctaConfig.bundles[key],
      kind: 'whatsapp' as const,
      ariaLabel: `Join the CAPSHOT ${key} pack waitlist on WhatsApp`,
      trackingId: `cta_bundle_${key}_whatsapp`,
    };
  }
  return ctaConfig[slot as 'primary' | 'secondary' | 'nav'];
}
