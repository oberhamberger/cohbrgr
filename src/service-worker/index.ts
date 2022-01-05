import { enable as navigationPreloadEnable } from 'workbox-navigation-preload';
import { registerRoute, NavigationRoute } from 'workbox-routing';
import { NetworkOnly, CacheFirst } from 'workbox-strategies';

declare const self: ServiceWorkerGlobalScope;

const CACHE_NAME = 'offline-html';
const FALLBACK_HTML_URL = '/offline';

self.addEventListener('install', async (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.add(FALLBACK_HTML_URL)),
    );
});

navigationPreloadEnable();

const networkOnly = new NetworkOnly();
const offlineNavigationHandler: any = async (params) => {
    try {
        return await networkOnly.handle(params);
    } catch (error) {
        return caches.match(FALLBACK_HTML_URL, {
            cacheName: CACHE_NAME,
        });
    }
};

const cacheFirst = new CacheFirst({
    cacheName: 'resources',
});
const resourceHandler = async ({ request }) =>
    request.destination === 'style' ||
    request.destination === 'script' ||
    request.destination === 'image' ||
    request.destination === 'font';

registerRoute(new NavigationRoute(offlineNavigationHandler));
registerRoute(resourceHandler, cacheFirst);
