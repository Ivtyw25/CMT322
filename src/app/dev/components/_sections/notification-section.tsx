import { devCopy } from '@/content/dev';
import { getSiteNotice } from '@/data/api/announcements';
import { NotificationBar } from '@/components/layout/notification-bar';
import { PreviewFrame } from '@/app/dev/components/_parts/preview-frame';
import { GallerySection } from '@/app/dev/components/_parts/section';

const states = devCopy.states;

export async function NotificationSection() {
  const notice = await getSiteNotice();
  const view = notice ? { id: notice.id, title: notice.title, message: notice.message } : null;
  return (
    <GallerySection id="notification-bar" note={devCopy.labels.nothing}>
      {view ? (
        <>
          <div className="flex max-w-full min-w-0 flex-col gap-2">
            <h3 className="type-body-xs-semibold text-gray-500">{states.solid}</h3>
            <PreviewFrame label={states.solid} width="desktop">
              <NotificationBar notice={view} preview="solid" />
            </PreviewFrame>
          </div>
          <div className="flex max-w-full min-w-0 flex-col gap-2">
            <h3 className="type-body-xs-semibold text-gray-500">{states.onHero}</h3>
            <PreviewFrame label={states.onHero} width="desktop" hero>
              <div className="pt-8">
                <NotificationBar notice={view} preview="hero" />
              </div>
              <div aria-hidden className="h-40" />
            </PreviewFrame>
          </div>
          <div className="flex max-w-full min-w-0 flex-col gap-2">
            <h3 className="type-body-xs-semibold text-gray-500">{states.mobile}</h3>
            <PreviewFrame label={states.mobile} width="mobile">
              <NotificationBar notice={view} preview="solid" />
            </PreviewFrame>
          </div>
        </>
      ) : null}
      <p className="type-body-s text-gray-600">{states.dismissed}</p>
    </GallerySection>
  );
}
