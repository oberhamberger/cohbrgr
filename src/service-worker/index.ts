import { enable as navigationPreloadEnable } from 'workbox-navigation-preload';
import { registerRoute, NavigationRoute } from 'workbox-routing';
import { NetworkOnly } from 'workbox-strategies';

const CACHE_NAME = 'offline-html';
const FALLBACK_HTML_URL = '/offline';
self.addEventListener('install', async (event: ExtendableEvent) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.add(FALLBACK_HTML_URL)),
    );
});

navigationPreloadEnable();

const networkOnly = new NetworkOnly();
const navigationHandler = async (params) => {
    try {
        return await networkOnly.handle(params);
    } catch (error) {
        return caches.match(FALLBACK_HTML_URL, {
            cacheName: CACHE_NAME,
        });
    }
};

registerRoute(new NavigationRoute(navigationHandler));
