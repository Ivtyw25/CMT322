'use client';

import { AppearanceMenu } from '@/components/layout/appearance-menu';
import type { ThemePreference } from '@/lib/theme/theme';

/** The appearance menu held open with a chosen option, for the gallery. */
export function DemoAppearanceMenu({ selected }: { selected: ThemePreference }) {
  return <AppearanceMenu open preview previewSelected={selected} />;
}
