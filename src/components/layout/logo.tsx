import Image from 'next/image';
import Link from 'next/link';
import logoMark from '@/assets/images/logo-mark.png';
import { routes } from '@/config/routes';
import { commonCopy } from '@/content/common';
import { cn } from '@/lib/cn';

type LogoProps = {
  /** `mark` size: 44 px on desktop and in the footer, 36 px in the mobile bar. */
  size?: 'default' | 'compact';
  /** Light text on dark surfaces (footer, transparent header over the hero). */
  tone?: 'default' | 'onDark';
  className?: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
  /** Marks the link so the back-to-top button can move focus here. */
  dataLogo?: boolean;
};

/** Logo mark and wordmark, linking home. The image is decorative; the link carries the name. */
export function Logo({
  size = 'default',
  tone = 'default',
  className,
  onClick,
  dataLogo,
}: LogoProps) {
  const compact = size === 'compact';
  return (
    <Link
      href={routes.home}
      aria-label={commonCopy.logo.homeLabel}
      onClick={onClick}
      data-logo={dataLogo ? '' : undefined}
      className={cn(
        'hit-area flex shrink-0 items-center rounded-lg',
        compact ? 'gap-2.5' : 'gap-3',
        className,
      )}
    >
      <Image
        src={logoMark}
        alt=""
        sizes="44px"
        // 44 px and on every page: loading it at once keeps the footer logo from popping in.
        loading="eager"
        className={cn('shrink-0 rounded-full', compact ? 'size-9' : 'size-11')}
      />
      <span
        className={cn(
          'whitespace-nowrap',
          compact ? 'type-wordmark-mobile' : 'type-heading-3xs',
          tone === 'onDark' ? 'text-static-white' : 'text-gray-900',
        )}
      >
        {commonCopy.shortName}
      </span>
    </Link>
  );
}
