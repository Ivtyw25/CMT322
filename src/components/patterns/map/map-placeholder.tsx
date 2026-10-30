import { Map as MapIcon } from 'lucide-react';
import { uiCopy } from '@/content/ui';
import { cn } from '@/lib/cn';

/** The grey box that stands in for the map while it loads, or when its tiles cannot. */
export function MapPlaceholder({ message, className }: { message?: string; className?: string }) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-2 bg-gray-100 p-4 text-center',
        className,
      )}
    >
      <MapIcon aria-hidden className="size-6 text-gray-400" />
      <p role="status" className={message ? 'type-body-s text-gray-600' : 'sr-only'}>
        {message ?? uiCopy.map.loading}
      </p>
    </div>
  );
}
