import { devCopy } from '@/content/dev';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DemoChips } from '@/app/dev/components/_parts/demo-chips';
import { DemoSegmented } from '@/app/dev/components/_parts/demo-segmented';
import { GallerySection, Specimen } from '@/app/dev/components/_parts/section';

const { samples, states, labels } = devCopy;

type TabsDemoProps = { items: readonly string[]; width?: string };

/** Tabs with one line of text per panel. */
function TabsDemo({ items, width }: TabsDemoProps) {
  return (
    <Tabs defaultValue="0" className={width}>
      <TabsList aria-label={samples.fieldLabel}>
        {items.map((item) => (
          <TabsTrigger key={item} value={String(items.indexOf(item))}>
            {item}
          </TabsTrigger>
        ))}
      </TabsList>
      {items.map((item) => (
        <TabsContent
          key={item}
          value={String(items.indexOf(item))}
          className="type-body-s text-gray-700"
        >
          {item}
        </TabsContent>
      ))}
    </Tabs>
  );
}

export function SwitchSection() {
  return (
    <GallerySection id="switch">
      <Specimen
        caption={`${states.selected}, ${states.unselected}, ${states.focus}, ${states.disabled}`}
        className="gap-8"
      >
        <Switch label={samples.switchLabel} defaultChecked />
        <Switch label={samples.switchLabel} />
        <Switch
          label={samples.switchLabel}
          className="[&_button]:outline-2 [&_button]:outline-offset-2 [&_button]:outline-primary-600"
        />
        <Switch label={samples.switchLabel} disabled />
        <Switch label={samples.switchLabel} disabled defaultChecked />
      </Specimen>
    </GallerySection>
  );
}

export function SegmentedSection() {
  return (
    <GallerySection id="segmented-control">
      <Specimen caption={labels.twoOptions} className="gap-6">
        <DemoSegmented legend={labels.twoOptions} labels={samples.segmented} initial={0} />
        <DemoSegmented legend={labels.twoOptions} labels={samples.segmented} initial={1} />
      </Specimen>
      <Specimen caption={labels.threeOptions} className="gap-6">
        {samples.segmentedThree.map((_, index) => (
          <DemoSegmented
            key={samples.segmentedThree[index]}
            legend={labels.threeOptions}
            labels={samples.segmentedThree}
            initial={index}
          />
        ))}
      </Specimen>
    </GallerySection>
  );
}

export function TabsSection() {
  return (
    <GallerySection id="tabs">
      <Specimen caption={labels.twoTabs}>
        <TabsDemo items={samples.tabsTwo} />
      </Specimen>
      <Specimen caption={states.wrapping}>
        <TabsDemo items={samples.tabsWrapping} width="w-87.5" />
      </Specimen>
    </GallerySection>
  );
}

export function ChipsSection() {
  return (
    <GallerySection id="filter-chips">
      <Specimen caption={states.selected}>
        <DemoChips label={samples.fieldLabel} labels={samples.chips} />
      </Specimen>
    </GallerySection>
  );
}
