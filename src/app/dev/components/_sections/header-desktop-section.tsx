import { devCopy } from '@/content/dev';
import { navGroups } from '@/content/nav';
import { DesktopHeader, type DesktopHeaderPreview } from '@/components/layout/desktop-header';
import type { ShellData } from '@/components/layout/shell-data';
import { PreviewFrame } from '@/app/dev/components/_parts/preview-frame';
import { GallerySection } from '@/app/dev/components/_parts/section';

type Open = 'closed' | 'project' | 'traffic' | 'report-track' | 'account' | 'appearance';

/** The sixteen variants of Figma 4:736, in the board's order, plus a current-group example. */
const variants: readonly {
  auth: 'guest' | 'signed-in';
  variant: 'solid' | 'transparent';
  open: Open;
}[] = [
  { auth: 'guest', variant: 'solid', open: 'closed' },
  { auth: 'signed-in', variant: 'solid', open: 'closed' },
  { auth: 'guest', variant: 'transparent', open: 'closed' },
  { auth: 'guest', variant: 'solid', open: 'project' },
  { auth: 'signed-in', variant: 'solid', open: 'project' },
  { auth: 'guest', variant: 'transparent', open: 'project' },
  { auth: 'guest', variant: 'solid', open: 'traffic' },
  { auth: 'guest', variant: 'solid', open: 'report-track' },
  { auth: 'signed-in', variant: 'solid', open: 'traffic' },
  { auth: 'signed-in', variant: 'solid', open: 'report-track' },
  { auth: 'guest', variant: 'transparent', open: 'traffic' },
  { auth: 'guest', variant: 'transparent', open: 'report-track' },
  { auth: 'signed-in', variant: 'solid', open: 'account' },
  { auth: 'guest', variant: 'solid', open: 'appearance' },
  { auth: 'signed-in', variant: 'solid', open: 'appearance' },
  { auth: 'guest', variant: 'transparent', open: 'appearance' },
];

const states = devCopy.states;
const stateLabel = {
  guest: states.guest,
  'signed-in': states.signedIn,
  solid: states.solid,
  transparent: states.transparent,
  closed: states.closed,
  project: navGroups.project.label,
  traffic: navGroups.traffic.label,
  'report-track': navGroups.reportTrack.label,
  account: states.account,
  appearance: states.appearance,
} as const;

function previewFor(entry: (typeof variants)[number]): DesktopHeaderPreview {
  const panel =
    entry.open === 'project' || entry.open === 'traffic' || entry.open === 'report-track'
      ? entry.open
      : null;
  return {
    variant: entry.variant,
    auth: entry.auth,
    openPanel: panel,
    appearanceOpen: entry.open === 'appearance',
    accountOpen: entry.open === 'account',
  };
}

export function HeaderDesktopSection({ data }: { data: ShellData }) {
  return (
    <GallerySection id="header-desktop" note={devCopy.labels.headerNote}>
      {variants.map((entry) => {
        const caption = [entry.auth, entry.variant, entry.open]
          .map((key) => stateLabel[key])
          .join(', ');
        const tall = entry.open !== 'closed';
        return (
          <div key={caption} className="flex max-w-full min-w-0 flex-col gap-2">
            <h3 className="type-body-xs-semibold text-gray-500">{caption}</h3>
            <PreviewFrame
              label={caption}
              width="desktop"
              tall={tall}
              hero={entry.variant === 'transparent'}
            >
              <DesktopHeader data={data} preview={previewFor(entry)} />
            </PreviewFrame>
          </div>
        );
      })}
      <div className="flex max-w-full min-w-0 flex-col gap-2">
        <h3 className="type-body-xs-semibold text-gray-500">{states.current}</h3>
        <PreviewFrame label={states.current} width="desktop">
          <DesktopHeader
            data={data}
            preview={{
              variant: 'solid',
              auth: 'guest',
              openPanel: null,
              currentGroup: 'traffic',
            }}
          />
        </PreviewFrame>
      </div>
    </GallerySection>
  );
}
