import { queryOptions } from '@tanstack/react-query';

import { NavigationResponse } from '@cohbrgr/localization';
import { Config } from '@cohbrgr/shell/env';

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
 *
 * Resolves to an empty list instead of throwing when the API is unreachable.
 * The shell renders the 404 page with this, and `render.tsx` turns any error
 * thrown during SSR into a 500 — so a throw here would replace a 404 with a
 * server error whenever the API is down. Navigation is chrome; its absence
 * should not take the page with it.
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
