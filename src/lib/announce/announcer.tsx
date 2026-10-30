'use client';

import { createContext, use, useCallback, useMemo, useState } from 'react';

type AnnounceFn = (message: string) => void;

const AnnouncerContext = createContext<AnnounceFn | null>(null);

/** One polite live region for the whole shell ("Appearance set to Dark", "You are logged out."). */
export function AnnouncerProvider({ children }: { children: React.ReactNode }) {
  const [message, setMessage] = useState('');
  const announce = useCallback<AnnounceFn>((next) => {
    // A trailing non-breaking space makes the same sentence read out again.
    setMessage((previous) => (previous === next ? `${next} ` : next));
  }, []);
  const value = useMemo(() => announce, [announce]);
  return (
    <AnnouncerContext value={value}>
      {children}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {message}
      </div>
    </AnnouncerContext>
  );
}

export function useAnnounce(): AnnounceFn {
  const announce = use(AnnouncerContext);
  if (!announce) throw new Error('useAnnounce must be used inside <AnnouncerProvider>.');
  return announce;
}
