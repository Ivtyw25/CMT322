'use client';

import { Eye, EyeOff, Lock } from 'lucide-react';
import { useId, useState } from 'react';
import { uiCopy } from '@/content/ui';
import { TextInput, type TextInputProps } from './text-input';
import { useFieldControl } from './field';

/** Password field with a lock icon and a show/hide toggle (`aria-pressed`). */
export function PasswordInput(props: Omit<TextInputProps, 'type' | 'leadingIcon' | 'trailing'>) {
  const [visible, setVisible] = useState(false);
  const [focused, setFocused] = useState(false);
  const [capsLock, setCapsLock] = useState(false);
  const capsId = useId();
  const field = useFieldControl();
  const Icon = visible ? EyeOff : Eye;
  return (
    <>
      <TextInput
        {...props}
        aria-describedby={
          [
            field['aria-describedby'],
            props['aria-describedby'],
            focused && capsLock ? capsId : null,
          ]
            .filter(Boolean)
            .join(' ') || undefined
        }
        onFocus={(event) => {
          setFocused(true);
          props.onFocus?.(event);
        }}
        onBlur={(event) => {
          setFocused(false);
          setCapsLock(false);
          props.onBlur?.(event);
        }}
        onKeyDown={(event) => {
          setCapsLock(event.getModifierState('CapsLock'));
          props.onKeyDown?.(event);
        }}
        onKeyUp={(event) => {
          setCapsLock(event.getModifierState('CapsLock'));
          props.onKeyUp?.(event);
        }}
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
      <p
        id={capsId}
        role="status"
        className={focused && capsLock ? 'type-body-xs text-warning-700' : 'sr-only'}
      >
        {focused && capsLock ? uiCopy.form.password.capsLock : ''}
      </p>
    </>
  );
}
