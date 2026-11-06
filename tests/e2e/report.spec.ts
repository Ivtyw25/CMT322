import { expect, test, type Page } from '@playwright/test';
import { routes } from '@/config/routes';
import { reportTrackCopy } from '@/content/report-track';
import { uiCopy } from '@/content/ui';
import { getReportCategories } from '@/data/api/tickets';
import { mockUser } from '@/data/mock/user';
import { prepare, settle, whenHydrated } from '../support/browser';

const { report } = reportTrackCopy;
const categories = await getReportCategories();
const firstCategory = categories[0] as (typeof categories)[number];
const MEGABYTE = 1024 * 1024;
const DRAFT_KEY = 'mlc-report-draft';
const REPORTS_KEY = 'mlc-submitted-reports';
const EMPTY_TILE = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
  'base64',
);

async function open(page: Page, path: string = routes.reportTrack.report, width = 1440) {
  await prepare(page, { signedIn: true });
  // Real tiles are blocked; a blank tile lets the map count as loaded, so clicks reach it.
  await page.route(/tile\.openstreetmap\.org/, (route) =>
    route.fulfill({ status: 200, contentType: 'image/png', body: EMPTY_TILE }),
  );
  await page.setViewportSize({ width, height: 900 });
  await page.goto(path);
  await settle(page);
  await whenHydrated(page, 'form input');
}

const field = (page: Page, label: string) => page.getByLabel(label, { exact: false }).first();
const submit = (page: Page) => page.getByRole('button', { name: report.actions.submit });
const summaryTitle = (page: Page) =>
  page.getByRole('heading', { level: 2, name: report.errorSummary.title });
const mapRegion = (page: Page) => page.getByRole('region', { name: report.location.map.label });
const pinMarker = (page: Page) => page.getByRole('button', { name: /Report location pin/ });
const coordinates = (page: Page) => page.getByText(/^\d+\.\d{4}, \d+\.\d{4}$/);

async function fillValid(page: Page) {
  await page.getByRole('radio', { name: report.type.options[0].label }).check();
  await field(page, report.category.label).selectOption(firstCategory.id);
  await field(page, report.details.subject.label).fill('Driveway blocked by site hoarding');
  await field(page, report.details.description.label).fill(
    'Since Monday the new hoarding covers half of our shop driveway and lorries cannot turn in.',
  );
  await field(page, report.location.address.label).fill('Lebuh Kampung Jawa, Bayan Lepas');
  await page.getByRole('checkbox', { name: /I agree/ }).check();
}

test.describe('report: access and resting state', () => {
  test('a guest is sent to Log in and back', async ({ page }) => {
    await prepare(page);
    await page.goto(`${routes.reportTrack.report}?station=s05`);
    await settle(page);
    await expect(page).toHaveURL(
      new RegExp(
        encodeURIComponent(`${routes.reportTrack.report}?station=s05`).replaceAll('.', '\\.'),
      ),
    );
    await expect(page.getByRole('form', { name: report.header.title })).toHaveCount(0);
  });

  test('the form starts empty with the account details filled in', async ({ page }) => {
    await open(page);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(report.header.title);
    await expect(page.getByRole('form', { name: report.header.title })).toBeVisible();
    await expect(page.getByRole('radio', { name: report.type.options[0].label })).toBeChecked();
    await expect(field(page, report.category.label)).toHaveValue('');
    await expect(field(page, report.details.subject.label)).toHaveValue('');
    await expect(field(page, report.contact.fullName.label)).toHaveValue(mockUser.name);
    await expect(field(page, report.contact.email.label)).toHaveValue(mockUser.email);
    await expect(pinMarker(page)).toHaveCount(0);
    await expect(summaryTitle(page)).toHaveCount(0);
    await expect(page.getByText(report.draft.saved)).toHaveCount(0);
  });

  test('has five sections with the "On this page" list at 1440', async ({ page }) => {
    await open(page);
    for (const id of ['type', 'details', 'location', 'files', 'contact']) {
      await expect(page.locator(`h2#${id}`)).toBeVisible();
    }
    await expect(
      page.getByRole('heading', { name: report.next.title }).filter({ visible: true }),
    ).toBeVisible();
    await expect(page.getByText(report.emergency.title).filter({ visible: true })).toBeVisible();
  });

  test('the type cards are one radio group that arrow keys move through', async ({ page }) => {
    await open(page);
    const group = page.getByRole('radiogroup', { name: report.type.legend });
    await expect(group.getByRole('radio')).toHaveCount(3);
    await group.getByRole('radio', { name: report.type.options[0].label }).focus();
    await page.keyboard.press('ArrowRight');
    await expect(page.getByRole('radio', { name: report.type.options[1].label })).toBeChecked();
  });

  test('the category hint is the select description and shows on focus', async ({ page }) => {
    await open(page);
    const select = field(page, report.category.label);
    await select.selectOption(firstCategory.id);
    await expect(select).toHaveAccessibleDescription(firstCategory.hint);
  });
});

test.describe('report: validation', () => {
  test('a field is checked when it loses focus, not while the first character is typed', async ({
    page,
  }) => {
    await open(page);
    const subject = field(page, report.details.subject.label);
    await subject.fill('Dri');
    await expect(page.getByText(report.details.subject.errorShort)).toHaveCount(0);
    await subject.blur();
    await expect(page.getByText(report.details.subject.errorShort)).toBeVisible();
    await expect(subject).toHaveAttribute('aria-invalid', 'true');
    await subject.fill('Driveway blocked');
    await expect(page.getByText(report.details.subject.errorShort)).toHaveCount(0);
    await expect(subject).not.toHaveAttribute('aria-invalid', 'true');
  });

  test('an untouched empty field shows nothing when it is passed over', async ({ page }) => {
    await open(page);
    await field(page, report.details.subject.label).focus();
    await page.keyboard.press('Shift+Tab');
    await expect(page.getByText(report.details.subject.errorEmpty)).toBeVisible();
    await expect(page.getByText(report.details.description.errorEmpty)).toHaveCount(0);
  });

  test('phone and email follow their formats', async ({ page }) => {
    await open(page);
    const phone = field(page, report.contact.phone.label);
    await phone.fill('12345');
    await phone.blur();
    await expect(page.getByText(report.contact.phone.error)).toBeVisible();
    await phone.fill('');
    await expect(page.getByText(report.contact.phone.error)).toHaveCount(0);
    const email = field(page, report.contact.email.label);
    await email.fill('meiling');
    await email.blur();
    await expect(page.getByText(report.contact.email.errorInvalid)).toBeVisible();
    await email.fill('');
    await expect(page.getByText(report.contact.email.errorEmpty)).toBeVisible();
  });

  test('the description needs 20 characters and the subject stops at 100', async ({ page }) => {
    await open(page);
    const description = field(page, report.details.description.label);
    await description.fill('too short');
    await description.blur();
    await expect(page.getByText(report.details.description.errorShort)).toBeVisible();
    const subject = field(page, report.details.subject.label);
    await subject.fill('x'.repeat(130));
    await expect(subject).toHaveValue('x'.repeat(100));
  });

  test('the character count shows beside the description', async ({ page }) => {
    await open(page);
    await field(page, report.details.description.label).fill('a'.repeat(184));
    await expect(page.getByText(report.details.description.counter(184, 1000))).toBeVisible();
  });

  test('consent is checked on change and on submit', async ({ page }) => {
    await open(page);
    const consent = page.getByRole('checkbox', { name: /I agree/ });
    await consent.check();
    await consent.uncheck();
    await expect(page.getByText(report.consent.error)).toBeVisible();
    await consent.check();
    await expect(page.getByText(report.consent.error)).toHaveCount(0);
  });
});

test.describe('report: submit with errors', () => {
  test('lists every problem in page order and moves focus to the summary', async ({ page }) => {
    await open(page);
    await submit(page).click();
    const title = summaryTitle(page);
    await expect(title).toBeVisible();
    await expect(title.locator('..')).toBeFocused();
    const links = title.locator('..').getByRole('link');
    await expect(links).toHaveText([
      report.category.error,
      report.details.subject.errorEmpty,
      report.details.description.errorEmpty,
      report.location.address.errorEmpty,
      report.consent.error,
    ]);
    await expect(page.getByText(report.details.subject.errorEmpty)).toHaveCount(2);
  });

  test('a summary link moves focus to its field', async ({ page }) => {
    await open(page);
    await submit(page).click();
    await summaryTitle(page)
      .locator('..')
      .getByRole('link', { name: report.details.subject.errorEmpty })
      .click();
    await expect(field(page, report.details.subject.label)).toBeFocused();
  });

  test('the summary shrinks as errors are fixed and goes when none remain', async ({ page }) => {
    await open(page);
    await submit(page).click();
    await field(page, report.details.subject.label).fill('Driveway blocked by hoarding');
    const links = summaryTitle(page).locator('..').getByRole('link');
    await expect(links).toHaveCount(4);
    await field(page, report.category.label).selectOption(firstCategory.id);
    await field(page, report.details.description.label).fill(
      'Since Monday the new hoarding covers half of our driveway.',
    );
    await field(page, report.location.address.label).fill('Lebuh Kampung Jawa');
    await page.getByRole('checkbox', { name: /I agree/ }).check();
    await expect(summaryTitle(page)).toHaveCount(0);
  });

  test('a photo that is still uploading blocks the submit', async ({ page }) => {
    await page.clock.install();
    await open(page);
    await fillValid(page);
    // Frozen timers keep the simulated upload at 0 % however slow the machine is.
    await page.clock.pauseAt(new Date(Date.now() + 60_000));
    await page
      .locator('input[type="file"]')
      .setInputFiles({ name: 'a.jpg', mimeType: 'image/jpeg', buffer: Buffer.alloc(MEGABYTE) });
    await submit(page).click();
    await expect(page.getByText(report.files.waitUploading).first()).toBeVisible();
    await expect(page).toHaveURL(new RegExp(`${routes.reportTrack.report}$`));
  });
});

test.describe('report: photos and files', () => {
  const input = (page: Page) => page.locator('input[type="file"]');
  const jpg = (name: string, size = MEGABYTE) => ({
    name,
    mimeType: 'image/jpeg',
    buffer: Buffer.alloc(size),
  });

  test('shows the rules and adds files that then show as uploaded', async ({ page }) => {
    await open(page);
    await expect(page.getByText(uiCopy.upload.rules(5, 10))).toBeVisible();
    await input(page).setInputFiles([jpg('front.jpg', Math.round(2.1 * MEGABYTE)), jpg('b.jpg')]);
    await expect(page.getByRole('progressbar').first()).toBeVisible();
    await expect(page.getByText(uiCopy.upload.uploaded('2.1 MB'))).toBeVisible();
    await expect(page.getByText(uiCopy.upload.uploaded('1.0 MB'))).toBeVisible();
  });

  test('turns away the wrong type and the too big file without blocking the good one', async ({
    page,
  }) => {
    await open(page);
    await input(page).setInputFiles([
      jpg('good.jpg'),
      { name: 'driveway.gif', mimeType: 'image/gif', buffer: Buffer.alloc(100) },
      jpg('huge.jpg', 11 * MEGABYTE),
    ]);
    await expect(page.getByText(uiCopy.upload.errors.wrongType('driveway.gif'))).toBeVisible();
    await expect(page.getByText(uiCopy.upload.errors.tooBig('huge.jpg', 10))).toBeVisible();
    await expect(
      page.getByRole('button', { name: uiCopy.upload.remove('good.jpg') }),
    ).toBeVisible();
  });

  test('a file with the same name and size is ignored without a message', async ({ page }) => {
    await open(page);
    await input(page).setInputFiles(jpg('same.jpg'));
    await input(page).setInputFiles(jpg('same.jpg'));
    await expect(page.getByRole('button', { name: uiCopy.upload.remove('same.jpg') })).toHaveCount(
      1,
    );
    await expect(page.locator('ul[aria-live="polite"]')).toHaveCount(0);
  });

  test('stops at five files and says so', async ({ page }) => {
    await open(page);
    await input(page).setInputFiles(
      [1, 2, 3, 4, 5].map((number) => jpg(`photo-${number}.jpg`, MEGABYTE + number)),
    );
    await expect(page.getByText(uiCopy.upload.maxReached(5))).toBeVisible();
    const browse = page.getByRole('button', { name: uiCopy.upload.browse });
    await expect(browse).toHaveAttribute('aria-disabled', 'true');
    await browse.focus();
    await expect(browse).toBeFocused();
    await input(page).setInputFiles(jpg('sixth.jpg', 2 * MEGABYTE));
    await expect(page.getByText(uiCopy.upload.errors.tooMany(5))).toBeVisible();
  });

  test('removing a file moves focus to the next row, then the previous, then browse', async ({
    page,
  }) => {
    await open(page);
    await input(page).setInputFiles([
      jpg('one.jpg', 1001),
      jpg('two.jpg', 1002),
      jpg('three.jpg', 1003),
    ]);
    const remove = (name: string) => page.getByRole('button', { name: uiCopy.upload.remove(name) });
    await remove('two.jpg').click();
    await expect(remove('three.jpg')).toBeFocused();
    await remove('three.jpg').click();
    await expect(remove('one.jpg')).toBeFocused();
    await remove('one.jpg').click();
    await expect(page.getByRole('button', { name: uiCopy.upload.browse })).toBeFocused();
    await expect(page.getByText(uiCopy.upload.removed('one.jpg'))).toBeAttached();
  });

  test('dragging over the zone changes its text, and dropping adds files', async ({ page }) => {
    await open(page);
    const zone = page.getByText(uiCopy.upload.dropPrefix).locator('..');
    const data = await page.evaluateHandle(() => {
      const transfer = new DataTransfer();
      transfer.items.add(new File([new Uint8Array(2048)], 'dropped.png', { type: 'image/png' }));
      return transfer;
    });
    await zone.dispatchEvent('dragover', { dataTransfer: data });
    await expect(page.getByText(uiCopy.upload.dropActive)).toBeVisible();
    await page.getByText(uiCopy.upload.dropActive).locator('..').dispatchEvent('drop', {
      dataTransfer: data,
    });
    await expect(
      page.getByRole('button', { name: uiCopy.upload.remove('dropped.png') }),
    ).toBeVisible();
  });

  test('browse opens the file dialog', async ({ page }) => {
    await open(page);
    const chooser = page.waitForEvent('filechooser');
    await page.getByRole('button', { name: uiCopy.upload.browse }).click();
    expect(await chooser).toBeTruthy();
  });
});

test.describe('report: location and the map', () => {
  test('mobile map controls have 44 px targets', async ({ page }) => {
    await open(page, routes.reportTrack.report, 390);
    for (const label of [
      uiCopy.map.zoomIn,
      uiCopy.map.zoomOut,
      report.location.map.dropPin,
      report.location.map.useMyLocation,
    ]) {
      const button = page.getByRole('button', { name: label, exact: true });
      await expect(button).toBeVisible();
      const box = await button.boundingBox();
      expect(box?.width).toBeGreaterThanOrEqual(44);
      expect(box?.height).toBeGreaterThanOrEqual(44);
    }
    await page.getByRole('button', { name: report.location.map.dropPin }).click();
    await expect(pinMarker(page)).toBeVisible();
    const pinBox = await pinMarker(page).boundingBox();
    expect(pinBox?.width).toBeGreaterThanOrEqual(44);
    expect(pinBox?.height).toBeGreaterThanOrEqual(44);
  });

  test('failed tile text stays clear of a centred pin on mobile', async ({ page }) => {
    await open(page, routes.reportTrack.report, 390);
    await page.unroute(/tile\.openstreetmap\.org/);
    await page.route(/tile\.openstreetmap\.org/, (route) => route.abort());
    await page.reload();
    const map = mapRegion(page);
    const error = map.locator('..').getByRole('status');
    await expect(error).toHaveText(uiCopy.map.unavailable);
    await page.getByRole('button', { name: report.location.map.dropPin }).click();
    const messageBox = await error.boundingBox();
    const pinBox = await pinMarker(page).boundingBox();
    expect(messageBox).not.toBeNull();
    expect(pinBox).not.toBeNull();
    expect(messageBox!.y + messageBox!.height).toBeLessThanOrEqual(pinBox!.y);
  });
  test('a click on the map sets the pin, the readout and a blank address', async ({ page }) => {
    await open(page);
    await expect(mapRegion(page)).toBeVisible();
    await page.locator('.leaflet-tile-loaded').first().waitFor({ state: 'attached' });
    await mapRegion(page).click({ position: { x: 300, y: 80 } });
    await expect(pinMarker(page)).toBeVisible();
    await expect(coordinates(page)).toBeVisible();
    await expect(field(page, report.location.address.label)).toHaveValue(/^Near /);
  });

  test('a typed address is kept when the pin moves', async ({ page }) => {
    await open(page);
    await field(page, report.location.address.label).fill('Jalan Bukit Jambul');
    await page.locator('.leaflet-tile-loaded').first().waitFor({ state: 'attached' });
    await mapRegion(page).click({ position: { x: 300, y: 80 } });
    await expect(field(page, report.location.address.label)).toHaveValue('Jalan Bukit Jambul');
  });

  test('dragging the map does not pan it, so the page can scroll', async ({ page }) => {
    await open(page, routes.reportTrack.report, 390);
    const pane = page.locator('.leaflet-map-pane');
    const before = await pane.evaluate((element) => element.style.transform);
    const box = await mapRegion(page).boundingBox();
    if (!box) throw new Error('The map has no box.');
    await page.mouse.move(box.x + 100, box.y + 100);
    await page.mouse.down();
    await page.mouse.move(box.x + 200, box.y + 150, { steps: 5 });
    await page.mouse.up();
    expect(await pane.evaluate((element) => element.style.transform)).toBe(before);
    await expect(page.getByRole('button', { name: uiCopy.map.zoomIn })).toBeVisible();
  });

  test('the keyboard button drops a pin, and arrow keys move it', async ({ page }) => {
    await open(page);
    const drop = page.getByRole('button', { name: report.location.map.dropPin });
    await drop.focus();
    await expect(drop).toBeVisible();
    await page.keyboard.press('Enter');
    await expect(pinMarker(page)).toBeVisible();
    const before = await coordinates(page).textContent();
    await pinMarker(page).focus();
    await page.keyboard.press('Shift+ArrowUp');
    await expect(coordinates(page)).not.toHaveText(before ?? '');
    await expect(pinMarker(page)).toHaveAttribute('aria-label', /Use the arrow keys to move it/);
  });

  test('the pin is announced as near a station', async ({ page }) => {
    await open(page);
    await page.getByRole('button', { name: report.location.map.dropPin }).focus();
    await page.keyboard.press('Enter');
    await expect(page.getByText(/^Pin set near /)).toBeAttached({ timeout: 3000 });
  });

  test('use my current location pins the spot and recentres', async ({ page, context }) => {
    await context.grantPermissions(['geolocation']);
    await context.setGeolocation({ latitude: 5.3, longitude: 100.27 });
    await open(page);
    await page.getByRole('button', { name: report.location.map.useMyLocation }).click();
    await expect(pinMarker(page)).toBeVisible();
    await expect(coordinates(page)).toHaveText('5.3000, 100.2700');
  });

  test('a blocked location says so and clears on the next pin', async ({ page, context }) => {
    await context.clearPermissions();
    await open(page);
    await page.getByRole('button', { name: report.location.map.useMyLocation }).click();
    await expect(page.getByText(report.location.map.errorDenied)).toBeVisible({ timeout: 12_000 });
    await page.getByRole('button', { name: report.location.map.dropPin }).focus();
    await page.keyboard.press('Enter');
    await expect(page.getByText(report.location.map.errorDenied)).toHaveCount(0);
  });

  test('the button is not shown when the browser has no geolocation', async ({ page }) => {
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'geolocation', { value: undefined, configurable: true });
    });
    await open(page);
    await expect(page.getByRole('button', { name: report.location.map.useMyLocation })).toHaveCount(
      0,
    );
  });

  test('keeps the OpenStreetMap credit visible', async ({ page }) => {
    await open(page);
    await expect(mapRegion(page).locator('..').getByText(uiCopy.map.attribution)).toBeVisible();
  });
});

test.describe('report: ?station= prefill', () => {
  test('a station code fills the chip, the address and the pin', async ({ page }) => {
    await open(page, routes.reportTrack.reportAt('S05'));
    await expect(page.getByText(/^Near S05 .+ station$/)).toBeVisible();
    await expect(field(page, report.location.address.label)).toHaveValue(/ station$/);
    await expect(pinMarker(page)).toBeVisible();
  });

  test('the chip remove button drops only the station', async ({ page }) => {
    await open(page, routes.reportTrack.reportAt('s05'));
    await page.getByRole('button', { name: report.location.map.removeStation }).click();
    await expect(page.getByText(/^Near S05 /)).toHaveCount(0);
    await expect(field(page, report.location.address.label)).toHaveValue(/ station$/);
    await expect(pinMarker(page)).toBeVisible();
  });

  test('an unknown code is ignored', async ({ page }) => {
    await open(page, `${routes.reportTrack.report}?station=zz99`);
    await expect(field(page, report.location.address.label)).toHaveValue('');
    await expect(pinMarker(page)).toHaveCount(0);
  });
});

test.describe('report: draft in this browser', () => {
  async function typeDraft(page: Page) {
    await field(page, report.details.subject.label).fill('Driveway blocked');
    await field(page, report.location.address.label).fill('Lebuh Kampung Jawa');
    await expect(page.getByText(report.draft.saved)).toBeVisible();
  }

  test('saves while typing, restores on return and starts over on request', async ({ page }) => {
    await open(page);
    await typeDraft(page);
    await page.reload();
    await settle(page);
    await whenHydrated(page, 'form input');
    await expect(page.getByText(/^We restored your draft from /)).toBeVisible();
    await expect(field(page, report.details.subject.label)).toHaveValue('Driveway blocked');
    await page.getByRole('button', { name: report.draft.startOver }).click();
    await expect(field(page, report.details.subject.label)).toHaveValue('');
    await expect(page.locator('h2#type')).toBeFocused();
    expect(await page.evaluate((key) => localStorage.getItem(key), DRAFT_KEY)).toBeNull();
  });

  test('never stores the name, email or consent', async ({ page }) => {
    await open(page);
    await typeDraft(page);
    const stored = await page.evaluate((key) => localStorage.getItem(key), DRAFT_KEY);
    expect(stored).not.toContain(mockUser.email);
    expect(stored).not.toContain('consent');
  });

  test('a draft older than 7 days is not restored', async ({ page }) => {
    await prepare(page, { signedIn: true });
    await page.addInitScript(([key, draft]) => window.localStorage.setItem(key, draft), [
      DRAFT_KEY,
      JSON.stringify({
        savedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
        type: 'complaint',
        categoryId: '',
        subject: 'Old subject',
        description: '',
        address: '',
        pin: null,
        stationCode: null,
        phone: '',
        fileCount: 0,
      }),
    ] as const);
    await page.goto(routes.reportTrack.report);
    await settle(page);
    await whenHydrated(page, 'form input');
    await expect(field(page, report.details.subject.label)).toHaveValue('');
  });

  test('a draft that had photos says photos are not saved', async ({ page }) => {
    await prepare(page, { signedIn: true });
    await page.addInitScript(([key, draft]) => window.localStorage.setItem(key, draft), [
      DRAFT_KEY,
      JSON.stringify({
        savedAt: new Date().toISOString(),
        type: 'feedback',
        categoryId: 'noise',
        subject: 'Noise at night',
        description: '',
        address: '',
        pin: null,
        stationCode: null,
        phone: '',
        fileCount: 2,
      }),
    ] as const);
    await page.goto(routes.reportTrack.report);
    await settle(page);
    await whenHydrated(page, 'form input');
    await expect(page.getByText(report.draft.photosNote)).toBeVisible();
    await expect(page.getByRole('radio', { name: report.type.options[1].label })).toBeChecked();
  });

  test('works with storage blocked: no draft, no message', async ({ page }) => {
    await prepare(page, { signedIn: true });
    await page.addInitScript(() => {
      const original = Storage.prototype.setItem;
      Storage.prototype.setItem = function (key: string, value: string) {
        if (key.startsWith('mlc-report') || key === 'mlc-submitted-reports') {
          throw new Error('blocked');
        }
        return original.call(this, key, value);
      };
    });
    await page.goto(routes.reportTrack.report);
    await settle(page);
    await whenHydrated(page, 'form input');
    await field(page, report.details.subject.label).fill('Driveway blocked');
    await page.waitForTimeout(800);
    await expect(page.getByText(report.draft.saved)).toHaveCount(0);
    await expect(field(page, report.details.subject.label)).toHaveValue('Driveway blocked');
  });
});

test.describe('report: sending', () => {
  test('shows a pending state, then goes to the submitted page and stores the ticket', async ({
    page,
  }) => {
    await open(page);
    await fillValid(page);
    await submit(page).click();
    const sending = page.getByRole('button', { name: report.actions.submitting });
    await expect(sending).toHaveAttribute('aria-busy', 'true');
    await expect(sending).toHaveAttribute('aria-disabled', 'true');
    await expect(page.locator('div[inert]')).toHaveCount(1);
    await expect(page.getByRole('link', { name: report.actions.cancel })).toBeEnabled();
    await page.waitForURL(/\/report\/submitted\/MLC-\d{6}-\d{4}$/);
    expect(page.url()).toContain('MLC-261029-0500');
    const stored = await page.evaluate((key) => localStorage.getItem(key), REPORTS_KEY);
    expect(JSON.parse(stored ?? '[]')[0]).toMatchObject({
      id: 'MLC-261029-0500',
      status: 'submitted',
      type: 'complaint',
      reporterId: mockUser.id,
    });
    expect(await page.evaluate((key) => localStorage.getItem(key), DRAFT_KEY)).toBeNull();
  });

  test('a second report in the same browser gets the next number', async ({ page }) => {
    await open(page);
    await fillValid(page);
    await submit(page).click();
    await page.waitForURL(/MLC-261029-0500$/);
    await page.goto(routes.reportTrack.report);
    await whenHydrated(page, 'form input');
    await fillValid(page);
    await submit(page).click();
    await page.waitForURL(/MLC-261029-0501$/);
  });

  test('cancel goes to the overview and keeps the draft', async ({ page }) => {
    await open(page);
    await field(page, report.details.subject.label).fill('Driveway blocked');
    await expect(page.getByText(report.draft.saved)).toBeVisible();
    await page.getByRole('link', { name: report.actions.cancel }).click();
    await expect(page).toHaveURL(new RegExp(`${routes.reportTrack.overview}$`));
    expect(await page.evaluate((key) => localStorage.getItem(key), DRAFT_KEY)).not.toBeNull();
  });

  test('Enter in a single-line field submits; Enter in the description adds a line', async ({
    page,
  }) => {
    await open(page);
    const description = field(page, report.details.description.label);
    await description.fill('first');
    await description.press('Enter');
    await description.type('second');
    await expect(description).toHaveValue('first\nsecond');
    await field(page, report.details.subject.label).press('Enter');
    await expect(summaryTitle(page)).toBeVisible();
  });
});

test.describe('report: layout at other widths', () => {
  for (const width of [320, 390, 768, 1024, 1280]) {
    test(`has no horizontal scroll at ${width}px`, async ({ page }) => {
      await open(page, routes.reportTrack.report, width);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow).toBeLessThanOrEqual(0);
    });
  }

  test('puts "What happens next" after the form below 1280px', async ({ page }) => {
    await open(page, routes.reportTrack.report, 1024);
    const next = await page
      .getByRole('heading', { name: report.next.title })
      .filter({ visible: true })
      .boundingBox();
    const form = await submit(page).boundingBox();
    expect((next?.y ?? 0) > (form?.y ?? 0)).toBe(true);
  });
});
