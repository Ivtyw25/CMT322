import { Suspense } from 'react';
import { adminCopy } from '@/content/admin';
import { getAreas } from '@/data/api/areas';
import { getStaffAnnouncements } from '@/data/api/staff-content';
import { AnnouncementsPage } from '@/features/admin/announcements/announcements-page';

export const metadata = adminCopy.meta.announcements;

export default async function AdminAnnouncementsPage() {
  const [base, areas] = await Promise.all([getStaffAnnouncements(), getAreas()]);
  return (
    <Suspense>
      <AnnouncementsPage
        base={base}
        areas={areas.map((area) => ({ id: area.id, label: area.label }))}
      />
    </Suspense>
  );
}
