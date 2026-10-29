import type { Metadata } from 'next';
import { homeCopy } from '@/content/home';

export const metadata: Metadata = { title: { absolute: homeCopy.heading } };

export default function HomePage() {
  return (
    <main id="main" className="mx-auto max-w-content px-5 py-16">
      <h1 className="type-heading-m lg:type-heading-xl">{homeCopy.heading}</h1>
      <p className="mt-4 type-body-l text-gray-600 lg:type-body-xl">{homeCopy.intro}</p>
    </main>
  );
}
