'use client';
import { Dialog as Primitive } from 'radix-ui';
import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { uiCopy } from '@/content/ui';
export function ConfirmDialog({
  open,
  title,
  body,
  confirm,
  pending,
  onClose,
  onConfirm,
}: {
  open: boolean;
  title: string;
  body: string;
  confirm: string;
  pending?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const cancel = useRef<HTMLButtonElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  return (
    <Primitive.Root
      open={open}
      onOpenChange={(value) => {
        if (!value && !pending) onClose();
      }}
    >
      <Primitive.Portal>
        <Primitive.Overlay className="bg-static-black/50 fixed inset-0 z-50" />
        <Primitive.Content
          onOpenAutoFocus={(event) => {
            event.preventDefault();
            opener.current =
              document.activeElement instanceof HTMLElement ? document.activeElement : null;
            cancel.current?.focus();
          }}
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            opener.current?.focus();
          }}
          className="fixed top-1/2 left-1/2 z-50 w-[calc(100%-2.5rem)] max-w-128 -translate-x-1/2 -translate-y-1/2 rounded-xl border border-gray-200 bg-surface p-6 shadow-panel"
        >
          <Primitive.Title className="type-heading-s">{title}</Primitive.Title>
          <Primitive.Description className="mt-3 type-body-s text-gray-600">
            {body}
          </Primitive.Description>
          <div className="mt-6 flex flex-wrap justify-end gap-3">
            <Button ref={cancel} variant="secondary" onClick={onClose} disabled={pending}>
              {uiCopy.actions.cancel}
            </Button>
            <Button
              loading={pending}
              onClick={onConfirm}
              className="bg-danger-600 hover:bg-danger-700"
            >
              {confirm}
            </Button>
          </div>
        </Primitive.Content>
      </Primitive.Portal>
    </Primitive.Root>
  );
}
