import { PolicyPage } from '@/features/legal-help/policy-page';
import { legalHelpCopy } from '@/content/legal-help';
import { getSiteInfo } from '@/data/api/site-info';
import { routes } from '@/config/routes';

export const metadata = {
  title: legalHelpCopy.accessibility.title,
  description: legalHelpCopy.accessibility.description,
};

export default async function Page() {
  const siteInfo = await getSiteInfo();
  return (
    <PolicyPage
      siteInfo={siteInfo}
      copy={legalHelpCopy.accessibility}
      href={routes.help.accessibility}
    />
  );
}
