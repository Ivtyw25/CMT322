'use client';

import { Pagination } from '@/components/ui/pagination';
import { routes } from '@/config/routes';

const hrefFor = (page: number) => `${routes.dev.components}?page=${page}#pagination`;

type DemoPaginationProps = { page: number; pageCount: number; label: string };

/** Pagination needs a client parent here, because `hrefFor` is a function. */
export function DemoPagination({ page, pageCount, label }: DemoPaginationProps) {
  return <Pagination page={page} pageCount={pageCount} hrefFor={hrefFor} label={label} />;
}
