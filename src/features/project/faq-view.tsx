'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Accordion, type AccordionEntry } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { projectCopy } from '@/content/project';
import { uiCopy } from '@/content/ui';
import type { FaqCategory, FaqItem } from '@/data/models/faq';
import { useAnnounce } from '@/lib/announce/announcer';
import { FaqAnswer } from './faq-answer';
import { FaqQuestionText } from './faq-question-text';
import { FaqSearchBar } from './faq-search-bar';
import { searchFaq } from './faq-search';
import { FaqTopics, topicsForAudience, type AudienceChoice } from './faq-topics';

const { faq: copy } = projectCopy;
const URL_DELAY_MS = 300;
const ANNOUNCE_DELAY_MS = 500;

export type FaqUrlState = {
  /** A valid category id, or null. */
  topic: string | null;
  all: boolean;
  query: string;
};

type FaqViewProps = {
  categories: readonly FaqCategory[];
  items: readonly FaqItem[];
  mostAsked: readonly FaqItem[];
  url: FaqUrlState;
  /** The "Topics" `h2`, rendered on the server. */
  topicsHeading: React.ReactNode;
};

type Mode = 'most' | 'all' | 'topic' | 'search';

/** Writes the view into the address bar without a history entry. The hash goes: it has been used. */
function writeUrl(state: { query: string; topic: string | null; all: boolean }) {
  const params = new URLSearchParams();
  if (state.query) params.set('q', state.query);
  if (state.topic) params.set('topic', state.topic);
  if (state.all) params.set('view', 'all');
  const search = params.toString();
  window.history.replaceState(
    window.history.state,
    '',
    `${window.location.pathname}${search ? `?${search}` : ''}`,
  );
}

/**
 * Search, topics and the question list of the FAQ page. One list shows at a time: most asked,
 * all, one topic, or search results. The view lives in the URL (`?q=`, `?topic=`, `?view=all`).
 */
export function FaqView({ categories, items, mostAsked, url, topicsHeading }: FaqViewProps) {
  const announce = useAnnounce();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const urlTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const [query, setQuery] = useState(url.query);
  const [topic, setTopic] = useState(url.topic);
  const [all, setAll] = useState(url.all);
  const [audience, setAudience] = useState<AudienceChoice>('everyone');

  // A topic link or Back changes the address from outside: follow it.
  const [seen, setSeen] = useState({ topic: url.topic, all: url.all });
  if (seen.topic !== url.topic || seen.all !== url.all) {
    setSeen({ topic: url.topic, all: url.all });
    setTopic(url.topic);
    setAll(url.all);
    setQuery(url.query);
  }

  const trimmed = query.trim();
  const mode: Mode = trimmed ? 'search' : topic ? 'topic' : all ? 'all' : 'most';
  const category = categories.find((entry) => entry.id === topic);

  const counts = useMemo(() => {
    const result: Record<string, number> = {};
    for (const item of items) result[item.categoryId] = (result[item.categoryId] ?? 0) + 1;
    return result;
  }, [items]);

  const list = useMemo(() => {
    if (mode === 'search') return searchFaq(items, trimmed);
    if (mode === 'topic') return items.filter((item) => item.categoryId === topic);
    if (mode === 'all') {
      const order = categories.map((entry) => entry.id);
      return [...items].sort((a, b) => order.indexOf(a.categoryId) - order.indexOf(b.categoryId));
    }
    return [...mostAsked];
  }, [mode, items, mostAsked, categories, topic, trimmed]);

  const labelOf = (id: string) => categories.find((entry) => entry.id === id)?.shortLabel;

  const entries: AccordionEntry[] = list.map((item, index) => ({
    id: item.id,
    eyebrow: labelOf(item.categoryId),
    title: <FaqQuestionText text={item.question} query={mode === 'search' ? trimmed : ''} />,
    defaultOpen: mode === 'most' ? index === 0 : mode === 'search' && list.length === 1,
    content: <FaqAnswer item={item} />,
  }));

  // Arriving through a topic link lands on the questions.
  useEffect(() => {
    if (url.topic) headingRef.current?.focus();
  }, [url.topic]);

  // A deep link to a question that is not in the current list shows all questions.
  const visibleIds = useMemo(() => new Set(list.map((item) => item.id)), [list]);
  useEffect(() => {
    function showLinkedQuestion() {
      const id = decodeURIComponent(window.location.hash.slice(1));
      if (!id || visibleIds.has(id) || !items.some((item) => item.id === id)) return;
      setQuery('');
      setTopic(null);
      setAll(true);
    }
    showLinkedQuestion();
    window.addEventListener('hashchange', showLinkedQuestion);
    return () => window.removeEventListener('hashchange', showLinkedQuestion);
  }, [visibleIds, items]);

  // One polite message for each settled change of view or count.
  const message = (() => {
    if (mode === 'search')
      return list.length === 0
        ? copy.view.status.none(trimmed)
        : copy.view.status.matches(list.length, trimmed);
    if (mode === 'topic') return copy.view.status.topic(list.length, category?.label ?? '');
    if (mode === 'all') return copy.view.status.all(list.length);
    return copy.view.status.mostAsked(list.length);
  })();
  const firstMessage = useRef(true);
  useEffect(() => {
    if (firstMessage.current) {
      firstMessage.current = false;
      return;
    }
    const timer = setTimeout(() => announce(message), ANNOUNCE_DELAY_MS);
    return () => clearTimeout(timer);
  }, [message, announce]);

  useEffect(() => () => clearTimeout(urlTimer.current), []);

  function changeQuery(next: string) {
    setQuery(next);
    clearTimeout(urlTimer.current);
    if (next === '') {
      writeUrl({ query: '', topic, all });
      return;
    }
    // The hash has done its job once the visitor searches; leaving it would pull focus back.
    if (window.location.hash) writeUrl({ query: url.query, topic, all });
    urlTimer.current = setTimeout(() => writeUrl({ query: next.trim(), topic, all }), URL_DELAY_MS);
  }

  function changeView(next: { topic: string | null; all: boolean }) {
    setTopic(next.topic);
    setAll(next.all);
    setQuery('');
    writeUrl({ query: '', ...next });
    headingRef.current?.focus();
  }

  function changeAudience(next: AudienceChoice) {
    setAudience(next);
    announce(copy.view.status.topics(topicsForAudience(categories, next).length));
  }

  const heading =
    mode === 'search'
      ? copy.view.results(trimmed)
      : mode === 'topic'
        ? (category?.label ?? '')
        : mode === 'all'
          ? copy.mostAsked.allTitle
          : copy.mostAsked.title;

  return (
    <div className="flex flex-col">
      <FaqSearchBar
        query={query}
        inputRef={inputRef}
        onQueryChange={changeQuery}
        onSubmit={() => headingRef.current?.focus()}
      />
      <section aria-labelledby="topics" className="mt-12 flex flex-col gap-5 lg:mt-16">
        {topicsHeading}
        <FaqTopics
          categories={categories}
          counts={counts}
          audience={audience}
          onAudienceChange={changeAudience}
          activeTopic={mode === 'topic' ? topic : null}
        />
      </section>
      <section aria-labelledby="questions" className="mt-12 flex flex-col gap-5 lg:mt-16">
        <div className="flex flex-col gap-1">
          <h2
            ref={headingRef}
            id="questions"
            tabIndex={-1}
            className="scroll-mt-32 type-heading-2xs outline-none lg:type-heading-xs"
          >
            {heading}
          </h2>
          {mode === 'topic' ? (
            <p className="type-body-s text-gray-600">{copy.topics.count(list.length)}</p>
          ) : null}
        </div>
        {list.length > 0 ? (
          <Accordion items={entries} size="large" />
        ) : mode === 'search' ? (
          <div className="flex flex-col items-start gap-3 rounded-xl border border-gray-200 bg-gray-50 p-5">
            <p className="type-body-m-semibold text-gray-900">{copy.search.empty.title(trimmed)}</p>
            <p className="type-body-s text-gray-600">{copy.search.empty.body}</p>
            <Button
              variant="secondary"
              onClick={() => {
                changeQuery('');
                inputRef.current?.focus();
              }}
            >
              {uiCopy.actions.clearSearch}
            </Button>
          </div>
        ) : (
          <p className="type-body-s text-gray-600">{copy.view.topicEmpty}</p>
        )}
        {mode === 'most' ? (
          <Button
            variant="secondary"
            className="self-start"
            onClick={() => changeView({ topic: null, all: true })}
          >
            {uiCopy.actions.showAll(items.length, copy.view.nouns)}
          </Button>
        ) : null}
        {mode === 'topic' ? (
          <Button
            variant="ghost"
            className="self-start"
            onClick={() => changeView({ topic: null, all: false })}
          >
            {copy.view.showMostAsked}
          </Button>
        ) : null}
      </section>
    </div>
  );
}
