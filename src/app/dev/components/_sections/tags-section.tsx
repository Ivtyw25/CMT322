import { Tag, tagKinds } from '@/components/ui/tag';
import { GallerySection, Specimen } from '@/app/dev/components/_parts/section';
import { devCopy } from '@/content/dev';

export function TagsSection() {
  return (
    <GallerySection id="tags">
      <Specimen caption="1:68 to 1:92">
        {tagKinds.map((kind) => (
          <Tag key={kind} kind={kind} />
        ))}
      </Specimen>
      <Specimen caption={devCopy.states.recordTags}>
        <Tag kind="ticketId" label={devCopy.samples.ticketId} />
        <Tag kind="category" label={devCopy.samples.categoryLabel} />
      </Specimen>
    </GallerySection>
  );
}
