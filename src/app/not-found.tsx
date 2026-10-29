import Link from 'next/link';
import { routes } from '@/config/routes';
import { notFoundCopy } from '@/content/not-found';

/** Placeholder 404. The legal-help iteration builds the designed version. */
export default function NotFound() {
  return (
    <main id="main" className="mx-auto max-w-content px-5 py-16">
      <h1 className="type-heading-m">{notFoundCopy.heading}</h1>
      <p className="mt-2 type-body-m text-gray-600">{notFoundCopy.body}</p>
      <Link href={routes.home} className="mt-6 inline-block type-body-m-semibold text-primary-700">
        {notFoundCopy.homeLink}
      </Link>
    </main>
  );
}
