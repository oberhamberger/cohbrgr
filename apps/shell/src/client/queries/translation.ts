import { queryOptions } from '@tanstack/react-query';

import { TranslationKeys, TranslationResponse } from '@cohbrgr/localization';
import { Config } from '@cohbrgr/shell/env';

/**
 * Last-resort copy for when the API cannot be reached.
 *
 * The API owns this text; the object below is a snapshot. Before the codex copy
 * moved into the API the page was hardcoded and survived an outage on its own,
 * and without a fallback it would now render its keys in brackets instead.
 * Covers `codex.*` only, which is all the shell renders as prose — the 404 page
 * carries its own hardcoded link and the navigation labels never appear,
 * because the nodes resolve to an empty list on the same outage.
 *
 * `translation-fallback.spec.ts` fails if this drifts from the API data file.
 */
export const FALLBACK_TRANSLATIONS: TranslationKeys = {
    'codex.subtitle': 'C·V·Q·O',
    'codex.title': 'Codex Visioque',
    'codex.lede':
        'This is a reference micro-frontend architecture for enterprise applications that eventually outgrow one team.',
    'codex.rendering':
        'The entire page is server-side rendered, including its federated parts that were built and deployed separately.',
    'codex.foundations':
        'The pieces that have to stay consistent across teams are shared: colour tokens, server middleware, the localisation contract and other technical foundations like React, TypeScript and the build process.',
};

/**
 * Fetches translations for a specific language from the API.
 */
export const fetchTranslations = async (
    lang: string = 'en',
): Promise<TranslationResponse> => {
    const response = await fetch(`${Config.apiUrl}/translation/${lang}`);
    if (!response.ok) {
        throw new Error(`Failed to fetch translations: ${response.statusText}`);
    }
    return response.json();
};

/**
 * TanStack Query options for fetching translations.
 * Translations are cached for 1 hour since they rarely change.
 */
export const translationQueryOptions = (lang: string = 'en') =>
    queryOptions({
        // Same key the content remote uses, so the two share one cache entry.
        queryKey: ['translations', lang],
        // Falls back rather than throwing, for the same reason
        // navigationQueryOptions does: an SSR throw becomes a 500 and would
        // take the 404 and codex pages down with the API.
        queryFn: async (): Promise<TranslationResponse> => {
            try {
                return await fetchTranslations(lang);
            } catch {
                return { lang, keys: FALLBACK_TRANSLATIONS };
            }
        },
        staleTime: 1000 * 60 * 60, // 1 hour
        gcTime: 1000 * 60 * 60 * 24, // 24 hours
    });
