import { reportTrackCopy } from '@/content/report-track';
import type { StationCode } from '@/data/models/station';
import type { ReportCategoryId, ReportType } from '@/data/models/ticket';
import type { FieldRules } from '@/lib/forms/use-field-validation';

const { details, contact, consent, category, location, files } = reportTrackCopy.report;

export type ReportPoint = { lat: number; lng: number };

/** What a station needs to be the place a report is near. */
export type ReportStation = {
  code: StationCode;
  name: string;
  /** Place name for the staff queue, e.g. "George Town". */
  area: string;
  lat: number;
  lng: number;
};

export type ReportValues = {
  type: ReportType;
  categoryId: ReportCategoryId | '';
  subject: string;
  description: string;
  address: string;
  pin: ReportPoint | null;
  stationCode: StationCode | null;
  name: string;
  phone: string;
  email: string;
  consent: boolean;
};

export type ReportFieldName =
  | 'category'
  | 'subject'
  | 'description'
  | 'pin'
  | 'address'
  | 'files'
  | 'name'
  | 'phone'
  | 'email'
  | 'consent';

/** Page order, which is also the order of the error summary. */
export const reportFieldOrder: readonly ReportFieldName[] = [
  'category',
  'subject',
  'description',
  'pin',
  'address',
  'files',
  'name',
  'phone',
  'email',
  'consent',
];

export const emptyReportValues: ReportValues = {
  type: 'complaint',
  categoryId: '',
  subject: '',
  description: '',
  address: '',
  pin: null,
  stationCode: null,
  name: '',
  phone: '',
  email: '',
  consent: false,
};

/** The id of a field's wrapper: the target of its error-summary link. */
export const reportFieldId = (name: ReportFieldName) => `report-field-${name}`;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_DIGITS = { min: 9, max: 12 } as const;

function phoneIsValid(phone: string): boolean {
  if (!/^[\d\s+-]+$/.test(phone)) return false;
  const digits = phone.replace(/\D/g, '').length;
  return digits >= PHONE_DIGITS.min && digits <= PHONE_DIGITS.max;
}

/** The rules of every field. `uploading` is true while a photo is still being added. */
export function reportRules(values: ReportValues, uploading: boolean): FieldRules<ReportFieldName> {
  return {
    category: () => (values.categoryId === '' ? category.error : null),
    subject: () => {
      const length = values.subject.trim().length;
      if (length === 0) return details.subject.errorEmpty;
      return length < details.subject.min ? details.subject.errorShort : null;
    },
    description: () => {
      const length = values.description.trim().length;
      if (length === 0) return details.description.errorEmpty;
      if (length < details.description.min) return details.description.errorShort;
      return length > details.description.max ? details.description.errorLong : null;
    },
    pin: () => (values.pin ? null : location.map.errorMissing),
    address: () => (values.address.trim().length < 3 ? location.address.errorEmpty : null),
    files: () => (uploading ? files.waitUploading : null),
    name: () => (values.name.trim() === '' ? contact.fullName.errorEmpty : null),
    phone: () => {
      if (values.phone.trim() === '') return contact.phone.errorEmpty;
      return phoneIsValid(values.phone) ? null : contact.phone.error;
    },
    email: () => {
      const email = values.email.trim();
      if (email === '') return contact.email.errorEmpty;
      return EMAIL_PATTERN.test(email) ? null : contact.email.errorInvalid;
    },
    consent: () => (values.consent ? null : consent.error),
  };
}

/** The station closest to a point (straight-line, good enough at city scale). */
export function nearestStation(
  stations: readonly ReportStation[],
  point: ReportPoint,
): ReportStation | null {
  const cosine = Math.cos((point.lat * Math.PI) / 180);
  let best: ReportStation | null = null;
  let bestDistance = Number.POSITIVE_INFINITY;
  for (const station of stations) {
    const distance = (station.lat - point.lat) ** 2 + ((station.lng - point.lng) * cosine) ** 2;
    if (distance < bestDistance) {
      best = station;
      bestDistance = distance;
    }
  }
  return best;
}

/** "5.2945" */
export const formatCoordinate = (value: number) => value.toFixed(4);

/** "5.2945, 100.2650" */
export const formatPoint = (point: ReportPoint) =>
  `${formatCoordinate(point.lat)}, ${formatCoordinate(point.lng)}`;
