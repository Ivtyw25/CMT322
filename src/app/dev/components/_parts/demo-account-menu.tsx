'use client';

import { AccountMenu } from '@/components/layout/account-menu';
import type { ShellUser } from '@/components/layout/shell-data';

const doNothing = () => undefined;

/** The account menu held open, for the gallery. */
export function DemoAccountMenu({ user }: { user: ShellUser }) {
  return <AccountMenu user={user} open onSignOut={doNothing} preview />;
}
