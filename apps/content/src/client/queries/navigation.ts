import { queryOptions } from '@tanstack/react-query';

import { NavigationResponse } from '@cohbrgr/localization';
import { reportApiFailure } from '@cohbrgr/utils/browser';
import { Config } from '@cohbrgr/content/env';

// `cache: 'no-store'` stops the runtime revalidating with If-None-Match. The
// endpoint answers a conditional request with 304, which is not `ok` and has no
// body, so a 304 read as a failure and silently emptied the navigation.
export const fetchNavigation = async (
    nodeId: string,
): Promise<NavigationResponse> => {
    const response = await fetch(`${Config.apiUrl}/navigation/${nodeId}`, {
        cache: 'no-store',
    });
    if (!response.ok) {
        throw new Error(
            `HTTP ${response.status} ${response.statusText}`.trim(),
        );
    }
    return response.json();
};

// Resolves to an empty list rather than throwing: an error thrown during SSR
// becomes a 500, and the links are chrome — losing them should not take the
// homepage with them.
export const navigationQueryOptions = (nodeId: string) =>
    queryOptions({
        queryKey: ['navigation', nodeId],
        queryFn: async (): Promise<NavigationResponse> => {
            try {
                return await fetchNavigation(nodeId);
            } catch (error) {
                reportApiFailure({
                    endpoint: `/navigation/${nodeId}`,
                    error,
                    degradedTo: 'no navigation',
                });
                return [];
            }
        },
        staleTime: 1000 * 60 * 60,
        gcTime: 1000 * 60 * 60 * 24,
    });
