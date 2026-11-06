'use client';
import { Circle, CircleCheck } from 'lucide-react';
import { accountCopy } from '@/content/account';
import { accountUiCopy } from '@/content/account-ui';
export function PasswordRules({ password, id }: { password: string; id?: string }) {
  const items = [
    [password.length >= 8 && password.length <= 64, accountCopy.signup.passwordRules.length],
    [/\d/.test(password), accountCopy.signup.passwordRules.number],
  ] as const;
  return (
    <ul id={id} className="space-y-1 type-body-xs">
      {items.map(([met, text]) => {
        const Icon = met ? CircleCheck : Circle;
        return (
          <li
            key={text}
            className={met ? 'flex gap-2 text-success-700' : 'flex gap-2 text-gray-500'}
          >
            <Icon aria-hidden className="size-4" />
            {text}
            <span className="sr-only">
              {met ? accountUiCopy.rules.met : accountUiCopy.rules.unmet}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
