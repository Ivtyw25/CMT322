import { ArrowRight, MapPin } from 'lucide-react';
import { routes } from '@/config/routes';
import { devCopy } from '@/content/dev';
import { Button } from '@/components/ui/button';
import { ButtonLink } from '@/components/ui/button-link';
import { cn } from '@/lib/cn';
import { forcedButton } from '@/app/dev/components/_parts/forced';
import { PreviewFrame } from '@/app/dev/components/_parts/preview-frame';
import { GallerySection, Specimen } from '@/app/dev/components/_parts/section';

const variants = ['primary', 'secondary', 'ghost'] as const;
const label = {
  primary: devCopy.samples.buttonPrimary,
  secondary: devCopy.samples.buttonSecondary,
  ghost: devCopy.samples.buttonGhost,
} as const;

export function ButtonsSection() {
  const states = devCopy.states;
  return (
    <GallerySection id="buttons" note={devCopy.labels.forcedNote}>
      {variants.map((variant) => (
        <Specimen key={variant} caption={devCopy.labels[variant]}>
          <Button variant={variant}>{label[variant]}</Button>
          <Button
            variant={variant}
            className={forcedButton.hover[variant]}
            aria-label={`${label[variant]} (${states.hover})`}
          >
            {label[variant]}
          </Button>
          <Button
            variant={variant}
            className={forcedButton.focus}
            aria-label={`${label[variant]} (${states.focus})`}
          >
            {label[variant]}
          </Button>
          <Button
            variant={variant}
            className={forcedButton.active[variant]}
            aria-label={`${label[variant]} (${states.active})`}
          >
            {label[variant]}
          </Button>
          <Button variant={variant} disabled>
            {label[variant]}
          </Button>
          <Button variant={variant} loading>
            {devCopy.samples.buttonLoading}
          </Button>
        </Specimen>
      ))}
      <Specimen caption={states.withIcon}>
        <Button icon={<MapPin aria-hidden className="size-4" />}>{label.primary}</Button>
        <Button variant="secondary" icon={<MapPin aria-hidden className="size-4" />}>
          {label.secondary}
        </Button>
        <ButtonLink
          href={routes.reportTrack.track}
          variant="ghost"
          icon={<ArrowRight aria-hidden className="size-4" />}
        >
          {label.ghost}
        </ButtonLink>
      </Specimen>
      <Specimen caption={states.fullWidth} className="flex-col items-stretch sm:w-80">
        <Button fullWidth>{label.primary}</Button>
        <Button variant="secondary" fullWidth>
          {label.secondary}
        </Button>
      </Specimen>
      <Specimen caption={states.onNavy} surface="navy">
        <Button variant="secondary">{label.secondary}</Button>
        <Button variant="secondary" loading>
          {devCopy.samples.buttonLoading}
        </Button>
      </Specimen>
      <PreviewFrame label={states.onHero} hero>
        <div className={cn('flex flex-wrap gap-4 p-6')}>
          <Button variant="secondary">{label.secondary}</Button>
          <Button>{label.primary}</Button>
        </div>
      </PreviewFrame>
    </GallerySection>
  );
}
