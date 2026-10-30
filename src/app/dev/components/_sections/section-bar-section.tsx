import { routes } from '@/config/routes';
import { devCopy } from '@/content/dev';
import { navGroups } from '@/content/nav';
import { SectionBar } from '@/components/layout/section-bar';
import { PreviewFrame } from '@/app/dev/components/_parts/preview-frame';
import { GallerySection } from '@/app/dev/components/_parts/section';

const states = devCopy.states;
const group = navGroups.project;
const items = group.items.map((item) => ({ label: item.label, href: item.href }));

export function SectionBarSection() {
  return (
    <GallerySection id="section-bar">
      <div className="flex flex-wrap items-start gap-6">
        <div className="flex max-w-full min-w-0 flex-col gap-2">
          <h3 className="type-body-xs-semibold text-gray-500">{states.closed}</h3>
          <PreviewFrame label={states.closed} width="mobile">
            <SectionBar
              groupLabel={group.label}
              pageLabel={navGroups.project.items[1].label}
              items={items}
              currentHref={routes.project.about}
              preview={{ open: false }}
            />
          </PreviewFrame>
        </div>
        <div className="flex max-w-full min-w-0 flex-col gap-2">
          <h3 className="type-body-xs-semibold text-gray-500">{states.open}</h3>
          <PreviewFrame label={states.open} width="mobile" tall>
            <SectionBar
              groupLabel={group.label}
              pageLabel={navGroups.project.items[1].label}
              items={items}
              currentHref={routes.project.about}
              preview={{ open: true }}
            />
          </PreviewFrame>
        </div>
        <div className="flex max-w-full min-w-0 flex-col gap-2">
          <h3 className="type-body-xs-semibold text-gray-500">{states.long}</h3>
          <PreviewFrame label={states.long} width="mobile">
            <SectionBar
              groupLabel={group.label}
              pageLabel={devCopy.samples.breadcrumbLong}
              items={items}
              currentHref={routes.project.about}
              preview={{ open: false }}
            />
          </PreviewFrame>
        </div>
      </div>
    </GallerySection>
  );
}
