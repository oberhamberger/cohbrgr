import { RouteHandler } from 'workbox-core';

export const OFFLINE_CACHE_NAME = 'offline';
export const FALLBACK_HTML_URL = '/offline';

const offlineNavigationHandler: RouteHandler = async ({ request }) => {
    const { destination, mode } = request;
    if (destination === 'document' && mode === 'navigate') {
        const offlineCache = await self.caches.open(OFFLINE_CACHE_NAME);
        return (
            (await offlineCache.match(OFFLINE_CACHE_NAME)) || Response.error()
        );
    }
    return Response.error();
};

export default offlineNavigationHandler;
