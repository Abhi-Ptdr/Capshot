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
 * Phase 3.1 Plan 01 extension (D3.1-06), updated by Phase 3.1 code review WR-01:
 *  - `ctaConfig.bundles.{trial,fitness,bulk}` populated with WhatsApp URLs
 *    that ride-along a per-tier message body so the WhatsApp Business
 *    inbox can bucket inbound leads by bundle tier via the inbound
 *    conversation text (the ONLY wa.me parameter actually propagated into
 *    the WhatsApp client is `text` — all other query params are stripped
 *    before the message is composed). Tier attribution ALSO happens via
 *    the click-side `data-cta={cta.trackingId}` instrumentation.
 *  - `getCta` signature extended to accept dotted-string slots
 *    (`'bundles.trial' | 'bundles.fitness' | 'bundles.bulk'`). On bundle
 *    slots it SYNTHESIZES a `CtaDestination` object with the phase-invariant
 *    label `'Join waitlist for early access'` (D3.1-06).
 *  - Phase 6 flips each bundle href to a Shopify checkout URL. No shape
 *    change in `CtaSlot` or `getCta`; the component surface is sealed.
 */

// WR-03: added `'route'` for internal React Router SPA destinations.
// `'external'` is reserved for third-party URLs that should open in a
// new tab (`target="_blank"`); mixing an internal `/flavors` route under
// `'external'` would break SPA navigation the moment a consumer branches
// on `kind` to decide tab behavior.
export type CtaKind = 'whatsapp' | 'shopify' | 'external' | 'route';

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
  | 'bundles.bulk'
  | 'about-waitlist'; // Phase 3.2 D3.2-14

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
    // WR-03: `/flavors` is an internal React Router route — `kind: 'route'`
    // marks it for SPA navigation. Was mislabeled `'external'` which would
    // have broken client-side routing if any consumer branched on kind.
    kind: 'route' as const,
    trackingId: 'cta_secondary_flavors',
  },
  nav: {
    label: 'NOTIFY ME',
    href: 'https://wa.me/919203975762?text=Hi%21%20Notify%20me%20when%20CAPSHOT%20launches.',
    kind: 'whatsapp' as const,
    trackingId: 'cta_nav_notify',
  },
  bundles: {
    // WR-01: tier attribution is encoded in the `text` body (the only wa.me
    // param propagated to the WhatsApp client), NOT a dropped `&tier=` query.
    // The literal `Interested in: trial|fitness|bulk` appears in the inbound
    // message so the Business inbox can bucket leads.
    trial:
      'https://wa.me/919203975762?text=Hi%21%20Add%20me%20to%20the%20CAPSHOT%20waitlist.%20Interested%20in%3A%20trial',
    fitness:
      'https://wa.me/919203975762?text=Hi%21%20Add%20me%20to%20the%20CAPSHOT%20waitlist.%20Interested%20in%3A%20fitness',
    bulk:
      'https://wa.me/919203975762?text=Hi%21%20Add%20me%20to%20the%20CAPSHOT%20waitlist.%20Interested%20in%3A%20bulk',
  },
  // D3.2-14: label "JOIN WAITLIST" chosen over "BE THE FIRST TO KNOW" —
  // shorter string, matches S5 waitlist card design mock. Body-text
  // ride-along "Interested in: about-waitlist" bucketizes About-page leads
  // in the WhatsApp Business inbox (same WR-01 convention as bundles.*).
  aboutWaitlist: {
    label: 'JOIN WAITLIST',
    href: 'https://wa.me/919203975762?text=Hi%21%20Add%20me%20to%20the%20CAPSHOT%20waitlist.%20Interested%20in%3A%20about-waitlist',
    kind: 'whatsapp' as const,
    ariaLabel: 'Join the CAPSHOT waitlist on WhatsApp',
    trackingId: 'cta_about_waitlist_whatsapp',
  },
} satisfies {
  primary: CtaDestination;
  secondary: CtaDestination;
  nav: CtaDestination;
  bundles: Record<'trial' | 'fitness' | 'bulk', string>;
  aboutWaitlist: CtaDestination;
};

export function getCta(slot: CtaSlot): CtaDestination {
  // Explicit equality branching on each literal keeps TypeScript narrowing
  // honest — no `as` cast, no silent `undefined` fallthrough. If a future
  // CtaSlot literal is added, the `never`-typed exhaustiveness check at
  // the bottom becomes a compile error until this switch is updated
  // (CR-01 / Phase 3.1 code-review hardening).
  switch (slot) {
    case 'primary':
      return ctaConfig.primary;
    case 'secondary':
      return ctaConfig.secondary;
    case 'nav':
      return ctaConfig.nav;
    case 'bundles.trial':
    case 'bundles.fitness':
    case 'bundles.bulk': {
      const key = slot.slice('bundles.'.length) as 'trial' | 'fitness' | 'bulk';
      return {
        label: 'Join waitlist for early access',
        href: ctaConfig.bundles[key],
        kind: 'whatsapp' as const,
        ariaLabel: `Join the CAPSHOT ${key} pack waitlist on WhatsApp`,
        trackingId: `cta_bundle_${key}_whatsapp`,
      };
    }
    case 'about-waitlist':
      return ctaConfig.aboutWaitlist;
    default: {
      // Exhaustiveness check — if a new CtaSlot literal is added without a
      // case branch above, TypeScript will error here because `slot` is no
      // longer `never`. The runtime throw is a defense-in-depth signal in
      // case a stray `string` reaches this function at the type boundary
      // (e.g., CMS data in a future phase).
      const _exhaustive: never = slot;
      throw new Error(`getCta: unknown slot "${_exhaustive as string}"`);
    }
  }
}
