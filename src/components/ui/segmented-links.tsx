import Link from 'next/link';
import { cn } from '@/lib/cn';
import { segmentedItemClass, segmentedTrackClass } from './segmented-styles';

export type SegmentedLink = {
  href: string;
  label: string;
  /** Decorative icon before the label. */
  icon?: React.ReactNode;
  /** The page the visitor is on: gets `aria-current="page"` and the selected look. */
  current?: boolean;
};

type SegmentedLinksProps = {
  /** Name of the navigation landmark, e.g. "Traffic views". */
  label: string;
  links: readonly SegmentedLink[];
  /** Stretch the segments over the full width. */
  fullWidth?: boolean;
  className?: string;
};

/** The segmented control as page links (Map view, Route view). Same look as the radio form. */
export function SegmentedLinks({
  label,
  links,
  fullWidth = false,
  className,
}: SegmentedLinksProps) {
  return (
    <nav aria-label={label} className={className}>
      <ul className={cn(segmentedTrackClass, fullWidth ? 'w-full' : 'w-fit')}>
        {links.map((link) => (
          <li key={link.href} className={fullWidth ? 'flex-1' : undefined}>
            <Link
              href={link.href}
              aria-current={link.current ? 'page' : undefined}
              className={cn(
                segmentedItemClass,
                link.current && 'bg-surface text-primary-700 shadow-control',
              )}
            >
              {link.icon ? (
                <span aria-hidden className="flex shrink-0">
                  {link.icon}
                </span>
              ) : null}
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
