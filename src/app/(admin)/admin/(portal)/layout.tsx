import { AdminShell } from '@/features/admin/layout/admin-shell';

/** Every staff page except log in: sidebar, top bar and the signed-in check. */
export default function PortalLayout({ children }: LayoutProps<'/'>) {
  return <AdminShell>{children}</AdminShell>;
}
