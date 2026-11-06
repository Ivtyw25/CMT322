import { readStorage, removeStorage, writeStorage } from '@/lib/dom/safe-storage';

/** The simulated sign-in lives in localStorage so it survives reloads and syncs across tabs. */
export const SESSION_STORAGE_KEY = 'mlc-session';
export const MOCK_USER_ID = 'user-meiling';

export type SessionStatus = 'loading' | 'guest' | 'signed-in';

// A successful explicit sign-in still lasts for this page view when browser storage is blocked.
let temporaryUserId: string | null = null;

export function readSessionUserId(): string | null {
  const raw = readStorage('local', SESSION_STORAGE_KEY);
  if (!raw) return temporaryUserId;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed === 'object' && parsed !== null && 'userId' in parsed) {
      return typeof parsed.userId === 'string' ? parsed.userId : null;
    }
  } catch {
    // A broken value counts as signed out.
  }
  return null;
}

export function writeSession(userId: string): void {
  const raw = JSON.stringify({ userId });
  writeStorage('local', SESSION_STORAGE_KEY, raw);
  temporaryUserId = readStorage('local', SESSION_STORAGE_KEY) === raw ? null : userId;
}

export function clearSession(): void {
  temporaryUserId = null;
  removeStorage('local', SESSION_STORAGE_KEY);
}

const listeners = new Set<() => void>();

export function notifySessionChange(): void {
  listeners.forEach((notify) => notify());
}

/** For useSyncExternalStore: this tab's changes plus the `storage` event from other tabs. */
export function subscribeToSession(onChange: () => void): () => void {
  listeners.add(onChange);
  const onStorage = (event: StorageEvent) => {
    if (event.key === SESSION_STORAGE_KEY || event.key === null) {
      temporaryUserId = null;
      onChange();
    }
  };
  window.addEventListener('storage', onStorage);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener('storage', onStorage);
  };
}

/**
 * Set while "Log out" is taking the visitor off a protected page, so the route guard does not
 * send them to Log in on the way to Home.
 */
let leavingProtectedPage = false;
export const beginLeavingProtectedPage = () => {
  leavingProtectedPage = true;
};
export const endLeavingProtectedPage = () => {
  leavingProtectedPage = false;
};
export const isLeavingProtectedPage = () => leavingProtectedPage;
