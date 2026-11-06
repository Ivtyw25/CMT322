import { cn } from '@/lib/cn';

export function ProfileCard({
  id,
  title,
  lede,
  action,
  tone = 'default',
  children,
}: {
  id: string;
  title: string;
  lede?: React.ReactNode;
  action?: React.ReactNode;
  tone?: 'default' | 'danger';
  children?: React.ReactNode;
}) {
  return (
    <section aria-labelledby={id} className="rounded-xl border border-gray-200 bg-surface">
      <div className="flex flex-col items-start gap-4 px-5 py-5 sm:flex-row sm:justify-between md:px-6">
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
  'grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-6 gap-y-1 border-t border-gray-200 px-5 py-4 md:grid-cols-[11.25rem_minmax(0,1fr)_auto] md:px-6';
/** Quiet text action at the end of a row; the hit area keeps 44 px without growing the row. */
export const profileRowAction = 'col-start-2 row-start-1 md:col-start-3 -my-2.5';
