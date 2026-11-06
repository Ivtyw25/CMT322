import { AuthForm } from '@/features/account/auth-form';
import { accountCopy } from '@/content/account';
export const metadata = accountCopy.login.meta;
export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const params = await searchParams;
  return <AuthForm mode="login" rawNext={params.next} />;
}
