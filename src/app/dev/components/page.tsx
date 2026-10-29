import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { devCopy } from '@/content/dev';

export const metadata: Metadata = { title: devCopy.title, robots: { index: false } };

/** Development-only gallery of every shared component, variant and state. 404 in production. */
export default function ComponentsGalleryPage() {
  if (process.env.NODE_ENV === 'production') notFound();
  return (
    <main id="main" className="mx-auto max-w-content px-5 py-16">
      <h1 className="type-heading-m">{devCopy.title}</h1>
      <p className="mt-2 type-body-m text-gray-600">{devCopy.intro}</p>
    </main>
  );
}
