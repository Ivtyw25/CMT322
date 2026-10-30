'use client';

import { useCallback } from 'react';
import { Check, Contrast, Monitor, Moon, Sun } from 'lucide-react';
import { DropdownMenu } from 'radix-ui';
import { navCopy } from '@/content/nav';
import { IconButton } from '@/components/ui/icon-button';
import { useAnnounce } from '@/lib/announce/announcer';
import { cn } from '@/lib/cn';
import { useHeaderMenuOffset } from '@/lib/dom/use-header-menu-offset';
import { useReleaseFocus } from '@/lib/dom/use-release-focus';
import { useTheme } from '@/lib/theme/theme-provider';
import { themePreferences, type ThemePreference } from '@/lib/theme/theme';

/** Space between the header's bottom edge and the menu (px). */
const MENU_GAP = 8;

const optionIcons = {
  light: Sun,
  dark: Moon,
  system: Monitor,
} as const satisfies Record<ThemePreference, unknown>;

export type AppearanceMenuProps = {
  /** Transparent header over the hero: white outline button. */
  onHero?: boolean;
  /** Mobile bar: 20 px icon. */
  compact?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Gallery only: the menu stays open and does not take focus. */
  preview?: boolean;
  /** Gallery only: show this option as the selected one. */
  previewSelected?: ThemePreference;
};

/** The theme button and its menu (Figma 123:5280). The button opens the menu; it never toggles. */
export function AppearanceMenu({
  onHero = false,
  compact = false,
  open,
  onOpenChange,
  preview = false,
  previewSelected,
}: AppearanceMenuProps) {
  const { preference, setPreference } = useTheme();
  const announce = useAnnounce();
  const copy = navCopy.appearance;
  const selected = previewSelected ?? preference;
  useReleaseFocus(preview);
  const { triggerRef, sideOffset, measure } = useHeaderMenuOffset(MENU_GAP, open);

  function handleOpenChange(next: boolean) {
    if (next) measure();
    onOpenChange?.(next);
  }

  // Keyboard and pointer alike land on the checked option, not the first one. Radix focuses the
  // menu itself when it mounts, so this waits one frame to come after it.
  const focusChecked = useCallback(
    (content: HTMLDivElement | null) => {
      if (!content || preview) return;
      const frame = requestAnimationFrame(() => {
        content.querySelector<HTMLElement>('[role="menuitemradio"][aria-checked="true"]')?.focus();
      });
      return () => cancelAnimationFrame(frame);
    },
    [preview],
  );

  return (
    <DropdownMenu.Root modal={false} open={open} onOpenChange={handleOpenChange}>
      <DropdownMenu.Trigger asChild>
        <IconButton
          ref={triggerRef}
          // The saved choice is only known in the browser; the label updates after hydration.
          suppressHydrationWarning
          aria-label={copy.buttonLabel(copy.options[selected].label)}
          variant={compact ? 'plain' : 'outline'}
          className={cn(
            onHero && 'text-static-white hover:bg-static-glass',
            onHero && !compact && 'border-static-white hover:border-static-white',
            onHero &&
              'data-[state=open]:border-surface data-[state=open]:bg-surface data-[state=open]:text-primary-700',
          )}
        >
          <Contrast aria-hidden className={compact ? 'size-5' : 'size-4.5'} />
        </IconButton>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content
        align="end"
        sideOffset={sideOffset}
        collisionPadding={16}
        loop
        ref={focusChecked}
        className={cn(
          'z-50 w-[min(16.5rem,calc(100vw-2rem))] rounded-2xl border border-gray-200 bg-surface p-2 shadow-menu',
          'data-[state=closed]:animate-menu-out data-[state=open]:animate-menu-in',
        )}
      >
        <DropdownMenu.Label className="flex flex-col px-2.5 pt-1.5 pb-1">
          <span className="type-body-s-semibold text-gray-900">{copy.title}</span>
          <span className="type-body-xs text-gray-500">{copy.subtitle}</span>
        </DropdownMenu.Label>
        <DropdownMenu.RadioGroup
          value={selected}
          onValueChange={(next) => {
            const choice = themePreferences.find((candidate) => candidate === next);
            if (!choice) return;
            setPreference(choice);
            announce(copy.changed(copy.options[choice].label));
          }}
        >
          {themePreferences.map((value) => {
            const Icon = optionIcons[value];
            const option = copy.options[value];
            return (
              <DropdownMenu.RadioItem
                key={value}
                value={value}
                className={cn(
                  'group flex min-h-11 cursor-pointer items-center gap-3 rounded-lg px-2.5 py-2.25 outline-none md:min-h-0',
                  'type-body-s-medium text-gray-800 transition-colors duration-(--duration-fast)',
                  'data-[highlighted]:bg-gray-100 data-[highlighted]:text-gray-900',
                  'data-[state=checked]:bg-primary-50 data-[state=checked]:text-primary-700',
                  'focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary-600',
                )}
              >
                <Icon aria-hidden className="size-4.5 shrink-0" />
                <span className="flex flex-1 flex-col">
                  <span className="group-data-[state=checked]:type-body-s-semibold">
                    {option.label}
                  </span>
                  {option.description ? (
                    <span className="type-body-xs font-normal text-gray-500">
                      {option.description}
                    </span>
                  ) : null}
                </span>
                <DropdownMenu.ItemIndicator>
                  <Check aria-hidden className="size-4 shrink-0" />
                </DropdownMenu.ItemIndicator>
              </DropdownMenu.RadioItem>
            );
          })}
        </DropdownMenu.RadioGroup>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
