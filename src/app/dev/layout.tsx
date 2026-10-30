import { notFound } from 'next/navigation';
import { SiteShell } from '@/components/layout/site-shell';
import { devGalleryEnabled } from '@/lib/dev-gallery';

/** Development tools sit inside the real shell so the live header and footer can be tried. */
export default function DevLayout({ children }: LayoutProps<'/'>) {
  if (!devGalleryEnabled) notFound();
  return <SiteShell>{children}</SiteShell>;
}
