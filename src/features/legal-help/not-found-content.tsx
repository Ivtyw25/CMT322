import Link from 'next/link';
import { routes } from '@/config/routes';
import { notFoundCopy } from '@/content/not-found';

/** Recovery content shared by root and site-layout 404 boundaries. */
export function NotFoundContent() {
  return (
    <div className="mx-auto max-w-content px-5 py-16">
      <div aria-hidden className="mb-5 h-1 w-12 bg-primary-600" />
      <h1 className="type-heading-m">{notFoundCopy.heading}</h1>
      <p className="mt-2 type-body-m text-gray-600">{notFoundCopy.body}</p>
      <Link
        href={routes.home}
        className="mt-6 inline-flex min-h-11 items-center type-body-m-semibold text-primary-700"
      >
        {notFoundCopy.homeLink}
      </Link>
      <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
        {notFoundCopy.links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="inline-flex min-h-11 items-center type-body-m text-primary-700 hover:text-primary-800"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
