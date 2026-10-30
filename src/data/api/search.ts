import { searchIndex } from '@/data/mock/search-index';
import type { SearchEntry } from '@/data/models/search';

export async function getSearchIndex(): Promise<SearchEntry[]> {
  return searchIndex;
}
