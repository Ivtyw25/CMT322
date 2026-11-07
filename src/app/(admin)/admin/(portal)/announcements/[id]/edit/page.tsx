import { adminCopy } from '@/content/admin';
import { getAreas } from '@/data/api/areas';
import { getNow } from '@/data/api/clock';
import { getStaffAnnouncements, getStaffMapItems } from '@/data/api/staff-content';
import { getStations } from '@/data/api/stations';
import { AnnouncementEditor } from '@/features/admin/announcements/announcement-editor';

export const metadata = adminCopy.meta.announcementEditor;

type Params = { params: Promise<{ id: string }> };

export async function generateStaticParams() {
  const items = await getStaffAnnouncements();
  return [{ id: 'new' }, ...items.map((item) => ({ id: item.id }))];
}

export default async function AdminAnnouncementEditPage({ params }: Params) {
  const { id } = await params;
  const [base, baseMapItems, areas, stations, now] = await Promise.all([
    getStaffAnnouncements(),
    getStaffMapItems(),
    getAreas(),
    getStations(),
    getNow(),
  ]);
  const center = {
    lat: stations.reduce((sum, station) => sum + station.lat, 0) / stations.length,
    lng: stations.reduce((sum, station) => sum + station.lng, 0) / stations.length,
  };
  return (
    <AnnouncementEditor
      id={decodeURIComponent(id)}
      base={base}
      baseMapItems={baseMapItems}
      areas={areas.map((area) => ({ id: area.id, label: area.label }))}
      stations={stations.map((station) => ({
        code: station.code,
        name: station.name,
        areaId: station.areaId,
      }))}
      today={now.slice(0, 10)}
      now={now}
      center={center}
    />
  );
}
