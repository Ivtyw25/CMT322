import { expect, test, type Locator, type Page } from '@playwright/test';
import { routes } from '@/config/routes';
import { devCopy } from '@/content/dev';
import { uiCopy } from '@/content/ui';
import { prepare, settle, whenHydrated, type VisitOptions } from '../../support/browser';

const { samples, states, labels } = devCopy;

async function openGallery(page: Page, options: VisitOptions = {}, width = 1280) {
  await prepare(page, options);
  await page.setViewportSize({ width, height: 900 });
  await page.goto(routes.dev.components);
  await settle(page);
}

const section = (page: Page, id: string) =>
  page.locator('section', { has: page.locator(`#${id}`) });

/** The captioned sample inside a gallery section. */
const specimen = (page: Page, id: string, caption: string): Locator =>
  section(page, id)
    .locator('div', { has: page.getByRole('heading', { name: caption, exact: true }) })
    .last();

const flexDirection = (locator: Locator) =>
  locator.evaluate((element) => getComputedStyle(element).flexDirection);

test.describe('accordion additions', () => {
  test('an item can show an eyebrow and start open', async ({ page }) => {
    await openGallery(page);
    const box = specimen(page, 'accordion', states.eyebrowDefaultOpen);
    await expect(box.getByText(samples.accordionEyebrow)).toHaveCount(3);
    const buttons = box.getByRole('button');
    await expect(buttons.nth(0)).toHaveAttribute('aria-expanded', 'true');
    await expect(buttons.nth(1)).toHaveAttribute('aria-expanded', 'false');
  });

  test('an item opens, scrolls into view and takes focus from code', async ({ page }) => {
    await openGallery(page);
    await whenHydrated(page, 'section:has(#accordion) button');
    const box = specimen(page, 'accordion', states.openFromCode);
    const third = box.getByRole('button', { name: samples.accordion[2]?.title ?? '' });
    await expect(third).toHaveAttribute('aria-expanded', 'false');
    await expect(async () => {
      await box.getByRole('button', { name: labels.openItemButton }).click();
      await expect(third).toHaveAttribute('aria-expanded', 'true', { timeout: 1000 });
    }).toPass();
    await expect(third).toBeFocused();
  });

  test('a #id link focuses the item it opens', async ({ page }) => {
    await prepare(page);
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(`${routes.dev.components}#gallery-topic-2`);
    const button = page
      .locator('#gallery-topic-2')
      .getByRole('button', { name: samples.accordion[1]?.title ?? '' });
    await expect(button).toHaveAttribute('aria-expanded', 'true', { timeout: 30_000 });
    await expect(button).toBeFocused();
  });
});

test.describe('timeline orientation', () => {
  const rows = (page: Page) => specimen(page, 'timeline', states.responsiveRow).locator('ol');

  test('responsive is vertical below 1280 px and a row from there', async ({ page }) => {
    await openGallery(page, {}, 1279);
    expect(await flexDirection(rows(page))).toBe('column');
    await page.setViewportSize({ width: 1280, height: 900 });
    await expect.poll(() => flexDirection(rows(page))).toBe('row');
  });

  test('Today appears once at either width, as a pill', async ({ page }) => {
    await openGallery(page, {}, 1279);
    const today = rows(page).getByText(uiCopy.time.today, { exact: true });
    await expect(today.locator('visible=true')).toHaveCount(1);
    await page.setViewportSize({ width: 1280, height: 900 });
    await expect(today.locator('visible=true')).toHaveCount(1);
  });

  test('the plain vertical timeline stays vertical at 1440 px', async ({ page }) => {
    await openGallery(page, {}, 1440);
    expect(await flexDirection(specimen(page, 'timeline', states.vertical).locator('ol'))).toBe(
      'column',
    );
  });

  test('every item says whether it is done or planned', async ({ page }) => {
    await openGallery(page);
    const list = specimen(page, 'timeline', states.vertical).locator('ol');
    await expect(list.getByText(uiCopy.timeline.past, { exact: true })).toHaveCount(2);
    await expect(list.getByText(uiCopy.timeline.future, { exact: true })).toHaveCount(2);
  });
});

test.describe('segmented control orientation', () => {
  test('vertical stacks 44 px options and arrow keys move through them', async ({ page }) => {
    await openGallery(page);
    await whenHydrated(page, 'section:has(#segmented-control) input');
    const fieldset = specimen(page, 'segmented-control', states.verticalSwitch).locator('fieldset');
    expect(await flexDirection(fieldset)).toBe('column');
    const options = fieldset.getByRole('radio');
    await expect(options).toHaveCount(samples.chips.length);
    const box = await fieldset.locator('label').first().boundingBox();
    expect(box?.height).toBeGreaterThanOrEqual(44);
    await options.first().focus();
    await expect(async () => {
      await page.keyboard.press('ArrowDown');
      await expect(options.nth(1)).toBeChecked({ timeout: 1000 });
    }).toPass();
    await page.keyboard.press('ArrowDown');
    await expect(options.nth(2)).toBeChecked();
    await page.keyboard.press('ArrowUp');
    await expect(options.nth(1)).toBeChecked();
  });

  test('adaptive is a row in a wide box and a column in a narrow one', async ({ page }) => {
    await openGallery(page);
    const fieldsets = specimen(page, 'segmented-control', states.adaptiveSwitch).locator(
      'fieldset',
    );
    expect(await flexDirection(fieldsets.nth(0))).toBe('column');
    expect(await flexDirection(fieldsets.nth(1))).toBe('row');
    await page.setViewportSize({ width: 390, height: 900 });
    await expect.poll(() => flexDirection(fieldsets.nth(1))).toBe('column');
  });
});

test('a selected link card is highlighted and marked as current', async ({ page }) => {
  await openGallery(page);
  const card = specimen(page, 'cards', states.selectedCard);
  await expect(card.getByRole('link')).toHaveAttribute('aria-current', 'true');
  await expect(card.getByRole('link')).toHaveAttribute(
    'href',
    routes.project.faqTopic('construction'),
  );
});

test.describe('stepper stages', () => {
  test('lists every stage with its detail and says which is in progress', async ({ page }) => {
    await openGallery(page);
    const list = specimen(page, 'stepper', states.stages).getByRole('list', {
      name: states.stages,
    });
    await expect(list.getByRole('listitem')).toHaveCount(samples.stagesList.length);
    await expect(list.getByText(samples.stagesList[0]?.detail ?? '')).toBeVisible();
    await expect(list.locator('[aria-current="step"]')).toContainText(uiCopy.tags.inProgress);
    await expect(list.getByText(uiCopy.stepper.completed, { exact: true })).toHaveCount(2);
    await expect(list.getByText(uiCopy.stepper.notStarted, { exact: true })).toHaveCount(3);
  });

  test('stays vertical at 1440 px', async ({ page }) => {
    await openGallery(page, {}, 1440);
    const list = specimen(page, 'stepper', states.stages).getByRole('list', {
      name: states.stages,
    });
    expect(await flexDirection(list)).toBe('column');
  });
});

test.describe('docs aside', () => {
  test('nested items sit under their parent and the active one is marked', async ({ page }) => {
    await openGallery(page);
    const nav = specimen(page, 'docs-layout', states.nestedAside).getByRole('navigation');
    const child = nav.getByRole('link', { name: samples.docsNestedHeadings[1]?.children[1] ?? '' });
    await expect(child).toHaveAttribute('aria-current', 'true');
    const parent = nav.getByRole('link', { name: samples.docsNestedHeadings[1]?.label ?? '' });
    await expect(parent).not.toHaveAttribute('aria-current', 'true');
    await expect(nav.locator('ul ul li')).toHaveCount(3);
  });

  test('a docs page can fill the aside without an "On this page" list', async ({ page }) => {
    await openGallery(page);
    const layout = section(page, 'docs-layout')
      .locator('div', { hasText: states.asideOnly })
      .last();
    await expect(layout.getByRole('navigation', { name: 'On this page' })).toHaveCount(0);
    await expect(
      layout.getByRole('heading', { name: uiCopy.docsPage.needHelp.title }),
    ).toBeVisible();
  });
});

test.describe('docs page parts', () => {
  test('the need-help block links to Report, Track and the careline', async ({ page }) => {
    await openGallery(page);
    const block = specimen(page, 'docs-parts', states.needHelp);
    await expect(
      block.getByRole('link', { name: uiCopy.docsPage.needHelp.report }),
    ).toHaveAttribute('href', routes.reportTrack.report);
    await expect(block.getByRole('link', { name: uiCopy.docsPage.needHelp.track })).toHaveAttribute(
      'href',
      routes.reportTrack.track,
    );
    await expect(block.getByRole('link', { name: /MRTCareline/ })).toHaveAttribute(
      'href',
      samples.careline.tel,
    );
  });

  test('"No" asks why, then thanks; "Yes" thanks at once; focus follows', async ({ page }) => {
    await openGallery(page);
    await whenHydrated(page, 'section:has(#docs-parts) button');
    const box = specimen(page, 'docs-parts', states.feedbackDefault);
    const no = box.getByRole('button', { name: uiCopy.docsPage.feedback.no });
    await expect(async () => {
      await no.click();
      await expect(no).toHaveAttribute('aria-pressed', 'true', { timeout: 1000 });
    }).toPass();
    const reasons = box.getByRole('group', { name: uiCopy.docsPage.feedback.reasonsLabel });
    await expect(reasons.getByRole('button')).toHaveCount(uiCopy.docsPage.feedback.reasons.length);
    await expect(reasons.getByRole('button').first()).toBeFocused();
    await reasons.getByRole('button').first().click();
    const thanks = box.getByRole('status');
    await expect(thanks).toHaveText(uiCopy.docsPage.feedback.thanksReason);
    await expect(thanks).toBeFocused();

    const small = specimen(page, 'docs-parts', states.feedbackSmall);
    await small.getByRole('button', { name: uiCopy.docsPage.feedback.yes }).click();
    await expect(small.getByRole('status')).toHaveText(uiCopy.docsPage.feedback.thanks);
    await expect(small.getByRole('status')).toBeFocused();
  });

  test('the small variant has 32 px buttons and shows its trailing text', async ({ page }) => {
    await openGallery(page);
    const small = specimen(page, 'docs-parts', states.feedbackSmall);
    await expect(small.getByText(samples.feedbackTrailing)).toBeVisible();
    const box = await small
      .getByRole('button', { name: uiCopy.docsPage.feedback.yes })
      .boundingBox();
    expect(box?.height).toBe(32);
  });

  test('related pages are rows that link to their page', async ({ page }) => {
    await openGallery(page);
    const box = specimen(page, 'docs-parts', states.relatedPages);
    await expect(box.getByRole('heading', { name: uiCopy.docsPage.relatedPages })).toBeVisible();
    await expect(box.getByRole('link')).toHaveCount(3);
    await expect(box.getByRole('link').first()).toHaveAttribute('href', routes.project.about);
  });

  test('the info list is a description list with a 200 px label column, 128 px on phones', async ({
    page,
  }) => {
    await openGallery(page);
    const list = specimen(page, 'docs-parts', states.infoList).locator('dl');
    await expect(list.locator('dt')).toHaveCount(samples.infoRows.length);
    expect((await list.locator('dt').first().boundingBox())?.width).toBe(200);
    await page.setViewportSize({ width: 390, height: 900 });
    await expect
      .poll(async () => (await list.locator('dt').first().boundingBox())?.width)
      .toBe(128);
  });
});

test.describe('map', () => {
  const snippet = (page: Page) => specimen(page, 'map', states.mapSnippet);
  const full = (page: Page) => specimen(page, 'map', states.mapFull);

  test('the OpenStreetMap credit is always visible and opens in a new tab', async ({ page }) => {
    await openGallery(page);
    for (const map of [snippet(page), full(page)]) {
      const credit = map.getByRole('link', { name: new RegExp(uiCopy.map.attribution) });
      await expect(credit).toBeVisible();
      await expect(credit).toHaveAttribute('href', uiCopy.map.attributionHref);
      await expect(credit).toHaveAttribute('target', '_blank');
      await expect(credit).toHaveAttribute('rel', 'noopener noreferrer');
    }
  });

  test('without tiles it says so and keeps the credit and the controls', async ({ page }) => {
    await openGallery(page);
    const map = snippet(page);
    await expect(map.getByText(uiCopy.map.unavailable)).toBeVisible({ timeout: 20_000 });
    await expect(map.getByRole('link', { name: new RegExp(uiCopy.map.attribution) })).toBeVisible();
    await expect(map.getByRole('button', { name: uiCopy.map.zoomIn })).toBeEnabled();
  });

  test('only a map with a centre label has the centre button', async ({ page }) => {
    await openGallery(page);
    await whenHydrated(page, 'section:has(#map) button');
    await expect(
      snippet(page).getByRole('button', { name: samples.map.centreLabel }),
    ).toBeVisible();
    await expect(full(page).getByRole('button', { name: samples.map.centreLabel })).toHaveCount(0);
  });

  test('the map region is named and focusable, and the centre button re-centres', async ({
    page,
  }) => {
    await openGallery(page);
    const map = snippet(page);
    const region = map.getByRole('region', { name: samples.map.label });
    await expect(region).toHaveAttribute('tabindex', '0');
    const marker = region.getByText(samples.map.markers[0].code, { exact: true });
    await expect(marker).toBeVisible();
    const offsetFromCentre = async () => {
      const [markerBox, regionBox] = await Promise.all([
        marker.boundingBox(),
        region.boundingBox(),
      ]);
      if (!markerBox || !regionBox) return Number.NaN;
      return Math.abs(markerBox.x + markerBox.width / 2 - (regionBox.x + regionBox.width / 2));
    };
    expect(await offsetFromCentre()).toBeLessThan(4);
    await region.focus();
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowRight');
    await expect.poll(offsetFromCentre).toBeGreaterThan(40);
    await map.getByRole('button', { name: samples.map.centreLabel }).click();
    await expect.poll(offsetFromCentre).toBeLessThan(4);
  });

  test('the zoom buttons zoom the map and have 44 px tap targets on phones', async ({ page }) => {
    await openGallery(page, {}, 390);
    await whenHydrated(page, 'section:has(#map) button');
    const map = snippet(page);
    const zoomIn = map.getByRole('button', { name: uiCopy.map.zoomIn });
    const marker = map.getByRole('region').getByText(samples.map.markers[1].label);
    await expect(marker).toBeAttached();
    const before = await map.locator('.leaflet-tile-container').first().boundingBox();
    await zoomIn.click();
    await expect
      .poll(async () => (await map.locator('.leaflet-tile-container').first().boundingBox())?.width)
      .not.toBe(before?.width);
    const box = await zoomIn.boundingBox();
    expect(box?.width).toBeGreaterThanOrEqual(28);
  });
});

test.describe('followed stations', () => {
  const summary = (page: Page) => page.getByTestId('follows-summary');
  const stationButton = (page: Page, name: string, action: string) =>
    section(page, 'follows').getByRole('button', { name: `${action} ${name}` });

  test('guests are asked to sign in and follow nothing', async ({ page }) => {
    await openGallery(page);
    await expect(
      section(page, 'follows').getByText(labels.followsGuestNote, { exact: true }).last(),
    ).toBeVisible();
    await expect(summary(page)).toHaveCount(0);
  });

  test('a signed-in visitor starts with the account list, and changes persist', async ({
    page,
  }) => {
    await openGallery(page, { signedIn: true });
    await expect(summary(page)).toContainText('S20, S13');
    await whenHydrated(page, 'section:has(#follows) button');
    const [komtar, penang] = samples.followStations;
    await expect(async () => {
      await stationButton(page, komtar.name, labels.unfollow).click();
      await expect(summary(page)).not.toContainText(komtar.code, { timeout: 1000 });
    }).toPass();
    await stationButton(page, penang.name, labels.follow).waitFor();
    await page.reload();
    await settle(page);
    await expect(summary(page)).toContainText('S13');
    await expect(summary(page)).not.toContainText(komtar.code);
  });

  test('another tab sees the change', async ({ page, context }) => {
    await openGallery(page, { signedIn: true });
    await whenHydrated(page, 'section:has(#follows) button');
    const other = await context.newPage();
    await prepare(other, { signedIn: true });
    await other.setViewportSize({ width: 1280, height: 900 });
    await other.goto(routes.dev.components);
    await settle(other);
    await whenHydrated(other, 'section:has(#follows) button');
    const [komtar] = samples.followStations;
    await expect(async () => {
      await stationButton(page, komtar.name, labels.unfollow).click();
      await expect(summary(other)).not.toContainText(komtar.code, { timeout: 1000 });
    }).toPass();
  });

  test('follow and unfollow still work for this page view when storage is blocked', async ({
    page,
  }) => {
    await openGallery(page, { signedIn: true });
    await whenHydrated(page, 'section:has(#follows) button');
    await page.evaluate(() => {
      const refuse = () => {
        throw new DOMException('Blocked', 'SecurityError');
      };
      Storage.prototype.getItem = refuse;
      Storage.prototype.setItem = refuse;
      Storage.prototype.removeItem = refuse;
    });
    const [komtar, , penang] = samples.followStations;
    await expect(async () => {
      await stationButton(page, penang.name, labels.follow).click();
      await expect(summary(page)).toContainText(penang.code, { timeout: 1000 });
    }).toPass();
    await stationButton(page, komtar.name, labels.unfollow).click();
    await expect(summary(page)).not.toContainText(komtar.code);
    await expect(summary(page)).toContainText(penang.code);
  });
});
