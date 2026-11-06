import { AuthForm } from '@/features/account/auth-form';
import { accountCopy } from '@/content/account';

export const metadata = accountCopy.signup.meta;

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const params = await searchParams;
  return <AuthForm mode="signup" rawNext={params.next} />;
}
