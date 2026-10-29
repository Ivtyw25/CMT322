import { expect, test, type Page } from '@playwright/test';
import { prepare, settle } from '../support/browser';
import { allowedExternalLinks, socialNames } from '../support/external-links';
import { visitsForActivePages } from '../support/pages';

const MAX_BUTTONS_PER_PAGE = 60;

type Anchor = {
  href: string | null;
  target: string | null;
  rel: string;
  name: string;
  inNewTabLabel: boolean;
};

async function readAnchors(page: Page): Promise<Anchor[]> {
  return page.locator('a').evaluateAll((anchors) =>
    anchors.map((a) => {
      const name = `${a.getAttribute('aria-label') ?? ''} ${a.textContent ?? ''} ${a.getAttribute('title') ?? ''}`;
      return {
        href: a.getAttribute('href'),
        target: a.getAttribute('target'),
        rel: a.getAttribute('rel') ?? '',
        name: name.replace(/\s+/g, ' ').trim(),
        inNewTabLabel: /opens in (a )?new tab/i.test(name),
      };
    }),
  );
}

for (const visit of visitsForActivePages()) {
  test(`links on ${visit.pageId} ${visit.url}`, async ({ page, request, baseURL }) => {
    await prepare(page, { signedIn: visit.signedIn });
    const response = await page.goto(visit.url);
    expect(response?.status(), 'page status').toBe(visit.expectStatus);
    await settle(page);

    const origin = new URL(baseURL ?? page.url()).origin;
    const anchors = await readAnchors(page);
    const problems: string[] = [];
    const internal = new Set<string>();

    for (const a of anchors) {
      const label = `"${a.name.slice(0, 50)}" (${a.href ?? 'no href'})`;
      if (!a.href || a.href === '#' || a.href.startsWith('javascript:')) {
        problems.push(`dead link ${label}`);
        continue;
      }
      if (socialNames.includes(a.name)) problems.push(`social name rendered as a link ${label}`);
      if (a.href.startsWith('#')) {
        const exists = await page.locator(`[id="${a.href.slice(1)}"]`).count();
        if (!exists) problems.push(`in-page anchor has no target ${label}`);
        continue;
      }
      if (a.href.startsWith('mailto:') || a.href.startsWith('tel:')) {
        if (!allowedExternalLinks.includes(a.href)) problems.push(`unknown contact link ${label}`);
        continue;
      }
      const url = new URL(a.href, page.url());
      if (url.origin === origin) {
        if (a.target === '_blank') problems.push(`internal link opens a new tab ${label}`);
        internal.add(url.pathname + url.search);
        continue;
      }
      if (!allowedExternalLinks.includes(url.href))
        problems.push(`external URL not in the allowlist ${label}`);
      if (a.target !== '_blank') problems.push(`external link must open in a new tab ${label}`);
      if (!/noopener/.test(a.rel) || !/noreferrer/.test(a.rel))
        problems.push(`external link needs rel="noopener noreferrer" ${label}`);
      if (!a.inNewTabLabel)
        problems.push(`external link needs an "opens in new tab" label ${label}`);
    }

    for (const path of internal) {
      const res = await request.get(path, { maxRedirects: 5 });
      if (res.status() >= 400) problems.push(`internal link returns ${res.status()}: ${path}`);
    }

    expect(problems, 'link problems').toEqual([]);
  });

  test(`buttons on ${visit.pageId} ${visit.url}`, async ({ page }) => {
    await prepare(page, { signedIn: visit.signedIn });
    await page.goto(visit.url);
    await settle(page);
    const count = Math.min(await page.locator('button:visible').count(), MAX_BUTTONS_PER_PAGE);
    const problems: string[] = [];

    for (let index = 0; index < count; index++) {
      if (index > 0) {
        await page.goto(visit.url);
        await settle(page);
      }
      const button = page.locator('button:visible').nth(index);
      if (!(await button.count()) || (await button.isDisabled())) continue;
      const name = ((await button.getAttribute('aria-label')) ?? (await button.innerText()))
        .trim()
        .slice(0, 50);
      const before = page.url();
      const invalidForm = await button.evaluate((el) => {
        const b = el as HTMLButtonElement;
        return b.type === 'submit' && !!b.form && !b.form.checkValidity();
      });
      await page.evaluate(() => {
        const w = window as Window & { __mutations?: number };
        w.__mutations = 0;
        new MutationObserver((list) => {
          w.__mutations = (w.__mutations ?? 0) + list.length;
        }).observe(document.body, {
          subtree: true,
          childList: true,
          attributes: true,
          characterData: true,
        });
      });
      await button
        .click({ timeout: 5_000 })
        .catch(() => problems.push(`button not clickable "${name}"`));
      await page.waitForTimeout(400);
      const changed =
        page.url() !== before ||
        invalidForm ||
        (await page
          .evaluate(() => ((window as Window & { __mutations?: number }).__mutations ?? 0) > 0)
          .catch(() => true));
      if (!changed) problems.push(`button does nothing "${name}"`);
    }

    expect(problems, 'button problems').toEqual([]);
  });
}
