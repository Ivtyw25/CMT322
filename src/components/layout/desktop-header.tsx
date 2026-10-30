'use client';

import { ChevronDown, ChevronUp, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { routes } from '@/config/routes';
import { commonCopy } from '@/content/common';
import { navCopy } from '@/content/nav';
import { buttonVariants } from '@/components/ui/button-variants';
import { VisuallyHidden } from '@/components/ui/visually-hidden';
import { useAnnounce } from '@/lib/announce/announcer';
import { cn } from '@/lib/cn';
import { useMediaQuery } from '@/lib/dom/use-media-query';
import { useCurrentPath } from '@/lib/navigation/use-current-path';
import { useSession } from '@/lib/session';
import { AccountMenu } from './account-menu';
import { AppearanceMenu } from './appearance-menu';
import { Container } from './container';
import { Logo } from './logo';
import { currentGroupId, navGroupList, type NavGroupId } from './nav-groups';
import { NavPanel } from './nav-panel';
import type { ThemePreference } from '@/lib/theme/theme';
import type { ShellData } from './shell-data';
import { useOverHero } from './use-over-hero';

export type HeaderVariant = 'solid' | 'transparent';

/** Fixed state for the components gallery. The real header never gets this. */
export type DesktopHeaderPreview = {
  variant: HeaderVariant;
  auth: 'guest' | 'signed-in';
  openPanel: NavGroupId | null;
  appearanceOpen?: boolean;
  accountOpen?: boolean;
  currentGroup?: NavGroupId | null;
  /** Page the nav panel marks as current. */
  currentPath?: string;
  /** Option marked as chosen in the appearance menu. */
  appearanceSelected?: ThemePreference;
};

type DesktopHeaderProps = { data: ShellData; preview?: DesktopHeaderPreview; className?: string };

const AUTH_PATHS: readonly string[] = [
  routes.account.login,
  routes.account.signup,
  routes.account.forgotPassword,
];

export function DesktopHeader({ data, preview, className }: DesktopHeaderProps) {
  const pathname = usePathname();
  const currentPath = useCurrentPath();
  const { signOut, status } = useSession();
  const loginRef = useRef<HTMLAnchorElement>(null);
  const focusLoginAfterSignOut = useRef(false);
  const announce = useAnnounce();
  const { isHome, overHero } = useOverHero();
  const wide = useMediaQuery('(min-width: 64rem)');
  const uid = useId();
  const rootRef = useRef<HTMLElement>(null);
  const triggerRefs = useRef<Partial<Record<NavGroupId, HTMLButtonElement | null>>>({});
  const focusFirstLink = useRef(false);

  // A panel belongs to the page it was opened on, so a route change closes it.
  const [opened, setOpened] = useState<{ id: NavGroupId; pathname: string } | null>(null);
  const [appearanceOpen, setAppearanceOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  // Crossing the 1024 px line resets everything, so a panel never comes back after a resize.
  const [lastWide, setLastWide] = useState(wide);
  if (lastWide !== wide) {
    setLastWide(wide);
    setOpened(null);
    setAppearanceOpen(false);
    setAccountOpen(false);
  }

  const livePanel = wide && opened?.pathname === pathname ? opened.id : null;
  const openPanel = preview ? preview.openPanel : livePanel;
  const appearanceIsOpen = preview ? Boolean(preview.appearanceOpen) : appearanceOpen;
  const accountIsOpen = preview ? Boolean(preview.accountOpen) : accountOpen;
  const variant: HeaderVariant = preview ? preview.variant : overHero ? 'transparent' : 'solid';
  const onHero = variant === 'transparent';
  const activeGroup = preview ? (preview.currentGroup ?? null) : currentGroupId(pathname);

  const closePanel = useCallback(() => setOpened(null), []);
  const openGroup = useCallback(
    (id: NavGroupId) => {
      setOpened({ id, pathname });
      setAppearanceOpen(false);
      setAccountOpen(false);
    },
    [pathname],
  );

  // Click or tap outside the header closes the panel.
  useEffect(() => {
    if (preview || !livePanel) return;
    function onPointerDown(event: PointerEvent) {
      if (event.target instanceof Node && !rootRef.current?.contains(event.target)) closePanel();
    }
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [preview, livePanel, closePanel]);

  // Arrow Down on a closed trigger opens the panel and lands on its first link.
  useEffect(() => {
    if (focusFirstLink.current && livePanel) {
      focusFirstLink.current = false;
      document
        .getElementById(`${uid}-${livePanel}`)
        ?.querySelector<HTMLElement>('a[href]')
        ?.focus();
    }
  }, [livePanel, uid]);

  function focusTrigger(index: number) {
    const group = navGroupList[(index + navGroupList.length) % navGroupList.length];
    if (!group) return;
    triggerRefs.current[group.id]?.focus();
    if (livePanel) openGroup(group.id);
  }

  function onTriggerKeyDown(event: React.KeyboardEvent, index: number) {
    const group = navGroupList[index];
    if (!group) return;
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        focusFirstLink.current = true;
        if (livePanel === group.id) {
          focusFirstLink.current = false;
          document
            .getElementById(`${uid}-${group.id}`)
            ?.querySelector<HTMLElement>('a[href]')
            ?.focus();
        } else openGroup(group.id);
        break;
      case 'ArrowRight':
        event.preventDefault();
        focusTrigger(index + 1);
        break;
      case 'ArrowLeft':
        event.preventDefault();
        focusTrigger(index - 1);
        break;
      case 'Home':
        event.preventDefault();
        focusTrigger(0);
        break;
      case 'End':
        event.preventDefault();
        focusTrigger(navGroupList.length - 1);
        break;
    }
  }

  function onPanelKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    event.preventDefault();
    const links = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('a[href]'));
    const at = links.indexOf(document.activeElement as HTMLElement);
    const next = event.key === 'ArrowDown' ? at + 1 : at - 1;
    links[(next + links.length) % links.length]?.focus();
  }

  function onItemKeyDown(event: React.KeyboardEvent, id: NavGroupId) {
    if (event.key === 'Escape' && livePanel === id) {
      event.preventDefault();
      closePanel();
      triggerRefs.current[id]?.focus();
    }
  }

  function onItemBlur(event: React.FocusEvent<HTMLLIElement>) {
    const next = event.relatedTarget;
    if (next instanceof Node && !event.currentTarget.contains(next)) closePanel();
  }

  // After "Log out" the chip is gone: focus lands on "Log in" once the header has switched.
  useEffect(() => {
    if (!focusLoginAfterSignOut.current || status !== 'guest') return;
    focusLoginAfterSignOut.current = false;
    requestAnimationFrame(() => loginRef.current?.focus());
  }, [status]);

  function handleSignOut() {
    focusLoginAfterSignOut.current = true;
    signOut();
    announce(commonCopy.announcements.loggedOut);
  }

  const showLogin = !AUTH_PATHS.includes(pathname);

  return (
    <header
      ref={rootRef}
      data-header={preview ? undefined : 'desktop'}
      className={cn(
        'z-40 w-full border-b transition-colors duration-(--duration-base) ease-(--ease-standard)',
        preview ? 'relative' : isHome ? 'fixed inset-x-0 top-0' : 'sticky top-0',
        onHero ? 'border-static-white/20 bg-transparent' : 'border-gray-200 bg-surface',
        className,
      )}
    >
      <Container className="relative">
        <div className="flex h-header items-center justify-between">
          <Logo tone={onHero ? 'onDark' : 'default'} dataLogo />

          <nav aria-label={commonCopy.landmarks.mainNav}>
            <ul className="flex items-start gap-1">
              {navGroupList.map((group, index) => {
                const open = openPanel === group.id;
                const current = activeGroup === group.id;
                const panelId = `${uid}-${group.id}`;
                const Chevron = open ? ChevronUp : ChevronDown;
                return (
                  <li
                    key={group.id}
                    onKeyDown={(event) => onItemKeyDown(event, group.id)}
                    onBlur={onItemBlur}
                  >
                    <button
                      type="button"
                      ref={(node) => {
                        triggerRefs.current[group.id] = node;
                      }}
                      aria-expanded={open}
                      aria-controls={open ? panelId : undefined}
                      onClick={() => (open ? closePanel() : openGroup(group.id))}
                      onKeyDown={(event) => onTriggerKeyDown(event, index)}
                      className={cn(
                        'hit-area relative flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-2',
                        'transition-colors duration-(--duration-base) ease-(--ease-standard)',
                        current ? 'type-body-s-semibold' : 'type-body-s-medium',
                        open
                          ? onHero
                            ? 'bg-surface text-primary-700'
                            : 'bg-primary-50 text-primary-700'
                          : onHero
                            ? 'text-static-white hover:bg-static-glass focus-visible:outline-static-white'
                            : current
                              ? 'text-primary-700 hover:bg-gray-100'
                              : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900',
                      )}
                    >
                      {group.label}
                      {current ? <VisuallyHidden>{navCopy.currentGroup}</VisuallyHidden> : null}
                      <Chevron aria-hidden className="size-4 shrink-0" />
                      {current && !open ? (
                        <span
                          aria-hidden
                          className="absolute inset-x-3 -bottom-7.25 h-0.75 rounded-full bg-primary-600"
                        />
                      ) : null}
                    </button>
                    {open ? (
                      <NavPanel
                        id={panelId}
                        group={group}
                        data={data}
                        pathname={preview?.currentPath ?? pathname}
                        currentPath={currentPath}
                        showAccountNote={preview ? preview.auth === 'guest' : true}
                        onNavigate={closePanel}
                        onKeyDown={onPanelKeyDown}
                        className="absolute inset-x-0 top-full mt-2.25"
                      />
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <AppearanceMenu
              onHero={onHero}
              open={appearanceIsOpen}
              onOpenChange={(next) => {
                setAppearanceOpen(next);
                if (next) {
                  closePanel();
                  setAccountOpen(false);
                }
              }}
              preview={Boolean(preview)}
              previewSelected={preview ? (preview.appearanceSelected ?? 'system') : undefined}
            />
            {!preview || preview.auth === 'guest' ? (
              <div data-auth={preview ? undefined : 'guest'} className="flex">
                {showLogin ? (
                  <Link
                    href={navCopy.header.logInHref(currentPath)}
                    ref={loginRef}
                    className={cn(
                      buttonVariants({ variant: 'secondary' }),
                      onHero &&
                        'border-static-white/60 bg-transparent text-static-white hover:border-static-white/60 hover:bg-static-glass active:bg-static-glass',
                    )}
                  >
                    <User aria-hidden className="size-4.5" />
                    {navCopy.header.logIn}
                  </Link>
                ) : null}
              </div>
            ) : null}
            {!preview || preview.auth === 'signed-in' ? (
              <div data-auth={preview ? undefined : 'signed-in'} className="flex">
                <AccountMenu
                  user={data.user}
                  onHero={onHero}
                  open={accountIsOpen}
                  onOpenChange={(next) => {
                    setAccountOpen(next);
                    if (next) {
                      closePanel();
                      setAppearanceOpen(false);
                    }
                  }}
                  onSignOut={handleSignOut}
                  onCloseAutoFocus={(event) => {
                    if (focusLoginAfterSignOut.current) event.preventDefault();
                  }}
                  preview={Boolean(preview)}
                />
              </div>
            ) : null}
          </div>
        </div>
      </Container>
    </header>
  );
}
