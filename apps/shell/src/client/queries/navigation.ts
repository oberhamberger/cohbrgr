import { queryOptions } from '@tanstack/react-query';

import { NavigationResponse } from '@cohbrgr/localization';
import { reportApiFailure } from '@cohbrgr/utils/browser';
import { Config } from '@cohbrgr/shell/env';

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

// Resolves to an empty list rather than throwing: render.tsx turns an error
// thrown during SSR into a 500, so a throw here would replace the 404 page with
// a server error whenever the API is down.
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
