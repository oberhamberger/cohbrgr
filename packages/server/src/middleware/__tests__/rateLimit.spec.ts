import { describe, expect, it } from 'vitest';

import { isStaticAsset } from '../rateLimit';

describe('rate limit exemptions', () => {
    // A single page view costs several asset requests. Counting them turned a
    // 500-request budget into roughly fifty page views per address, which the
    // e2e suite exhausted the moment two font files were added.
    it.each([
        '/fonts/eb-garamond-latin-var.woff2',
        '/fonts/courier-prime-latin-700.woff2',
        '/css/main.1a2b3c.css',
        '/main.1a2b3c.js',
        '/sw.js',
        '/favicon.ico',
        '/favicon-32x32.png',
        '/apple-touch-icon.png',
        '/manifest.json',
    ])('does not count %s', (path) => {
        expect(isStaticAsset(path)).toBe(true);
    });

    it.each(['/', '/codex', '/offline', '/translation/en', '/navigation/hero'])(
        'still counts %s',
        (path) => {
            expect(isStaticAsset(path)).toBe(false);
        },
    );

    it('is not fooled by an extension appearing mid-path', () => {
        expect(isStaticAsset('/css/not-an-asset')).toBe(false);
        expect(isStaticAsset('/a.js/pretending')).toBe(false);
    });
});
