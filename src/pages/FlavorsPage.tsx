import { PrimaryCTA } from '@/components/ui/PrimaryCTA';

/**
 * Phase 1 Plan 02 — `/flavors` coming-soon shell.
 *
 * Headline locked by CONTEXT D-15. Phase 2 replaces the body with the real
 * 16-flavor grid + range filters. The TRY CAPSHOT CTA is the SAME button
 * and SAME destination as the Hero (reads from src/config/cta.ts) — Phase 6
 * swap is a single-file edit at `cta.ts`.
 */
export default function FlavorsPage() {
  return (
    <>
      <title>Flavors — CAPSHOT</title>
      <main
        id="main"
        tabIndex={-1}
        className="grid min-h-[calc(100dvh-56px)] place-items-center px-4"
      >
        <div className="mx-auto max-w-[28rem] text-center">
          <h1 className="text-2xl font-bold sm:text-[32px]">
            All 16 flavors coming soon.
          </h1>
          <p className="mt-4 text-[color:var(--color-fg-muted)]">
            We&apos;re photographing every cap. Check back shortly — or tap
            below to join the waitlist.
          </p>
          <div className="mt-8 flex justify-center">
            <PrimaryCTA size="md" />
          </div>
        </div>
      </main>
    </>
  );
}
