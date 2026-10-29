import { expect, test } from '@playwright/test';
import { prepare, settle } from '../support/browser';
import { visitsForActivePages } from '../support/pages';

const WIDTHS = [320, 360, 390, 414, 768, 1024, 1280, 1440, 1920];
const MOBILE_HEADER_BELOW = 1024;
const TAP_TARGET_BELOW = 768;
const MIN_TAP = 44;

for (const visit of visitsForActivePages()) {
  test.describe(`${visit.pageId} ${visit.url}`, () => {
    for (const width of WIDTHS) {
      test(`${width}px`, async ({ page }) => {
        await prepare(page, { signedIn: visit.signedIn });
        await page.setViewportSize({ width, height: 900 });
        await page.goto(visit.url);
        await settle(page);

        const report = await page.evaluate(
          ({ minTap, checkTaps }) => {
            const viewport = document.documentElement.clientWidth;
            const isVisible = (el: Element) => {
              const style = getComputedStyle(el);
              const rect = el.getBoundingClientRect();
              return (
                style.visibility !== 'hidden' &&
                style.display !== 'none' &&
                rect.width > 1 &&
                rect.height > 1
              );
            };
            const insideScroller = (el: Element) => {
              for (
                let node = el.parentElement;
                node && node !== document.body;
                node = node.parentElement
              ) {
                const { overflowX } = getComputedStyle(node);
                if (overflowX !== 'visible') return true;
              }
              return false;
            };
            const describe = (el: Element) =>
              `${el.tagName.toLowerCase()}${el.id ? `#${el.id}` : ''} "${(el.textContent ?? '').trim().slice(0, 40)}"`;

            const clipped = Array.from(document.body.querySelectorAll('*'))
              .filter(
                (el) => el.children.length === 0 && (el.textContent ?? '').trim() && isVisible(el),
              )
              .filter((el) => {
                const rect = el.getBoundingClientRect();
                return (rect.right > viewport + 1 || rect.left < -1) && !insideScroller(el);
              })
              .map(describe);

            const smallTargets = checkTaps
              ? Array.from(
                  document.querySelectorAll(
                    'a[href], button, summary, select, input:not([type=hidden]):not([type=checkbox]):not([type=radio]), [role=button], [role=tab], [role=switch], [role=menuitem], [role=option]',
                  ),
                )
                  .filter(isVisible)
                  .filter((el) => !el.closest('.hit-area') && !el.classList.contains('hit-area'))
                  .filter((el) => {
                    // Inline links inside running text are exempt (WCAG 2.5.8 inline exception).
                    const parent = el.parentElement;
                    const inline = getComputedStyle(el).display === 'inline';
                    const inText =
                      parent &&
                      Array.from(parent.childNodes).some(
                        (n) => n.nodeType === 3 && n.textContent?.trim(),
                      );
                    return !(inline && inText);
                  })
                  .filter((el) => {
                    const rect = el.getBoundingClientRect();
                    return rect.width < minTap - 0.5 || rect.height < minTap - 0.5;
                  })
                  .map((el) => {
                    const rect = el.getBoundingClientRect();
                    return `${describe(el)} ${Math.round(rect.width)}×${Math.round(rect.height)}`;
                  })
              : [];

            const headers = Array.from(document.querySelectorAll('[data-header]')).map((el) => ({
              kind: el.getAttribute('data-header'),
              visible: isVisible(el),
            }));

            return {
              scrollWidth: document.documentElement.scrollWidth,
              viewport,
              clipped,
              smallTargets,
              headers,
            };
          },
          { minTap: MIN_TAP, checkTaps: width < TAP_TARGET_BELOW },
        );

        expect(report.scrollWidth, 'no horizontal scroll').toBeLessThanOrEqual(report.viewport);
        expect(report.clipped, 'text clipped off-screen').toEqual([]);
        expect(report.smallTargets, `tap targets under ${MIN_TAP}×${MIN_TAP}px`).toEqual([]);
        if (report.headers.length > 0) {
          const visible = report.headers.filter((h) => h.visible).map((h) => h.kind);
          expect(visible, 'header variant for this width').toEqual([
            width < MOBILE_HEADER_BELOW ? 'mobile' : 'desktop',
          ]);
        }
      });
    }
  });
}
