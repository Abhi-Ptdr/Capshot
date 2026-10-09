import Button from '@/components/primitives/Button';

/**
 * Phase 1 Plan 01: branded coming-soon shell for `/about`. Phase 5 replaces
 * the body with the real founder note + About content. Headline is locked
 * by CONTEXT D-15.
 */
export default function AboutPage() {
  return (
    <>
      <title>About — CAPSHOT</title>
      <main
        id="main"
        tabIndex={-1}
        className="grid min-h-[calc(100dvh-56px)] place-items-center px-4"
      >
        <div className="mx-auto max-w-md text-center">
          <h1 className="text-2xl font-bold sm:text-[32px]">
            Our story is on the way.
          </h1>
          <p className="mt-4 text-[color:var(--color-fg-muted)]">
            A pre-filled flavor cap, dreamt up in India, built for every water
            bottle. The full founder note drops with launch.
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
