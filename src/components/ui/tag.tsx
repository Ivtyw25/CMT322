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
  'overdue',
  'highPriority',
  'normal',
  'scheduled',
  'draft',
  'published',
] as const;
export type TagKind = (typeof tagKinds)[number];

/** Pills whose label is the record's own text: a ticket ID, a category. */
export type LabelledTagKind = 'ticketId' | 'category';

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
        plain: 'bg-gray-100 text-gray-700',
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
  plain: 'bg-gray-500',
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
  overdue: 'danger',
  highPriority: 'danger',
  normal: 'plain',
  scheduled: 'info',
  draft: 'plain',
  published: 'success',
  ticketId: 'plain',
  category: 'plain',
} as const satisfies Record<TagKind | LabelledTagKind, keyof typeof dotTone>;

type TagProps = { className?: string } & (
  { kind: TagKind; label?: never } | { kind: LabelledTagKind; label: string }
);

/**
 * One of the fixed tags (the last six are the staff portal's), or a pill that carries a record's own
 * text (`ticketId`, `category`). The label always carries the meaning; never recolour.
 */
export function Tag(props: TagProps) {
  const tone = toneOf[props.kind];
  const text = props.label === undefined ? uiCopy.tags[props.kind] : props.label;
  return (
    <span
      className={cn(
        tagVariants({ tone }),
        props.label !== undefined && 'max-w-full wrap-anywhere whitespace-normal',
        props.className,
      )}
    >
      <span aria-hidden className={cn('size-1.5 shrink-0 rounded-full', dotTone[tone])} />
      {text}
    </span>
  );
}
