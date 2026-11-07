import type { Metadata } from 'next';
import { Suspense } from 'react';
import { Container } from '@/components/layout/container';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { routes } from '@/config/routes';
import { trafficCopy } from '@/content/traffic';
import { uiCopy } from '@/content/ui';
import { getAnnouncements } from '@/data/api/announcements';
import { getAreas } from '@/data/api/areas';
import { toAnnouncementRows } from '@/features/traffic/announcement-rows';
import { AnnouncementsBrowser } from '@/features/traffic/announcements-browser';
import { AnnouncementsSkeleton } from '@/features/traffic/announcements-skeleton';

const copy = trafficCopy.announcements;

export const metadata: Metadata = {
  title: copy.meta.title,
  description: copy.meta.description,
};

export default async function TrafficAnnouncementsPage() {
  const [announcements, areas] = await Promise.all([getAnnouncements(), getAreas()]);
  const rows = toAnnouncementRows(announcements, areas);
  const areaOptions = areas.map((area) => ({ value: area.id, label: area.label }));

  return (
    <>
      <header className="bg-gray-50">
        <Container className="flex flex-col gap-4 py-8 lg:py-12">
          <Breadcrumb
            items={[
              { label: uiCopy.breadcrumb.home, href: routes.home },
              { label: trafficCopy.overview.header.title, href: routes.traffic.overview },
            ]}
            current={copy.header.breadcrumb}
          />
          <h1 className="type-heading-m">{copy.header.title}</h1>
          <p className="max-w-180 type-body-xl text-gray-600">{copy.header.lede}</p>
        </Container>
      </header>
      <Container className="py-8 lg:py-10">
        <Suspense fallback={<AnnouncementsSkeleton />}>
          <AnnouncementsBrowser rows={rows} areaOptions={areaOptions} />
        </Suspense>
      </Container>
    </>
  );
}
