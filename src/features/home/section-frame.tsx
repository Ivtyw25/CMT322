import { Container } from '@/components/layout/container';
import { AccentBar } from '@/components/patterns/accent-bar';
import { cn } from '@/lib/cn';

type HomeSectionProps = {
  /** Id of the section's h2. */
  headingId: string;
  /** Grey band or the plain page surface, as in Figma. */
  tone?: 'plain' | 'band';
  children: React.ReactNode;
  className?: string;
};

/** A Home section: full-width band, Home's 32 px inset container, section rhythm 40 / 64 / 80 px. */
export function HomeSection({ headingId, tone = 'plain', children, className }: HomeSectionProps) {
  return (
    <section
      aria-labelledby={headingId}
      className={cn('py-10 md:py-16 lg:py-20', tone === 'band' && 'bg-gray-50', className)}
    >
      <Container gutter="wide" className="flex flex-col gap-6 md:gap-8">
        {children}
      </Container>
    </section>
  );
}

type SectionHeaderProps = {
  headingId: string;
  title: string;
  lede?: string;
  /** Visually hide the heading but keep it for screen readers. */
  hidden?: boolean;
  /** Action beside the heading from 768 px (under the intro below). */
  action?: React.ReactNode;
};

/** Accent bar, h2 and intro; `action` sits on the right from 768 px. */
export function SectionHeader({
  headingId,
  title,
  lede,
  hidden = false,
  action,
}: SectionHeaderProps) {
  if (hidden) {
    return (
      <h2 id={headingId} className="sr-only">
        {title}
      </h2>
    );
  }
  return (
    <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between md:gap-8">
      <div className="flex flex-col gap-3">
        <AccentBar />
        <h2 id={headingId} className="type-heading-xs lg:type-heading-s">
          {title}
        </h2>
        {lede ? <p className="type-body-m text-gray-600">{lede}</p> : null}
      </div>
      {action ? <div className="md:shrink-0">{action}</div> : null}
    </div>
  );
}
