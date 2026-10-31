import { TriangleAlert } from 'lucide-react';
import { cn } from '@/lib/cn';
import type { LineMarkerKind } from './line-markers';

/**
 * The 16 px symbol of a road change: no-entry circle (closure), amber bar (construction),
 * triangle (hazard). Decorative: the station's name and the list carry the meaning.
 */
export function LineMarkerGlyph({ kind, className }: { kind: LineMarkerKind; className?: string }) {
  if (kind === 'closure') {
    return (
      <span
        aria-hidden
        className={cn(
          'flex size-4 items-center justify-center rounded-full bg-danger-600',
          className,
        )}
      >
        <span className="h-0.5 w-2 rounded-full bg-static-white" />
      </span>
    );
  }
  if (kind === 'construction') {
    return (
      <span aria-hidden className={cn('flex size-4 items-center justify-center', className)}>
        <span className="h-1.5 w-4 rounded-full bg-warning-600" />
      </span>
    );
  }
  return (
    <TriangleAlert
      aria-hidden
      className={cn('size-4 fill-danger-100 text-danger-600', className)}
    />
  );
}
