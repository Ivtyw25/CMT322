/**
 * Classes that fake hover, active and focus-visible so every state can sit on one page.
 * They repeat what the components do on the real pseudo-classes.
 */
export const forcedButton = {
  hover: {
    primary: 'bg-action-hover',
    secondary: 'border-gray-400 bg-gray-50',
    ghost: 'underline',
  },
  active: {
    primary: 'bg-action-active',
    secondary: 'bg-gray-100',
    ghost: 'text-primary-800',
  },
  focus: 'outline-2 outline-offset-2 outline-primary-600',
} as const;
