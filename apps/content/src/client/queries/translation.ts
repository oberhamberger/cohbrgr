import { queryOptions } from '@tanstack/react-query';

import { TranslationKeys, TranslationResponse } from '@cohbrgr/localization';
import { reportApiFailure } from '@cohbrgr/utils/browser';
import { Config } from '@cohbrgr/content/env';

/**
 * Last-resort copy for when the API cannot be reached.
 *
 * The API is the source of truth; this is a snapshot, and it exists so that a
 * translation outage degrades the homepage instead of turning it into a 500.
 * Without it the hero would render its keys in brackets, which is worse than an
 * error page. Only `hero.*` is covered — the navigation labels come from nodes
 * that resolve to an empty list on the same outage.
 *
 * `translation-fallback.spec.ts` fails if this drifts from the API's data file,
 * so it cannot silently go stale.
 */
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

/**
 * Fetches translations for a specific language from the API.
 *
 * `cache: 'no-store'` for the same reason as navigation: the endpoint answers a
 * conditional request with 304, which is not `ok`.
 */
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

/**
 * TanStack Query options for fetching translations.
 * Translations are cached for 1 hour since they rarely change.
 *
 * Falls back rather than throwing: this runs inside a suspense query during SSR,
 * and `render.tsx` turns any error thrown there into a 500 for the whole page.
 */
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
        staleTime: 1000 * 60 * 60, // 1 hour
        gcTime: 1000 * 60 * 60 * 24, // 24 hours
    });
