'use client';

import { CircleAlert, CircleCheck, ImagePlus, X } from 'lucide-react';
import { useEffect, useId, useRef, useState } from 'react';
import { uiCopy } from '@/content/ui';
import { cn } from '@/lib/cn';

const ACCEPTED_TYPES = ['image/jpeg', 'image/png'];
const TICK_MS = 250;
const TICK_STEP = 18;
const BYTES_PER_MB = 1024 * 1024;

type UploadItem = { id: string; file: File; progress: number };

type FileUploadProps = {
  maxFiles: number;
  maxMegabytes: number;
  /** Called with the files that passed the checks, whenever the list changes. */
  onFilesChange?: (files: File[]) => void;
  className?: string;
};

/**
 * Photo picker with drag and drop. The upload is simulated: each file counts up to 100 %
 * (the real API replaces this). Rules and errors come from the copy in `uiCopy.upload`.
 */
export function FileUpload({ maxFiles, maxMegabytes, onFilesChange, className }: FileUploadProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState<UploadItem[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [dragging, setDragging] = useState(false);
  const counter = useRef(0);
  const uploading = items.some((item) => item.progress < 100);

  useEffect(() => {
    if (!uploading) return;
    const timer = setInterval(() => {
      setItems((current) =>
        current.map((item) => ({ ...item, progress: Math.min(100, item.progress + TICK_STEP) })),
      );
    }, TICK_MS);
    return () => clearInterval(timer);
  }, [uploading]);

  function commit(next: UploadItem[]) {
    setItems(next);
    onFilesChange?.(next.map((item) => item.file));
  }

  function addFiles(list: FileList | null) {
    if (!list) return;
    const accepted: UploadItem[] = [];
    const problems: string[] = [];
    for (const file of Array.from(list)) {
      if (!ACCEPTED_TYPES.includes(file.type))
        problems.push(uiCopy.upload.errors.wrongType(file.name));
      else if (file.size > maxMegabytes * BYTES_PER_MB)
        problems.push(uiCopy.upload.errors.tooBig(file.name, maxMegabytes));
      else if (items.length + accepted.length >= maxFiles)
        problems.push(uiCopy.upload.errors.tooMany(maxFiles));
      else accepted.push({ id: `upload-${counter.current++}`, file, progress: 0 });
    }
    setErrors([...new Set(problems)]);
    if (accepted.length > 0) commit([...items, ...accepted]);
    if (inputRef.current) inputRef.current.value = '';
  }

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <label
        htmlFor={inputId}
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
          'flex min-h-28 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed px-4 py-6 text-center',
          'transition-colors duration-(--duration-fast) ease-(--ease-standard)',
          dragging
            ? 'border-primary-600 bg-primary-50'
            : 'border-gray-300 bg-surface hover:border-gray-400',
          'has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-primary-600',
        )}
      >
        <ImagePlus aria-hidden className="size-6 text-gray-500" />
        <span className="type-body-s-semibold text-primary-700">{uiCopy.upload.choose}</span>
        <span className="type-body-s text-gray-600">{uiCopy.upload.dropHint}</span>
        <span className="type-body-xs text-gray-500">
          {uiCopy.upload.rules(maxFiles, maxMegabytes)}
        </span>
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          accept={ACCEPTED_TYPES.join(',')}
          multiple
          className="sr-only"
          onChange={(event) => addFiles(event.target.files)}
        />
      </label>

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

      {items.length > 0 ? (
        <ul className="flex flex-col gap-2">
          {items.map((item) => {
            const done = item.progress >= 100;
            return (
              <li
                key={item.id}
                className="flex items-center gap-3 rounded-lg border border-gray-200 bg-surface p-3"
              >
                <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                  <p className="truncate type-body-s-medium text-gray-900">{item.file.name}</p>
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
                </div>
                {done ? (
                  <CircleCheck aria-hidden className="size-5 shrink-0 text-success-700" />
                ) : null}
                <p className="sr-only" aria-live="polite">
                  {done ? uiCopy.upload.done(item.file.name) : ''}
                </p>
                <button
                  type="button"
                  aria-label={uiCopy.upload.remove(item.file.name)}
                  onClick={() => commit(items.filter((entry) => entry.id !== item.id))}
                  className="hit-area flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-md text-gray-500 transition-colors duration-(--duration-fast) hover:bg-gray-100 hover:text-gray-900"
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
