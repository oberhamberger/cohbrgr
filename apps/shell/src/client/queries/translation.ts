import { queryOptions } from '@tanstack/react-query';

import { TranslationKeys, TranslationResponse } from '@cohbrgr/localization';
import { reportApiFailure } from '@cohbrgr/utils/browser';
import { Config } from '@cohbrgr/shell/env';

// Snapshot of the API's `codex.*` copy, so an outage renders the page rather
// than its keys in brackets. `translation-fallback.spec.ts` fails if this
// drifts from apps/api/data/translations.json.
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
        // Same key the content remote uses, so the two share one cache entry.
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
