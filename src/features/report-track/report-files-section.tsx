'use client';

import { CircleAlert } from 'lucide-react';
import { FileUpload } from '@/components/ui/file-upload';
import { reportTrackCopy } from '@/content/report-track';
import { DocsSectionHeading } from '@/features/project/docs-section';
import { reportFieldId } from './report-values';

const { files } = reportTrackCopy.report;

type FilesSectionProps = {
  /** Shown when a submit was blocked because a photo is still uploading. */
  error: string | null;
  onFileCountChange: (count: number) => void;
  onBusyChange: (busy: boolean) => void;
};

/** "Photos and files": optional, up to 5 files. */
export function ReportFilesSection({ error, onFileCountChange, onBusyChange }: FilesSectionProps) {
  return (
    <section aria-labelledby="files" className="flex flex-col gap-5 border-t border-gray-200 pt-10">
      <div className="flex flex-col gap-1.5">
        <DocsSectionHeading id="files" title={files.title} />
        <p className="type-body-s text-gray-600">{files.lede}</p>
      </div>
      <div id={reportFieldId('files')} className="flex scroll-mt-35 flex-col gap-3">
        <FileUpload
          maxFiles={files.maxFiles}
          maxMegabytes={files.maxMb}
          onFilesChange={(list) => onFileCountChange(list.length)}
          onBusyChange={onBusyChange}
        />
        {error ? (
          <p className="flex items-start gap-1.5 type-body-s text-danger-700">
            <CircleAlert aria-hidden className="mt-0.5 size-4 shrink-0" />
            {error}
          </p>
        ) : null}
      </div>
    </section>
  );
}
