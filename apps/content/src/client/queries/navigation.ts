import { queryOptions } from '@tanstack/react-query';

import { NavigationResponse } from '@cohbrgr/localization';
import { Config } from '@cohbrgr/content/env';

/**
 * Fetches the navigation nodes for a single tree from the API.
 * The nodes carry translation keys, not labels, so the caller resolves them.
 */
export const fetchNavigation = async (
    nodeId: string,
): Promise<NavigationResponse> => {
    const response = await fetch(`${Config.apiUrl}/navigation/${nodeId}`);
    if (!response.ok) {
        throw new Error(`Failed to fetch navigation: ${response.statusText}`);
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
            } catch {
                return [];
            }
        },
        staleTime: 1000 * 60 * 60, // 1 hour
        gcTime: 1000 * 60 * 60 * 24, // 24 hours
    });
