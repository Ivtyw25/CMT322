'use client';

import { CircleAlert, File as FileIcon, Image as ImageIcon, Upload, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { uiCopy } from '@/content/ui';
import { cn } from '@/lib/cn';
import { formatFileSize } from '@/lib/format/file-size';

/** JPG, PNG and PDF. The rules line in `uiCopy.upload` names the same kinds. */
const DEFAULT_ACCEPT: readonly string[] = ['image/jpeg', 'image/png', 'application/pdf'];
const TICK_MS = 250;
const TICK_STEP = 18;
const BYTES_PER_MB = 1024 * 1024;

type UploadItem = { id: string; file: File; progress: number };

type FileUploadProps = {
  maxFiles: number;
  maxMegabytes: number;
  /** MIME types the zone takes. Default: JPG, PNG and PDF. */
  accept?: readonly string[];
  /** Called with the files that passed the checks, whenever the list changes. */
  onFilesChange?: (files: File[]) => void;
  /** Called with true while any file is still uploading. */
  onBusyChange?: (busy: boolean) => void;
  className?: string;
};

/**
 * File picker with drag and drop. The upload is simulated: each file counts up to 100 % (the real
 * API replaces this). Rules, messages and labels come from `uiCopy.upload`. Rejected files never
 * block the valid ones; removing a file moves focus to a neighbouring row, else to "browse".
 */
export function FileUpload({
  maxFiles,
  maxMegabytes,
  accept = DEFAULT_ACCEPT,
  onFilesChange,
  onBusyChange,
  className,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const browseRef = useRef<HTMLButtonElement>(null);
  const removeRefs = useRef(new Map<string, HTMLButtonElement>());
  const focusAfterRemove = useRef<string | null | undefined>(undefined);
  const counter = useRef(0);
  const [items, setItems] = useState<UploadItem[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [dragging, setDragging] = useState(false);
  const [removedMessage, setRemovedMessage] = useState('');
  const uploading = items.some((item) => item.progress < 100);
  const full = items.length >= maxFiles;

  useEffect(() => {
    onBusyChange?.(uploading);
  }, [uploading, onBusyChange]);

  useEffect(() => {
    if (!uploading) return;
    const timer = setInterval(() => {
      setItems((current) =>
        current.map((item) => ({ ...item, progress: Math.min(100, item.progress + TICK_STEP) })),
      );
    }, TICK_MS);
    return () => clearInterval(timer);
  }, [uploading]);

  // After a removal: the next row's remove button, else the previous one's, else "browse".
  useEffect(() => {
    const target = focusAfterRemove.current;
    if (target === undefined) return;
    focusAfterRemove.current = undefined;
    (target ? removeRefs.current.get(target) : browseRef.current)?.focus();
  }, [items]);

  function commit(next: UploadItem[]) {
    setItems(next);
    onFilesChange?.(next.map((item) => item.file));
  }

  function addFiles(list: FileList | null) {
    if (!list) return;
    const accepted: UploadItem[] = [];
    const problems: string[] = [];
    for (const file of Array.from(list)) {
      const duplicate = [...items, ...accepted].some(
        (item) => item.file.name === file.name && item.file.size === file.size,
      );
      if (duplicate) continue;
      if (!accept.includes(file.type)) problems.push(uiCopy.upload.errors.wrongType(file.name));
      else if (file.size > maxMegabytes * BYTES_PER_MB)
        problems.push(uiCopy.upload.errors.tooBig(file.name, maxMegabytes));
      else if (items.length + accepted.length >= maxFiles)
        problems.push(uiCopy.upload.errors.tooMany(maxFiles));
      else accepted.push({ id: `upload-${counter.current++}`, file, progress: 0 });
    }
    setErrors([...new Set(problems)]);
    setRemovedMessage('');
    if (accepted.length > 0) commit([...items, ...accepted]);
    if (inputRef.current) inputRef.current.value = '';
  }

  function removeItem(index: number) {
    const item = items[index];
    if (!item) return;
    const neighbour = items[index + 1] ?? items[index - 1];
    focusAfterRemove.current = neighbour?.id ?? null;
    setErrors([]);
    setRemovedMessage(uiCopy.upload.removed(item.file.name));
    commit(items.filter((entry) => entry.id !== item.id));
  }

  function openPicker() {
    if (!full) inputRef.current?.click();
  }

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <div
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          addFiles(event.dataTransfer.files);
        }}
        className={cn(
          'flex min-h-36 flex-col items-center justify-center gap-2 rounded-xl border border-dashed px-4 py-6 text-center',
          'transition-colors duration-(--duration-fast) ease-(--ease-standard)',
          dragging ? 'border-primary-600 bg-primary-50' : 'border-gray-300 bg-gray-50',
        )}
      >
        <Upload aria-hidden className="size-6 text-gray-600" />
        <p className="type-body-s text-gray-700">
          {dragging ? uiCopy.upload.dropActive : null}
          {!dragging && full ? uiCopy.upload.maxReached(maxFiles) : null}
          {!dragging && !full ? `${uiCopy.upload.dropPrefix} ` : null}
          {!dragging ? (
            <button
              ref={browseRef}
              type="button"
              aria-disabled={full ? 'true' : undefined}
              onClick={openPicker}
              className={cn(
                'hit-area type-body-s-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600',
                full
                  ? 'ml-1 cursor-not-allowed text-gray-500'
                  : 'cursor-pointer text-primary-700 underline-offset-2 hover:text-primary-800',
              )}
            >
              {uiCopy.upload.browse}
            </button>
          ) : null}
        </p>
        <p className="type-body-xs text-gray-500">{uiCopy.upload.rules(maxFiles, maxMegabytes)}</p>
        <input
          ref={inputRef}
          type="file"
          accept={accept.join(',')}
          multiple
          tabIndex={-1}
          aria-hidden
          className="sr-only"
          onChange={(event) => addFiles(event.target.files)}
        />
      </div>

      {errors.length > 0 ? (
        <ul aria-live="polite" className="flex flex-col gap-1">
          {errors.map((message) => (
            <li key={message} className="flex items-start gap-1.5 type-body-s text-danger-700">
              <CircleAlert aria-hidden className="mt-0.5 size-4 shrink-0" />
              {message}
            </li>
          ))}
        </ul>
      ) : null}
      <p role="status" className="sr-only">
        {removedMessage}
      </p>

      {items.length > 0 ? (
        <ul className="flex flex-col gap-2">
          {items.map((item, index) => {
            const done = item.progress >= 100;
            const Tile = item.file.type.startsWith('image/') ? ImageIcon : FileIcon;
            return (
              <li
                key={item.id}
                className="flex items-center gap-3 rounded-lg border border-gray-200 bg-surface p-3"
              >
                <span
                  aria-hidden
                  className="flex size-10 shrink-0 items-center justify-center rounded-md bg-gray-100 text-gray-600"
                >
                  <Tile className="size-5" />
                </span>
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <p className="truncate type-body-s-medium text-gray-900">{item.file.name}</p>
                  {done ? (
                    <p className="type-body-xs text-success-700">
                      {uiCopy.upload.uploaded(formatFileSize(item.file.size))}
                    </p>
                  ) : (
                    <>
                      <p className="type-body-xs text-gray-600">
                        {uiCopy.upload.progress(item.file.name, item.progress)}
                      </p>
                      <div
                        role="progressbar"
                        aria-label={uiCopy.upload.progress(item.file.name, item.progress)}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuenow={item.progress}
                        className="h-1.5 overflow-hidden rounded-full bg-gray-100"
                      >
                        <div
                          className="h-full rounded-full bg-primary-600 transition-[width] duration-(--duration-fast) ease-(--ease-standard)"
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                    </>
                  )}
                </div>
                <button
                  type="button"
                  ref={(node) => {
                    if (node) removeRefs.current.set(item.id, node);
                    else removeRefs.current.delete(item.id);
                  }}
                  aria-label={uiCopy.upload.remove(item.file.name)}
                  onClick={() => removeItem(index)}
                  className="hit-area flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-md text-gray-500 transition-colors duration-(--duration-fast) hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                >
                  <X aria-hidden className="size-4" />
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
