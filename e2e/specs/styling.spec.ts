import { expect, test } from '@playwright/test';

// Guards against the CSS-modules SSR regression where the server bundle and the
// client stylesheet disagreed on a scoped class name, so the markup referenced
// classes the stylesheet never defined and every module-scoped rule silently
// dropped. These assertions read computed styles, so they fail whenever a
// `*.module.scss` rule stops reaching the element — independently of the OS,
// which is why they run everywhere (unlike the screenshot baselines).

test.describe('Scoped CSS modules resolve', () => {
    test('navigation list is styled by its module', async ({ page }) => {
        await page.goto('/');

        const nav = page.locator('nav');
        await expect(nav).toBeVisible({ timeout: 15_000 });

        // From Navigation.module.scss: `.navigation li { display: inline-block;
        // list-style: none }`. Without the scoped class these fall back to the
        // browser defaults (`list-item` / `disc`) — exactly the broken state.
        const firstItem = page.locator('nav li').first();
        await expect(firstItem).toHaveCSS('display', 'inline-block');
        await expect(firstItem).toHaveCSS('list-style-type', 'none');

        // `.navigation ul { margin: 0; padding: 0 }`
        const list = page.locator('nav ul');
        await expect(list).toHaveCSS('margin', '0px');
        await expect(list).toHaveCSS('padding', '0px');
    });

    test('layout wrapper is a grid from its module', async ({ page }) => {
        await page.goto('/');

        // Layout.module.scss: `.layout { display: grid }`. Selected by the
        // hashed-class prefix so the assertion survives future hash changes.
        const layout = page.locator('div[class^="layout-"]');
        await expect(layout).toBeVisible({ timeout: 15_000 });
        await expect(layout).toHaveCSS('display', 'grid');
    });
});
