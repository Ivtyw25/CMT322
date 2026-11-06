import { SitemapPage } from '@/features/legal-help/sitemap-page';
import { legalHelpCopy } from '@/content/legal-help';
import { getSiteInfo } from '@/data/api/site-info';

export const metadata = {
  title: legalHelpCopy.sitemap.title,
  description: legalHelpCopy.sitemap.description,
};

export default async function Page() {
  const siteInfo = await getSiteInfo();
  return <SitemapPage siteInfo={siteInfo} />;
}
