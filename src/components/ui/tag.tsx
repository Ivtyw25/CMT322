import { cva } from 'class-variance-authority';
import { uiCopy } from '@/content/ui';
import { cn } from '@/lib/cn';

export const tagKinds = [
  'closure',
  'construction',
  'hazard',
  'active',
  'upcoming',
  'ended',
  'pending',
  'inProgress',
  'resolved',
  'submitted',
  'overdue',
  'highPriority',
  'normal',
  'scheduled',
  'draft',
  'published',
] as const;
export type TagKind = (typeof tagKinds)[number];

const tagVariants = cva(
  'inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-0.5 type-body-xs-medium whitespace-nowrap',
  {
    variants: {
      tone: {
        danger: 'bg-danger-50 text-danger-700',
        warning: 'bg-warning-50 text-warning-700',
        success: 'bg-success-50 text-success-700',
        info: 'bg-primary-50 text-primary-700',
        neutral: 'bg-gray-100 text-gray-600',
        submitted: 'bg-gray-100 text-gray-700',
      },
    },
  },
);

const dotTone = {
  danger: 'bg-danger-600',
  warning: 'bg-warning-600',
  success: 'bg-success-600',
  info: 'bg-primary-600',
  neutral: 'bg-gray-500',
  submitted: 'bg-gray-500',
} as const;

const toneOf = {
  closure: 'danger',
  construction: 'warning',
  hazard: 'danger',
  active: 'success',
  upcoming: 'info',
  ended: 'neutral',
  pending: 'warning',
  inProgress: 'info',
  resolved: 'success',
  submitted: 'submitted',
  overdue: 'danger',
  highPriority: 'danger',
  normal: 'submitted',
  scheduled: 'info',
  draft: 'submitted',
  published: 'success',
} as const satisfies Record<TagKind, keyof typeof dotTone>;

/** One of the fixed status tags (the last six are the staff portal's). The label always carries the meaning; never recolour. */
export function Tag({ kind, className }: { kind: TagKind; className?: string }) {
  const tone = toneOf[kind];
  return (
    <span className={cn(tagVariants({ tone }), className)}>
      <span aria-hidden className={cn('size-1.5 rounded-full', dotTone[tone])} />
      {uiCopy.tags[kind]}
    </span>
  );
}
