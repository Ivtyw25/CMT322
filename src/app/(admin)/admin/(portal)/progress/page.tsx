import { Suspense } from 'react';
import { adminCopy } from '@/content/admin';
import { getStaffProgressUpdates } from '@/data/api/staff-content';
import { getStations } from '@/data/api/stations';
import { ProgressPage } from '@/features/admin/progress/progress-page';

export const metadata = adminCopy.meta.progress;

export default async function AdminProgressPage() {
  const [base, stations] = await Promise.all([getStaffProgressUpdates(), getStations()]);
  return (
    <Suspense>
      <ProgressPage
        base={base}
        stations={stations.map((station) => ({
          code: station.code,
          name: station.name,
          progress: station.progress,
        }))}
      />
    </Suspense>
  );
}
