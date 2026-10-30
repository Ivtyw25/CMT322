import { Mail, Phone } from 'lucide-react';
import Link from 'next/link';
import { commonCopy } from '@/content/common';
import { footerCopy } from '@/content/footer';
import { getAreas } from '@/data/api/areas';
import { getSiteInfo } from '@/data/api/site-info';
import { cn } from '@/lib/cn';
import { BackToTop } from './back-to-top';
import { Logo } from './logo';
import { NewsletterForm } from './newsletter-form';

const footerLink =
  'hit-area flex min-h-11 items-center type-body-s text-static-on-navy-200 transition-colors duration-(--duration-fast) hover:text-static-white hover:underline focus-visible:outline-static-white @min-[48rem]:min-h-0';

const contactLink =
  'hit-area type-body-s-semibold text-static-white hover:underline focus-visible:outline-static-white';

const divider = 'hidden h-px bg-surface @min-[48rem]:block';

type SiteFooterProps = {
  /** Gallery only: opens the newsletter in a given state. */
  newsletterPreview?: React.ComponentProps<typeof NewsletterForm>['preview'];
  className?: string;
};

/**
 * The footer (Figma 1:127 desktop, 127:5801 mobile). It lays out from its own width, not the
 * window's: under 768 px the phone layout, 768 to 1023 the tablet layout, from 1024 the desktop one.
 * Navy zone: text uses the static tokens, so it never flips in dark mode.
 */
export async function SiteFooter({ newsletterPreview, className }: SiteFooterProps) {
  const [siteInfo, areas] = await Promise.all([getSiteInfo(), getAreas()]);

  return (
    <footer data-shell-inert="" className={cn('@container bg-primary-900', className)}>
      <div className="px-5 pt-10 pb-8 @min-[48rem]:px-8 @min-[64rem]:px-10 @min-[64rem]:pt-16">
        <div className="mx-auto flex max-w-content flex-col gap-7 @min-[48rem]:gap-8 @min-[64rem]:gap-10">
          <div className="flex flex-col gap-7 @min-[48rem]:gap-8 @min-[64rem]:flex-row @min-[64rem]:gap-14">
            <div className="flex flex-col gap-5 @min-[64rem]:w-90 @min-[64rem]:shrink-0">
              <Logo tone="onDark" />
              <p className="type-body-s text-static-on-navy-200">{footerCopy.description}</p>
              <ul className="flex flex-col gap-3">
                <li className="flex items-start gap-2.5 @min-[48rem]:gap-3">
                  <Phone aria-hidden className="mt-0.5 size-4.5 shrink-0 text-static-on-navy-100" />
                  <div className="flex flex-col gap-0.5">
                    <a href={siteInfo.careline.tel} className={contactLink}>
                      <span className="sr-only">{footerCopy.contact.carelineLabel}: </span>
                      {siteInfo.careline.label} {siteInfo.careline.number}
                    </a>
                    <p className="type-body-xs text-static-on-navy-200 @min-[48rem]:text-static-on-navy-300">
                      {siteInfo.careline.description}
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-2.5 @min-[48rem]:gap-3">
                  <Mail aria-hidden className="mt-0.5 size-4.5 shrink-0 text-static-on-navy-100" />
                  <div className="flex flex-col gap-0.5">
                    <a href={siteInfo.email.href} className={contactLink}>
                      <span className="sr-only">{footerCopy.contact.emailLabel}: </span>
                      {siteInfo.email.address}
                    </a>
                    <p className="type-body-xs text-static-on-navy-200 @min-[48rem]:text-static-on-navy-300">
                      {siteInfo.email.description}
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            <nav
              aria-label={commonCopy.landmarks.footerNav}
              className="grid grid-cols-2 gap-x-6 gap-y-7 @min-[48rem]:grid-cols-4 @min-[48rem]:gap-8 @min-[64rem]:flex-1"
            >
              {footerCopy.columns.map((column) => (
                <div key={column.id} className="flex min-w-0 flex-col gap-1 @min-[48rem]:gap-3">
                  <h2 className="type-body-s-semibold text-static-white">{column.title}</h2>
                  <ul className="flex flex-col @min-[48rem]:gap-3">
                    {column.links.map((link) => (
                      <li key={link.href}>
                        <Link href={link.href} className={footerLink}>
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
          </div>

          <div className={divider} />
          <NewsletterForm
            areas={areas.map((area) => ({ id: area.id, label: area.label }))}
            preview={newsletterPreview}
          />
          <div className={divider} />

          <div className="flex flex-wrap items-center gap-2 @min-[48rem]:gap-4">
            <p className="hidden type-body-s-semibold text-static-white @min-[48rem]:block">
              {footerCopy.social.title}
            </p>
            <ul
              aria-label={footerCopy.social.title}
              className="flex flex-wrap gap-2 @min-[48rem]:gap-4"
            >
              {siteInfo.socials.map((channel) => (
                <li
                  key={channel.name}
                  className={cn(
                    'rounded-full border border-static-on-navy-300 px-2.5 py-1 type-body-xs-medium text-static-white',
                    '@min-[48rem]:border-static-white-30 @min-[48rem]:px-3 @min-[48rem]:py-1.25 @min-[48rem]:text-static-on-navy-100',
                  )}
                >
                  {channel.name}
                </li>
              ))}
            </ul>
            <BackToTop className="hidden @min-[48rem]:ml-6.5 @min-[48rem]:flex" />
          </div>

          <div className={divider} />
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-static-on-navy-300 pt-5 type-body-xs @min-[48rem]:gap-x-6 @min-[48rem]:border-t-0 @min-[48rem]:pt-0">
            <p className="text-static-on-navy-200 @min-[48rem]:mr-8.5">
              {footerCopy.legal.copyright}
            </p>
            {footerCopy.legal.links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hit-area type-body-xs-medium text-static-white hover:underline focus-visible:outline-static-white @min-[48rem]:text-static-on-navy-100"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
