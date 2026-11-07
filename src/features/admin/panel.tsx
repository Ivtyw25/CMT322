import { cn } from '@/lib/cn';

type AdminPanelProps = React.ComponentProps<'section'> & {
  /** Visible heading. It names the section for screen readers. */
  title?: string;
  hint?: string;
  /** A link or button beside the heading. */
  action?: React.ReactNode;
  /** `flush` drops the padding so lists and tables run to the card edge. */
  flush?: boolean;
  headingId: string;
};

/** A white card with an optional heading (the dashboard and ticket detail blocks). */
export function AdminPanel({
  title,
  hint,
  action,
  flush = false,
  headingId,
  className,
  children,
  ...props
}: AdminPanelProps) {
  return (
    <section
      aria-labelledby={title ? headingId : undefined}
      className={cn(
        'min-w-0 overflow-hidden rounded-2xl border border-gray-200 bg-surface',
        !flush && 'flex flex-col gap-3 px-5 py-4.5',
        className,
      )}
      {...props}
    >
      {title ? (
        <div className={cn('flex items-center gap-3', flush && 'px-5 py-4')}>
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <h2 id={headingId} className="type-heading-3xs text-gray-900">
              {title}
            </h2>
            {hint ? <p className="type-body-xs text-gray-500">{hint}</p> : null}
          </div>
          {action}
        </div>
      ) : null}
      {children}
    </section>
  );
}
