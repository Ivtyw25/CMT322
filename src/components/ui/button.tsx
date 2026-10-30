'use client';

import { type VariantProps } from 'class-variance-authority';
import { LoaderCircle } from 'lucide-react';
import { cn } from '@/lib/cn';
import { buttonVariants } from './button-variants';

type ButtonStyleProps = VariantProps<typeof buttonVariants> & {
  /** Decorative icon before the label (16 to 18 px). */
  icon?: React.ReactNode;
};

export type ButtonProps = Omit<React.ComponentProps<'button'>, 'className'> &
  ButtonStyleProps & {
    /** Shows a spinner, keeps the width and ignores clicks while the action runs. */
    loading?: boolean;
    className?: string;
  };

/** An action. For navigation use ButtonLink. Loading keeps focus and blocks clicks (not `disabled`). */
export function Button({
  variant,
  fullWidth,
  icon,
  loading = false,
  className,
  type = 'button',
  onClick,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(buttonVariants({ variant, fullWidth }), className)}
      aria-busy={loading || undefined}
      aria-disabled={loading || undefined}
      onClick={(event) => {
        if (loading) event.preventDefault();
        else onClick?.(event);
      }}
      {...props}
    >
      {loading ? <LoaderCircle aria-hidden className="size-4 shrink-0 animate-spin" /> : icon}
      {children}
    </button>
  );
}
