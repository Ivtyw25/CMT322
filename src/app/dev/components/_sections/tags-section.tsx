import { Tag, tagKinds } from '@/components/ui/tag';
import { GallerySection, Specimen } from '@/app/dev/components/_parts/section';

export function TagsSection() {
  return (
    <GallerySection id="tags">
      <Specimen caption="1:68 to 1:92">
        {tagKinds.map((kind) => (
          <Tag key={kind} kind={kind} />
        ))}
      </Specimen>
    </GallerySection>
  );
}
