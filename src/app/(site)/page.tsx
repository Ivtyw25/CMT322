import type { Metadata } from 'next';
import { commonCopy } from '@/content/common';
import { homeCopy } from '@/content/home';

export const metadata: Metadata = {
  title: { absolute: commonCopy.metadata.defaultTitle },
  description: homeCopy.meta.description,
};

export default function HomePage() {
  return (
    <main id="main" className="mx-auto max-w-content px-5 py-16">
      <h1 className="type-heading-m lg:type-heading-xl">{homeCopy.hero.title}</h1>
      <p className="mt-4 type-body-l text-gray-600 lg:type-body-xl">{homeCopy.works.lede}</p>
    </main>
  );
}
