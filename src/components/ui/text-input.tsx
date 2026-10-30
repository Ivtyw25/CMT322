'use client';

import { cn } from '@/lib/cn';
import { controlVariants } from './control-styles';
import { useFieldControl } from './field';

export type TextInputProps = Omit<React.ComponentProps<'input'>, 'className'> & {
  /** Decorative icon inside the left edge (mail, lock). */
  leadingIcon?: React.ReactNode;
  /** Control inside the right edge (the password toggle). */
  trailing?: React.ReactNode;
  className?: string;
};

export function TextInput({
  leadingIcon,
  trailing,
  className,
  type = 'text',
  ...props
}: TextInputProps) {
  const { tone, ...fieldProps } = useFieldControl();
  return (
    <div className={cn('relative', className)}>
      {leadingIcon ? (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-gray-500"
        >
          {leadingIcon}
        </span>
      ) : null}
      <input
        type={type}
        {...fieldProps}
        {...props}
        className={cn(controlVariants({ tone }), leadingIcon && 'pl-10', trailing && 'pr-11')}
      />
      {trailing ? (
        <span className="absolute inset-y-0 right-1 flex items-center">{trailing}</span>
      ) : null}
    </div>
  );
}
