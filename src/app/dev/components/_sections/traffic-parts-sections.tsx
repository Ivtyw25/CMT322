import Link from 'next/link';
import { Suspense } from 'react';
import { routes } from '@/config/routes';
import { Pagination } from '@/components/ui/pagination';
import { devCopy } from '@/content/dev';
import { getStations } from '@/data/api/stations';
import { DemoLineSelect } from '@/app/dev/components/_parts/demo-line-select';
import { DemoQueryParams } from '@/app/dev/components/_parts/demo-query-params';
import { GallerySection, Specimen } from '@/app/dev/components/_parts/section';

const copy = devCopy.traffic;

const hrefFor = (page: number) => `${routes.dev.components}?page=${page}#pagination`;

export function PaginationSection() {
  return (
    <GallerySection id="pagination">
      <Specimen caption={copy.paginationFew}>
        <Pagination page={2} pageCount={5} hrefFor={hrefFor} label={copy.paginationLabel} />
      </Specimen>
      <Specimen caption={copy.paginationMany}>
        <Pagination page={6} pageCount={12} hrefFor={hrefFor} label={copy.paginationLabel} />
      </Specimen>
      <Specimen caption={copy.paginationEnd}>
        <Pagination page={12} pageCount={12} hrefFor={hrefFor} label={copy.paginationLabel} />
      </Specimen>
    </GallerySection>
  );
}

export async function LineDiagramSection() {
  const stations = await getStations();
  return (
    <GallerySection id="line-diagram">
      <Specimen caption={copy.lineCaption} className="[&>*]:w-full">
        <DemoLineSelect stations={stations} />
      </Specimen>
    </GallerySection>
  );
}

export function QueryParamsSection() {
  return (
    <GallerySection id="query-params">
      <Specimen caption={copy.queryCaption}>
        <Suspense>
          <DemoQueryParams />
        </Suspense>
      </Specimen>
    </GallerySection>
  );
}

export function WorkspaceSection() {
  return (
    <GallerySection id="workspace" note={copy.workspaceNote}>
      <Link
        href={routes.dev.workspace}
        className="w-fit type-body-s-semibold text-primary-700 underline-offset-2 hover:underline"
      >
        {copy.workspaceLink}
      </Link>
    </GallerySection>
  );
}
