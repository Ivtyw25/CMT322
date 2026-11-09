import { progressUpdates, stageBases } from '@/data/mock/progress-updates';
import type { ProgressUpdate, StageBase } from '@/data/models/progress-update';

/** Every station progress update, drafts and scheduled ones included. */
export async function getProgressUpdates(): Promise<ProgressUpdate[]> {
  return progressUpdates;
}

/** Every station's stages before any progress update. */
export async function getStageBases(): Promise<StageBase[]> {
  return stageBases;
}
