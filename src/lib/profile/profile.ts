'use client';

import { useSyncExternalStore } from 'react';
import { readStorage, writeStorage } from '@/lib/dom/safe-storage';
import type { NotificationPreferenceId } from '@/data/models/account';

export type ProfileChanges = {
  name?: string;
  email?: string;
  phone?: string;
  homeArea?: string;
  notifications?: Partial<Record<NotificationPreferenceId, boolean>>;
};
const key = 'mlc-profile';
let memory: string | null = null;
const listeners = new Set<() => void>();
const server = () => null;
const snapshot = () => memory ?? readStorage('local', key);
function parseProfile(raw: string | null): ProfileChanges {
  try {
    const value: unknown = JSON.parse(raw ?? '{}');
    if (!value || typeof value !== 'object') return {};
    const stored = value as Record<string, unknown>;
    const result: ProfileChanges = {};
    for (const field of ['name', 'email', 'phone', 'homeArea'] as const) {
      if (typeof stored[field] === 'string') result[field] = stored[field];
    }
    if (stored.notifications && typeof stored.notifications === 'object') {
      const notifications = stored.notifications as Record<string, unknown>;
      result.notifications = {};
      for (const id of [
        'ticket-updates',
        'road-closures',
        'night-works',
        'construction-milestones',
        'newsletter',
      ] as const) {
        if (typeof notifications[id] === 'boolean') result.notifications[id] = notifications[id];
      }
    }
    return result;
  } catch {
    return {};
  }
}
export function readProfile(): ProfileChanges {
  return parseProfile(snapshot());
}
export function saveProfile(changes: ProfileChanges) {
  memory = JSON.stringify({ ...readProfile(), ...changes });
  writeStorage('local', key, memory);
  listeners.forEach((notify) => notify());
}
export function clearProfile() {
  memory = '{}';
  writeStorage('local', key, memory);
  listeners.forEach((notify) => notify());
}
function subscribe(notify: () => void) {
  listeners.add(notify);
  const changed = (event: StorageEvent) => {
    if (event.key === key || event.key === null) {
      memory = null;
      notify();
    }
  };
  window.addEventListener('storage', changed);
  return () => {
    listeners.delete(notify);
    window.removeEventListener('storage', changed);
  };
}
export function useProfile() {
  const raw = useSyncExternalStore(subscribe, snapshot, server);
  return parseProfile(raw);
}
