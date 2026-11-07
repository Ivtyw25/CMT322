'use client';

import { useEffect, useRef, useState } from 'react';

type FlowState = 'ready' | 'on' | 'paused';

const VISIBLE_SHARE = 0.4;

/**
 * Runs the looping water animation of the diagram line (line-flow.css) while the diagram is in
 * view, and pauses it when it scrolls away. Off with reduced motion.
 */
export function LineFlow({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<FlowState>();

  useEffect(() => {
    const node = ref.current;
    if (!node || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    setState('ready');
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        setState((current) => {
          if (entry.isIntersecting) return 'on';
          return current === 'ready' ? 'ready' : 'paused';
        });
      },
      { threshold: VISIBLE_SHARE },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} data-flow={state}>
      {children}
    </div>
  );
}
