import { routes } from '@/config/routes';
import { devCopy } from '@/content/dev';
import { MobileHeader } from '@/components/layout/mobile-header';
import type { ShellData } from '@/components/layout/shell-data';
import { PreviewFrame } from '@/app/dev/components/_parts/preview-frame';
import { GallerySection } from '@/app/dev/components/_parts/section';

const states = devCopy.states;

/** The six variants of Figma 127:5787, in the board's order; open ones show the drawer. */
const variants = [
  { auth: 'guest', variant: 'solid', menuOpen: false },
  { auth: 'guest', variant: 'solid', menuOpen: true },
  { auth: 'signed-in', variant: 'solid', menuOpen: false },
  { auth: 'signed-in', variant: 'solid', menuOpen: true },
  { auth: 'guest', variant: 'transparent', menuOpen: false },
  { auth: 'guest', variant: 'transparent', menuOpen: true },
] as const;

const authLabel = { guest: states.guest, 'signed-in': states.signedIn } as const;
const variantLabel = { solid: states.solid, transparent: states.transparent } as const;

export function HeaderMobileSection({ data }: { data: ShellData }) {
  return (
    <GallerySection id="header-mobile" note={devCopy.labels.headerNote}>
      <div className="flex flex-wrap items-start gap-6">
        {variants.map((entry) => {
          const caption = [
            authLabel[entry.auth],
            variantLabel[entry.variant],
            entry.menuOpen ? states.open : states.closed,
          ].join(', ');
          return (
            <div key={caption} className="flex max-w-full min-w-0 flex-col gap-2">
              <h3 className="type-body-xs-semibold text-gray-500">{caption}</h3>
              <PreviewFrame label={caption} width="mobile" hero={entry.variant === 'transparent'}>
                <MobileHeader
                  data={data}
                  preview={{
                    variant: entry.variant,
                    auth: entry.auth,
                    menuOpen: entry.menuOpen,
                    currentPath: routes.traffic.map,
                  }}
                />
                {entry.menuOpen ? (
                  <div aria-hidden className={entry.auth === 'guest' ? 'h-244' : 'h-272'} />
                ) : null}
              </PreviewFrame>
            </div>
          );
        })}
      </div>
    </GallerySection>
  );
}
