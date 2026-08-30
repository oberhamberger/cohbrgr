import { expect, test } from '@playwright/test';

// The one accent lives on the C·V·Q·O mark, on every page and in both themes.
// `.codex p` in Codex.module.scss already outranked `[role='doc-subtitle']`
// once and painted the mark back to ink on that page alone, which no
// homepage-only assertion would have caught.
//
// Spelled out rather than read from the custom property, so a palette change
// has to be made here too. #c40d2e / #ff294f.

const ACCENT = {
    light: 'rgb(196, 13, 46)',
    dark: 'rgb(255, 41, 79)',
} as const;

const PAGES = [
    ['/', 'homepage'],
    ['/codex', 'codex'],
] as const;

test.describe('The mark carries the one accent', () => {
    for (const scheme of ['light', 'dark'] as const) {
        for (const [path, name] of PAGES) {
            test(`${name} mark is the accent in ${scheme} mode`, async ({
                page,
            }) => {
                await page.emulateMedia({ colorScheme: scheme });
                await page.goto(path);

                const mark = page.locator("[role='doc-subtitle']");
                await expect(mark).toBeVisible({ timeout: 15_000 });
                await expect(mark).toHaveCSS('color', ACCENT[scheme]);
            });
        }
    }

    test('the mark resolves to ink on hover, not to muted', async ({
        page,
    }) => {
        await page.emulateMedia({ colorScheme: 'light' });
        await page.goto('/');

        const link = page.locator("[role='doc-subtitle'] a");
        await expect(link).toBeVisible({ timeout: 15_000 });
        await expect(link).toHaveCSS('color', ACCENT.light);

        // Hover cannot step down to muted, because the resting state is no
        // longer the text colour.
        await link.hover();
        await expect(link).toHaveCSS('color', 'rgb(11, 11, 11)');
    });

    test('the full stop after the name stays ink', async ({ page }) => {
        await page.emulateMedia({ colorScheme: 'light' });
        await page.goto('/');

        // `.mark` wraps the full stop in the hero.title translation string.
        const stop = page.locator('h1 .mark');
        await expect(stop).toBeVisible({ timeout: 15_000 });
        await expect(stop).toHaveCSS('color', 'rgb(11, 11, 11)');
    });
});
