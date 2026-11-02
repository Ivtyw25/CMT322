import { cn } from '@/lib/cn';

const block = 'rounded-lg bg-gray-100 motion-safe:animate-pulse';

/** What shows while the address is read: title, switch, three grey bars, rows and cards. */
export function PanelSkeleton({ children }: { children?: React.ReactNode }) {
  return (
    <div aria-hidden className="flex flex-col gap-4 p-4 md:p-8 lg:p-6">
      <div className={cn(block, 'h-8 w-40')} />
      <div className={cn(block, 'h-11 w-full')} />
      <div className={cn(block, 'h-11 w-full')} />
      <div className={cn(block, 'h-10 w-full')} />
      {[0, 1, 2, 3].map((row) => (
        <div key={row} className={cn(block, 'h-5 w-2/3')} />
      ))}
      {[0, 1, 2, 3].map((card) => (
        <div key={card} className={cn(block, 'h-24 w-full')} />
      ))}
      {children}
    </div>
  );
}
