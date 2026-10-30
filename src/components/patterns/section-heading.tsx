import { cn } from '@/lib/cn';
import { AccentBar } from './accent-bar';

type SectionHeadingProps = {
  children: React.ReactNode;
  /** Heading level: h2 for page sections, h3 inside one. */
  as?: 'h2' | 'h3';
  id?: string;
  /** Short intro under the heading. */
  description?: string;
  className?: string;
};

/** Accent bar, then the section heading (Heading/S on phones, Heading/M from 1024 px). */
export function SectionHeading({
  children,
  as: Heading = 'h2',
  id,
  description,
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <AccentBar />
      <Heading id={id} tabIndex={id ? -1 : undefined} className="type-heading-xs lg:type-heading-s">
        {children}
      </Heading>
      {description ? (
        <p className="type-body-m text-gray-600 lg:type-body-l">{description}</p>
      ) : null}
    </div>
  );
}
