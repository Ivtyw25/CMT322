import { SiteShell } from '@/components/layout/site-shell';

/** Full-height pages (Map view, Route view): header and site notice, no footer. */
export default function WorkspaceLayout({ children }: LayoutProps<'/'>) {
  return <SiteShell layout="workspace">{children}</SiteShell>;
}
