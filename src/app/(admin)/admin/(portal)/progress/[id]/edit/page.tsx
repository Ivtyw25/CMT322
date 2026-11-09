import { Suspense } from 'react';
import { adminCopy } from '@/content/admin';
import { getNow } from '@/data/api/clock';
import { getProgressUpdates, getStageBases } from '@/data/api/progress-updates';
import { getStations } from '@/data/api/stations';
import { ProgressEditor } from '@/features/admin/progress/progress-editor';

export const metadata = adminCopy.meta.progressEditor;

type Params = { params: Promise<{ id: string }> };

export async function generateStaticParams() {
  const items = await getProgressUpdates();
  return [{ id: 'new' }, ...items.map((item) => ({ id: item.id }))];
}

export default async function AdminProgressEditPage({ params }: Params) {
  const { id } = await params;
  const [base, stations, bases, now] = await Promise.all([
    getProgressUpdates(),
    getStations(),
    getStageBases(),
    getNow(),
  ]);
  return (
    <Suspense>
      <ProgressEditor
        id={decodeURIComponent(id)}
        base={base}
        stations={stations.map((station) => ({
          code: station.code,
          name: station.name,
          base: bases.find((entry) => entry.code === station.code)?.stages ?? station.stages,
        }))}
        today={now.slice(0, 10)}
        now={now}
      />
    </Suspense>
  );
}
