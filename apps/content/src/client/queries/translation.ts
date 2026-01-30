import { TranslationResponse } from '@cohbrgr/localization';
import { Config } from '@cohbrgr/content/env';
import { queryOptions } from '@tanstack/react-query';

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
        queryKey: ['translations', lang],
        queryFn: () => fetchTranslations(lang),
        staleTime: 1000 * 60 * 60, // 1 hour
        gcTime: 1000 * 60 * 60 * 24, // 24 hours
    });
