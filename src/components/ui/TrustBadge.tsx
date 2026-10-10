import { ShieldCheck, Leaf, MapPin, Lock } from 'lucide-react';
import type { ComponentType } from 'react';

/**
 * Phase 1 Plan 02 — TrustBadge DECLARATION (TRUST-02 / Pitfall #2).
 *
 * Phase 3.1 Plan 01 extension (D3.1-08) — adds a `variant: 'visual-only'`
 * arm as a discriminated union. The default (and only Phase 1) arm is
 * `variant: 'linked'`, which preserves the TRUST-01 PROD-throw +
 * `data-pending-fssai` dev-warning contract BYTE-IDENTICAL.
 *
 * Enforcement:
 *  - `label` is a strict union literal (`TrustBadgeLabel`) — attempting
 *    `"FSSAI Approved"` (deprecated FSSAI nomenclature) or `"Vegan"`
 *    without the FSSAI vegan logo is a TypeScript error.
 *  - On the LINKED arm: `evidenceUrl` is mandatory. In production
 *    (`import.meta.env.PROD`), the component throws if it's missing.
 *    In dev, it renders a visible `data-pending-fssai` warning so the
 *    gap is caught before deploy.
 *  - On the VISUAL-ONLY arm: `evidenceUrl` is NOT allowed in the type
 *    (compile error if passed — discriminated-union correctness). The
 *    arm renders a `<span>` only; NO `<a>`, NO PROD throw, NO dev warning.
 *
 * Icon map (D3.1-07a locks): FSSAI → ShieldCheck, Plant-based → Leaf,
 * Made in India → MapPin (Claude's discretion — chose MapPin over Flag
 * because it visually balances better alongside the other three
 * geometric lucide glyphs in the strip; swap to Flag is a one-line
 * change in iconFor() if visual review requests it), Secure Checkout → Lock.
 *
 * Visual spec is a Phase 5 concern (TRUST-01). Phase 3.1 ships the
 * visual-only Phase 3.1 trust-strip render path; Phase 5 migrates each
 * visual-only call site to variant="linked" as FSSAI evidence lands.
 * The visual-only className is BYTE-IDENTICAL to the linked `<a>`
 * className so the Phase 5 swap is a zero-visual-change migration.
 */

export type TrustBadgeLabel =
  | 'FSSAI Licensed'
  | 'Plant-based ingredients'
  | 'Made in India'
  | 'Secure Checkout';

// WR-02: `variant` is REQUIRED on both arms of the discriminated union so
// the discriminator is unambiguous and switch-exhaustiveness is trivial.
// A caller omitting `variant` now gets a clear "variant is missing" TS
// error instead of a confusing "evidenceUrl is missing on the linked arm"
// cascade. Legacy call sites (`<TrustBadge label="..." evidenceUrl="..." />`
// without `variant`) must add `variant="linked"` explicitly.
export type TrustBadgeProps =
  | {
      variant: 'linked';
      label: TrustBadgeLabel;
      value?: string;
      evidenceUrl: string;
      icon?: 'leaf' | 'shield' | 'check' | 'star';
    }
  | {
      variant: 'visual-only';
      label: TrustBadgeLabel;
      value?: string;
      icon?: 'leaf' | 'shield' | 'check' | 'star';
      // NOTE: no evidenceUrl in this arm — passing it is a TS error.
    };

function iconFor(label: TrustBadgeLabel): ComponentType<{
  size?: number;
  strokeWidth?: number;
  'aria-hidden'?: boolean | 'true' | 'false';
}> {
  switch (label) {
    case 'FSSAI Licensed':
      return ShieldCheck;
    case 'Plant-based ingredients':
      return Leaf;
    case 'Made in India':
      return MapPin;
    case 'Secure Checkout':
      return Lock;
  }
}

export function TrustBadge(props: TrustBadgeProps) {
  if (props.variant === 'visual-only') {
    const Icon = iconFor(props.label);
    return (
      <span
        aria-label={props.label}
        className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-2 text-sm text-[color:var(--color-fg)]"
      >
        <Icon size={16} strokeWidth={2} aria-hidden="true" />
        <span>{props.label}</span>
        {props.value ? (
          <span className="text-[color:var(--color-fg-muted)]">
            · {props.value}
          </span>
        ) : null}
      </span>
    );
  }

  // Linked arm (default) — Phase 1 behavior preserved byte-identical.
  const { label, value, evidenceUrl } = props;
  if (!evidenceUrl) {
    if (import.meta.env.PROD) {
      throw new Error('TrustBadge requires evidenceUrl in production');
    }
    return (
      <div
        data-pending-fssai
        role="status"
        style={{
          background: '#fff3cd',
          padding: 8,
          border: '1px dashed #f0a500',
          color: '#664d03',
          fontFamily: 'system-ui, sans-serif',
          fontSize: 14,
        }}
      >
        ⚠ TrustBadge missing evidenceUrl — dev-only warning. Label:{' '}
        <strong>{label}</strong>
        {value ? ` (${value})` : ''}
      </div>
    );
  }
  return (
    <a
      href={evidenceUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${label} — view evidence`}
      className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-3 py-2 text-sm text-[color:var(--color-fg)]"
    >
      <span>{label}</span>
      {value ? (
        <span className="text-[color:var(--color-fg-muted)]">· {value}</span>
      ) : null}
    </a>
  );
}
