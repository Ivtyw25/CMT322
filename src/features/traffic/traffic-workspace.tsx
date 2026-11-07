'use client';

import { ChevronLeft, ChevronRight, SlidersHorizontal, X } from 'lucide-react';
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { Button } from '@/components/ui/button';
import { IconButton } from '@/components/ui/icon-button';
import { trafficCopy } from '@/content/traffic';
import { cn } from '@/lib/cn';
import { useMediaQuery } from '@/lib/dom/use-media-query';

const PANEL_ID = 'traffic-panel';
const STORAGE_KEY = 'traffic-panel';
/**
 * Panel width in px: default, limits, and one arrow-key step on the divider. The minimum keeps
 * the Route view / Map view switch on one line.
 */
const WIDTH = { initial: 400, min: 340, max: 560, step: 24 };
/** The panel never takes more than this share of the workspace, so the map or line stays usable. */
const MAX_SHARE = 0.6;

type Stored = { width: number; collapsed: boolean };
type PanelStyle = React.CSSProperties & { '--panel-w': string };

function readRaw(): string | null {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function parseStored(raw: string | null): Stored | null {
  if (!raw) return null;
  try {
    const value: unknown = JSON.parse(raw);
    if (
      typeof value === 'object' &&
      value !== null &&
      'width' in value &&
      'collapsed' in value &&
      typeof value.width === 'number' &&
      typeof value.collapsed === 'boolean'
    ) {
      return { width: value.width, collapsed: value.collapsed };
    }
    return null;
  } catch {
    return null;
  }
}

/** Other tabs changing the saved layout. This tab's own changes live in component state. */
function subscribeStorage(onChange: () => void) {
  window.addEventListener('storage', onChange);
  return () => window.removeEventListener('storage', onChange);
}

function writeStored(value: Stored) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch {
    // Storage may be blocked; the panel still works for this visit.
  }
}

type TrafficWorkspaceProps = {
  /** Filters, the list and the station card. */
  panel: React.ReactNode;
  /** The map or the line. */
  main: React.ReactNode;
  /** Phones: whether the panel covers the view. Controlled by the page so a choice can open it. */
  panelOpen: boolean;
  onPanelOpenChange: (open: boolean) => void;
};

/**
 * Map view and Route view frame. From 768 px: the panel on the left, resizable by dragging or
 * with the arrow keys on its divider (340 px up to 560 px, never over 60 % of the width), and
 * collapsible with the button on the divider; both choices are remembered in this browser.
 * Below 768 px: the map or line fills the view and the panel opens over all of it.
 */
export function TrafficWorkspace({
  panel,
  main,
  panelOpen,
  onPanelOpenChange,
}: TrafficWorkspaceProps) {
  const copy = trafficCopy.map.layout;
  const rootRef = useRef<HTMLDivElement>(null);
  const openButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const saved = parseStored(useSyncExternalStore(subscribeStorage, readRaw, () => null));
  // This visit's choice, then the saved one, then the defaults.
  const [chosen, setChosen] = useState<Stored | null>(null);
  const [dragWidth, setDragWidth] = useState<number | null>(null);
  const settled = chosen ?? saved ?? { width: WIDTH.initial, collapsed: false };
  const width = dragWidth ?? settled.width;
  const { collapsed } = settled;
  const phone = useMediaQuery('(max-width: 47.99rem)');
  const overlay = phone && panelOpen;

  // Widening past 768 px ends the phone overlay.
  useEffect(() => {
    if (!phone && panelOpen) onPanelOpenChange(false);
  }, [phone, panelOpen, onPanelOpenChange]);

  // Phones: move focus into the panel when it opens, and back to its button when it closes.
  const wasOpen = useRef(overlay);
  useEffect(() => {
    if (overlay && !wasOpen.current) closeButtonRef.current?.focus();
    if (!overlay && wasOpen.current && phone) openButtonRef.current?.focus();
    wasOpen.current = overlay;
  }, [overlay, phone]);

  function maxWidth(): number {
    const total = rootRef.current?.clientWidth ?? WIDTH.max / MAX_SHARE;
    return Math.max(WIDTH.min, Math.min(WIDTH.max, Math.round(total * MAX_SHARE)));
  }

  function clamp(next: number): number {
    return Math.min(maxWidth(), Math.max(WIDTH.min, Math.round(next)));
  }

  function commit(next: Partial<Stored>) {
    const value = { ...settled, ...next };
    setChosen(value);
    setDragWidth(null);
    writeStored(value);
  }

  function startDrag(event: React.PointerEvent<HTMLDivElement>) {
    if (event.button !== 0) return;
    event.preventDefault();
    const handle = event.currentTarget;
    handle.setPointerCapture(event.pointerId);
    const left = rootRef.current?.getBoundingClientRect().left ?? 0;
    let latest = width;
    const move = (moveEvent: PointerEvent) => {
      latest = clamp(moveEvent.clientX - left);
      setDragWidth(latest);
    };
    const end = () => {
      handle.removeEventListener('pointermove', move);
      handle.removeEventListener('pointerup', end);
      handle.removeEventListener('pointercancel', end);
      commit({ width: latest });
    };
    handle.addEventListener('pointermove', move);
    handle.addEventListener('pointerup', end);
    handle.addEventListener('pointercancel', end);
  }

  function onDividerKey(event: React.KeyboardEvent<HTMLDivElement>) {
    const moves: Record<string, number> = {
      ArrowLeft: width - WIDTH.step,
      ArrowRight: width + WIDTH.step,
      Home: WIDTH.min,
      End: maxWidth(),
    };
    const next = moves[event.key];
    if (next === undefined) return;
    event.preventDefault();
    commit({ width: clamp(next) });
  }

  const shownWidth = Math.min(width, WIDTH.max);
  const panelStyle: PanelStyle = { '--panel-w': `${shownWidth}px` };

  return (
    <div ref={rootRef} className="relative flex h-full">
      <div
        id={PANEL_ID}
        role={overlay ? 'dialog' : undefined}
        aria-modal={overlay ? true : undefined}
        aria-label={overlay ? copy.panelLabel : undefined}
        onKeyDown={(event) => {
          if (overlay && event.key === 'Escape') onPanelOpenChange(false);
        }}
        style={panelStyle}
        className={cn(
          'scrollbar-none flex-col overflow-y-auto overscroll-contain bg-surface',
          overlay ? 'fixed inset-x-0 top-[var(--chrome-h,4rem)] bottom-0 z-40 flex' : 'hidden',
          'md:static md:z-auto md:flex md:w-(--panel-w) md:shrink-0',
          collapsed && 'md:hidden',
        )}
      >
        <div className="sticky top-0 z-10 flex justify-end border-b border-gray-200 bg-surface px-4 py-2 md:hidden">
          <IconButton
            ref={closeButtonRef}
            variant="plain"
            aria-label={copy.closePanel}
            onClick={() => onPanelOpenChange(false)}
          >
            <X aria-hidden className="size-5" />
          </IconButton>
        </div>
        {panel}
      </div>

      <div className="relative hidden w-0 shrink-0 md:block">
        {collapsed ? null : (
          <div
            role="separator"
            tabIndex={0}
            aria-orientation="vertical"
            aria-controls={PANEL_ID}
            aria-label={copy.resizePanel}
            aria-valuemin={WIDTH.min}
            aria-valuemax={WIDTH.max}
            aria-valuenow={shownWidth}
            onPointerDown={startDrag}
            onKeyDown={onDividerKey}
            className={cn(
              'absolute inset-y-0 -left-1.5 z-20 w-3 cursor-col-resize touch-none outline-none',
              'after:absolute after:inset-y-0 after:left-1/2 after:w-px after:-translate-x-1/2 after:bg-gray-200',
              'hover:after:w-0.5 hover:after:bg-primary-600 focus-visible:after:w-0.5 focus-visible:after:bg-primary-600',
            )}
          />
        )}
        <button
          type="button"
          aria-controls={PANEL_ID}
          aria-expanded={!collapsed}
          aria-label={collapsed ? copy.expandPanel : copy.collapsePanel}
          onClick={() => commit({ collapsed: !collapsed })}
          className={cn(
            'hit-area absolute top-4 z-30 flex size-7 cursor-pointer items-center justify-center rounded-full border border-gray-300 bg-surface text-gray-700 shadow-control',
            'transition-colors duration-(--duration-fast) hover:border-gray-400 hover:text-gray-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600',
            collapsed ? 'left-2' : '-left-3.5',
          )}
        >
          {collapsed ? (
            <ChevronRight aria-hidden className="size-4" />
          ) : (
            <ChevronLeft aria-hidden className="size-4" />
          )}
        </button>
      </div>

      <div className="relative min-w-0 flex-1">
        {main}
        <div className="pointer-events-none absolute inset-x-0 bottom-5 z-20 flex justify-center md:hidden">
          <Button
            ref={openButtonRef}
            aria-controls={PANEL_ID}
            aria-expanded={overlay}
            onClick={() => onPanelOpenChange(true)}
            className="pointer-events-auto shadow-panel"
          >
            <SlidersHorizontal aria-hidden className="size-4" />
            {copy.openPanel}
          </Button>
        </div>
      </div>
    </div>
  );
}
