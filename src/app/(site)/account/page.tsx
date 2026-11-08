import { accountCopy } from '@/content/account';
import { getAccountProfile } from '@/data/api/account';
import { getAreas } from '@/data/api/areas';
import { getStations } from '@/data/api/stations';
import { ProfilePage } from '@/features/account/profile-page';

export const metadata = accountCopy.account.meta;

export default async function AccountPage() {
  const [profile, areas, stations] = await Promise.all([
    getAccountProfile(),
    getAreas(),
    getStations(),
  ]);
  return <ProfilePage profile={profile} areas={areas} stations={stations} />;
}
