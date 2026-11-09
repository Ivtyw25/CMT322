import { adminCopy } from '@/content/admin';
import { getNow } from '@/data/api/clock';
import { getStaffProgressUpdates } from '@/data/api/staff-content';
import { getStations } from '@/data/api/stations';
import { ProgressEditor } from '@/features/admin/progress/progress-editor';

export const metadata = adminCopy.meta.progressEditor;

type Params = { params: Promise<{ id: string }> };

export async function generateStaticParams() {
  const items = await getStaffProgressUpdates();
  return [{ id: 'new' }, ...items.map((item) => ({ id: item.id }))];
}

export default async function AdminProgressEditPage({ params }: Params) {
  const { id } = await params;
  const [base, stations, now] = await Promise.all([
    getStaffProgressUpdates(),
    getStations(),
    getNow(),
  ]);
  return (
    <ProgressEditor
      id={decodeURIComponent(id)}
      base={base}
      stations={stations.map((station) => ({
        code: station.code,
        name: station.name,
        progress: station.progress,
      }))}
      today={now.slice(0, 10)}
      now={now}
    />
  );
}
