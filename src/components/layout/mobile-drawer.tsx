'use client';

import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { commonCopy } from '@/content/common';
import { navCopy } from '@/content/nav';
import { ButtonLink } from '@/components/ui/button-link';
import { ThemeSwitcher } from '@/components/patterns/theme-switcher';
import { cn } from '@/lib/cn';
import { navGroupList } from './nav-groups';
import type { ShellUser } from './shell-data';

type MobileDrawerProps = {
  id: string;
  user: ShellUser;
  pathname: string;
  currentPath: string;
  /** Closes the drawer. Called when any link is chosen, even the current page. */
  onNavigate: () => void;
  onSignOut: () => void;
  /** Gallery only: show one auth variant instead of both, and size to the content. */
  previewAuth?: 'guest' | 'signed-in';
  className?: string;
};

const rowClass =
  'flex min-h-11 items-center gap-2 rounded-lg py-2.5 transition-colors duration-(--duration-fast) ease-(--ease-standard) hover:bg-gray-50 active:bg-gray-50 focus-visible:-outline-offset-2 -mx-2 px-2';

const groupPadding = 'px-5 py-3 md:px-8';

/** The mobile menu (Figma 127:5592): every group expanded, account area, appearance. */
export function MobileDrawer({
  id,
  user,
  pathname,
  currentPath,
  onNavigate,
  onSignOut,
  previewAuth,
  className,
}: MobileDrawerProps) {
  return (
    <nav
      id={id}
      aria-label={commonCopy.landmarks.siteMenu}
      className={cn(
        'overflow-y-auto overscroll-contain bg-surface pt-2 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] shadow-drawer',
        'animate-drawer-in',
        className,
      )}
    >
      {navGroupList.map((group) => (
        <div key={group.id} className={cn('border-b border-gray-200', groupPadding)}>
          <p id={`${id}-${group.id}`} className="pb-1.5 type-body-xs-semibold text-gray-500">
            {group.label}
          </p>
          <ul aria-labelledby={`${id}-${group.id}`} className="flex flex-col gap-0.5">
            {group.items.map((item) => {
              const current = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    aria-current={current ? 'page' : undefined}
                    className={cn(
                      rowClass,
                      current
                        ? 'type-body-m-semibold text-primary-700'
                        : 'type-body-m-medium text-gray-900',
                    )}
                  >
                    <span className="min-w-0 flex-1">{item.label}</span>
                    <ChevronRight
                      aria-hidden
                      className={cn(
                        'mt-0.75 size-4.5 shrink-0 self-start',
                        current ? 'text-primary-700' : 'text-gray-400',
                      )}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}

      {previewAuth !== 'signed-in' ? (
        <div
          data-auth={previewAuth ? undefined : 'guest'}
          className={cn('flex flex-col items-start gap-2.5 py-4', 'px-5 md:px-8')}
        >
          <ButtonLink href={navCopy.header.logInHref(currentPath)} fullWidth onClick={onNavigate}>
            {navCopy.mobile.logIn}
          </ButtonLink>
          <Link
            href={navCopy.mobile.createAccountHref(currentPath)}
            onClick={onNavigate}
            className="hit-area type-body-s-semibold text-primary-700 hover:underline"
          >
            {navCopy.mobile.createAccount}
          </Link>
        </div>
      ) : null}

      {previewAuth !== 'guest' ? (
        <div
          data-auth={previewAuth ? undefined : 'signed-in'}
          className="flex flex-col gap-2.5 px-5 py-4 md:px-8"
        >
          <div className="flex items-center gap-2.5">
            <span
              aria-hidden
              className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary-600 type-body-xs-semibold text-static-white"
            >
              {user.initials}
            </span>
            <div className="flex min-w-0 flex-col">
              <p className="type-body-s-semibold break-words text-gray-900">{user.fullName}</p>
              <p className="type-body-xs break-words text-gray-500">{user.email}</p>
            </div>
          </div>
          <ul className="flex flex-col">
            {navCopy.mobile.accountItemIds.map((itemId) => {
              const item = navCopy.account.items.find((candidate) => candidate.id === itemId);
              if (!item) return null;
              return (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    className={cn(rowClass, 'type-body-m-medium text-gray-900')}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
            <li>
              <button
                type="button"
                onClick={onSignOut}
                className={cn(
                  rowClass,
                  'w-full cursor-pointer text-left type-body-m-medium text-gray-900',
                )}
              >
                {navCopy.account.logOut}
              </button>
            </li>
          </ul>
        </div>
      ) : null}

      <div className="flex flex-col gap-2 border-t border-gray-200 px-5 py-3 md:px-8">
        <p className="type-body-xs-semibold text-gray-500">{navCopy.appearance.title}</p>
        <ThemeSwitcher />
      </div>
    </nav>
  );
}
