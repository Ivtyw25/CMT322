import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { expect, test, type Page } from '@playwright/test';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';
import { prepare, settle } from '../support/browser';
import { activePages, needsSignIn, urlsFor } from '../support/pages';
import { maskRects, paintMasks } from './masks';
import { visualStates } from './states';

const REFERENCE_DIR = join(process.cwd(), 'tests', 'visual', 'reference');
const DIFF_DIR = join(process.cwd(), 'tests', 'visual', '__diff__');
const VIEWPORTS = [
  { width: 1440, height: 900 },
  { width: 390, height: 844 },
];
const THEMES = ['light', 'dark'] as const;

function cropHeight(img: PNG, maxHeight: number): PNG {
  if (img.height <= maxHeight) return img;
  const out = new PNG({ width: img.width, height: maxHeight });
  PNG.bitblt(img, out, 0, 0, img.width, maxHeight, 0, 0);
  return out;
}

/** Share of differing pixels. A taller reference counts the missing rows as different; a page taller than its reference is cut at the reference height. */
function compare(actualFull: PNG, reference: PNG, diffPath: string): number {
  writeFileSync(diffPath.replace(/\.png$/, '.actual.png'), PNG.sync.write(actualFull));
  // A reference that stops short of the page (an incomplete Figma frame) is compared over its own height.
  const actual = cropHeight(actualFull, reference.height);
  const width = Math.max(actual.width, reference.width);
  const height = Math.max(actual.height, reference.height);
  const pad = (img: PNG) => {
    const out = new PNG({ width, height });
    PNG.bitblt(img, out, 0, 0, img.width, img.height, 0, 0);
    return out;
  };
  const a = pad(actual);
  const r = pad(reference);
  const diff = new PNG({ width, height });
  const different = pixelmatch(a.data, r.data, diff.data, width, height, { threshold: 0.1 });
  writeFileSync(diffPath, PNG.sync.write(diff));
  return different / (width * height);
}

async function capture(page: Page) {
  await page.addStyleTag({ content: '*{caret-color:transparent!important}' });
  return PNG.sync.read(await page.screenshot({ fullPage: true, animations: 'disabled' }));
}

const WORKSPACE_PAGES = new Set(['traffic-map', 'route-view']);

mkdirSync(DIFF_DIR, { recursive: true });

for (const manifestPage of activePages) {
  if (!manifestPage.figma.desktop && !manifestPage.figma.mobile) continue;
  const url = urlsFor(manifestPage.id)[0] ?? '/';
  const shots = [
    { name: manifestPage.id, run: async (_page: Page) => {} },
    ...(visualStates[manifestPage.id] ?? []),
  ];

  for (const shot of shots) {
    for (const viewport of VIEWPORTS) {
      for (const theme of THEMES) {
        const file = `${shot.name}--${viewport.width}--${theme}.png`;
        const referencePath = join(REFERENCE_DIR, file);
        test(file, async ({ page }) => {
          test.skip(!existsSync(referencePath), `no Figma reference ${file}`);
          await prepare(page, { theme, signedIn: needsSignIn(manifestPage.id) });
          const reference = PNG.sync.read(readFileSync(referencePath));
          // Workspace pages fill the viewport (no footer), so match the Figma frame height.
          const fillsViewport = viewport.width >= 1024 && WORKSPACE_PAGES.has(manifestPage.id);
          await page.setViewportSize(
            fillsViewport ? { width: viewport.width, height: reference.height } : viewport,
          );
          await page.goto(url);
          await settle(page);
          await shot.run(page);
          const rects = await maskRects(page);
          const actual = await capture(page);
          paintMasks(actual, rects);
          paintMasks(reference, rects);
          const ratio = compare(actual, reference, join(DIFF_DIR, file));
          test
            .info()
            .annotations.push({ type: 'diff', description: `${(ratio * 100).toFixed(2)}%` });
          expect(
            ratio,
            `pixel difference vs Figma (diff in tests/visual/__diff__/${file})`,
          ).toBeLessThanOrEqual(manifestPage.visualTolerance);
        });
      }
    }
  }
}
