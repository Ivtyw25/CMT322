import { projectCopy } from '@/content/project';

const { segments } = projectCopy.stations;

/** The two line segments and their construction status. */
export function StationsSegments() {
  return (
    <ul
      aria-label={segments.label}
      className="mt-0.5 grid gap-6 rounded-xl bg-gray-50 px-4 py-3.5 md:mt-4 md:grid-cols-2"
    >
      {segments.items.map((item) => (
        <li key={item.segment} className="flex flex-col gap-0.5">
          <p className="type-body-s-semibold text-gray-900">{item.title}</p>
          <p className="type-body-s text-gray-600">{item.status}</p>
        </li>
      ))}
    </ul>
  );
}
