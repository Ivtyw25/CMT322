const KB = 1024;
const MB = KB * 1024;

/** "2.1 MB" or "340 KB". */
export function formatFileSize(bytes: number): string {
  if (bytes >= MB) return `${(bytes / MB).toFixed(1)} MB`;
  return `${Math.max(1, Math.round(bytes / KB))} KB`;
}
