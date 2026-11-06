import { cn } from '@/lib/cn';

export function ProfileCard({
  id,
  title,
  lede,
  action,
  actionBeside = false,
  tone = 'default',
  children,
}: {
  id: string;
  title: string;
  lede?: React.ReactNode;
  action?: React.ReactNode;
  /** Keep the action beside the title on phones (My reports) instead of below it. */
  actionBeside?: boolean;
  tone?: 'default' | 'danger';
  children?: React.ReactNode;
}) {
  return (
    <section
      aria-labelledby={id}
      className={cn(
        'rounded-xl border bg-surface',
        tone === 'danger' ? 'border-danger-100' : 'border-gray-200',
      )}
    >
      <div
        className={cn(
          'flex gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between md:px-6',
          actionBeside ? 'items-center justify-between' : 'flex-col items-start',
        )}
      >
        <div className="min-w-0 space-y-1">
          <h2
            id={id}
            tabIndex={-1}
            className={cn(
              'scroll-mt-32 type-body-m-semibold outline-none',
              tone === 'danger' && 'text-danger-700',
            )}
          >
            {title}
          </h2>
          {lede ? <div className="type-body-s wrap-anywhere text-gray-600">{lede}</div> : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
      {children}
    </section>
  );
}

/** Label, value and action row inside a profile card (Figma 92:3048). */
export const profileRow =
  'grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-6 gap-y-0.5 border-t border-gray-200 px-4 py-4 md:grid-cols-[11.25rem_minmax(0,1fr)_auto] md:px-6';
/** Quiet text action at the end of a row; the hit area keeps 44 px without growing the row. */
export const profileRowAction =
  'col-start-2 row-span-2 row-start-1 -my-2.5 md:col-start-3 md:row-span-1';
/** Row label: quiet grey above the value on phones, medium weight in its own column from md. */
export const profileLabel = 'type-body-s text-gray-600 md:type-body-s-medium md:text-gray-900';
