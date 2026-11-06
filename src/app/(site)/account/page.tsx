import { accountCopy } from '@/content/account';
import { getAccountProfile } from '@/data/api/account';
import { getAreas } from '@/data/api/areas';
import { getStations } from '@/data/api/stations';
import { getTicketsForUser } from '@/data/api/tickets';
import { getCurrentUser } from '@/data/api/user';
import { ProfilePage } from '@/features/account/profile-page';

export const metadata = accountCopy.account.meta;

export default async function AccountPage() {
  const user = await getCurrentUser();
  const [profile, areas, stations, tickets] = await Promise.all([
    getAccountProfile(),
    getAreas(),
    getStations(),
    getTicketsForUser(user.id),
  ]);
  return <ProfilePage profile={profile} areas={areas} stations={stations} tickets={tickets} />;
}
