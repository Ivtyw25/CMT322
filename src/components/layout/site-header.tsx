import { DesktopHeader } from './desktop-header';
import { MobileHeader } from './mobile-header';
import type { ShellData } from './shell-data';

/**
 * The site header. Below 1024 px the mobile bar and drawer show; from 1024 px the desktop header
 * with nav panels. Both are in the page and CSS picks one, so there is no layout jump on load.
 */
export function SiteHeader({ data }: { data: ShellData }) {
  return (
    <>
      <MobileHeader data={data} className="lg:hidden" />
      <DesktopHeader data={data} className="hidden lg:block" />
    </>
  );
}
