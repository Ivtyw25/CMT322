import { PolicyPage } from '@/features/legal-help/policy-page';
import { legalHelpCopy } from '@/content/legal-help';
import { getSiteInfo } from '@/data/api/site-info';
import { routes } from '@/config/routes';

export const metadata = {
  title: legalHelpCopy.terms.title,
  description: legalHelpCopy.terms.description,
};

export default async function Page() {
  const siteInfo = await getSiteInfo();
  return <PolicyPage siteInfo={siteInfo} copy={legalHelpCopy.terms} href={routes.legal.terms} />;
}
