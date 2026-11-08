'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { reverseGeocode, type GeoPoint } from './reverse-geocode';

/** Wait this long after the last pin move before asking. */
const DEBOUNCE_MS = 600;
/** Nominatim allows one request per second. */
const MIN_INTERVAL_MS = 1000;

export type AddressLookupStatus = 'idle' | 'loading' | 'failed';

/**
 * Finds the street address of a map point. Moves of the pin are debounced, requests start at
 * least a second apart, and an answer that is no longer wanted is aborted and dropped.
 */
export function useReverseGeocode(onAddress: (address: string) => void) {
  const [status, setStatus] = useState<AddressLookupStatus>('idle');
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const controller = useRef<AbortController | null>(null);
  const lastStartedAt = useRef(0);
  const handler = useRef(onAddress);

  useEffect(() => {
    handler.current = onAddress;
  }, [onAddress]);

  const cancel = useCallback(() => {
    clearTimeout(timer.current);
    controller.current?.abort();
    controller.current = null;
    setStatus('idle');
  }, []);

  const lookup = useCallback((point: GeoPoint) => {
    clearTimeout(timer.current);
    controller.current?.abort();
    setStatus('loading');
    const wait = Math.max(DEBOUNCE_MS, lastStartedAt.current + MIN_INTERVAL_MS - Date.now());
    timer.current = setTimeout(async () => {
      const request = new AbortController();
      controller.current = request;
      lastStartedAt.current = Date.now();
      try {
        const address = await reverseGeocode(point, request.signal);
        if (request.signal.aborted) return;
        if (address) {
          handler.current(address);
          setStatus('idle');
        } else {
          setStatus('failed');
        }
      } catch {
        if (!request.signal.aborted) setStatus('failed');
      }
    }, wait);
  }, []);

  useEffect(
    () => () => {
      clearTimeout(timer.current);
      controller.current?.abort();
    },
    [],
  );

  return { status, lookup, cancel };
}
