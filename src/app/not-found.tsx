import { NavCurrentAfterHydration } from '@/lib/navigation/nav-current';
import { SiteShell } from '@/components/layout/site-shell';
import { NotFoundContent } from '@/features/legal-help/not-found-content';

export default function NotFound() {
  return (
    <NavCurrentAfterHydration>
      <SiteShell>
        <NotFoundContent />
      </SiteShell>
    </NavCurrentAfterHydration>
  );
}
