'use client';

import { Bell, ChevronDown, LogOut, MapPin, Ticket, User } from 'lucide-react';
import { DropdownMenu } from 'radix-ui';
import Link from 'next/link';
import { navCopy } from '@/content/nav';
import { cn } from '@/lib/cn';
import { useHeaderMenuOffset } from '@/lib/dom/use-header-menu-offset';
import { useReleaseFocus } from '@/lib/dom/use-release-focus';
import type { ShellUser } from './shell-data';

/** Space between the header's bottom edge and the menu (px). */
const MENU_GAP = 8;

const itemIcons = {
  profile: User,
  reports: Ticket,
  stations: MapPin,
  notifications: Bell,
} as const;

const itemClass = cn(
  'hit-area flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.25 outline-none',
  'type-body-s-medium text-gray-800 transition-colors duration-(--duration-fast)',
  'data-[highlighted]:bg-gray-100 data-[highlighted]:text-gray-900',
  'focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary-600',
);

export type AccountMenuProps = {
  user: ShellUser;
  /** Transparent header over the hero: white label and chevron. */
  onHero?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSignOut: () => void;
  /** Lets the header take focus itself after "Log out", when the chip is gone. */
  onCloseAutoFocus?: (event: Event) => void;
  preview?: boolean;
};

/** Signed-in chip and its menu (Figma 101:4008). Log out is a button; the rest are links. */
export function AccountMenu({
  user,
  onHero = false,
  open,
  onOpenChange,
  onSignOut,
  onCloseAutoFocus,
  preview = false,
}: AccountMenuProps) {
  useReleaseFocus(preview);
  const { triggerRef, sideOffset, measure } = useHeaderMenuOffset(MENU_GAP, open);

  function handleOpenChange(next: boolean) {
    if (next) measure();
    onOpenChange?.(next);
  }

  return (
    <DropdownMenu.Root modal={false} open={open} onOpenChange={handleOpenChange}>
      <DropdownMenu.Trigger asChild>
        <button
          ref={triggerRef}
          type="button"
          aria-label={navCopy.header.accountMenuLabel(user.fullName)}
          className={cn(
            'hit-area flex cursor-pointer items-center gap-2 rounded-lg py-1 pr-2 pl-1',
            'transition-colors duration-(--duration-fast) ease-(--ease-standard)',
            onHero
              ? 'text-static-white hover:bg-static-glass data-[state=open]:bg-surface data-[state=open]:text-primary-700'
              : 'text-gray-800 hover:bg-gray-100 data-[state=open]:bg-primary-50',
          )}
        >
          <span
            aria-hidden
            // Drawn with CSS so the chip's visible text is just the name, which its label contains.
            data-initials={user.initials}
            className="flex size-8 items-center justify-center rounded-full bg-primary-100 type-body-xs-semibold text-primary-800 before:content-[attr(data-initials)]"
          />
          <span className="max-w-40 truncate type-body-s-medium">{user.givenName}</span>
          <ChevronDown aria-hidden className="size-4 shrink-0" />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content
        align="end"
        sideOffset={sideOffset}
        collisionPadding={16}
        onCloseAutoFocus={onCloseAutoFocus}
        className={cn(
          'z-50 w-75 max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-gray-200 bg-surface shadow-panel',
          'data-[state=closed]:animate-menu-out data-[state=open]:animate-menu-in',
        )}
      >
        <div className="flex items-center gap-3 px-4.5 py-4">
          <span
            aria-hidden
            className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-600 type-body-s-semibold text-static-white"
          >
            {user.initials}
          </span>
          <div className="flex min-w-0 flex-col">
            <p className="type-body-s-semibold break-words text-gray-900">{user.fullName}</p>
            <p className="type-body-xs break-words text-gray-500">{user.email}</p>
          </div>
        </div>
        <div className="border-y border-gray-200 p-1.5">
          {navCopy.account.items.map((item) => {
            const Icon = itemIcons[item.id];
            return (
              <DropdownMenu.Item key={item.id} asChild className={itemClass}>
                <Link href={item.href}>
                  <Icon aria-hidden className="size-4 shrink-0" />
                  {item.label}
                </Link>
              </DropdownMenu.Item>
            );
          })}
        </div>
        <div className="p-1.5">
          <DropdownMenu.Item onSelect={onSignOut} className={cn(itemClass, 'px-3 py-2.5')}>
            <LogOut aria-hidden className="size-4 shrink-0" />
            {navCopy.account.logOut}
          </DropdownMenu.Item>
        </div>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
