import { routes } from '@/config/routes';
import { devCopy } from '@/content/dev';
import { InfoList } from '@/components/ui/info-list';
import { LocationMap } from '@/components/patterns/map/location-map';
import { NeedHelpBlock } from '@/components/patterns/need-help-block';
import { PageFeedback } from '@/components/patterns/page-feedback';
import { RelatedPages } from '@/components/patterns/related-pages';
import { DemoTrafficMap } from '@/app/dev/components/_parts/demo-traffic-map';
import { DemoFollows } from '@/app/dev/components/_parts/demo-follows';
import { GallerySection, Specimen } from '@/app/dev/components/_parts/section';

const { samples, states, labels } = devCopy;

const relatedHrefs = [routes.project.about, routes.project.construction, routes.project.faq];
const relatedPages = samples.relatedPages.map((page, index) => ({
  ...page,
  href: relatedHrefs[index] ?? routes.project.overview,
}));
const infoItems = samples.infoRows.map((row, index) => ({ ...row, id: `info-${index + 1}` }));

export function DocsPartsSection() {
  return (
    <GallerySection id="docs-parts">
      <Specimen caption={states.needHelp} className="sm:w-72">
        <NeedHelpBlock careline={samples.careline} />
      </Specimen>
      <Specimen caption={states.feedbackDefault} className="sm:w-120">
        <PageFeedback />
      </Specimen>
      <Specimen caption={states.feedbackSmall} className="sm:w-120">
        <PageFeedback size="sm" trailing={samples.feedbackTrailing} />
      </Specimen>
      <Specimen caption={states.relatedPages} className="[&>*]:w-full sm:[&>*]:w-120">
        <RelatedPages pages={relatedPages} />
      </Specimen>
      <Specimen caption={states.infoList} className="[&>*]:w-full sm:[&>*]:w-160">
        <InfoList items={infoItems} />
      </Specimen>
    </GallerySection>
  );
}

export function MapSection() {
  return (
    <GallerySection id="map">
      <Specimen caption={states.mapSnippet} className="[&>*]:w-full">
        <LocationMap
          {...samples.map}
          markers={samples.map.markers}
          interaction="snippet"
          className="h-95 rounded-2xl"
        />
      </Specimen>
      <Specimen caption={states.mapFull} className="[&>*]:w-full">
        <LocationMap
          center={samples.map.center}
          zoom={samples.map.zoom}
          label={samples.map.label}
          interaction="full"
          className="h-60 rounded-2xl"
        />
      </Specimen>
      <Specimen caption={devCopy.traffic.mapCaption} className="[&>*]:w-full">
        <DemoTrafficMap />
      </Specimen>
    </GallerySection>
  );
}

export function FollowsSection() {
  return (
    <GallerySection id="follows" note={labels.followsGuestNote}>
      <Specimen caption={states.followsSignedIn}>
        <DemoFollows
          stations={samples.followStations}
          labels={{
            follow: labels.follow,
            unfollow: labels.unfollow,
            following: labels.followingNow,
            nothing: labels.nothingFollowed,
            guestNote: labels.followsGuestNote,
          }}
        />
      </Specimen>
    </GallerySection>
  );
}
