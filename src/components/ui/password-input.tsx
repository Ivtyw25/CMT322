'use client';

import { Eye, EyeOff, Lock } from 'lucide-react';
import { useState } from 'react';
import { uiCopy } from '@/content/ui';
import { TextInput, type TextInputProps } from './text-input';

/** Password field with a lock icon and a show/hide toggle (`aria-pressed`). */
export function PasswordInput(props: Omit<TextInputProps, 'type' | 'leadingIcon' | 'trailing'>) {
  const [visible, setVisible] = useState(false);
  const Icon = visible ? EyeOff : Eye;
  return (
    <TextInput
      {...props}
      type={visible ? 'text' : 'password'}
      autoComplete={props.autoComplete ?? 'current-password'}
      leadingIcon={<Lock className="size-4.5" />}
      trailing={
        <button
          type="button"
          aria-label={visible ? uiCopy.form.password.hide : uiCopy.form.password.show}
          aria-pressed={visible}
          onClick={() => setVisible((current) => !current)}
          className="hit-area flex size-9 cursor-pointer items-center justify-center rounded-md text-gray-500 transition-colors duration-(--duration-fast) hover:text-gray-900"
        >
          <Icon aria-hidden className="size-4.5" />
        </button>
      }
    />
  );
}
