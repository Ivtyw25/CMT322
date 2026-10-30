import { getSiteNotice } from '@/data/api/announcements';
import { NotificationBar } from './notification-bar';
import { ProtectedRoute } from './protected-route';
import { SiteFooter } from './site-footer';
import { SiteHeader } from './site-header';
import { SkipLink } from './skip-link';
import { loadShellData } from './shell-data';

/**
 * Everything around a page: skip link, header, site notice, `<main id="main">` and footer.
 * Pages render only their own content; this owns the one `<main>`.
 */
export async function SiteShell({ children }: { children: React.ReactNode }) {
  const [data, notice] = await Promise.all([loadShellData(), getSiteNotice()]);
  return (
    <div className="relative flex min-h-dvh flex-col">
      <SkipLink />
      <SiteHeader data={data} />
      {notice ? (
        <NotificationBar notice={{ id: notice.id, title: notice.title, message: notice.message }} />
      ) : null}
      <main id="main" tabIndex={-1} data-shell-inert="" className="flex-1">
        <ProtectedRoute>{children}</ProtectedRoute>
      </main>
      <SiteFooter />
    </div>
  );
}
