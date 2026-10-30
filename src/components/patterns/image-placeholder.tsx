import { ImageIcon } from 'lucide-react';
import { uiCopy } from '@/content/ui';
import { cn } from '@/lib/cn';

type ImagePlaceholderProps = {
  /** Keep the photo's frame: pass an aspect-ratio utility such as `aspect-video`. */
  className?: string;
  /** Hide from screen readers when the card already describes the photo. */
  decorative?: boolean;
};

/** Grey stand-in for a photo that is not available yet. */
export function ImagePlaceholder({ className, decorative = false }: ImagePlaceholderProps) {
  return (
    <div
      role={decorative ? undefined : 'img'}
      aria-label={decorative ? undefined : uiCopy.imagePlaceholder}
      aria-hidden={decorative || undefined}
      className={cn('flex items-center justify-center bg-gray-100', className)}
    >
      <ImageIcon aria-hidden className="size-7 text-gray-400" />
    </div>
  );
}
