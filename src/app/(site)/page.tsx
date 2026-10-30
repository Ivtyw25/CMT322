import type { Metadata } from 'next';
import { homeCopy } from '@/content/home';

export const metadata: Metadata = { title: { absolute: homeCopy.heading } };

/** Placeholder until the Home iteration. The navy block stands in for the hero behind the header. */
export default function HomePage() {
  return (
    <div className="bg-static-navy">
      <div className="mx-auto max-w-content px-5 pt-40 pb-24 md:px-8 lg:px-10">
        <h1 className="type-heading-m text-static-white lg:type-heading-xl">{homeCopy.heading}</h1>
        <p className="mt-4 type-body-l text-static-on-navy-100 lg:type-body-xl">{homeCopy.intro}</p>
      </div>
    </div>
  );
}
