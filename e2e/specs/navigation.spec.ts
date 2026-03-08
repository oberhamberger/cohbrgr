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
});
