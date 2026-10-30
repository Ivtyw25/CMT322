import { notFound } from 'next/navigation';
import { SiteShell } from '@/components/layout/site-shell';

/** Development tools sit inside the real shell so the live header and footer can be tried. */
export default function DevLayout({ children }: LayoutProps<'/'>) {
  if (process.env.NODE_ENV === 'production') notFound();
  return <SiteShell>{children}</SiteShell>;
}
