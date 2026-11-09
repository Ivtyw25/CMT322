'use client';

import { Upload, X } from 'lucide-react';
import { useId, useRef, useState } from 'react';
import { ImagePlaceholder } from '@/components/patterns/image-placeholder';
import { Field } from '@/components/ui/field';
import { TextInput } from '@/components/ui/text-input';
import { adminCopy } from '@/content/admin';
import type { ProgressPhoto } from '@/data/models/progress-update';
import { useAnnounce } from '@/lib/announce/announcer';
import { cn } from '@/lib/cn';

const copy = adminCopy.progressEditor.photos;
const ACCEPT = ['image/jpeg', 'image/png'];
const BYTES_PER_MB = 1024 * 1024;

type PhotoListProps = {
  photos: readonly ProgressPhoto[];
  onChange: (photos: ProgressPhoto[]) => void;
  /** Shows "A description is needed" under every photo that has none. */
  showAltErrors: boolean;
};

/**
 * Photos of an update: a drop zone and one row per photo with the description screen readers
 * hear. Only the file name is kept (there is no backend to hold the picture).
 */
export function PhotoList({ photos, onChange, showAltErrors }: PhotoListProps) {
  const inputId = useId();
  const input = useRef<HTMLInputElement>(null);
  const announce = useAnnounce();
  const [dragging, setDragging] = useState(false);
  const [problems, setProblems] = useState<string[]>([]);

  function add(list: FileList | null) {
    if (!list) return;
    const found: string[] = [];
    const added: ProgressPhoto[] = [];
    for (const file of Array.from(list)) {
      if (photos.length + added.length >= copy.maxPhotos) {
        found.push(copy.tooMany(copy.maxPhotos));
        break;
      }
      if (!ACCEPT.includes(file.type)) found.push(copy.wrongType(file.name));
      else if (file.size > copy.maxMegabytes * BYTES_PER_MB) {
        found.push(copy.tooBig(file.name, copy.maxMegabytes));
      } else {
        added.push({ id: `photo-${Date.now()}-${added.length}`, fileName: file.name, alt: '' });
      }
    }
    setProblems(found);
    if (added.length > 0) onChange([...photos, ...added]);
  }

  return (
    <div className="flex flex-col gap-4">
      <div
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          add(event.dataTransfer.files);
        }}
        className={cn(
          'flex flex-col items-center gap-1.5 rounded-xl border border-dashed px-4 py-8 text-center transition-colors duration-(--duration-fast)',
          dragging ? 'border-primary-600 bg-primary-50' : 'border-gray-300 bg-gray-50',
        )}
      >
        <Upload aria-hidden className="size-5 text-gray-700" />
        <label
          htmlFor={inputId}
          className="cursor-pointer type-body-s-medium text-gray-900 has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-primary-600"
        >
          {dragging ? copy.dropActive : copy.drop}
          <input
            ref={input}
            id={inputId}
            type="file"
            multiple
            accept={ACCEPT.join(',')}
            className="sr-only"
            onChange={(event) => {
              add(event.target.files);
              event.target.value = '';
            }}
          />
        </label>
        <p className="type-body-xs text-gray-500">
          {copy.rules(copy.maxPhotos, copy.maxMegabytes)}
        </p>
      </div>
      {problems.length > 0 ? (
        <ul role="alert" className="flex flex-col gap-1 type-body-s text-danger-700">
          {problems.map((problem) => (
            <li key={problem}>{problem}</li>
          ))}
        </ul>
      ) : null}

      {photos.length === 0 ? (
        <p className="type-body-s text-gray-600">{copy.empty}</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {photos.map((photo) => (
            <li key={photo.id} className="flex items-start gap-4">
              <ImagePlaceholder decorative className="h-20 w-25 shrink-0 rounded-lg" />
              <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <p className="min-w-0 flex-1 type-body-s-medium break-all text-gray-900">
                    {photo.fileName}
                  </p>
                  <button
                    type="button"
                    aria-label={copy.remove(photo.fileName)}
                    onClick={() => {
                      onChange(photos.filter((entry) => entry.id !== photo.id));
                      announce(copy.removed(photo.fileName));
                    }}
                    className="hit-area flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-gray-500 transition-colors duration-(--duration-fast) hover:text-gray-900"
                  >
                    <X aria-hidden className="size-4" />
                  </button>
                </div>
                <Field
                  label={copy.altLabel(photo.fileName)}
                  hideLabel
                  error={showAltErrors && photo.alt.trim() === '' ? copy.altMissing : undefined}
                >
                  <TextInput
                    value={photo.alt}
                    placeholder={copy.altPlaceholder}
                    onChange={(event) =>
                      onChange(
                        photos.map((entry) =>
                          entry.id === photo.id ? { ...entry, alt: event.target.value } : entry,
                        ),
                      )
                    }
                  />
                </Field>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
