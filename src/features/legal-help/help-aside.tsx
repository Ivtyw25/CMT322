import { ButtonLink } from '@/components/ui/button-link';
import { legalHelpCopy } from '@/content/legal-help';
import type { SiteInfo } from '@/data/models/site-info';

export function HelpAside({
  siteInfo,
  action,
}: {
  siteInfo: SiteInfo;
  action: { href: string; label: string };
}) {
  const copy = legalHelpCopy.aside;
  return (
    <section className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4">
      <h2 className="type-body-s-semibold">{copy.title}</h2>
      <p className="type-body-s text-gray-600">{copy.body}</p>
      <ButtonLink href={action.href} fullWidth>
        {action.label}
      </ButtonLink>
      <a
        href={siteInfo.careline.tel}
        className="inline-flex min-h-11 items-center type-body-xs text-primary-700 hover:underline"
      >
        {siteInfo.careline.label} {siteInfo.careline.number}
      </a>
    </section>
  );
}
