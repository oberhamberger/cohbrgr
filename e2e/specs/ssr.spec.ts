import { expect, test } from '@playwright/test';

test.describe('Server-Side Rendering', () => {
    test('homepage returns 200 with HTML content', async ({ page }) => {
        const response = await page.goto('/');
        expect(response?.status()).toBe(200);
        expect(response?.headers()['content-type']).toContain('text/html');
    });

    test('page has correct title', async ({ page }) => {
        await page.goto('/');
        await expect(page).toHaveTitle('Christian Oberhamberger');
    });

    test('page has canonical link', async ({ page }) => {
        await page.goto('/');
        const canonical = page.locator('link[rel="canonical"]');
        await expect(canonical).toHaveAttribute('href', 'https://cohbrgr.com/');
    });

    test('page has meta viewport', async ({ page }) => {
        await page.goto('/');
        const viewport = page.locator('meta[name="viewport"]');
        await expect(viewport).toHaveAttribute(
            'content',
            'width=device-width, initial-scale=1.0',
        );
    });

    test('page includes CSP nonce on scripts', async ({ page }) => {
        await page.goto('/');
        const scripts = page.locator('script[nonce]');
        const count = await scripts.count();
        expect(count).toBeGreaterThan(0);
    });
});
