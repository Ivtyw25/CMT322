import { homeCopy } from '@/content/home';
import { SwipeRow } from '@/components/patterns/swipe-row';
import { SwipeRowItem } from '@/components/patterns/swipe-row-item';
import { HomeSection, SectionHeader } from './section-frame';
import { sectionIcons } from './section-icons';

const HEADING_ID = 'safety-heading';

/** "Stay safe around worksites" (Figma 38:1237, mobile 133:6741): six tips, not interactive. */
export function SafetySection() {
  const copy = homeCopy.safety;
  return (
    <HomeSection headingId={HEADING_ID} tone="band">
      <SectionHeader headingId={HEADING_ID} title={copy.title} lede={copy.lede} />
      <SwipeRow
        from="sm"
        wideClassName="sm:grid sm:grid-cols-2 sm:gap-6 md:grid-cols-3 md:gap-8 xl:grid-cols-6"
      >
        {copy.tips.map((tip) => {
          const Icon = sectionIcons[tip.icon];
          return (
            <SwipeRowItem key={tip.id} className="flex flex-col items-start gap-2">
              <span
                aria-hidden
                className="mb-1 flex size-12 items-center justify-center rounded-full border border-primary-200 bg-surface text-primary-700"
              >
                <Icon className="size-5" />
              </span>
              <h3 className="type-heading-3xs text-wrap text-gray-900">{tip.title}</h3>
              <p className="type-body-s text-gray-600">{tip.text}</p>
            </SwipeRowItem>
          );
        })}
      </SwipeRow>
    </HomeSection>
  );
}
