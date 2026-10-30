import { routes } from '@/config/routes';
import { devCopy } from '@/content/dev';
import { navGroups } from '@/content/nav';
import { NavPanel } from '@/components/layout/nav-panel';
import type { ShellData } from '@/components/layout/shell-data';
import { DemoAccountMenu } from '@/app/dev/components/_parts/demo-account-menu';
import { PreviewFrame } from '@/app/dev/components/_parts/preview-frame';
import { GallerySection } from '@/app/dev/components/_parts/section';

const states = devCopy.states;

type PanelSpec = {
  caption: string;
  group: typeof navGroups.project | typeof navGroups.traffic | typeof navGroups.reportTrack;
  current: string;
  hideNote?: boolean;
  empty?: boolean;
};

const panels: readonly PanelSpec[] = [
  { caption: navGroups.project.label, group: navGroups.project, current: routes.project.about },
  { caption: navGroups.traffic.label, group: navGroups.traffic, current: routes.traffic.map },
  {
    caption: `${navGroups.traffic.label}: ${states.noClosures}`,
    group: navGroups.traffic,
    current: routes.traffic.overview,
    empty: true,
  },
  {
    caption: `${navGroups.reportTrack.label}: ${states.guest}`,
    group: navGroups.reportTrack,
    current: routes.reportTrack.track,
  },
  {
    caption: `${navGroups.reportTrack.label}: ${states.signedInNoNote}`,
    group: navGroups.reportTrack,
    current: routes.reportTrack.overview,
    hideNote: true,
  },
];

export function NavPanelsSection({ data }: { data: ShellData }) {
  return (
    <GallerySection id="nav-panels">
      {panels.map((panel) => (
        <div key={panel.caption} className="flex max-w-full min-w-0 flex-col gap-2">
          <h3 className="type-body-xs-semibold text-gray-500">{panel.caption}</h3>
          <PreviewFrame label={panel.caption} width="desktop">
            <div className="p-6">
              <NavPanel
                group={{ ...panel.group, id: panel.group.id }}
                data={panel.empty ? { ...data, closures: [] } : data}
                pathname={panel.current}
                currentPath={panel.current}
                showAccountNote={!panel.hideNote}
                className="max-h-none w-300"
              />
            </div>
          </PreviewFrame>
        </div>
      ))}
      <div className="flex max-w-full min-w-0 flex-col gap-2">
        <h3 className="type-body-xs-semibold text-gray-500">{states.account}</h3>
        <PreviewFrame label={states.account} width="fluid" tall>
          <div className="flex justify-end p-6">
            <DemoAccountMenu user={data.user} />
          </div>
        </PreviewFrame>
      </div>
    </GallerySection>
  );
}
