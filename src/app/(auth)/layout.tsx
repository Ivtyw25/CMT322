import { SkipLink } from '@/components/layout/skip-link';

/**
 * Log in, Sign up and Forgot password: no site header, notice or footer. Each page draws its own
 * split layout (form left, navy panel right) inside this single <main>.
 */
export default function AuthLayout({ children }: LayoutProps<'/'>) {
  return (
    <>
      <SkipLink />
      <main id="main" tabIndex={-1} className="min-h-dvh">
        {children}
      </main>
    </>
  );
}
