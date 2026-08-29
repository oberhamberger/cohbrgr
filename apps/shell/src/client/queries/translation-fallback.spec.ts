import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

import { FALLBACK_TRANSLATIONS } from 'src/client/queries/translation';

// The fallback is a snapshot of copy the API owns, and it only ever renders
// during an outage, so nothing in normal use would reveal it going stale. This
// reads the API's data file rather than importing it, to avoid a build-time
// dependency from the shell on a sibling app.
const apiTranslations = JSON.parse(
    readFileSync(
        resolve(__dirname, '../../../../api/data/translations.json'),
        'utf8',
    ),
) as Record<string, Record<string, string>>;

describe('offline translation fallback', () => {
    // `codex.nav.*` are labels for navigation nodes, which resolve to an empty
    // list on the same outage, so they never reach a render.
    const codexKeys = Object.keys(apiTranslations['en'] ?? {}).filter(
        (key) => key.startsWith('codex.') && !key.startsWith('codex.nav.'),
    );

    it('finds the API data file it is meant to track', () => {
        expect(codexKeys.length).toBeGreaterThan(0);
    });

    it('covers every codex key the shell renders', () => {
        expect(Object.keys(FALLBACK_TRANSLATIONS).sort()).toEqual(
            codexKeys.sort(),
        );
    });

    it('matches the API copy exactly', () => {
        codexKeys.forEach((key) => {
            expect(
                FALLBACK_TRANSLATIONS[
                    key as keyof typeof FALLBACK_TRANSLATIONS
                ],
            ).toBe(apiTranslations['en']?.[key]);
        });
    });
});
