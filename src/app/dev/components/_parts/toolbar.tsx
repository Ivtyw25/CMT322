'use client';

import { devCopy } from '@/content/dev';
import { resetNoticeDismissal, useNoticeDismissed } from '@/components/layout/notification-bar';
import { ThemeSwitcher } from '@/components/patterns/theme-switcher';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useSession } from '@/lib/session';

/** Real controls for the gallery: theme, simulated sign-in, and the dismissed notice. */
export function GalleryToolbar() {
  const { status, signIn, signOut } = useSession();
  const noticeDismissed = useNoticeDismissed();
  const copy = devCopy.toolbar;
  return (
    <div
      role="region"
      aria-label={copy.label}
      className="sticky top-15.25 z-30 border-b border-gray-200 bg-surface lg:top-23.25"
    >
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 py-3">
        <div className="flex flex-wrap items-center gap-3">
          <span className="type-body-s-medium text-gray-900">{copy.theme}</span>
          <ThemeSwitcher className="w-72 max-w-full" />
        </div>
        <Switch
          label={copy.signedIn}
          checked={status === 'signed-in'}
          onCheckedChange={(checked) => (checked ? signIn() : signOut())}
        />
        <Button variant="secondary" disabled={!noticeDismissed} onClick={resetNoticeDismissal}>
          {copy.showNotice}
        </Button>
      </div>
    </div>
  );
}
