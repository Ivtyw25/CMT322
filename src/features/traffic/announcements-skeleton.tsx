import { trafficCopy } from '@/content/traffic';

const ROWS = 6;

const bar = 'rounded-md bg-gray-100 motion-safe:animate-pulse';

/** Shown while the filters are read from the address: real header, grey bars for the list. */
export function AnnouncementsSkeleton() {
  return (
    <div role="status" aria-busy="true" className="flex flex-col gap-6">
      <span className="sr-only">{trafficCopy.announcements.loading}</span>
      <div aria-hidden className="flex flex-col gap-4 xl:flex-row xl:justify-between">
        <div className={`${bar} max-w-md h-11 w-full`} />
        <div className={`${bar} h-11 w-full xl:w-100`} />
      </div>
      <div aria-hidden className="divide-y divide-gray-200 rounded-xl border border-gray-200">
        {Array.from({ length: ROWS }, (_, index) => (
          <div key={index} className="flex items-center gap-6 p-5">
            <div className={`${bar} h-6 w-20 rounded-full`} />
            <div className="flex flex-1 flex-col gap-2">
              <div className={`${bar} h-4 w-2/3`} />
              <div className={`${bar} h-3 w-1/2`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
