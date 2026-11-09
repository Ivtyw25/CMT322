import { Suspense } from 'react';
import { adminCopy } from '@/content/admin';
import { getProgressUpdates } from '@/data/api/progress-updates';
import { getStations } from '@/data/api/stations';
import { ProgressPage } from '@/features/admin/progress/progress-page';

export const metadata = adminCopy.meta.progress;

export default async function AdminProgressPage() {
  const [base, stations] = await Promise.all([getProgressUpdates(), getStations()]);
  return (
    <Suspense>
      <ProgressPage
        base={base}
        stations={stations.map((station) => ({ code: station.code, name: station.name }))}
      />
    </Suspense>
  );
}
