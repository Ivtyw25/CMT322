import { Suspense } from 'react';
import { adminCopy } from '@/content/admin';
import { getNow } from '@/data/api/clock';
import { getStaffAnnouncements } from '@/data/api/staff-content';
import { getStations } from '@/data/api/stations';
import { AnnouncementEditor } from '@/features/admin/announcements/announcement-editor';
import { pinStationOf } from '@/features/admin/pin-station';

export const metadata = adminCopy.meta.announcementEditor;

type Params = { params: Promise<{ id: string }> };

export async function generateStaticParams() {
  const items = await getStaffAnnouncements();
  return [{ id: 'new' }, ...items.map((item) => ({ id: item.id }))];
}

export default async function AdminAnnouncementEditPage({ params }: Params) {
  const { id } = await params;
  const [base, stations, now] = await Promise.all([
    getStaffAnnouncements(),
    getStations(),
    getNow(),
  ]);
  const center = {
    lat: stations.reduce((sum, station) => sum + station.lat, 0) / stations.length,
    lng: stations.reduce((sum, station) => sum + station.lng, 0) / stations.length,
  };
  return (
    <Suspense>
      <AnnouncementEditor
        id={decodeURIComponent(id)}
        base={base}
        stations={stations.map(pinStationOf)}
        today={now.slice(0, 10)}
        now={now}
        center={center}
      />
    </Suspense>
  );
}
