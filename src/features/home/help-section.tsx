import { House, Phone, TriangleAlert } from 'lucide-react';
import { ButtonLink } from '@/components/ui/button-link';
import { homeCopy } from '@/content/home';
import { cn } from '@/lib/cn';
import { HomeSection, SectionHeader } from './section-frame';

const HEADING_ID = 'help-heading';

type HelpSectionProps = {
  careline: { label: string; number: string; tel: string };
};

/** One column of the strip: below 768 a top rule, from 768 a vertical divider. */
function HelpColumn({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'flex flex-col items-start gap-3 border-t border-gray-200 pt-6 first:border-t-0 first:pt-0',
        'md:border-t-0 md:border-l md:px-8 md:pt-0 md:first:border-l-0 md:first:pl-0 md:last:pr-0',
        className,
      )}
    >
      {children}
    </div>
  );
}

/** Help strip (Figma 38:1284, mobile 133:6827): report, property surveys and the careline. */
export function HelpSection({ careline }: HelpSectionProps) {
  const copy = homeCopy.help;
  const callLabel = copy.careline.callLabel(careline.label, careline.number);
  return (
    <HomeSection headingId={HEADING_ID} tone="band">
      <SectionHeader headingId={HEADING_ID} title={copy.title} hidden />
      <div className="grid gap-6 md:grid-cols-3 md:gap-0">
        <HelpColumn>
          <TriangleAlert aria-hidden className="size-6 text-primary-600" />
          <h3 className="type-heading-2xs text-wrap">{copy.report.title}</h3>
          <p className="type-body-s text-gray-600">{copy.report.text}</p>
          <div className="flex flex-wrap gap-3 pt-1">
            <ButtonLink href={copy.report.primary.href}>{copy.report.primary.label}</ButtonLink>
            <ButtonLink variant="secondary" href={copy.report.secondary.href}>
              {copy.report.secondary.label}
            </ButtonLink>
          </div>
        </HelpColumn>
        <HelpColumn>
          <House aria-hidden className="size-6 text-primary-600" />
          <h3 className="type-heading-2xs text-wrap">{copy.property.title}</h3>
          <p className="type-body-s text-gray-600">{copy.property.text}</p>
          <ButtonLink variant="ghost" href={copy.property.link.href}>
            {copy.property.link.label}
          </ButtonLink>
        </HelpColumn>
        <HelpColumn>
          <Phone aria-hidden className="size-6 text-primary-600" />
          <h3 className="type-heading-2xs text-wrap">
            <a
              href={careline.tel}
              aria-label={callLabel}
              className="rounded-sm text-gray-900 hover:underline"
            >
              {copy.careline.title(careline.label, careline.number)}
            </a>
          </h3>
          <p className="type-body-s text-gray-600">{copy.careline.text}</p>
        </HelpColumn>
      </div>
    </HomeSection>
  );
}
