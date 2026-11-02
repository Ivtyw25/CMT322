import type { ReportFieldName, ReportValues } from './report-values';

/** What every section of the report form gets from the form. */
export type ReportSectionProps = {
  values: ReportValues;
  update: (patch: Partial<ReportValues>) => void;
  /** The error showing under a field, or null. */
  errorOf: (name: ReportFieldName) => string | null;
  /** Check a field when it loses focus. */
  onBlur: (name: ReportFieldName) => void;
};
