import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { devCopy } from '@/content/dev';
import { devGalleryEnabled } from '@/lib/dev-gallery';

export const metadata: Metadata = {
  title: devCopy.traffic.workspaceTitle,
  robots: { index: false },
};

/** Development-only sample of the workspace layout (no footer, window-high). 404 on the live site. */
export default function WorkspaceSamplePage() {
  if (!devGalleryEnabled) notFound();
  return (
    <div className="flex h-full flex-col gap-2 border-b border-gray-200 bg-gray-50 p-6">
      <h1 className="type-heading-xs">{devCopy.traffic.workspaceTitle}</h1>
      <p className="type-body-s text-gray-700">{devCopy.traffic.workspaceBody}</p>
    </div>
  );
}
