import type { Careline } from '@/components/patterns/need-help-block';
import { ButtonLink } from '@/components/ui/button-link';
import { routes } from '@/config/routes';
import { projectCopy } from '@/content/project';
import { uiCopy } from '@/content/ui';

const { stillNeedHelp } = projectCopy.faq;

/** "Still need help?" card: replaces the generic Need help block on the FAQ page. */
export function FaqHelpCard({ careline }: { careline: Careline }) {
  return (
    <section
      aria-labelledby="faq-help-title"
      className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-gray-50 p-4"
    >
      <h2 id="faq-help-title" className="type-body-s-semibold text-gray-900">
        {stillNeedHelp.title}
      </h2>
      <p className="type-body-xs text-gray-600">{stillNeedHelp.body}</p>
      <div className="flex flex-col gap-2">
        <ButtonLink href={routes.reportTrack.report} fullWidth>
          {uiCopy.docsPage.needHelp.report}
        </ButtonLink>
        <ButtonLink href={routes.reportTrack.track} variant="secondary" fullWidth>
          {uiCopy.docsPage.needHelp.track}
        </ButtonLink>
      </div>
      <p className="type-body-xs text-gray-600">
        <a href={careline.tel} className="text-primary-700 hover:underline">
          {stillNeedHelp.careline(careline.label, careline.number)}
        </a>
      </p>
    </section>
  );
}
