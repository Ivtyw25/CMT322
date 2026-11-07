import { MOCK_NOW } from '@/data/mock/clock';

/** Today as an ISO date ("2026-10-29"). The mock site is fixed on the day of the design. */
export async function getToday(): Promise<string> {
  return MOCK_NOW.slice(0, 10);
}

/** "Now" as an ISO date-time. The mock site is fixed on the evening of the design's day. */
export async function getNow(): Promise<string> {
  return MOCK_NOW;
}
