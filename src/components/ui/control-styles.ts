import { cva } from 'class-variance-authority';

/**
 * Shared look of text inputs, textareas and selects (Figma Report 1:950, Log in 4:959).
 * 42 px tall from 768 px up; 44 px on phones so the tap target is large enough.
 */
export const controlVariants = cva(
  [
    'w-full rounded-lg border bg-surface px-3.5 py-2.5 type-body-s text-gray-900',
    'min-h-11 md:min-h-0',
    'placeholder:text-gray-400',
    'transition-colors duration-(--duration-fast) ease-(--ease-standard)',
    'focus-visible:shadow-focus focus-visible:outline-none',
    'disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-100 disabled:text-gray-500',
    'read-only:bg-gray-50',
  ],
  {
    variants: {
      tone: {
        default: [
          'border-gray-300 hover:border-gray-400 focus-visible:border-primary-600',
          'aria-invalid:border-danger-600',
        ],
        /** On the navy footer: no border, errors in amber (danger tokens fail contrast there). */
        onNavy: [
          'border-transparent focus-visible:border-primary-600',
          'aria-invalid:border-2 aria-invalid:border-static-amber',
        ],
      },
    },
    defaultVariants: { tone: 'default' },
  },
);
