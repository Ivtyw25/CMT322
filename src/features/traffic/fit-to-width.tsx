'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/cn';

const MIN_SCALE = 0.85;
/** Smallest label size once shrunk, in rem (12 px): the labels are enlarged by the shrink factor. */
const LABEL_REM = 0.75;

type FitToWidthProps = {
  width: number;
  height: number;
  /** Smallest shrink factor before the drawing scrolls sideways. */
  minScale?: number;
  children: React.ReactNode;
};

/**
 * Shows a drawing of a fixed size at its natural size, or shrunk to fit the space (never below
 * 85 %; narrower than that it scrolls sideways). Small labels grow by the shrink factor, so they
 * stay at least 12 px on screen.
 */
export function FitToWidth({ width, height, minScale = MIN_SCALE, children }: FitToWidthProps) {
  const box = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const element = box.current;
    if (!element) return;
    const measure = () => setScale(Math.min(1, Math.max(minScale, element.clientWidth / width)));
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, [width, minScale]);
  return (
    <div ref={box} className="w-full overflow-x-auto">
      <div className="mx-auto" style={{ width: width * scale, height: height * scale }}>
        <div
          className={cn(
            scale < 1 &&
              '[&_.type-body-xs]:text-(length:--fit-label) [&_.type-body-xs-medium]:text-(length:--fit-label) [&_.type-body-xs-semibold]:text-(length:--fit-label)',
          )}
          style={
            {
              width,
              height,
              transform: `scale(${scale})`,
              transformOrigin: 'top left',
              '--fit-label': `${LABEL_REM / scale}rem`,
            } as React.CSSProperties
          }
        >
          {children}
        </div>
      </div>
    </div>
  );
}
