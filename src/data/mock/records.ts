import type { Announcement } from '@/data/models/announcement';
import type { ConstructionUpdate, Milestone } from '@/data/models/construction-update';
import type { FaqCategory, FaqItem } from '@/data/models/faq';
import type { SearchEntry } from '@/data/models/search';
import type { Ticket } from '@/data/models/ticket';

/*
 * Empty until the content writer fills them in the foundations iteration.
 * The content writer splits these into one file per record type (announcements.ts, tickets.ts, …)
 * and deletes this file.
 */
export const announcements: Announcement[] = [];
export const constructionUpdates: ConstructionUpdate[] = [];
export const milestones: Milestone[] = [];
export const tickets: Ticket[] = [];
export const faqCategories: FaqCategory[] = [];
export const faqItems: FaqItem[] = [];
export const searchIndex: SearchEntry[] = [];
