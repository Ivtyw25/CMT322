'use client';

import { useProfile } from '@/lib/profile/profile';
import { givenName, initialsOf } from '@/lib/format/person';
import type { ShellUser } from './shell-data';

/** Keep the header and account page in sync after local demo profile edits. */
export function useShellUser(user: ShellUser, preview = false): ShellUser {
  const changes = useProfile();
  if (preview) return user;
  const fullName = changes.name ?? user.fullName;
  return {
    ...user,
    fullName,
    givenName: givenName(fullName),
    initials: initialsOf(fullName),
    email: changes.email ?? user.email,
  };
}
