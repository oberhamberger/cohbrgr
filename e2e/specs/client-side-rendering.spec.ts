import { expect, test } from '@playwright/test';

test.describe('Client-Side Rendering', () => {
    test('navigates from 404 page back to homepage via client-side link', async ({
        page,
    }) => {
        // Start on a 404 page
        const response = await page.goto('/this-page-does-not-exist');
        expect(response?.status()).toBe(404);

        await expect(page.locator('h1')).toHaveText('Not Found');

        // The 404 page has a "return" link inside a nav element
        const returnLink = page.locator('nav a', { hasText: 'return' });
        await expect(returnLink).toBeVisible();

        // Click the link — this is a React Router <Link>, so it's CSR navigation
        await returnLink.click();

        // Verify client-side navigation to homepage (no full page reload)
        await expect(page).toHaveURL('/');
        await expect(page).toHaveTitle('Christian Oberhamberger');

        // Verify federated content loaded after CSR navigation
        // The Content component renders a nav with multiple external links
        const nav = page.locator('nav');
        await expect(nav).toBeVisible({ timeout: 15_000 });
        await expect(nav.locator('a').first()).toBeVisible();
    });
});
