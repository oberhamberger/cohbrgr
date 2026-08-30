import { queryOptions } from '@tanstack/react-query';

import { TranslationKeys, TranslationResponse } from '@cohbrgr/localization';
import { reportApiFailure } from '@cohbrgr/utils/browser';
import { Config } from '@cohbrgr/content/env';

// Snapshot of the API's `hero.*` copy, so an outage renders the page rather
// than its keys in brackets. `translation-fallback.spec.ts` fails if this
// drifts from apps/api/data/translations.json.
export const FALLBACK_TRANSLATIONS: TranslationKeys = {
    'hero.subtitle': 'C·V·Q·O',
    'hero.subtitle.label': 'Codex Visioque',
    'hero.title': "My Name is Christian<span class='mark'>.</span>",
    'hero.text':
        "I am a Frontend Architect at <a href='https://netconomy.net'>Netconomy</a>. I mainly work with React and Node.js on online commerce platforms.",
    'hero.nav.github': 'Github',
    'hero.nav.bluesky': 'Bluesky',
    'hero.nav.linkedin': 'LinkedIn',
};

// `cache: 'no-store'` for the same reason as navigation: the endpoint answers a
// conditional request with 304, which is not `ok`.
export const fetchTranslations = async (
    lang: string = 'en',
): Promise<TranslationResponse> => {
    const response = await fetch(`${Config.apiUrl}/translation/${lang}`, {
        cache: 'no-store',
    });
    if (!response.ok) {
        throw new Error(
            `HTTP ${response.status} ${response.statusText}`.trim(),
        );
    }
    return response.json();
};

export const translationQueryOptions = (lang: string = 'en') =>
    queryOptions({
        queryKey: ['translations', lang],
        queryFn: async (): Promise<TranslationResponse> => {
            try {
                return await fetchTranslations(lang);
            } catch (error) {
                reportApiFailure({
                    endpoint: `/translation/${lang}`,
                    error,
                    degradedTo: 'the bundled fallback copy',
                });
                return { lang, keys: FALLBACK_TRANSLATIONS };
            }
        },
        staleTime: 1000 * 60 * 60,
        gcTime: 1000 * 60 * 60 * 24,
    });
