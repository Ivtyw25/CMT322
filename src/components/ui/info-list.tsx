import { cn } from '@/lib/cn';

export type InfoListItem = { id: string; label: string; value: React.ReactNode };

/**
 * Name/value pairs as a description list, ruled between rows. The label column is 128 px on
 * phones and 200 px from 768 px; labels wrap, values fill the rest. Not a table. With `stacked`
 * the label sits above its value on phones.
 */
export function InfoList({
  items,
  stacked = false,
  className,
}: {
  items: readonly InfoListItem[];
  stacked?: boolean;
  className?: string;
}) {
  return (
    <dl className={cn('border-b border-gray-200', className)}>
      {items.map((item) => (
        <div
          key={item.id}
          className={cn(
            'flex gap-4 border-t border-gray-200 py-3 md:gap-6',
            stacked && 'flex-col gap-6 md:flex-row',
          )}
        >
          <dt
            className={cn(
              'shrink-0 type-body-s-medium text-gray-900 md:w-50',
              stacked ? 'md:w-50' : 'w-32',
            )}
          >
            {item.label}
          </dt>
          <dd className="min-w-0 flex-1 type-body-s text-gray-700">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
