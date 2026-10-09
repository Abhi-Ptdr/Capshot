import Button from '@/components/primitives/Button';

/**
 * Phase 1 Plan 01: branded coming-soon shell for `/flavors`. Phase 2 replaces
 * the body with the 16-flavor grid + range filters. Headline copy is locked
 * by CONTEXT D-15; sub-copy is a Phase 1 default from UI-SPEC §Copywriting
 * Contract. CTA is a plain Button placeholder — Plan 02's `<PrimaryCTA>`
 * replaces this with the real wa.me-wired variant from `src/config/cta.ts`.
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
        <div className="mx-auto max-w-md text-center">
          <h1 className="text-2xl font-bold sm:text-[32px]">
            All 16 flavors coming soon.
          </h1>
          <p className="mt-4 text-[color:var(--color-fg-muted)]">
            We&apos;re photographing every cap. Check back shortly — or tap
            below to join the waitlist.
          </p>
          <div className="mt-8">
            <Button
              as="a"
              href="#"
              aria-label="Try CAPSHOT"
              className="h-12 px-5 bg-[color:var(--color-accent)] text-[color:var(--color-accent-fg)]"
            >
              TRY CAPSHOT
            </Button>
          </div>
        </div>
      </main>
    </>
  );
}
