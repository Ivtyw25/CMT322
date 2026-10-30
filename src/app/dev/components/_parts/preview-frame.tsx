import Image from 'next/image';
import heroPhoto from '@/assets/images/hero.jpg';
import { cn } from '@/lib/cn';

type PreviewFrameProps = {
  /** Accessible name of the scrollable frame. */
  label: string;
  /** Frame width: the design width the preview stands for. */
  width?: 'desktop' | 'tablet' | 'mobile' | 'fluid';
  /** Reserve room for a panel or menu that opens below the component. */
  tall?: boolean;
  /** Photo and scrims behind the component (transparent header, notice over the hero). */
  hero?: boolean;
  children: React.ReactNode;
};

/**
 * A relative box that previews shell parts at a fixed design width (1440 or 390 px). It
 * scrolls sideways on narrow screens, so the page itself never does.
 */
export function PreviewFrame({
  label,
  width = 'fluid',
  tall = false,
  hero = false,
  children,
}: PreviewFrameProps) {
  return (
    <div
      role="region"
      aria-label={label}
      tabIndex={0}
      className={cn(
        'max-w-full overflow-x-auto rounded-xl border border-gray-200',
        width !== 'fluid' && 'w-fit',
      )}
    >
      <div
        className={cn(
          'relative isolate bg-gray-50',
          width === 'desktop' && 'w-360',
          width === 'tablet' && 'w-205',
          width === 'mobile' && 'w-97.5 max-w-full',
          tall && 'min-h-144',
        )}
      >
        {hero ? (
          <div aria-hidden className="absolute inset-0 -z-10 bg-static-navy">
            <Image
              src={heroPhoto}
              alt=""
              fill
              sizes="1440px"
              loading="eager"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-hero-scrim" />
            <div className="absolute inset-x-0 top-0 h-32 bg-nav-scrim" />
          </div>
        ) : null}
        {children}
      </div>
    </div>
  );
}
