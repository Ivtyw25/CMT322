'use client';

import { useEffect, useEffectEvent, useRef, useState } from 'react';
import { DocsLayout } from '@/components/layout/docs-layout';
import { Button } from '@/components/ui/button';
import { ChipSelect } from '@/components/ui/chip-select';
import { FilterChips } from '@/components/ui/filter-chips';
import { routes } from '@/config/routes';
import { projectCopy } from '@/content/project';
import { uiCopy } from '@/content/ui';
import type { ConstructionPhase, ConstructionUpdate } from '@/data/models/construction-update';
import { useAnnounce } from '@/lib/announce/announcer';
import { formatDate } from '@/lib/format/dates';
import { ConstructionUpdateEntry } from './construction-update-entry';
import { DocsSection } from './docs-section';

const { construction: copy } = projectCopy;
const PAGE_SIZE = 4;
const TOC_LIMIT = 6;
const LOAD_DELAY_MS = 400;
const ALL = 'all';

type PhaseChoice = ConstructionPhase | typeof ALL;
export type AreaOption = { id: string; label: string };

export type ConstructionUrlState = { phase: string; area: string };

type ConstructionDocsProps = {
  updates: readonly ConstructionUpdate[];
  areas: readonly AreaOption[];
  url: ConstructionUrlState;
  /** Server-rendered parts of the page. */
  head: React.ReactNode;
  timeline: React.ReactNode;
  tail: React.ReactNode;
  needHelp: React.ReactNode;
};

const phaseOptions = (Object.keys(uiCopy.constructionPhases) as PhaseChoice[]).map((value) => ({
  value,
  label: uiCopy.constructionPhases[value],
}));

function writeUrl(phase: string, area: string) {
  const params = new URLSearchParams();
  if (phase !== ALL) params.set('phase', phase);
  if (area !== ALL) params.set('area', area);
  const search = params.toString();
  window.history.replaceState(
    window.history.state,
    '',
    `${window.location.pathname}${search ? `?${search}` : ''}${window.location.hash}`,
  );
}

const shortDate = (iso: string) => formatDate(iso).split(' ').slice(0, 2).join(' ');

/**
 * The Construction progress page body: filters, the site updates list and the "On this page"
 * list, whose sub-items follow what is rendered. Filters live in the URL as `?phase=&area=`.
 */
export function ConstructionDocs({
  updates,
  areas,
  url,
  head,
  timeline,
  tail,
  needHelp,
}: ConstructionDocsProps) {
  const announce = useAnnounce();
  const rootRef = useRef<HTMLDivElement>(null);
  const focusAfterRender = useRef<string | null>(null);

  const validPhase = (value: string): string => (value in uiCopy.constructionPhases ? value : ALL);
  const validArea = (value: string): string =>
    areas.some((area) => area.id === value) ? value : ALL;

  const [phase, setPhase] = useState(validPhase(url.phase));
  const [area, setArea] = useState(validArea(url.area));
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [loading, setLoading] = useState(false);

  // Back and forward change the address from outside: follow it.
  const [seen, setSeen] = useState(url);
  if (seen.phase !== url.phase || seen.area !== url.area) {
    setSeen(url);
    setPhase(validPhase(url.phase));
    setArea(validArea(url.area));
    setVisible(PAGE_SIZE);
  }

  const matching = updates.filter(
    (item) => (phase === ALL || item.phase === phase) && (area === ALL || item.areaId === area),
  );
  const shown = matching.slice(0, visible);
  const hasMore = matching.length > visible;

  function changeFilters(nextPhase: string, nextArea: string) {
    setPhase(nextPhase);
    setArea(nextArea);
    setVisible(PAGE_SIZE);
    writeUrl(nextPhase, nextArea);
    const count = updates.filter(
      (item) =>
        (nextPhase === ALL || item.phase === nextPhase) &&
        (nextArea === ALL || item.areaId === nextArea),
    ).length;
    const names = [
      nextPhase === ALL ? null : uiCopy.constructionPhases[nextPhase as ConstructionPhase],
      nextArea === ALL ? null : areas.find((item) => item.id === nextArea)?.label,
    ]
      .filter(Boolean)
      .join(', ');
    announce(
      count === 0
        ? copy.updates.status.none
        : names
          ? copy.updates.status.filtered(count, names)
          : copy.updates.status.shown(count),
    );
  }

  function loadOlder() {
    if (loading) return;
    setLoading(true);
    const firstNew = matching[visible]?.id ?? null;
    window.setTimeout(() => {
      focusAfterRender.current = firstNew;
      setVisible((count) => count + PAGE_SIZE);
      setLoading(false);
      announce(copy.updates.status.shown(Math.min(matching.length, visible + PAGE_SIZE)));
    }, LOAD_DELAY_MS);
  }

  // Focus the heading of the entry the visitor asked for (load older, deep link).
  useEffect(() => {
    const id = focusAfterRender.current;
    if (!id) return;
    focusAfterRender.current = null;
    document.querySelector<HTMLElement>(`[id="${id}"] h3`)?.focus();
  });

  // A deep link to an update: show it if filters or paging hide it, then scroll and focus.
  const showLinked = useEffectEvent(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    const target = updates.find((item) => item.id === id);
    if (!target) return;
    const inFilter = matching.findIndex((item) => item.id === id);
    if (inFilter === -1) {
      setPhase(ALL);
      setArea(ALL);
      setVisible(
        Math.ceil((updates.findIndex((item) => item.id === id) + 1) / PAGE_SIZE) * PAGE_SIZE,
      );
      writeUrl(ALL, ALL);
    } else if (inFilter >= visible) {
      setVisible(Math.ceil((inFilter + 1) / PAGE_SIZE) * PAGE_SIZE);
    }
    focusAfterRender.current = id;
    requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView());
  });
  useEffect(() => {
    const frame = requestAnimationFrame(showLinked);
    window.addEventListener('hashchange', showLinked);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('hashchange', showLinked);
    };
  }, []);

  const toc = [
    { id: 'timeline', label: copy.toc.timeline },
    {
      id: 'updates',
      label: copy.toc.updates,
      children: shown.slice(0, TOC_LIMIT).map((item) => ({
        id: item.id,
        label: copy.toc.update(shortDate(item.date), item.tocLabel),
      })),
    },
  ];

  return (
    <DocsLayout currentHref={routes.project.construction} onThisPage={toc} aside={needHelp}>
      <div className="flex flex-col gap-12 lg:gap-16">
        {head}
        <DocsSection id="timeline" title={copy.timeline.title}>
          {timeline}
        </DocsSection>
        <DocsSection id="updates" title={copy.updates.title}>
          <div ref={rootRef} className="flex flex-col gap-8">
            <div
              role="group"
              aria-label={copy.updates.filtersLabel}
              className="flex flex-wrap items-center gap-2"
            >
              <FilterChips
                label={copy.updates.filtersLabel}
                options={phaseOptions}
                value={phase as PhaseChoice}
                onValueChange={(next) => changeFilters(next, area)}
                density="compact"
              />
              <ChipSelect
                density="compact"
                label={copy.updates.areaLabel}
                value={area}
                onChange={(event) => changeFilters(phase, event.target.value)}
                options={[
                  { value: ALL, label: uiCopy.filters.allAreas },
                  ...areas.map((item) => ({ value: item.id, label: item.label })),
                ]}
              />
            </div>

            {shown.length > 0 ? (
              <ol aria-label={copy.updates.title}>
                {shown.map((item, index) => (
                  <ConstructionUpdateEntry key={item.id} update={item} first={index === 0} />
                ))}
              </ol>
            ) : (
              <div className="flex flex-col items-start gap-3">
                <p className="type-body-m-semibold text-gray-900">{copy.updates.empty.title}</p>
                <p className="type-body-s text-gray-600">{copy.updates.empty.body}</p>
                <Button
                  variant="secondary"
                  onClick={() => {
                    changeFilters(ALL, ALL);
                    rootRef.current?.querySelector<HTMLElement>('button')?.focus();
                  }}
                >
                  {copy.updates.empty.action}
                </Button>
              </div>
            )}

            {shown.length > 0 ? (
              hasMore ? (
                <Button variant="secondary" loading={loading} onClick={loadOlder} className="w-fit">
                  {loading ? copy.updates.loading : uiCopy.actions.loadOlder}
                </Button>
              ) : (
                <p className="type-body-s text-gray-500">{copy.updates.allLoaded}</p>
              )
            ) : null}
          </div>
        </DocsSection>
        {tail}
      </div>
    </DocsLayout>
  );
}
