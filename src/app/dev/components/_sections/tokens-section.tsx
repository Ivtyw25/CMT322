import { devCopy } from '@/content/dev';
import { GallerySection, Specimen } from '@/app/dev/components/_parts/section';
import {
  colourSwatches,
  radii,
  shadows,
  stepDowns,
  typeStyles,
} from '@/app/dev/components/_parts/token-data';

export function TokensSection() {
  const copy = devCopy.tokens;
  return (
    <GallerySection id="tokens" note={devCopy.labels.weights}>
      <Specimen caption={copy.colours}>
        <ul className="grid w-full grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
          {colourSwatches.map((swatch) => (
            <li key={swatch.name} className="flex flex-col gap-1">
              <span
                aria-hidden
                className={`h-12 rounded-lg border border-gray-200 ${swatch.className}`}
              />
              <span className="type-body-xs text-gray-700">{swatch.name}</span>
            </li>
          ))}
        </ul>
      </Specimen>
      <Specimen caption={copy.type} className="flex-col">
        {typeStyles.map((style) => (
          <p key={style} className={`${style} text-gray-900`}>
            {copy.typeSample}
            <span className="ml-3 type-body-xs text-gray-500">{style}</span>
          </p>
        ))}
      </Specimen>
      <Specimen caption={copy.mobileStepDown} className="flex-col">
        {stepDowns.map((step) => (
          <p key={step.name} className={`${step.className} text-gray-900`}>
            {copy.typeSample}
            <span className="ml-3 type-body-xs text-gray-500">{step.name}</span>
          </p>
        ))}
      </Specimen>
      <Specimen caption={copy.radii}>
        {radii.map((radius) => (
          <div key={radius.name} className="flex flex-col items-center gap-1">
            <span
              aria-hidden
              className={`size-16 border border-gray-300 bg-gray-100 ${radius.className}`}
            />
            <span className="type-body-xs text-gray-700">{radius.name}</span>
          </div>
        ))}
      </Specimen>
      <Specimen caption={copy.shadows} surface="muted" className="gap-6">
        {shadows.map((shadow) => (
          <div key={shadow.name} className="flex flex-col items-center gap-2">
            <span aria-hidden className={`size-16 rounded-lg bg-surface ${shadow.className}`} />
            <span className="type-body-xs text-gray-700">{shadow.name}</span>
          </div>
        ))}
      </Specimen>
    </GallerySection>
  );
}
