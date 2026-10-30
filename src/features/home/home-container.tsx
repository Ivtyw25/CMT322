import { cn } from '@/lib/cn';

/**
 * Home page width: side padding 20 px below 390, 32 px from 390 (the mobile frame) and 40 px from
 * 1024; content at most 1200 px and centred. Sections put their background outside this.
 */
export function HomeContainer({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div className="px-5 min-[390px]:px-8 lg:px-10">
      <div className={cn('mx-auto max-w-content', className)} {...props} />
    </div>
  );
}
