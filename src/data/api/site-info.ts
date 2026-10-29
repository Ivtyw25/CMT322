import { siteInfo } from '@/data/mock/site-info';
import type { SiteInfo } from '@/data/models/site-info';

export async function getSiteInfo(): Promise<SiteInfo> {
  return siteInfo;
}
