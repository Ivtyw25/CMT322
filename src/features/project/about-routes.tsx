import { Callout } from '@/components/ui/callout';
import { InfoList } from '@/components/ui/info-list';
import { projectCopy } from '@/content/project';
import { CopyTabs } from './copy-tabs';

const { routes: copy } = projectCopy.about;

/** The two services as tabs: a paragraph and three facts each, then the shared note. */
export function AboutRoutes() {
  return (
    <>
      <p className="max-w-170 type-body-m text-gray-700">{copy.lede}</p>
      <CopyTabs
        label={copy.tabsLabel}
        tabs={copy.tabs.map((tab) => ({
          id: tab.id,
          label: tab.label,
          content: (
            <div className="flex flex-col gap-4">
              <p className="max-w-170 type-body-m text-gray-700">{tab.intro}</p>
              <InfoList
                items={[
                  { id: 'length', label: copy.factLabels.length, value: tab.facts.length },
                  {
                    id: 'journey',
                    label: copy.factLabels.journeyTime,
                    value: tab.facts.journeyTime,
                  },
                  {
                    id: 'construction',
                    label: copy.factLabels.construction,
                    value: tab.facts.construction,
                  },
                ]}
              />
            </div>
          ),
        }))}
      >
        <Callout tone="info">{copy.note}</Callout>
      </CopyTabs>
    </>
  );
}
