import { Suspense } from 'react';
import { adminCopy } from '@/content/admin';
import { getToday } from '@/data/api/clock';
import { getProgressUpdates, getStageBases } from '@/data/api/progress-updates';
import { getStations } from '@/data/api/stations';
import { ProgressPage } from '@/features/admin/progress/progress-page';

export const metadata = adminCopy.meta.progress;

export default async function AdminProgressPage() {
  const [base, stations, bases, today] = await Promise.all([
    getProgressUpdates(),
    getStations(),
    getStageBases(),
    getToday(),
  ]);
  return (
    <Suspense>
      <ProgressPage
        base={base}
        stations={stations.map((station) => ({
          code: station.code,
          name: station.name,
          base: bases.find((entry) => entry.code === station.code)?.stages ?? station.stages,
        }))}
        today={today}
      />
    </Suspense>
  );
}
