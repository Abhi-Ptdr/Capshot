import type { ReactNode, MouseEventHandler } from 'react';
import { cn } from '@/lib/cn';

type ButtonBase = {
  children: ReactNode;
  className?: string;
  'data-cta'?: string;
  'aria-label'?: string;
};

type ButtonAsAnchor = ButtonBase & {
  as: 'a';
  href: string;
  target?: string;
  rel?: string;
  type?: never;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
};

type ButtonAsButton = ButtonBase & {
  as?: 'button';
  href?: never;
  target?: never;
  rel?: never;
  type?: 'button' | 'submit';
  onClick?: MouseEventHandler<HTMLButtonElement>;
};

type ButtonProps = ButtonAsAnchor | ButtonAsButton;

/**
 * Unopinionated polymorphic button primitive. Default styling applies base
 * reset-ish utilities (inline-flex pill, bold uppercase, display font); size
 * and variant decisions live in Plan 02's `<PrimaryCTA>` cva wrapper per the
 * ARCHITECTURE Pattern 1 split. Keeping this component unopinionated means
 * Plan 02 can introduce variants without a breaking change to callers.
 */
export default function Button(props: ButtonProps) {
  const base =
    'inline-flex items-center justify-center font-bold uppercase tracking-wide rounded-full';
  const className = cn(base, props.className);

  if (props.as === 'a') {
    const {
      as: _as,
      className: _className,
      children,
      href,
      target,
      rel,
      onClick,
      ...rest
    } = props;
    return (
      <a
        href={href}
        target={target}
        rel={rel}
        onClick={onClick}
        className={className}
        {...rest}
      >
        {children}
      </a>
    );
  }

  const {
    as: _as,
    className: _className,
    children,
    type = 'button',
    onClick,
    ...rest
  } = props;
  return (
    <button type={type} onClick={onClick} className={className} {...rest}>
      {children}
    </button>
  );
}
