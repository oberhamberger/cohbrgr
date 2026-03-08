import { expect, test } from '@playwright/test';

test.describe('Module Federation', () => {
    test('content loads from federated remote', async ({ page }) => {
        await page.goto('/');

        // The federated Content component renders a nav with links.
        // Server-side health check means no client-side fetch delay.
        const nav = page.locator('nav');
        await expect(nav).toBeVisible({ timeout: 15_000 });

        // Verify the navigation contains expected links
        const links = nav.locator('a');
        await expect(links.first()).toBeVisible();
    });

    test('content app health endpoint is reachable', async ({ request }) => {
        const response = await request.get('http://localhost:3001/health');
        expect(response.status()).toBe(200);

        const body = await response.json();
        expect(body.status).toBe('OK');
    });
});
