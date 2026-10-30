import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/cn';

export const iconButtonVariants = cva(
  [
    'hit-area inline-flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-lg',
    'transition-colors duration-(--duration-fast) ease-(--ease-standard)',
  ],
  {
    variants: {
      variant: {
        /** Bordered square: the theme button. */
        outline:
          'border border-gray-200 text-gray-800 hover:border-gray-300 hover:bg-gray-50 data-[state=open]:border-primary-200 data-[state=open]:bg-primary-50 data-[state=open]:text-primary-700',
        /** No border: the mobile menu button. */
        plain: 'text-gray-800 hover:bg-gray-100',
      },
    },
    defaultVariants: { variant: 'outline' },
  },
);

export type IconButtonProps = Omit<React.ComponentProps<'button'>, 'className' | 'aria-label'> &
  VariantProps<typeof iconButtonVariants> & {
    /** Icon-only controls always need a name. */
    'aria-label': string;
    className?: string;
  };

export function IconButton({ variant, className, type = 'button', ...props }: IconButtonProps) {
  return (
    <button type={type} className={cn(iconButtonVariants({ variant }), className)} {...props} />
  );
}
