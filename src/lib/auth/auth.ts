import { routes } from '@/config/routes';
import { saveProfile } from '@/lib/profile/profile';

const demoEmail = 'meiling.tan@example.com';
const demoPassword = 'Mutiara123';
let registered: { email: string; password: string } | null = null;
export const authDelay = (ms = 800) => new Promise<void>((resolve) => setTimeout(resolve, ms));
export const validEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
export const validPassword = (password: string) =>
  password.length >= 8 && password.length <= 64 && /\d/.test(password);
export function safeNext(raw: string | null | undefined): string {
  if (!raw || !raw.startsWith('/') || raw.startsWith('//') || /[\\\u0000-\u0020]/.test(raw))
    return routes.home;
  try {
    const decoded = decodeURIComponent(raw);
    if (decoded.startsWith('//') || decoded.includes('\\')) return routes.home;
    const path = new URL(raw, 'https://local.invalid').pathname.replace(/\/$/, '');
    if (
      [routes.account.login, routes.account.signup, routes.account.forgotPassword].some(
        (route) => route === path,
      )
    )
      return routes.home;
    return raw;
  } catch {
    return routes.home;
  }
}
export function authLink(path: string, next: string) {
  return `${path}?next=${encodeURIComponent(next)}`;
}
export async function authenticate(email: string, password: string) {
  await authDelay();
  const normalized = email.trim().toLowerCase();
  return (
    (normalized === demoEmail && password === demoPassword) ||
    (normalized === registered?.email && password === registered.password)
  );
}
export async function registerAccount(name: string, email: string, password: string) {
  await authDelay();
  if (email.trim().toLowerCase() === demoEmail) return false;
  registered = { email: email.trim().toLowerCase(), password };
  saveProfile({ name: name.trim(), email: email.trim() });
  return true;
}
export async function requestReset(email: string) {
  if (!validEmail(email)) return false;
  await authDelay();
  return true;
}
let rememberedEmail = '';
export const rememberEmail = (email: string) => {
  rememberedEmail = email;
};
export const recalledEmail = () => rememberedEmail;
