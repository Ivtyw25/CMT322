import Image from 'next/image';
import loginArt from '@/assets/images/illustration-login.webp';
import signupArt from '@/assets/images/illustration-sign-up.webp';
import { cn } from '@/lib/cn';
import { Logo } from '@/components/layout/logo';
export function AuthShell({
  heading,
  illustration,
  children,
  footer,
}: {
  heading: string;
  illustration: 'login' | 'signup';
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-[712fr_728fr]">
      <div className="flex flex-col">
        <div className="relative flex min-h-dvh flex-col px-5 pt-5 pb-15 md:px-8 lg:px-14 lg:py-10">
          <Logo />
          <div
            className={cn(
              'mx-auto flex w-full max-w-100 flex-1 flex-col justify-start py-8 motion-reduce:animate-none lg:justify-center lg:py-0',
              illustration === 'signup' ? 'animate-auth-in-right' : 'animate-auth-in-left',
            )}
          >
            {children}
          </div>
          <div className="mx-auto flex w-full max-w-100 flex-wrap justify-center gap-x-1 gap-y-2 text-center type-body-xs text-gray-500 lg:max-w-150">
            {footer}
          </div>
        </div>
      </div>
      <aside
        aria-hidden
        className="relative hidden h-dvh min-h-dvh flex-col self-start overflow-hidden bg-static-navy lg:sticky lg:top-0 lg:flex"
      >
        <p
          key={heading}
          className="relative z-10 mx-auto w-full max-w-140 animate-[fade-in_400ms_var(--ease-enter)_both] pt-50 text-center type-heading-l whitespace-pre-line text-static-white motion-reduce:animate-none"
        >
          {heading}
        </p>
        <Image
          src={illustration === 'login' ? loginArt : signupArt}
          alt=""
          sizes="50vw"
          className={cn(
            'mt-auto h-auto w-full animate-auth-art-in motion-reduce:animate-none',
            illustration === 'signup' && '-mb-3.5',
          )}
          priority
        />
      </aside>
    </div>
  );
}
