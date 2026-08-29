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

    // The codex link is rendered by the content remote but points at a shell
    // route, so this covers the hand-off across the federation boundary.
    test('homepage links to the codex page', async ({ page }) => {
        await page.goto('/');

        const codexLink = page.locator('nav a', { hasText: 'Codex' });
        await expect(codexLink).toBeVisible({ timeout: 15_000 });

        await codexLink.click();
        await expect(page).toHaveURL(/\/codex$/);
        await expect(page.locator('h1')).toHaveText('Codex Visioque');
    });
});
