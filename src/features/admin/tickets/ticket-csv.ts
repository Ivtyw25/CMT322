/** One CSV cell: quoted, with inner quotes doubled. */
function cell(value: string): string {
  return `"${value.replaceAll('"', '""')}"`;
}

export function buildCsv(header: readonly string[], rows: readonly (readonly string[])[]): string {
  return [header, ...rows].map((row) => row.map(cell).join(',')).join('\r\n');
}

/** Saves text as a file through the browser. */
export function downloadCsv(fileName: string, csv: string): void {
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
