import Image from 'next/image';
import { ImagePlaceholder } from '@/components/patterns/image-placeholder';
import type { PhotoSource } from '@/data/models/photo';
import { cn } from '@/lib/cn';

type SitePhotoProps = {
  /** The picture. None: the grey placeholder fills the frame instead. */
  src: PhotoSource | undefined;
  /** What the photo shows. Leave it out when a caption or the card text already says it. */
  alt?: string;
  /** The frame: pass an aspect-ratio or size utility, as for the placeholder. */
  className?: string;
  /** The width the frame renders at, for next/image `sizes`. */
  sizes: string;
};

/** A photo cropped to fill its frame, or the grey placeholder while there is no picture. */
export function SitePhoto({ src, alt, className, sizes }: SitePhotoProps) {
  if (!src) return <ImagePlaceholder decorative={alt === undefined} className={className} />;
  return (
    <div className={cn('relative overflow-hidden bg-gray-100', className)}>
      <Image src={src} alt={alt ?? ''} fill sizes={sizes} className="object-cover" />
    </div>
  );
}
