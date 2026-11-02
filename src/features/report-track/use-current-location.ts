'use client';

import { useCallback, useState, useSyncExternalStore } from 'react';
import type { ReportPoint } from './report-values';

const TIMEOUT_MS = 10_000;

export type LocationStatus = 'idle' | 'loading' | 'denied' | 'unavailable';

const subscribeNever = () => () => {};
const supportsGeolocation = () => Boolean(navigator.geolocation);

/** "Use my current location": one reading, 10 s timeout, no high accuracy. */
export function useCurrentLocation(onFound: (point: ReportPoint) => void) {
  const [status, setStatus] = useState<LocationStatus>('idle');
  const supported = useSyncExternalStore(subscribeNever, supportsGeolocation, () => false);

  const locate = useCallback(() => {
    if (status === 'loading' || !supportsGeolocation()) return;
    setStatus('loading');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setStatus('idle');
        onFound({ lat: position.coords.latitude, lng: position.coords.longitude });
      },
      (error) => setStatus(error.code === error.PERMISSION_DENIED ? 'denied' : 'unavailable'),
      { timeout: TIMEOUT_MS, enableHighAccuracy: false },
    );
  }, [status, onFound]);

  const clearError = useCallback(
    () => setStatus((current) => (current === 'loading' ? current : 'idle')),
    [],
  );

  return { status, supported, locate, clearError };
}
