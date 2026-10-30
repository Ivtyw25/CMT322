import { devCopy } from '@/content/dev';
import { SiteFooter } from '@/components/layout/site-footer';
import { PreviewFrame } from '@/app/dev/components/_parts/preview-frame';
import { GallerySection } from '@/app/dev/components/_parts/section';

const states = devCopy.states;
const address = 'meiling.tan@example.com';

type FooterSpec = {
  caption: string;
  width: 'desktop' | 'tablet' | 'mobile';
  preview?: React.ComponentProps<typeof SiteFooter>['newsletterPreview'];
};

const footers: readonly FooterSpec[] = [
  { caption: states.desktop, width: 'desktop' },
  { caption: states.tablet, width: 'tablet' },
  { caption: states.mobile, width: 'mobile' },
  {
    caption: states.newsletterInvalid,
    width: 'mobile',
    preview: { state: 'idle', email: 'meiling', showError: true },
  },
  {
    caption: states.newsletterLoading,
    width: 'mobile',
    preview: { state: 'sending', email: address },
  },
  {
    caption: states.newsletterError,
    width: 'mobile',
    preview: { state: 'failed', email: address },
  },
  {
    caption: states.newsletterSuccess,
    width: 'mobile',
    preview: { state: 'success', email: address },
  },
];

export function FooterSection() {
  return (
    <GallerySection id="footer">
      {footers.map((spec) => (
        <div key={spec.caption} className="flex max-w-full min-w-0 flex-col gap-2">
          <h3 className="type-body-xs-semibold text-gray-500">{spec.caption}</h3>
          <PreviewFrame label={spec.caption} width={spec.width}>
            <SiteFooter newsletterPreview={spec.preview} />
          </PreviewFrame>
        </div>
      ))}
    </GallerySection>
  );
}
