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
    <svg aria-hidden viewBox="0 0 16 16" className={cn('size-4 text-danger-600', className)}>
      <path
        d="M8 1.5 15 14H1z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M8 6v4" stroke="var(--color-static-white)" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="8" cy="12" r="0.9" fill="var(--color-static-white)" />
    </svg>
  );
}
