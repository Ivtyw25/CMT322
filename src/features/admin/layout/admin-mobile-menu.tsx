'use client';

import { X } from 'lucide-react';
import { Dialog } from 'radix-ui';
import { adminCopy } from '@/content/admin';
import type { StaffMember } from '@/data/models/staff';
import { IconButton } from '@/components/ui/icon-button';
import { AdminSidebar } from './admin-sidebar';

type AdminMobileMenuProps = {
  id: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  staff: StaffMember;
  pathname: string;
  unclaimedCount: number;
  onSignOut: () => void;
};

/** Below 1024 px the sidebar is a drawer behind the menu button. Focus is trapped; Escape closes. */
export function AdminMobileMenu({
  id,
  open,
  onOpenChange,
  staff,
  pathname,
  unclaimedCount,
  onSignOut,
}: AdminMobileMenuProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-static-scrim-bar data-[state=closed]:animate-menu-out data-[state=open]:animate-panel-in lg:hidden" />
        <Dialog.Content
          id={id}
          aria-describedby={undefined}
          className="fixed inset-y-0 left-0 z-50 flex w-[min(15.5rem,calc(100vw-2.5rem))] flex-col shadow-drawer outline-none data-[state=closed]:animate-menu-out data-[state=open]:animate-panel-in lg:hidden"
        >
          <Dialog.Title className="sr-only">{adminCopy.shell.menuTitle}</Dialog.Title>
          <AdminSidebar
            staff={staff}
            pathname={pathname}
            unclaimedCount={unclaimedCount}
            onNavigate={() => onOpenChange(false)}
            onSignOut={onSignOut}
            className="h-full"
          />
          <Dialog.Close asChild>
            <IconButton
              variant="plain"
              aria-label={adminCopy.shell.closeMenu}
              className="absolute top-4 right-2 text-static-white hover:bg-static-glass"
            >
              <X aria-hidden className="size-5" />
            </IconButton>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
