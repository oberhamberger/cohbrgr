import { queryOptions } from '@tanstack/react-query';

import { TranslationResponse } from '@cohbrgr/localization';
import { Config } from '@cohbrgr/shell/env';

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
        // Falls back to empty keys rather than throwing, for the same reason
        // navigationQueryOptions does: an SSR throw becomes a 500 and would
        // take the 404 and codex pages down with the API.
        queryFn: async (): Promise<TranslationResponse> => {
            try {
                return await fetchTranslations(lang);
            } catch {
                return { lang, keys: {} };
            }
        },
        staleTime: 1000 * 60 * 60, // 1 hour
        gcTime: 1000 * 60 * 60 * 24, // 24 hours
    });
