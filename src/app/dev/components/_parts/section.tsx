import { devCopy } from '@/content/dev';
import { cn } from '@/lib/cn';

type GallerySectionProps = {
  /** One of the ids in devCopy.sections; the title comes from there. */
  id: (typeof devCopy.sections)[number]['id'];
  /** Short note under the heading. */
  note?: string;
  children: React.ReactNode;
};

/** One gallery section: an h2 with an anchor id. */
export function GallerySection({ id, note, children }: GallerySectionProps) {
  const title = devCopy.sections.find((section) => section.id === id)?.title;
  return (
    <section aria-labelledby={`${id}-title`} className="border-t border-gray-200 py-10">
      <h2 id={id} tabIndex={-1} className="type-heading-xs">
        <span id={`${id}-title`}>{title}</span>
      </h2>
      {note ? <p className="mt-1 type-body-s text-gray-600">{note}</p> : null}
      <div className="mt-6 flex flex-col gap-8">{children}</div>
    </section>
  );
}

type SpecimenProps = {
  caption: string;
  children: React.ReactNode;
  className?: string;
  /** Background behind the specimen (navy for footer-style parts). */
  surface?: 'default' | 'navy' | 'muted';
};

/** A captioned sample inside a section. */
export function Specimen({ caption, children, className, surface = 'default' }: SpecimenProps) {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="type-body-xs-semibold text-gray-500">{caption}</h3>
      <div
        className={cn(
          'flex flex-wrap items-start gap-4 rounded-xl border border-gray-200 p-4',
          surface === 'navy' && 'bg-primary-900',
          surface === 'muted' && 'bg-gray-50',
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
}
