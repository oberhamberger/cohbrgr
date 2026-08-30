import { expect, test } from '@playwright/test';

// Guards the CSS-modules SSR regression where the server bundle and the client
// stylesheet disagreed on a scoped class name and every module-scoped rule
// silently dropped. Reads computed styles, so it runs on every OS.

test.describe('Scoped CSS modules resolve', () => {
    test('navigation list is styled by its module', async ({ page }) => {
        await page.goto('/');

        const nav = page.locator('nav');
        await expect(nav).toBeVisible({ timeout: 15_000 });

        // From Navigation.module.scss. Without the scoped class these fall
        // back to browser defaults (`block` / `disc` / 40px padding).
        const list = page.locator('nav ul');
        await expect(list).toHaveCSS('display', 'flex');
        await expect(list).toHaveCSS('list-style-type', 'none');
        await expect(list).toHaveCSS('column-gap', '38.4px');
        await expect(list).toHaveCSS('margin', '0px');
        await expect(list).toHaveCSS('padding', '0px');
    });

    test('layout wrapper is a grid from its module', async ({ page }) => {
        await page.goto('/');

        // Selected by the hashed-class prefix so it survives hash changes.
        const layout = page.locator('div[class^="layout-"]');
        await expect(layout).toBeVisible({ timeout: 15_000 });
        await expect(layout).toHaveCSS('display', 'grid');
        // A fallback to `normal` means the module dropped out.
        await expect(layout).toHaveCSS('align-content', 'center');
    });
});
