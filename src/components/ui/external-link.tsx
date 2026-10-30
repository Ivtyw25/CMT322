import { uiCopy } from '@/content/ui';
import { cn } from '@/lib/cn';
import { VisuallyHidden } from './visually-hidden';

type ExternalLinkProps = Omit<React.ComponentProps<'a'>, 'target' | 'rel' | 'href'> & {
  href: string;
};

/** Opens in a new tab and says so. Use for every http(s) destination outside this site. */
export function ExternalLink({ href, className, children, ...props }: ExternalLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn('text-primary-700 underline-offset-2 hover:underline', className)}
      {...props}
    >
      {children}
      <VisuallyHidden> {uiCopy.opensInNewTab}</VisuallyHidden>
    </a>
  );
}
