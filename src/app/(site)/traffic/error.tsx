'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { routes } from '@/config/routes';
import { trafficCopy } from '@/content/traffic';
import { uiCopy } from '@/content/ui';

/** Shown when the Traffic overview or the announcements cannot load. */
export default function TrafficSiteError({ reset }: { error: Error; reset: () => void }) {
  const copy =
    usePathname() === routes.traffic.overview
      ? trafficCopy.overview.week.error
      : trafficCopy.announcements.error;
  return (
    <div className="mx-auto flex max-w-content flex-col items-start gap-3 px-5 py-16 md:px-8">
      <h1 className="type-heading-s text-gray-900">{copy.title}</h1>
      <p className="type-body-m text-gray-600">{copy.body}</p>
      <div className="flex flex-wrap items-center gap-4">
        <Button onClick={reset}>{uiCopy.actions.tryAgain}</Button>
        <Link
          href={routes.help.contact}
          className="type-body-s-semibold text-primary-700 hover:text-primary-800"
        >
          {trafficCopy.announcements.error.contact}
        </Link>
      </div>
    </div>
  );
}
