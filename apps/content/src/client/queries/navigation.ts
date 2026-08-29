import { queryOptions } from '@tanstack/react-query';

import { NavigationResponse } from '@cohbrgr/localization';
import { reportApiFailure } from '@cohbrgr/utils/browser';
import { Config } from '@cohbrgr/content/env';

/**
 * Fetches the navigation nodes for a single tree from the API.
 * The nodes carry translation keys, not labels, so the caller resolves them.
 *
 * `cache: 'no-store'` stops the runtime revalidating with If-None-Match. The
 * endpoint answers a conditional request with 304, which is not `ok` and carries
 * no body we can use, so a 304 read as a failure and silently emptied the
 * navigation in production.
 */
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

/**
 * TanStack Query options for fetching a navigation tree.
 * Cached like translations — the structure changes about as often.
 *
 * Resolves to an empty list instead of throwing when the API is unreachable.
 * The links are chrome; losing them should not take the page down with them,
 * and an SSR throw here becomes a 500 for the whole homepage.
 */
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
        staleTime: 1000 * 60 * 60, // 1 hour
        gcTime: 1000 * 60 * 60 * 24, // 24 hours
    });
