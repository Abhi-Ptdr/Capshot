import { m } from '@/lib/motion';
import Container from '@/components/primitives/Container';
import Section from '@/components/primitives/Section';
import { StepTwistIllustration } from './StepTwistIllustration';
import { StepShakeIllustration } from './StepShakeIllustration';
import { StepBoomIllustration } from './StepBoomIllustration';

/**
 * Phase 2 Plan 02 — How It Works section (HOW-01 / D2-01 / D2-02 / D2-03).
 *
 * The brand mantra TWIST → SHAKE → BOOM, rendered as three Hinglish beats
 * paired with static inline-SVG illustrations drawn from the brand palette
 * (brand-deep / brand-mid / brand-rose / brand-cream — never a stray hex).
 *
 * Entrance animation is a Motion `whileInView` fade+slide (opacity 0→1,
 * y 24→0, 0.5s, staggered 0.1s per beat) that fires ONCE per element
 * (`viewport.once: true`). Reduced-motion gets the final state immediately
 * via `motion-reduce:!transform-none motion-reduce:!opacity-100` as a
 * belt-and-suspenders alongside Motion's own prefers-reduced-motion
 * detection.
 *
 * No section headline — per 02-CONTEXT's "let the 3 beats speak"
 * recommendation. The Hero's locked headline ("Twist karo. Shake karo.
 * BOOM.") sits directly above this section, so the 3 beats are the
 * visual payoff of the mantra, not a redundant kicker.
 *
 * Phase 3 is where the cinematic cap-twist + path morphs land. Phase 2
 * ships the STATIC illustrations only — do NOT bake Phase 3's timings
 * into the SVG trees.
 */

const STEPS = [
  { label: 'TWIST', Illustration: StepTwistIllustration },
  { label: 'SHAKE', Illustration: StepShakeIllustration },
  { label: 'BOOM', Illustration: StepBoomIllustration },
] as const;

export function HowItWorks() {
  return (
    <Section className="pt-8 sm:pt-12 md:pt-16 pb-16" background="bg">
      <Container>
        <ul className="grid gap-10 sm:grid-cols-3 sm:gap-6 lg:gap-10">
          {STEPS.map(({ label, Illustration }, i) => (
            <li
              key={label}
              className="flex flex-col items-center text-center"
            >
              <m.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-10% 0px' }}
                transition={{
                  duration: 0.5,
                  delay: i * 0.1,
                  ease: [0.2, 0, 0.2, 1],
                }}
                className="w-full max-w-[280px] text-[color:var(--color-brand-deep)] motion-reduce:!transform-none motion-reduce:!opacity-100 dark:text-[color:var(--color-brand-cream)]"
              >
                <Illustration className="h-auto w-full" />
              </m.div>
              <h3 className="mt-6 text-[48px] font-bold leading-none tracking-tight sm:text-[64px] lg:text-[80px]">
                {label}
              </h3>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
