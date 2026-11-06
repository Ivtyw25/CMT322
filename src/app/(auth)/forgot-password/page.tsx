import { AuthForm } from '@/features/account/auth-form';
import { accountCopy } from '@/content/account';
export const metadata = accountCopy.forgotPassword.meta;
export default async function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const params = await searchParams;
  return <AuthForm mode="reset" rawNext={params.next} />;
}
