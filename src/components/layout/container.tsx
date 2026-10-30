import { cn } from '@/lib/cn';

const gutters = {
  /** 20 / 32 / 40 px: most pages (Figma mobile frames inset 20 px). */
  default: 'px-5 md:px-8 lg:px-10',
  /** 20 px below 390, then 32 / 40 px: Home and station hero rows (Figma inset 32 px at 390). */
  wide: 'px-5 min-[390px]:px-8 lg:px-10',
} as const;

/**
 * Page width: side padding, content at most 1200 px and centred.
 * Full-bleed backgrounds sit outside; the content sits in here.
 */
export function Container({
  as: Tag = 'div',
  gutter = 'default',
  className,
  ...props
}: React.ComponentProps<'div'> & {
  as?: 'div' | 'section' | 'header' | 'footer';
  gutter?: keyof typeof gutters;
}) {
  return (
    <Tag className={gutters[gutter]}>
      <div className={cn('mx-auto max-w-content', className)} {...props} />
    </Tag>
  );
}
