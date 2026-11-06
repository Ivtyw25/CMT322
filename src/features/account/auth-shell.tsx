import Image from 'next/image';
import loginArt from '@/assets/images/illustration-login.webp';
import signupArt from '@/assets/images/illustration-sign-up.webp';
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
    <div className="grid min-h-dvh lg:grid-cols-2">
      <div className="flex min-h-dvh flex-col px-5 py-5 md:px-8 lg:px-14 lg:py-10">
        <Logo />
        <div className="mx-auto flex w-full max-w-100 flex-1 flex-col justify-center py-8 lg:py-12">
          {children}
        </div>
        <div className="mx-auto w-full max-w-100 py-2 text-center type-body-xs text-gray-500">
          {footer}
        </div>
      </div>
      <aside
        aria-hidden
        className="relative hidden h-dvh min-h-dvh flex-col self-start overflow-hidden bg-static-navy lg:sticky lg:top-0 lg:flex"
      >
        <p className="relative z-10 mx-auto w-full max-w-120 px-10 pt-51 text-center type-heading-l text-static-white">
          {heading}
        </p>
        <Image
          src={illustration === 'login' ? loginArt : signupArt}
          alt=""
          sizes="50vw"
          className="mt-auto h-auto w-full"
          priority
        />
      </aside>
    </div>
  );
}
