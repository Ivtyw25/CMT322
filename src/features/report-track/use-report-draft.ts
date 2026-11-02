'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { readJson, removeKey, writeJson } from '@/lib/storage';
import type { ReportValues } from './report-values';

const DRAFT_KEY = 'mlc-report-draft';
const SAVE_DELAY_MS = 500;
const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

/** What a draft keeps. Name, email, consent and files are never stored. */
type DraftValues = Pick<
  ReportValues,
  'type' | 'categoryId' | 'subject' | 'description' | 'address' | 'pin' | 'stationCode' | 'phone'
>;
type Draft = DraftValues & { savedAt: string; fileCount: number };

export type RestoredDraft = { values: DraftValues; savedAt: string; hadFiles: boolean };

function isDraft(value: unknown): value is Draft {
  if (typeof value !== 'object' || value === null) return false;
  const draft = value as Record<string, unknown>;
  return (
    typeof draft.savedAt === 'string' &&
    typeof draft.type === 'string' &&
    typeof draft.categoryId === 'string' &&
    typeof draft.subject === 'string' &&
    typeof draft.description === 'string' &&
    typeof draft.address === 'string' &&
    typeof draft.phone === 'string'
  );
}

function hasContent(values: ReportValues): boolean {
  return Boolean(
    values.subject || values.description || values.address || values.phone || values.categoryId,
  );
}

type Options = {
  values: ReportValues;
  fileCount: number;
  /** Called once on mount with a draft younger than 7 days. */
  onRestore: (restored: RestoredDraft) => void;
};

/**
 * The report draft in this browser (`mlc-report-draft`): restored on mount, written 500 ms after
 * the last change. Storage that is blocked changes nothing visible, and `saved` never turns true.
 */
export function useReportDraft({ values, fileCount, onRestore }: Options) {
  const [saved, setSaved] = useState(false);
  const restoreRef = useRef(onRestore);

  useEffect(() => {
    restoreRef.current = onRestore;
  }, [onRestore]);

  useEffect(() => {
    const stored = readJson(DRAFT_KEY);
    if (!isDraft(stored)) return;
    const age = Date.now() - new Date(stored.savedAt).getTime();
    if (!(age >= 0 && age < MAX_AGE_MS)) return;
    const { savedAt, fileCount: storedFiles, ...rest } = stored;
    restoreRef.current({ values: rest, savedAt, hadFiles: storedFiles > 0 });
  }, []);

  useEffect(() => {
    if (!hasContent(values)) return;
    const timer = setTimeout(() => {
      const draft: Draft = {
        savedAt: new Date().toISOString(),
        type: values.type,
        categoryId: values.categoryId,
        subject: values.subject,
        description: values.description,
        address: values.address,
        pin: values.pin,
        stationCode: values.stationCode,
        phone: values.phone,
        fileCount,
      };
      writeJson(DRAFT_KEY, draft);
      setSaved(readJson(DRAFT_KEY) !== null);
    }, SAVE_DELAY_MS);
    return () => clearTimeout(timer);
  }, [values, fileCount]);

  /** Deletes the draft (after a sent report, or "Start over"). New typing starts a new draft. */
  const clear = useCallback(() => {
    removeKey(DRAFT_KEY);
    setSaved(false);
  }, []);

  return { saved, clear };
}
