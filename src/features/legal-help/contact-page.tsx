import { CircleHelp, Flag, Mail, Megaphone, Phone, Search } from 'lucide-react';
import { DocsSectionHeading } from '@/components/patterns/docs-section';
import { routes } from '@/config/routes';
import { legalHelpCopy } from '@/content/legal-help';
import type { SiteInfo } from '@/data/models/site-info';
import { ContactCard } from './contact-card';
import { ContactRow } from './contact-row';
import { HelpNote } from './help-note';
import { HelpPageFrame } from './help-page-frame';

function ContactSection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section aria-labelledby={id} className="flex flex-col gap-4">
      <DocsSectionHeading id={id} title={title} />
      {children}
    </section>
  );
}

export function ContactPage({ siteInfo }: { siteInfo: SiteInfo }) {
  const copy = legalHelpCopy.contact;
  const [works, urgent, website, before] = copy.sections;
  return (
    <HelpPageFrame href={routes.help.contact} {...copy} siteInfo={siteInfo}>
      <ContactSection {...works}>
        <div className="grid items-start gap-4 sm:grid-cols-2">
          <ContactCard {...copy.report} icon={<Flag aria-hidden className="size-5" />} />
          <ContactCard {...copy.track} icon={<Search aria-hidden className="size-5" />} />
        </div>
      </ContactSection>
      <ContactSection {...urgent}>
        <HelpNote tone="warning">{copy.emergency}</HelpNote>
        <ContactRow
          href={siteInfo.careline.tel}
          icon={<Phone aria-hidden className="size-5 text-warning-600" />}
          iconClassName="bg-warning-50"
          title={`${siteInfo.careline.label} ${siteInfo.careline.number}`}
          body={copy.careline}
        />
      </ContactSection>
      <ContactSection {...website}>
        <ContactRow
          href={siteInfo.email.href}
          icon={<Mail aria-hidden className="size-5 text-primary-600" />}
          iconClassName="bg-primary-50"
          title={siteInfo.email.address}
          body={copy.email}
        />
      </ContactSection>
      <ContactSection {...before}>
        <div className="grid items-start gap-4 sm:grid-cols-2">
          <ContactCard {...copy.faq} icon={<CircleHelp aria-hidden className="size-5" />} />
          <ContactCard
            {...copy.announcements}
            icon={<Megaphone aria-hidden className="size-5" />}
          />
        </div>
      </ContactSection>
    </HelpPageFrame>
  );
}
