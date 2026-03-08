import { expect, test } from '@playwright/test';

test.describe('No JavaScript', () => {
    test.use({ javaScriptEnabled: false });

    test('page renders meaningful HTML without JS', async ({ page }) => {
        await page.goto('/');

        // Page should still have the title from SSR
        await expect(page).toHaveTitle('Christian Oberhamberger');
    });

    test('page contains SSR layout without JS', async ({ page }) => {
        const response = await page.goto('/');
        expect(response?.status()).toBe(200);

        // The HTML should contain the root div with SSR content
        const html = await page.content();
        expect(html).toContain('id="root"');
        expect(html).toContain('</div>');
    });

    test('page includes meta tags without JS', async ({ page }) => {
        await page.goto('/');
        const description = page.locator('meta[name="description"]');
        await expect(description).toHaveAttribute('content', /Christian/);
    });
});
