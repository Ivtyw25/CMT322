import { cn } from '@/lib/cn';

/**
 * Page width: side padding 20 / 32 / 40 px, content at most 1200 px and centred.
 * Full-bleed backgrounds sit outside; the content sits in here.
 */
export function Container({
  as: Tag = 'div',
  className,
  ...props
}: React.ComponentProps<'div'> & { as?: 'div' | 'section' | 'header' | 'footer' }) {
  return (
    <Tag className="px-5 md:px-8 lg:px-10">
      <div className={cn('mx-auto max-w-content', className)} {...props} />
    </Tag>
  );
}
