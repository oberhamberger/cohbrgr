import { RouteHandler, RouteMatchCallback } from 'workbox-core';
import { enable as navigationPreloadEnable } from 'workbox-navigation-preload';
import { registerRoute, Route, setCatchHandler } from 'workbox-routing';
import { CacheFirst } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';

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
    const { destination, mode } = request;
    const offlineCache = await self.caches.open(OFFLINE_CACHE_NAME);

    if (destination === 'document' && mode === 'navigate') {
        return (
            (await offlineCache.match(OFFLINE_CACHE_NAME)) || Response.error()
        );
    }
    return Response.error();
};

const resourceCacheFirst = new CacheFirst({
    cacheName: 'resources',
    plugins: [
        new ExpirationPlugin({
            maxEntries: 20,
            maxAgeSeconds: 60 * 60 * 24,
        }),
    ],
});
const resourceHandler: RouteMatchCallback = async ({ request }) =>
    request.destination === 'style' ||
    request.destination === 'script' ||
    request.destination === 'image' ||
    request.destination === 'font';
const resourceRoute = new Route(resourceHandler, resourceCacheFirst);

setCatchHandler(offlineNavigationHandler);
registerRoute(resourceRoute);
