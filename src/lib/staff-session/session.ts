import { readStorage, removeStorage, writeStorage } from '@/lib/dom/safe-storage';

/** The simulated staff sign-in, separate from the commuter session. */
export const STAFF_SESSION_STORAGE_KEY = 'mlc-staff-session';

export type StaffSessionStatus = 'loading' | 'signed-out' | 'signed-in';

// A sign-in still lasts for this page view when browser storage is blocked.
let temporaryStaffId: string | null = null;

export function readStaffId(): string | null {
  const raw = readStorage('local', STAFF_SESSION_STORAGE_KEY);
  if (!raw) return temporaryStaffId;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed === 'object' && parsed !== null && 'staffId' in parsed) {
      return typeof parsed.staffId === 'string' ? parsed.staffId : null;
    }
  } catch {
    // A broken value counts as signed out.
  }
  return null;
}

export function writeStaffSession(staffId: string): void {
  const raw = JSON.stringify({ staffId });
  writeStorage('local', STAFF_SESSION_STORAGE_KEY, raw);
  temporaryStaffId = readStorage('local', STAFF_SESSION_STORAGE_KEY) === raw ? null : staffId;
}

export function clearStaffSession(): void {
  temporaryStaffId = null;
  removeStorage('local', STAFF_SESSION_STORAGE_KEY);
}

const listeners = new Set<() => void>();

export function notifyStaffSessionChange(): void {
  listeners.forEach((notify) => notify());
}

/** For useSyncExternalStore: this tab's changes plus the `storage` event from other tabs. */
export function subscribeToStaffSession(onChange: () => void): () => void {
  listeners.add(onChange);
  const onStorage = (event: StorageEvent) => {
    if (event.key === STAFF_SESSION_STORAGE_KEY || event.key === null) {
      temporaryStaffId = null;
      onChange();
    }
  };
  window.addEventListener('storage', onStorage);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener('storage', onStorage);
  };
}
