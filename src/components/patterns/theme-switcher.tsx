'use client';

import { Monitor, Moon, Sun } from 'lucide-react';
import { navCopy } from '@/content/nav';
import { useAnnounce } from '@/lib/announce/announcer';
import { useTheme } from '@/lib/theme/theme-provider';
import type { ThemePreference } from '@/lib/theme/theme';
import { SegmentedControl, type SegmentedOption } from '@/components/ui/segmented-control';

const options: readonly SegmentedOption<ThemePreference>[] = [
  {
    value: 'light',
    label: navCopy.appearance.options.light.shortLabel,
    icon: <Sun className="size-4" />,
  },
  {
    value: 'dark',
    label: navCopy.appearance.options.dark.shortLabel,
    icon: <Moon className="size-4" />,
  },
  {
    value: 'system',
    label: navCopy.appearance.options.system.shortLabel,
    icon: <Monitor className="size-4" />,
  },
];

/** Light / Dark / System as a segmented control (mobile drawer, gallery). Same state as the desktop menu. */
export function ThemeSwitcher({ className }: { className?: string }) {
  const { preference, setPreference } = useTheme();
  const announce = useAnnounce();
  return (
    <SegmentedControl
      legend={navCopy.mobile.appearanceLegend}
      options={options}
      value={preference}
      fullWidth
      className={className}
      onValueChange={(next) => {
        setPreference(next);
        announce(navCopy.appearance.changed(navCopy.appearance.options[next].label));
      }}
    />
  );
}
