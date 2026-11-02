import { CircleAlert, CircleCheck, Info, TriangleAlert } from 'lucide-react';
import { cn } from '@/lib/cn';

export type CalloutTone = 'info' | 'warning' | 'success' | 'danger';

type CalloutProps = {
  tone: CalloutTone;
  /** Bold first line next to the icon. Always shown for warning, success and danger. */
  title?: string;
  /** Element of the title. The error summary uses `h2`. */
  titleAs?: 'p' | 'h2' | 'h3';
  id?: string;
  /** Lets code move focus here (use with `tabIndex={-1}`). */
  ref?: React.Ref<HTMLDivElement>;
  tabIndex?: number;
  children?: React.ReactNode;
  className?: string;
};

const iconed = {
  warning: {
    Icon: TriangleAlert,
    box: 'border-warning-600 bg-warning-50',
    text: 'text-warning-700',
  },
  success: { Icon: CircleCheck, box: 'border-success-600 bg-success-50', text: 'text-success-700' },
  danger: { Icon: CircleAlert, box: 'border-danger-600 bg-danger-50', text: 'text-danger-700' },
} as const;

/**
 * Static note. Not a live region: move focus to it with `ref` and `tabIndex={-1}` when it carries
 * news. Info: icon beside the text. The other tones: icon beside the title.
 */
export function Callout({
  tone,
  title,
  titleAs: Title = 'p',
  id,
  ref,
  tabIndex,
  children,
  className,
}: CalloutProps) {
  if (tone === 'info') {
    return (
      <div
        id={id}
        ref={ref}
        tabIndex={tabIndex}
        className={cn(
          'flex gap-3 rounded-xl border-l-3 border-primary-600 bg-gray-50 p-4 type-body-s text-gray-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600',
          className,
        )}
      >
        <Info aria-hidden className="mt-0.5 size-4.5 shrink-0 text-primary-700" />
        <div>{children}</div>
      </div>
    );
  }
  const { Icon, box, text } = iconed[tone];
  return (
    <div
      id={id}
      ref={ref}
      tabIndex={tabIndex}
      className={cn(
        'flex flex-col gap-1.5 rounded-xl border-l-3 p-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600',
        box,
        className,
      )}
    >
      <Title className={cn('flex items-center gap-2 type-body-s-semibold', text)}>
        <Icon aria-hidden className="size-4 shrink-0" />
        {title}
      </Title>
      {children ? <div className="type-body-s text-gray-700">{children}</div> : null}
    </div>
  );
}
