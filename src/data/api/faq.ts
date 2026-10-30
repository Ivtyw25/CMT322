import { faqCategories, faqItems } from '@/data/mock/faq';
import type { FaqCategory, FaqItem } from '@/data/models/faq';

export async function getFaq(): Promise<{ categories: FaqCategory[]; items: FaqItem[] }> {
  return { categories: faqCategories, items: faqItems };
}

/** "Most asked this month", in rank order. */
export async function getMostAskedFaq(): Promise<FaqItem[]> {
  return faqItems
    .filter((item) => item.mostAskedRank !== null)
    .sort((a, b) => (a.mostAskedRank ?? 0) - (b.mostAskedRank ?? 0));
}
