import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

/** Teaches tailwind-merge about the Figma text-style utilities so they never clash with colour classes. */
const twMerge = extendTailwindMerge<'typography'>({
  extend: {
    classGroups: {
      typography: [
        {
          type: [
            'heading-xl',
            'heading-l',
            'heading-m',
            'heading-s',
            'heading-xs',
            'heading-2xs',
            'heading-3xs',
            'body-xl',
            'body-l',
            'body-m',
            'body-m-medium',
            'body-m-semibold',
            'body-s',
            'body-s-medium',
            'body-s-semibold',
            'body-xs',
            'body-xs-medium',
            'body-xs-semibold',
          ],
        },
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
