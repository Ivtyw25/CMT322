import { adminCopy } from '@/content/admin';
import { getNow } from '@/data/api/clock';
import { getStaffAnnouncements, getStaffMapItems } from '@/data/api/staff-content';
import { getStations } from '@/data/api/stations';
import { MapItemsPage } from '@/features/admin/map-items/map-items-page';

export const metadata = adminCopy.meta.mapItems;

export default async function AdminMapItemsPage() {
  const [base, announcements, stations, now] = await Promise.all([
    getStaffMapItems(),
    getStaffAnnouncements(),
    getStations(),
    getNow(),
  ]);
  const center = {
    lat: stations.reduce((sum, station) => sum + station.lat, 0) / stations.length,
    lng: stations.reduce((sum, station) => sum + station.lng, 0) / stations.length,
  };
  return (
    <MapItemsPage
      base={base}
      announcements={announcements
        .filter((item) => item.status !== 'draft')
        .map((item) => ({ id: item.id, title: item.title }))}
      today={now.slice(0, 10)}
      center={center}
    />
  );
}
