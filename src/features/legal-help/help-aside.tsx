import { ButtonLink } from '@/components/ui/button-link';

import { legalHelpCopy, type HelpAsideCopy } from '@/content/legal-help';
import type { SiteInfo } from '@/data/models/site-info';

export function HelpAside({ siteInfo, aside }: { siteInfo: SiteInfo; aside: HelpAsideCopy }) {
  return (
    <section className="flex flex-col gap-2.5 rounded-2xl border border-gray-200 bg-gray-50 p-4">
      <h2 className="type-body-s-semibold text-gray-900">{aside.title}</h2>
      <p className="type-body-xs text-gray-600">{aside.body}</p>
      <ButtonLink href={aside.primary.href} fullWidth>
        {aside.primary.label}
      </ButtonLink>
      {aside.secondary ? (
        <ButtonLink href={aside.secondary.href} variant="secondary" fullWidth>
          {aside.secondary.label}
        </ButtonLink>
      ) : null}
      <a href={siteInfo.careline.tel} className="hit-area type-body-xs text-gray-700">
        {legalHelpCopy.aside.careline(siteInfo.careline.label, siteInfo.careline.number)}
      </a>
    </section>
  );
}
