/**
 * Phase 1 Plan 02 — TrustBadge DECLARATION only (TRUST-02 / Pitfall #2).
 *
 * NOT rendered by any Phase 1 route — the component is committed so the
 * contract is frozen before Phase 5 trust-strip work begins.
 *
 * Enforcement:
 *  - `label` is a strict union literal; attempting `"FSSAI Approved"`
 *    (deprecated FSSAI nomenclature) or `"Vegan"` without the FSSAI vegan
 *    logo is a TypeScript error.
 *  - `evidenceUrl` is mandatory. In production (`import.meta.env.PROD`),
 *    the component throws if it's missing. In dev, it renders a visible
 *    `data-pending-fssai` warning so the gap is caught before deploy.
 *
 * Visual spec is a Phase 5 concern (TRUST-01). Phase 1 ships only the
 * declaration + enforcement — no styled trust-strip row yet.
 */

export type TrustBadgeProps = {
  label:
    | 'FSSAI Licensed'
    | 'Plant-based ingredients'
    | 'Made in India'
    | 'Secure Checkout';
  value?: string;
  evidenceUrl: string;
  icon?: 'leaf' | 'shield' | 'check' | 'star';
};

export function TrustBadge({ label, value, evidenceUrl }: TrustBadgeProps) {
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
