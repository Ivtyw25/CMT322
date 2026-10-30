import { devCopy } from '@/content/dev';
import { navCopy } from '@/content/nav';
import { themePreferences } from '@/lib/theme/theme';
import { DemoAppearanceMenu } from '@/app/dev/components/_parts/demo-appearance-menu';
import { PreviewFrame } from '@/app/dev/components/_parts/preview-frame';
import { GallerySection } from '@/app/dev/components/_parts/section';

export function AppearanceSection() {
  return (
    <GallerySection id="appearance-menu" note={devCopy.states.appearance}>
      <div className="grid gap-6 md:grid-cols-3">
        {themePreferences.map((value) => {
          const label = navCopy.appearance.options[value].label;
          return (
            <div key={value} className="flex max-w-full min-w-0 flex-col gap-2">
              <h3 className="type-body-xs-semibold text-gray-500">{label}</h3>
              <PreviewFrame label={label} tall>
                <div className="flex justify-end p-6">
                  <DemoAppearanceMenu selected={value} />
                </div>
              </PreviewFrame>
            </div>
          );
        })}
      </div>
    </GallerySection>
  );
}
