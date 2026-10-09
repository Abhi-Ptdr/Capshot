import { PrimaryCTA } from '@/components/ui/PrimaryCTA';

/**
 * Phase 1 Plan 02 — `/contact` coming-soon shell. Phase 5 adds Instagram
 * handle + email overflow. Headline locked by CONTEXT D-15.
 */
export default function ContactPage() {
  return (
    <>
      <title>Contact — CAPSHOT</title>
      <main
        id="main"
        tabIndex={-1}
        className="grid min-h-[calc(100dvh-56px)] place-items-center px-4"
      >
        <div className="mx-auto max-w-md text-center">
          <h1 className="text-2xl font-bold sm:text-[32px]">
            Say hi on WhatsApp — we&apos;re here now.
          </h1>
          <p className="mt-4 text-[color:var(--color-fg-muted)]">
            Tap below to open WhatsApp. Instagram (@capshot_twist) and email
            also land in the same inbox.
          </p>
          <div className="mt-8 flex justify-center">
            <PrimaryCTA size="md" />
          </div>
        </div>
      </main>
    </>
  );
}
