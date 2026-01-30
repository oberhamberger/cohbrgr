import { queryOptions } from '@tanstack/react-query';
import { TranslationResponse } from 'src/client/types/translation';

const API_BASE_URL =
    process.env['DOCKER'] === 'true'
        ? 'https://cohbrgr-api-944962437395.europe-west6.run.app'
        : 'http://localhost:3002';

/**
 * Fetches translations for a specific language from the API.
 */
export const fetchTranslations = async (
    lang: string = 'en',
): Promise<TranslationResponse> => {
    const response = await fetch(`${API_BASE_URL}/translation/${lang}`);
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
