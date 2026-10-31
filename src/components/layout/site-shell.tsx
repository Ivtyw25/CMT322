import { getSiteNotice } from '@/data/api/announcements';
import { cn } from '@/lib/cn';
import { ChromeHeight } from './chrome-height';
import { NotificationBar } from './notification-bar';
import { ProtectedRoute } from './protected-route';
import { SiteFooter } from './site-footer';
import { SiteHeader } from './site-header';
import { SkipLink } from './skip-link';
import { loadShellData } from './shell-data';

type SiteShellProps = {
  children: React.ReactNode;
  /**
   * `standard` (default) ends with the footer. `workspace` (Map view, Route view) has no footer
   * and, from 1024 px, a content area exactly as tall as the space under the header and notice:
   * `calc(100dvh - var(--chrome-h))`. Below 1024 px the page scrolls as usual.
   */
  layout?: 'standard' | 'workspace';
};

/**
 * Everything around a page: skip link, header, site notice, `<main id="main">` and footer.
 * Pages render only their own content; this owns the one `<main>`.
 */
export async function SiteShell({ children, layout = 'standard' }: SiteShellProps) {
  const workspace = layout === 'workspace';
  const [data, notice] = await Promise.all([loadShellData(), getSiteNotice()]);
  return (
    <div className="relative flex min-h-dvh flex-col">
      <SkipLink />
      <SiteHeader data={data} />
      {notice ? (
        <NotificationBar notice={{ id: notice.id, title: notice.title, message: notice.message }} />
      ) : null}
      <main
        id="main"
        tabIndex={-1}
        data-shell-inert=""
        className={cn('flex-1', workspace && 'lg:workspace-height lg:flex-none lg:overflow-hidden')}
      >
        <ProtectedRoute>{children}</ProtectedRoute>
      </main>
      {workspace ? <ChromeHeight /> : <SiteFooter />}
    </div>
  );
}
