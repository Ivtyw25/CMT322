/** "Browse by topic" audience switch. Labels live in the project page copy. */
export type FaqAudience = 'travel' | 'live-work' | 'land';

export type FaqCategoryId = 'getting-around' | 'living-near' | 'land' | 'the-line';

export type FaqCategory = {
  id: FaqCategoryId;
  /** Topic card title, e.g. "Getting around during the works". */
  label: string;
  /** Small label above each question, e.g. "Getting around". */
  shortLabel: string;
  /** Topic card teaser. */
  summary: string;
  /** Audiences that see this topic. "Everyone" sees every topic. */
  audiences: FaqAudience[];
};

export type FaqNextStep = { label: string; href: string };

export type FaqItem = {
  id: string;
  categoryId: FaqCategoryId;
  question: string;
  /** Short answer for previews (Home "Common questions"). */
  summary: string;
  /** One paragraph per item. */
  answer: string[];
  /** "What to do next" links. Empty when there are none. */
  nextSteps: FaqNextStep[];
  /** Extra search terms, e.g. "night works", "compensation". */
  keywords: string[];
  /** Position in "Most asked this month" (1 = first). Null when not listed. */
  mostAskedRank: number | null;
  /** ISO 8601 date. */
  updatedAt: string;
};
