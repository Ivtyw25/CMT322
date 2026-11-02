import type { Page } from '@playwright/test';
import type { PNG } from 'pngjs';

/**
 * Parts of a page that can never match Figma pixel for pixel: the OpenStreetMap basemap is real
 * tiles, Figma has a drawn map. Their boxes are painted one flat colour in both images, so the
 * test compares the page around them. Add a selector here to mask another part.
 */
export const maskSelectors: readonly string[] = ['.leaflet-container'];

const MASK_RGBA = [128, 128, 128, 255] as const;

export type MaskRect = { x: number; y: number; width: number; height: number };

/** The page-coordinate boxes of everything that matches `maskSelectors`. */
export async function maskRects(page: Page): Promise<MaskRect[]> {
  return page.evaluate(
    (selectors) =>
      selectors.flatMap((selector) =>
        [...document.querySelectorAll(selector)].map((element) => {
          const box = element.getBoundingClientRect();
          return {
            x: box.left + window.scrollX,
            y: box.top + window.scrollY,
            width: box.width,
            height: box.height,
          };
        }),
      ),
    [...maskSelectors],
  );
}

/** Paints the boxes flat, in place. */
export function paintMasks(image: PNG, rects: readonly MaskRect[]): void {
  for (const rect of rects) {
    const left = Math.max(0, Math.floor(rect.x));
    const top = Math.max(0, Math.floor(rect.y));
    const right = Math.min(image.width, Math.ceil(rect.x + rect.width));
    const bottom = Math.min(image.height, Math.ceil(rect.y + rect.height));
    for (let y = top; y < bottom; y += 1) {
      for (let x = left; x < right; x += 1) {
        const offset = (y * image.width + x) * 4;
        image.data[offset] = MASK_RGBA[0];
        image.data[offset + 1] = MASK_RGBA[1];
        image.data[offset + 2] = MASK_RGBA[2];
        image.data[offset + 3] = MASK_RGBA[3];
      }
    }
  }
}
