import { reportTrackCopy } from '@/content/report-track';
import { cn } from '@/lib/cn';

const bar = 'rounded-md bg-gray-100';

/** Placeholder for the confirmation while the session and this browser's reports are read. */
export function SubmittedSkeleton() {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label={reportTrackCopy.submitted.loading}
      className="flex flex-col gap-10"
    >
      <div className="flex flex-col gap-3">
        <div className={cn(bar, 'h-5 w-28')} />
        <div className={cn(bar, 'max-w-md h-12 w-full')} />
      </div>
      <div className={cn(bar, 'h-20 w-full')} />
      <div className={cn(bar, 'h-48 w-full')} />
    </div>
  );
}
