import { Info, TriangleAlert } from 'lucide-react';
import { cn } from '@/lib/cn';

type CalloutProps = {
  tone: 'info' | 'warning';
  /** Bold first line next to the icon (warning callouts). */
  title?: string;
  children: React.ReactNode;
  className?: string;
};

/** Static note. Not a live region. Info: icon beside the text. Warning: icon beside the title. */
export function Callout({ tone, title, children, className }: CalloutProps) {
  if (tone === 'warning') {
    return (
      <div
        className={cn(
          'flex flex-col gap-1.5 rounded-xl border-l-3 border-warning-600 bg-warning-50 p-4',
          className,
        )}
      >
        <p className="flex items-center gap-2 type-body-s-semibold text-warning-700">
          <TriangleAlert aria-hidden className="size-4 shrink-0" />
          {title}
        </p>
        <div className="type-body-s text-gray-700">{children}</div>
      </div>
    );
  }
  return (
    <div
      className={cn(
        'flex gap-3 rounded-xl border border-primary-100 bg-primary-50 p-4 type-body-s text-gray-700',
        className,
      )}
    >
      <Info aria-hidden className="mt-0.5 size-4.5 shrink-0 text-primary-700" />
      <div>{children}</div>
    </div>
  );
}
