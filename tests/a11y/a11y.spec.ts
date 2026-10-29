import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { prepare, settle } from '../support/browser';
import { visitsForActivePages } from '../support/pages';

const THEMES = ['light', 'dark'] as const;
const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
];

for (const visit of visitsForActivePages()) {
  for (const theme of THEMES) {
    for (const viewport of VIEWPORTS) {
      test(`${visit.pageId} ${visit.url} ${theme} ${viewport.name}`, async ({ page }) => {
        await prepare(page, { theme, signedIn: visit.signedIn });
        await page.setViewportSize(viewport);
        await page.goto(visit.url);
        await settle(page);
        await expect(page.locator('html')).toHaveAttribute('data-theme', theme);

        const results = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
          .analyze();
        const blocking = results.violations
          .filter((v) => v.impact === 'serious' || v.impact === 'critical')
          .map((v) => ({
            rule: v.id,
            impact: v.impact,
            help: v.help,
            targets: v.nodes.slice(0, 5).map((n) => n.target.join(' ')),
          }));
        expect(blocking, 'serious or critical axe violations').toEqual([]);
      });
    }
  }
}
