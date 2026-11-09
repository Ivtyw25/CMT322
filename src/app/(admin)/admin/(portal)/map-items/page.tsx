import { adminCopy } from '@/content/admin';
import { getNow } from '@/data/api/clock';
import { getStaffAnnouncements } from '@/data/api/staff-content';
import { getStations } from '@/data/api/stations';
import { MapItemsPage } from '@/features/admin/map-items/map-items-page';
import { pinStationOf } from '@/features/admin/pin-station';

export const metadata = adminCopy.meta.mapItems;

export default async function AdminMapItemsPage() {
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
    <MapItemsPage
      base={base}
      today={now.slice(0, 10)}
      now={now}
      center={center}
      stations={stations.map(pinStationOf)}
    />
  );
}
