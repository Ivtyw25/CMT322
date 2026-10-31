import { projectCopy } from '@/content/project';

/** Four headline numbers. A `<dl>` so a screen reader hears "Stations, 22"; the value shows first. */
export function AboutKeyFigures() {
  return (
    <dl className="grid grid-cols-2 gap-y-5 md:grid-cols-4">
      {projectCopy.about.figures.items.map((item) => (
        <div
          key={item.label}
          className="flex flex-col-reverse gap-1 border-gray-200 px-4 odd:pl-0 even:border-l md:border-l md:px-5 md:first:border-l-0 md:first:pl-0 md:odd:pl-5"
        >
          <dt className="type-body-s text-gray-600">{item.label}</dt>
          <dd className="type-heading-xs text-primary-700 lg:type-heading-s">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
