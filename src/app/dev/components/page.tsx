import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { devCopy } from '@/content/dev';
import { Container } from '@/components/layout/container';
import { loadShellData } from '@/components/layout/shell-data';
import { GalleryToolbar } from './_parts/toolbar';
import { AppearanceSection } from './_sections/appearance-section';
import { ButtonsSection } from './_sections/buttons-section';
import {
  AccordionSection,
  BreadcrumbSection,
  CardsSection,
  LineRailSection,
  PlaceholdersSection,
  StepperSection,
  TimelineSection,
} from './_sections/content-sections';
import {
  ChipsSection,
  SegmentedSection,
  SwitchSection,
  TabsSection,
} from './_sections/controls-section';
import { DocsSection } from './_sections/docs-section';
import { FieldsSection } from './_sections/fields-section';
import { FooterSection } from './_sections/footer-section';
import { HeaderDesktopSection } from './_sections/header-desktop-section';
import { HeaderMobileSection } from './_sections/header-mobile-section';
import { NavPanelsSection } from './_sections/nav-panels-section';
import { NotificationSection } from './_sections/notification-section';
import { SectionBarSection } from './_sections/section-bar-section';
import { TagsSection } from './_sections/tags-section';
import { TokensSection } from './_sections/tokens-section';

export const metadata: Metadata = { title: devCopy.title, robots: { index: false } };

/** Development-only gallery of every shared component, variant and state. 404 in production. */
export default async function ComponentsGalleryPage() {
  if (process.env.NODE_ENV === 'production') notFound();
  const data = await loadShellData();
  return (
    <>
      <Container className="pt-10 pb-6">
        <h1 className="type-heading-m">{devCopy.title}</h1>
        <p className="mt-2 type-body-m text-gray-600">{devCopy.intro}</p>
      </Container>
      <Container>
        <GalleryToolbar />
      </Container>
      <Container className="pb-16">
        <TokensSection />
        <ButtonsSection />
        <TagsSection />
        <FieldsSection />
        <SwitchSection />
        <SegmentedSection />
        <TabsSection />
        <ChipsSection />
        <AccordionSection />
        <BreadcrumbSection />
        <CardsSection />
        <LineRailSection />
        <TimelineSection />
        <StepperSection />
        <PlaceholdersSection />
        <HeaderDesktopSection data={data} />
        <NavPanelsSection data={data} />
        <AppearanceSection />
        <HeaderMobileSection data={data} />
        <NotificationSection />
        <SectionBarSection />
        <DocsSection />
        <FooterSection />
      </Container>
    </>
  );
}
