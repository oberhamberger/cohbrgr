import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

import { FALLBACK_TRANSLATIONS } from 'src/client/queries/translation';

// The fallback is a snapshot of copy the API owns, and it is only ever rendered
// during an outage — so nothing in normal use would reveal it going stale. This
// reads the API's data file directly rather than importing it, to avoid a
// build-time dependency from the content app on a sibling app.
const apiTranslations = JSON.parse(
    readFileSync(
        resolve(__dirname, '../../../../api/data/translations.json'),
        'utf8',
    ),
) as Record<string, Record<string, string>>;

describe('offline translation fallback', () => {
    const heroKeys = Object.keys(apiTranslations['en'] ?? {}).filter((key) =>
        key.startsWith('hero.'),
    );

    it('finds the API data file it is meant to track', () => {
        expect(heroKeys.length).toBeGreaterThan(0);
    });

    it('covers every hero key the API serves', () => {
        expect(Object.keys(FALLBACK_TRANSLATIONS).sort()).toEqual(
            heroKeys.sort(),
        );
    });

    it('matches the API copy exactly', () => {
        heroKeys.forEach((key) => {
            expect(
                FALLBACK_TRANSLATIONS[
                    key as keyof typeof FALLBACK_TRANSLATIONS
                ],
            ).toBe(apiTranslations['en']?.[key]);
        });
    });
});
