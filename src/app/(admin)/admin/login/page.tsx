import { notFound } from 'next/navigation';
import { adminCopy } from '@/content/admin';
import { getStaffMemberByRole } from '@/data/api/staff';
import { StaffLogin } from '@/features/admin/login/staff-login';

export const metadata = adminCopy.meta.login;

export default async function AdminLoginPage() {
  const [authority, developer] = await Promise.all([
    getStaffMemberByRole('authority'),
    getStaffMemberByRole('developer'),
  ]);
  if (!authority || !developer) notFound();
  return <StaffLogin authority={authority} developer={developer} />;
}
