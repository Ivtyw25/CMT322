import { constructionUpdates, milestones } from '@/data/mock/construction-updates';
import type { AreaId } from '@/data/models/area';
import type {
  ConstructionPhase,
  ConstructionUpdate,
  Milestone,
} from '@/data/models/construction-update';

export type ConstructionUpdateFilter = { phase?: ConstructionPhase; areaId?: AreaId };

/** Site updates, newest first. */
export async function getConstructionUpdates(
  filter: ConstructionUpdateFilter = {},
): Promise<ConstructionUpdate[]> {
  return constructionUpdates
    .filter((item) => !filter.phase || item.phase === filter.phase)
    .filter((item) => !filter.areaId || item.areaId === filter.areaId)
    .sort((a, b) => b.date.localeCompare(a.date));
}

/** Project milestones, oldest first. */
export async function getMilestones(): Promise<Milestone[]> {
  return [...milestones].sort((a, b) => a.date.localeCompare(b.date));
}
