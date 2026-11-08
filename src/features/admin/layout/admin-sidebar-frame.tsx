'use client';

import { useState } from 'react';
import { adminCopy } from '@/content/admin';
import type { StaffMember } from '@/data/models/staff';
import { cn } from '@/lib/cn';
import { AdminSidebar } from './admin-sidebar';
import { clampSidebarWidth, SIDEBAR_WIDTH } from './use-sidebar-layout';

type AdminSidebarFrameProps = {
  id: string;
  staff: StaffMember;
  pathname: string;
  unclaimedCount: number;
  width: number;
  collapsed: boolean;
  onWidthChange: (width: number) => void;
  onCollapse: () => void;
  onSignOut: () => void;
};

type FrameStyle = React.CSSProperties & { '--sidebar-w': string };

/**
 * From 1024 px: the sidebar with a divider on its right edge. Drag the divider, or use the arrow
 * keys on it, to resize. The sidebar scrolls without a visible scrollbar.
 */
export function AdminSidebarFrame({
  id,
  staff,
  pathname,
  unclaimedCount,
  width,
  collapsed,
  onWidthChange,
  onCollapse,
  onSignOut,
}: AdminSidebarFrameProps) {
  const copy = adminCopy.shell;
  const [dragWidth, setDragWidth] = useState<number | null>(null);
  const shown = dragWidth ?? width;
  const style: FrameStyle = { '--sidebar-w': `${shown}px` };

  function startDrag(event: React.PointerEvent<HTMLDivElement>) {
    if (event.button !== 0) return;
    event.preventDefault();
    const handle = event.currentTarget;
    handle.setPointerCapture(event.pointerId);
    let latest = shown;
    const move = (moveEvent: PointerEvent) => {
      latest = clampSidebarWidth(moveEvent.clientX);
      setDragWidth(latest);
    };
    const end = () => {
      handle.removeEventListener('pointermove', move);
      handle.removeEventListener('pointerup', end);
      handle.removeEventListener('pointercancel', end);
      setDragWidth(null);
      onWidthChange(latest);
    };
    handle.addEventListener('pointermove', move);
    handle.addEventListener('pointerup', end);
    handle.addEventListener('pointercancel', end);
  }

  function onDividerKey(event: React.KeyboardEvent<HTMLDivElement>) {
    const moves: Record<string, number> = {
      ArrowLeft: shown - SIDEBAR_WIDTH.step,
      ArrowRight: shown + SIDEBAR_WIDTH.step,
      Home: SIDEBAR_WIDTH.min,
      End: SIDEBAR_WIDTH.max,
    };
    const next = moves[event.key];
    if (next === undefined) return;
    event.preventDefault();
    onWidthChange(clampSidebarWidth(next));
  }

  return (
    <aside
      id={id}
      style={style}
      className={cn(
        'sticky top-0 hidden h-dvh w-(--sidebar-w) shrink-0',
        collapsed ? 'lg:hidden' : 'lg:block',
      )}
    >
      <AdminSidebar
        staff={staff}
        pathname={pathname}
        unclaimedCount={unclaimedCount}
        onSignOut={onSignOut}
        onCollapse={onCollapse}
        sidebarId={id}
        className="h-full"
      />
      <div
        role="separator"
        tabIndex={0}
        aria-orientation="vertical"
        aria-controls={id}
        aria-label={copy.resizeSidebar}
        aria-valuemin={SIDEBAR_WIDTH.min}
        aria-valuemax={SIDEBAR_WIDTH.max}
        aria-valuenow={shown}
        onPointerDown={startDrag}
        onKeyDown={onDividerKey}
        className={cn(
          'absolute inset-y-0 -right-1.5 z-20 w-3 cursor-col-resize touch-none outline-none',
          'after:absolute after:inset-y-0 after:left-1/2 after:w-px after:-translate-x-1/2 after:bg-transparent',
          'hover:after:w-0.5 hover:after:bg-primary-500 focus-visible:after:w-0.5 focus-visible:after:bg-primary-500',
        )}
      />
    </aside>
  );
}
