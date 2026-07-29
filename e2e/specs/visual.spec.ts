import { expect, test } from '@playwright/test';

// Screenshot regression — broad visual drift coverage on top of the precise
// computed-style checks in styling.spec.ts. Pixel baselines are OS-specific, so
// they are generated for Linux (the CI platform, see .github/workflows/ci.yml)
// and skipped elsewhere; local macOS/Windows runs still get the computed-style
// guard. Regenerate after intentional visual changes with:
//   pnpm --filter @cohbrgr/e2e exec playwright test visual --update-snapshots
// run inside the Playwright Linux image (mcr.microsoft.com/playwright) so the
// baselines match CI rendering.

test.describe('Visual regression', () => {
    test.skip(
        process.platform !== 'linux',
        'Screenshot baselines are Linux-only (CI platform)',
    );

    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        await expect(page.locator('nav')).toBeVisible({ timeout: 15_000 });
        // Web fonts change metrics; wait so the baseline is stable.
        await page.evaluate(() => document.fonts.ready);
    });

    test('homepage matches baseline', async ({ page }) => {
        await expect(page).toHaveScreenshot('home.png', {
            fullPage: true,
            animations: 'disabled',
            maxDiffPixelRatio: 0.01,
        });
    });

    test('navigation matches baseline', async ({ page }) => {
        await expect(page.locator('nav')).toHaveScreenshot('navigation.png', {
            animations: 'disabled',
            maxDiffPixelRatio: 0.01,
        });
    });
});
