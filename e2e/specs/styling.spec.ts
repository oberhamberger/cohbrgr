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

        // From Navigation.module.scss: `.navigation ul { display: flex;
        // list-style: none; gap: 0.75rem 2rem; margin: 0; padding: 0 }`.
        // Without the scoped class these fall back to the browser defaults
        // (`block` / `disc` / a 40px inline padding) — the broken state.
        const list = page.locator('nav ul');
        await expect(list).toHaveCSS('display', 'flex');
        await expect(list).toHaveCSS('list-style-type', 'none');
        await expect(list).toHaveCSS('column-gap', '32px');
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
        // `.layout { align-content: center }` — the single vertical
        // composition. A fallback to `normal` means the module dropped out.
        await expect(layout).toHaveCSS('align-content', 'center');
    });
});
