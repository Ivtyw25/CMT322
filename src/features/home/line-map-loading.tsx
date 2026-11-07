import { LoaderCircle } from 'lucide-react';
import { homeCopy } from '@/content/home';
import { cn } from '@/lib/cn';

/** Spinner shown while Map view's code and tiles load. */
export function LineMapLoading({ className }: { className?: string }) {
  return (
    <div
      role="status"
      className={cn(
        'flex items-center justify-center gap-2 bg-gray-100 type-body-s text-gray-600',
        className,
      )}
    >
      <LoaderCircle aria-hidden className="size-5 animate-spin motion-reduce:animate-none" />
      {homeCopy.line.map.loading}
    </div>
  );
}
