import { Flag, Search, CircleHelp, Megaphone, TriangleAlert, Phone, Mail } from 'lucide-react';
import { DocsSection } from '@/components/patterns/docs-section';
import { routes } from '@/config/routes';
import { legalHelpCopy } from '@/content/legal-help';
import type { SiteInfo } from '@/data/models/site-info';
import { ContactCard } from './contact-card';
import { HelpPageFrame } from './help-page-frame';

export function ContactPage({ siteInfo }: { siteInfo: SiteInfo }) {
  const copy = legalHelpCopy.contact;
  return (
    <HelpPageFrame href={routes.help.contact} {...copy} siteInfo={siteInfo}>
      <DocsSection id="works" title={copy.sections[0].title}>
        <div className="grid gap-4 sm:grid-cols-2">
          <ContactCard {...copy.report} icon={<Flag aria-hidden className="size-5" />} />
          <ContactCard {...copy.track} icon={<Search aria-hidden className="size-5" />} />
        </div>
        <p className="type-body-s text-gray-600">{legalHelpCopy.demo}</p>
      </DocsSection>
      <DocsSection id="urgent" title={copy.sections[1].title}>
        <p className="flex gap-3 rounded-lg border-l-2 border-warning-600 bg-warning-50 p-4 type-body-s text-gray-700">
          <TriangleAlert aria-hidden className="size-5 shrink-0 text-warning-600" />
          {copy.emergency}
        </p>
        <a
          href={siteInfo.careline.tel}
          className="flex items-center gap-4 rounded-xl border border-gray-200 p-5 hover:bg-gray-50"
        >
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-warning-50">
            <Phone aria-hidden className="size-5 text-warning-600" />
          </span>
          <span className="flex flex-col gap-1">
            <span className="type-body-m-semibold">
              {siteInfo.careline.label} {siteInfo.careline.number}
            </span>
            <span className="type-body-s text-gray-600">{copy.careline}</span>
          </span>
        </a>
      </DocsSection>
      <DocsSection id="website" title={copy.sections[2].title}>
        <a
          href={siteInfo.email.href}
          className="flex min-w-0 items-center gap-4 rounded-xl border border-gray-200 p-5 hover:bg-gray-50"
        >
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary-50">
            <Mail aria-hidden className="size-5 text-primary-600" />
          </span>
          <span className="flex min-w-0 flex-col gap-1">
            <span className="type-body-m-semibold wrap-anywhere">{siteInfo.email.address}</span>
            <span className="type-body-s text-gray-600">{copy.email}</span>
          </span>
        </a>
      </DocsSection>
      <DocsSection id="before" title={copy.sections[3].title}>
        <div className="grid gap-4 sm:grid-cols-2">
          <ContactCard {...copy.faq} icon={<CircleHelp aria-hidden className="size-5" />} />
          <ContactCard
            {...copy.announcements}
            icon={<Megaphone aria-hidden className="size-5" />}
          />
        </div>
      </DocsSection>
    </HelpPageFrame>
  );
}
