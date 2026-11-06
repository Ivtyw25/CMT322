import { ContactPage } from '@/features/legal-help/contact-page';
import { legalHelpCopy } from '@/content/legal-help';
import { getSiteInfo } from '@/data/api/site-info';

export const metadata = {
  title: legalHelpCopy.contact.title,
  description: legalHelpCopy.contact.description,
};

export default async function Page() {
  const siteInfo = await getSiteInfo();
  return <ContactPage siteInfo={siteInfo} />;
}
