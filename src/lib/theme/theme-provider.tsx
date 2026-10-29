'use client';

import { createContext, use, useEffect, useMemo, useSyncExternalStore } from 'react';
import {
  applyTheme,
  DARK_QUERY,
  readStoredPreference,
  resolveTheme,
  storePreference,
  THEME_STORAGE_KEY,
  type ResolvedTheme,
  type ThemePreference,
} from './theme';

type ThemeContextValue = {
  preference: ThemePreference;
  resolvedTheme: ResolvedTheme;
  setPreference: (preference: ThemePreference) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

/* The saved choice is an external store: localStorage plus in-page listeners and other tabs. */
const listeners = new Set<() => void>();
function subscribePreference(onChange: () => void): () => void {
  listeners.add(onChange);
  const onStorage = (event: StorageEvent) => {
    if (event.key === THEME_STORAGE_KEY) onChange();
  };
  window.addEventListener('storage', onStorage);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener('storage', onStorage);
  };
}
function setPreference(preference: ThemePreference): void {
  storePreference(preference);
  listeners.forEach((notify) => notify());
}
const getServerPreference = (): ThemePreference | null => null;

function subscribeSystem(onChange: () => void): () => void {
  const query = window.matchMedia(DARK_QUERY);
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
}
const getSystemIsDark = () => window.matchMedia(DARK_QUERY).matches;
const getServerSystemIsDark = () => false;

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // null on the server and during hydration; the head script has already painted the right theme.
  const stored = useSyncExternalStore(
    subscribePreference,
    readStoredPreference,
    getServerPreference,
  );
  const systemIsDark = useSyncExternalStore(
    subscribeSystem,
    getSystemIsDark,
    getServerSystemIsDark,
  );
  const preference = stored ?? 'system';
  const resolvedTheme = resolveTheme(preference, systemIsDark);

  useEffect(() => {
    if (stored !== null) applyTheme(resolvedTheme);
  }, [stored, resolvedTheme]);

  const value = useMemo(
    () => ({ preference, resolvedTheme, setPreference }),
    [preference, resolvedTheme],
  );
  return <ThemeContext value={value}>{children}</ThemeContext>;
}

export function useTheme(): ThemeContextValue {
  const context = use(ThemeContext);
  if (!context) throw new Error('useTheme must be used inside <ThemeProvider>.');
  return context;
}
