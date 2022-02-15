import { RouteHandler } from 'workbox-core';
import { enable as navigationPreloadEnable } from 'workbox-navigation-preload';
import { registerRoute, setCatchHandler } from 'workbox-routing';
import { CacheFirst } from 'workbox-strategies';

declare const self: ServiceWorkerGlobalScope;

const OFFLINE_CACHE_NAME = 'offline';
const FALLBACK_HTML_URL = '/offline';

self.addEventListener('install', async (event) => {
    event.waitUntil(
        caches
            .open(OFFLINE_CACHE_NAME)
            .then((cache) => cache.add(FALLBACK_HTML_URL)),
    );
});

navigationPreloadEnable();

const offlineNavigationHandler: RouteHandler = async ({ request }) => {
    const dest = request.destination;
    const offlineCache = await self.caches.open(OFFLINE_CACHE_NAME);

    if (dest === 'document') {
        return (
            (await offlineCache.match(OFFLINE_CACHE_NAME)) || Response.error()
        );
    }
    return Response.error();
};

const cacheFirst = new CacheFirst({
    cacheName: 'resources',
});
const resourceHandler = async ({ request }) =>
    request.destination === 'style' ||
    request.destination === 'script' ||
    request.destination === 'image' ||
    request.destination === 'font';

setCatchHandler(offlineNavigationHandler);
registerRoute(resourceHandler, cacheFirst);
