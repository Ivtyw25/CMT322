import { routes } from '@/config/routes';
import { devCopy } from '@/content/dev';
import { navGroups } from '@/content/nav';
import { uiCopy } from '@/content/ui';
import { Accordion } from '@/components/ui/accordion';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Callout } from '@/components/ui/callout';
import { LinkCard } from '@/components/ui/link-card';
import { Tag } from '@/components/ui/tag';
import { AccentBar } from '@/components/patterns/accent-bar';
import { ImagePlaceholder } from '@/components/patterns/image-placeholder';
import { LineRail, LineRailStop } from '@/components/patterns/line-rail';
import { SectionHeading } from '@/components/patterns/section-heading';
import { Stepper, type StepEntry, type StepState } from '@/components/patterns/stepper';
import { Timeline, type TimelineEntry } from '@/components/patterns/timeline';
import { DemoAccordionOpen } from '@/app/dev/components/_parts/demo-accordion-open';
import { GallerySection, Specimen } from '@/app/dev/components/_parts/section';

const { samples, states } = devCopy;

const breadcrumbItems = [
  { label: uiCopy.breadcrumb.home, href: routes.home },
  { label: samples.tabsFour[0] ?? '', href: routes.traffic.overview },
];

export function AccordionSection() {
  const items = samples.accordion.map((entry, index) => ({
    id: `gallery-faq-${index + 1}`,
    title: entry.title,
    content: <p>{entry.body}</p>,
  }));
  const topicItems = samples.accordionTopics.map((entry, index) => ({
    id: `gallery-topic-${index + 1}`,
    title: entry.title,
    content: <p>{entry.body}</p>,
  }));
  return (
    <GallerySection id="accordion">
      <Specimen caption={states.open} className="[&>*]:w-full">
        <Accordion items={items} defaultOpenIds={items.slice(0, 1).map((item) => item.id)} />
      </Specimen>
      <Specimen caption={states.eyebrowDefaultOpen} className="[&>*]:w-full">
        <Accordion
          size="large"
          items={topicItems.map((item, index) => ({
            ...item,
            eyebrow: samples.accordionEyebrow,
            defaultOpen: index === 0,
          }))}
        />
      </Specimen>
      <Specimen caption={states.openFromCode} className="[&>*]:w-full">
        <DemoAccordionOpen
          items={topicItems.map((item, index) => ({ ...item, id: `gallery-code-${index + 1}` }))}
          targetId="gallery-code-3"
          buttonLabel={devCopy.labels.openItemButton}
        />
      </Specimen>
    </GallerySection>
  );
}

export function BreadcrumbSection() {
  return (
    <GallerySection id="breadcrumb">
      <Specimen caption={states.normal}>
        <Breadcrumb items={breadcrumbItems} current={samples.tabsFour[1] ?? ''} />
      </Specimen>
      <Specimen caption={states.long}>
        <Breadcrumb items={breadcrumbItems} current={samples.breadcrumbLong} />
      </Specimen>
    </GallerySection>
  );
}

export function CardsSection() {
  return (
    <GallerySection id="cards">
      <Specimen caption={states.linkCard} className="gap-6">
        <LinkCard
          href={routes.traffic.announcements}
          title={samples.cardTitle}
          media={<Tag kind="active" className="self-start" />}
          className="w-full sm:w-80"
        >
          <p className="type-body-xs text-gray-600">{samples.cardBody}</p>
        </LinkCard>
        <LinkCard
          href={routes.project.construction}
          title={samples.cardTitle}
          media={<ImagePlaceholder decorative className="aspect-video w-full rounded-lg" />}
          className="w-full sm:w-80"
        >
          <p className="type-body-xs text-gray-600">{samples.cardBody}</p>
        </LinkCard>
        <LinkCard
          href={routes.project.faq}
          title={samples.cardTitle}
          className="w-full border-gray-300 sm:w-80 [&_h3]:text-primary-700"
        >
          <p className="type-body-xs text-gray-600">{samples.cardBody}</p>
        </LinkCard>
      </Specimen>
      <Specimen caption={states.selectedCard} className="gap-6">
        <LinkCard
          href={routes.project.faqTopic('construction')}
          title={samples.cardTitle}
          selected
          className="w-full sm:w-80"
        >
          <p className="type-body-xs text-gray-600">{samples.cardBody}</p>
        </LinkCard>
      </Specimen>
    </GallerySection>
  );
}

const [stopA, stopB, stopC, stopD, stopE] = samples.railStops;
const panelPages = navGroups.project.items;

export function LineRailSection() {
  return (
    <GallerySection id="line-rail">
      <Specimen caption={states.followingStop}>
        <LineRail variant="page" label={states.followingStop} className="w-full sm:w-96">
          <LineRailStop
            variant="page"
            code={stopA.code}
            title={stopA.name}
            description={stopA.note}
            href={routes.project.station(stopA.code)}
            filled
          />
          <LineRailStop
            variant="page"
            code={stopB.code}
            title={stopB.name}
            description={stopB.note}
            href={routes.project.station(stopB.code)}
            following
          />
          <LineRailStop
            variant="page"
            code={stopC.code}
            title={stopC.name}
            description={stopC.note}
            href={routes.project.station(stopC.code)}
            selected
          />
          <LineRailStop
            variant="page"
            code={stopD.code}
            title={stopD.name}
            href={routes.project.station(stopD.code)}
          />
          <LineRailStop variant="page" code={stopE.code} title={stopE.name} />
        </LineRail>
      </Specimen>
      <Specimen caption={states.navPanelVariant}>
        <LineRail variant="panel" label={states.navPanelVariant} className="w-full sm:w-96">
          {panelPages.slice(0, 3).map((page, index) => (
            <LineRailStop
              key={page.href}
              title={page.label}
              description={page.description}
              href={page.href}
              filled={index === 0}
              current={index === 0}
            />
          ))}
        </LineRail>
      </Specimen>
    </GallerySection>
  );
}

const [pastA, pastB, futureA, futureB] = samples.milestones;
const timelineItems: TimelineEntry[] = [
  { id: 't1', date: pastA.date, text: pastA.text, state: 'past' },
  { id: 't2', date: pastB.date, text: pastB.text, state: 'past' },
  { id: 't3', date: '', text: '', state: 'today' },
  { id: 't4', date: futureA.date, text: futureA.text, state: 'future' },
  { id: 't5', date: futureB.date, text: futureB.text, state: 'future' },
];

export function TimelineSection() {
  return (
    <GallerySection id="timeline">
      <Specimen caption={states.vertical}>
        <Timeline items={timelineItems} className="w-full sm:w-120" />
      </Specimen>
      <Specimen caption={states.responsiveRow}>
        <Timeline items={timelineItems} orientation="responsive" className="w-full" />
      </Specimen>
    </GallerySection>
  );
}

const stepIds = ['submitted', 'pending', 'in-progress', 'resolved'] as const;

function stepsWithCurrent(current: number): StepEntry[] {
  return stepIds.map((id, index) => {
    const state: StepState =
      index < current ? 'complete' : index === current ? 'current' : 'upcoming';
    return { id, label: uiCopy.ticketStatus[id], state };
  });
}

const stageStates: readonly StepState[] = [
  'complete',
  'complete',
  'current',
  'upcoming',
  'upcoming',
  'upcoming',
];
const stages: StepEntry[] = samples.stagesList.map((stage, index) => ({
  id: `stage-${index + 1}`,
  label: stage.label,
  detail: stage.detail,
  state: stageStates[index] ?? 'upcoming',
}));

export function StepperSection() {
  return (
    <GallerySection id="stepper" note={devCopy.states.horizontal}>
      {stepIds.map((id, index) => (
        <Specimen key={id} caption={`${states.step}: ${uiCopy.ticketStatus[id]}`}>
          <Stepper steps={stepsWithCurrent(index)} className="w-full" />
        </Specimen>
      ))}
      <Specimen caption={states.stages} className="sm:w-120">
        <Stepper variant="stages" label={states.stages} steps={stages} className="w-full" />
      </Specimen>
    </GallerySection>
  );
}

export function PlaceholdersSection() {
  return (
    <GallerySection id="placeholders-callouts">
      <Specimen caption={uiCopy.imagePlaceholder}>
        <ImagePlaceholder className="aspect-video w-full rounded-xl sm:w-80" />
      </Specimen>
      <Specimen caption={states.default} className="flex-col items-stretch sm:w-120">
        <Callout tone="info">{samples.calloutInfo}</Callout>
        <Callout tone="warning" title={samples.calloutWarningTitle}>
          {samples.calloutWarningText}
        </Callout>
      </Specimen>
      <Specimen caption={samples.docsArticleTitle} className="flex-col">
        <AccentBar />
        <SectionHeading description={samples.cardBody}>{samples.docsHeadings[0]}</SectionHeading>
      </Specimen>
    </GallerySection>
  );
}
