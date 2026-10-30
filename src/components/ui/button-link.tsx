import { type VariantProps } from 'class-variance-authority';
import Link from 'next/link';
import { cn } from '@/lib/cn';
import { buttonVariants } from './button-variants';

type ButtonLinkStyleProps = VariantProps<typeof buttonVariants> & {
  /** Decorative icon before the label (16 to 18 px). */
  icon?: React.ReactNode;
};

export type ButtonLinkProps = Omit<React.ComponentProps<typeof Link>, 'className'> &
  ButtonLinkStyleProps & { className?: string };

/** A link that looks like a button. */
export function ButtonLink({
  variant,
  fullWidth,
  icon,
  className,
  children,
  ...props
}: ButtonLinkProps) {
  return (
    <Link className={cn(buttonVariants({ variant, fullWidth }), className)} {...props}>
      {icon}
      {children}
    </Link>
  );
}
