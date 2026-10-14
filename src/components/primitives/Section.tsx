import type { ReactNode, ElementType } from 'react';
import { cn } from '@/lib/cn';

type SectionProps = {
  children: ReactNode;
  as?: ElementType;
  background?: 'bg' | 'surface';
  /**
   * When `tone="dark"`, the section flips its scope to dark-mode tokens
   * (brand-deep bg, cream fg) regardless of the global theme — matches the
   * dark brown bands in the About page design. `background="bg"` resolves to
   * brand-deep, `background="surface"` resolves to brand-mid (#6B5252).
   */
  tone?: 'light' | 'dark';
  id?: string;
  className?: string;
};

export default function Section({
  children,
  as: As = 'section',
  background = 'bg',
  tone = 'light',
  id,
  className,
}: SectionProps) {
  return (
    <As
      id={id}
      className={cn(
        'py-8 sm:py-12 md:py-16',
        tone === 'dark' && 'dark',
        background === 'surface'
          ? 'bg-[color:var(--color-surface)]'
          : 'bg-[color:var(--color-bg)]',
        tone === 'dark' && 'text-[color:var(--color-fg)]',
        className,
      )}
    >
      {children}
    </As>
  );
}
