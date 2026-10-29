import {
  announcements,
  constructionUpdates,
  faqCategories,
  faqItems,
  milestones,
  searchIndex,
  tickets,
} from '@/data/mock/records';
import type { Announcement, AnnouncementStatus } from '@/data/models/announcement';
import type { ConstructionUpdate, Milestone } from '@/data/models/construction-update';
import type { FaqCategory, FaqItem } from '@/data/models/faq';
import type { SearchEntry } from '@/data/models/search';
import type { Ticket } from '@/data/models/ticket';

/*
 * Starter access functions. The foundations team splits this into one file per domain
 * (announcements.ts, construction.ts, tickets.ts, faq.ts, search.ts) next to stations.ts.
 */

export async function getAnnouncements(status?: AnnouncementStatus): Promise<Announcement[]> {
  return status ? announcements.filter((item) => item.status === status) : announcements;
}

export async function getConstructionUpdates(): Promise<ConstructionUpdate[]> {
  return [...constructionUpdates].sort((a, b) => b.date.localeCompare(a.date));
}

export async function getMilestones(): Promise<Milestone[]> {
  return [...milestones].sort((a, b) => a.date.localeCompare(b.date));
}

export async function getTicket(id: string): Promise<Ticket | null> {
  return tickets.find((ticket) => ticket.id === id.toUpperCase()) ?? null;
}

export async function getFaq(): Promise<{ categories: FaqCategory[]; items: FaqItem[] }> {
  return { categories: faqCategories, items: faqItems };
}

export async function getSearchIndex(): Promise<SearchEntry[]> {
  return searchIndex;
}
