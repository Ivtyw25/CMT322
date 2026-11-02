'use client';

import { useEffect, useRef, useState } from 'react';
import { trafficCopy } from '@/content/traffic';

const DEBOUNCE_MS = 500;

/** A hidden polite message: "{n} road changes shown", 500 ms after the count changes, not on load. */
export function FilterLiveRegion({ count }: { count: number }) {
  const [message, setMessage] = useState('');
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const timer = window.setTimeout(
      () => setMessage(trafficCopy.map.filters.liveRegion(count)),
      DEBOUNCE_MS,
    );
    return () => window.clearTimeout(timer);
  }, [count]);
  return (
    <p role="status" className="sr-only">
      {message}
    </p>
  );
}
