'use client';

import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useId, useRef, useState } from 'react';
import { routes } from '@/config/routes';
import { commonCopy } from '@/content/common';
import { navCopy } from '@/content/nav';
import { IconButton } from '@/components/ui/icon-button';
import { useAnnounce } from '@/lib/announce/announcer';
import { cn } from '@/lib/cn';
import { useMediaQuery } from '@/lib/dom/use-media-query';
import { useCurrentPath } from '@/lib/navigation/use-current-path';
import { useSession } from '@/lib/session';
import { AppearanceMenu } from './appearance-menu';
import type { HeaderVariant } from './desktop-header';
import { Logo } from './logo';
import { MobileDrawer } from './mobile-drawer';
import type { ShellData } from './shell-data';
import { useOverHero } from './use-over-hero';

/** Regions of the page that stop taking focus while the drawer is open. */
const INERT_SELECTOR = '[data-shell-inert]';

/** Fixed state for the components gallery. The real header never gets this. */
export type MobileHeaderPreview = {
  variant: HeaderVariant;
  auth: 'guest' | 'signed-in';
  menuOpen: boolean;
  appearanceOpen?: boolean;
  /** Page the drawer marks as current. */
  currentPath?: string;
};

type MobileHeaderProps = { data: ShellData; preview?: MobileHeaderPreview; className?: string };

export function MobileHeader({ data, preview, className }: MobileHeaderProps) {
  const pathname = usePathname();
  const currentPath = useCurrentPath();
  const { signOut } = useSession();
  const announce = useAnnounce();
  const { isHome, overHero } = useOverHero();
  const wide = useMediaQuery('(min-width: 64rem)');
  const generatedId = useId();
  const menuId = preview ? `${generatedId}-menu` : 'site-menu';
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  // The drawer belongs to the page it was opened on, so any route change closes it.
  const [openedOn, setOpenedOn] = useState<string | null>(null);
  const [appearanceOpen, setAppearanceOpen] = useState(false);
  // Crossing the 1024 px line resets everything, so the drawer never comes back after a resize.
  const [lastWide, setLastWide] = useState(wide);
  if (lastWide !== wide) {
    setLastWide(wide);
    setOpenedOn(null);
    setAppearanceOpen(false);
  }

  const liveOpen = !wide && openedOn === pathname;
  const menuOpen = preview ? preview.menuOpen : liveOpen;
  const appearanceIsOpen = preview ? Boolean(preview.appearanceOpen) : appearanceOpen;
  const variant: HeaderVariant = preview
    ? preview.variant
    : overHero && !menuOpen && !appearanceIsOpen
      ? 'transparent'
      : 'solid';
  const onHero = variant === 'transparent';

  // Open drawer: lock page scroll and make everything outside the bar inert.
  useEffect(() => {
    if (preview || !liveOpen) return;
    const root = document.documentElement;
    const regions = document.querySelectorAll(INERT_SELECTOR);
    root.dataset.scrollLocked = '';
    regions.forEach((region) => region.setAttribute('inert', ''));
    return () => {
      delete root.dataset.scrollLocked;
      regions.forEach((region) => region.removeAttribute('inert'));
    };
  }, [preview, liveOpen]);

  const close = () => setOpenedOn(null);

  function handleSignOut() {
    signOut();
    announce(commonCopy.announcements.loggedOut);
    close();
    menuButtonRef.current?.focus();
  }

  function onKeyDown(event: React.KeyboardEvent) {
    if (event.key === 'Escape' && liveOpen) {
      event.preventDefault();
      close();
      menuButtonRef.current?.focus();
    }
  }

  return (
    <header
      data-header={preview ? undefined : 'mobile'}
      onKeyDown={onKeyDown}
      className={cn(
        'z-40 w-full border-b transition-colors duration-(--duration-base) ease-(--ease-standard)',
        preview ? 'relative' : isHome ? 'fixed inset-x-0 top-0' : 'sticky top-0',
        onHero ? 'border-static-white/20 bg-transparent' : 'border-gray-200 bg-surface',
        className,
      )}
    >
      <div className="flex h-header-mobile items-center gap-2 px-4 md:px-8">
        <Logo size="compact" tone={onHero ? 'onDark' : 'default'} onClick={close} dataLogo />
        <div className="flex-1" />
        <AppearanceMenu
          compact
          onHero={onHero}
          open={appearanceIsOpen}
          onOpenChange={setAppearanceOpen}
          preview={Boolean(preview)}
        />
        {!preview || preview.auth === 'signed-in' ? (
          <Link
            data-auth={preview ? undefined : 'signed-in'}
            href={routes.account.profile}
            aria-label={navCopy.mobile.profileLink(data.user.fullName)}
            // Initials drawn with CSS: the label already names the person, so no visible text to match.
            data-initials={data.user.initials}
            className="hit-area flex size-9 shrink-0 items-center justify-center rounded-full bg-primary-100 type-body-xs-semibold text-primary-700 transition-colors duration-(--duration-fast) before:content-[attr(data-initials)] hover:bg-primary-200"
          />
        ) : null}
        <IconButton
          ref={menuButtonRef}
          variant="plain"
          aria-label={menuOpen ? navCopy.mobile.closeMenu : navCopy.mobile.openMenu}
          aria-expanded={menuOpen}
          aria-controls={menuId}
          onClick={() => setOpenedOn(liveOpen ? null : pathname)}
          className={cn(onHero && 'text-static-white hover:bg-static-glass')}
        >
          {menuOpen ? (
            <X aria-hidden className="size-5" />
          ) : (
            <Menu aria-hidden className="size-5" />
          )}
        </IconButton>
      </div>
      {menuOpen ? (
        <MobileDrawer
          id={menuId}
          user={data.user}
          pathname={preview?.currentPath ?? pathname}
          currentPath={currentPath}
          onNavigate={close}
          onSignOut={handleSignOut}
          previewAuth={preview?.auth}
          className={cn(
            'absolute inset-x-0 top-full',
            preview ? 'max-h-none' : 'h-[calc(100dvh-3.8125rem)]',
          )}
        />
      ) : null}
    </header>
  );
}
