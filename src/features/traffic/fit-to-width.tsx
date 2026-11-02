'use client';

import { useEffect, useRef, useState } from 'react';

const MIN_SCALE = 0.85;

type FitToWidthProps = { width: number; height: number; children: React.ReactNode };

/**
 * Shows a drawing of a fixed size at its natural size, or shrunk to fit the space (never below
 * 85 %, so its labels stay readable; narrower than that it scrolls sideways).
 */
export function FitToWidth({ width, height, children }: FitToWidthProps) {
  const box = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const element = box.current;
    if (!element) return;
    const measure = () => setScale(Math.min(1, Math.max(MIN_SCALE, element.clientWidth / width)));
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, [width]);
  return (
    <div ref={box} className="w-full overflow-x-auto">
      <div className="mx-auto" style={{ width: width * scale, height: height * scale }}>
        <div style={{ width, height, transform: `scale(${scale})`, transformOrigin: 'top left' }}>
          {children}
        </div>
      </div>
    </div>
  );
}
