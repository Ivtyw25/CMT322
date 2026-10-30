import { cva } from 'class-variance-authority';

export const buttonVariants = cva(
  [
    'hit-area inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg type-body-s-semibold',
    'transition-colors duration-(--duration-fast) ease-(--ease-standard)',
    'disabled:cursor-not-allowed aria-busy:cursor-progress',
  ],
  {
    variants: {
      variant: {
        primary: [
          'bg-primary-600 px-4 py-2.5 text-static-white shadow-button',
          'hover:bg-action-hover active:bg-action-active',
          'disabled:border disabled:border-gray-200 disabled:bg-gray-100 disabled:text-gray-400 disabled:shadow-none',
        ],
        secondary: [
          'border border-gray-300 bg-surface px-4 py-2.5 text-gray-800',
          'hover:border-gray-400 hover:bg-gray-50 active:bg-gray-100',
          'disabled:border-gray-200 disabled:bg-gray-100 disabled:text-gray-400',
        ],
        ghost: [
          'px-0 py-2.5 text-primary-700 hover:underline active:text-primary-800',
          'disabled:text-gray-400 disabled:no-underline',
        ],
      },
      fullWidth: { true: 'w-full', false: '' },
    },
    defaultVariants: { variant: 'primary', fullWidth: false },
  },
);
