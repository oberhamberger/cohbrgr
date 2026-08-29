import { expect, test } from '@playwright/test';

test.describe('Navigation', () => {
    test('homepage renders navigation after federation load', async ({
        page,
    }) => {
        await page.goto('/');

        // Navigation comes from the federated Content component.
        // Server injects contentHealthy flag, so federation loads immediately.
        const nav = page.locator('nav');
        await expect(nav).toBeVisible({ timeout: 15_000 });
    });

    test('unknown route shows 404 page', async ({ page }) => {
        const response = await page.goto('/this-page-does-not-exist');
        expect(response?.status()).toBe(404);
    });

    test('offline page renders', async ({ page }) => {
        const response = await page.goto('/offline');
        expect(response?.status()).toBe(200);
    });

    test('codex page is server-rendered', async ({ page }) => {
        const response = await page.goto('/codex');
        expect(response?.status()).toBe(200);
        await expect(page.locator('h1')).toHaveText('Codex Visioque');
    });

    // The mark is the only way into the codex now that the nav item is gone, and
    // it carries no link styling, so nothing visual would catch it breaking.
    // It is also rendered by the content remote while pointing at a shell route,
    // which makes it the cover for the hand-off across the federation boundary.
    test('the C·V·Q·O mark links to the codex page', async ({ page }) => {
        await page.goto('/');

        const mark = page.locator('[role="doc-subtitle"] a');
        await expect(mark).toBeVisible({ timeout: 15_000 });
        await expect(mark).toHaveAttribute('href', '/codex');
        await expect(mark).toHaveAttribute('aria-label', 'Codex Visioque');
        // No underline at rest — that is the whole point of the treatment.
        await expect(mark).toHaveCSS('text-decoration-line', 'none');

        await mark.click();
        await expect(page).toHaveURL(/\/codex$/);
        await expect(page.locator('h1')).toHaveText('Codex Visioque');
    });
});
