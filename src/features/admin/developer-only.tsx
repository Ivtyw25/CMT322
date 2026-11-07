'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { routes } from '@/config/routes';
import { useStaffSession } from '@/lib/staff-session';

/**
 * Announcements, map items and progress updates are the project developer's tools. The authority
 * has no link to them; one who opens the address anyway goes back to the dashboard.
 */
export function DeveloperOnly({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { staff } = useStaffSession();
  const redirect = staff !== null && staff.role !== 'developer';
  useEffect(() => {
    if (redirect) router.replace(routes.admin.dashboard);
  }, [redirect, router]);
  if (!staff || redirect) return null;
  return children;
}
