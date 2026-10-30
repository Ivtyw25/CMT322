import type { AreaId } from '@/data/models/area';

/** Emails ending with this domain make the mock fail, so the error state can be tested. */
const FAILING_DOMAIN = '@fail.test';
const MOCK_DELAY_MS = 600;

/**
 * Mock sign-up for road change alerts (footer and Home). Resolves after a short delay;
 * rejects for addresses at fail.test. `areaId` null means all areas.
 */
export async function subscribeToAlerts(email: string, areaId: AreaId | null): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS));
  if (email.trim().toLowerCase().endsWith(FAILING_DOMAIN)) {
    throw new Error(`Mock alert sign-up failed for ${areaId ?? 'all areas'}`);
  }
}
