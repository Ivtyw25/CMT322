import { SiteShell } from '@/components/layout/site-shell';

/** Every public page: header, site notice, footer. */
export default function SiteLayout({ children }: LayoutProps<'/'>) {
  return <SiteShell>{children}</SiteShell>;
}
