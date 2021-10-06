import * as navigationPreload from 'workbox-navigation-preload';
import { registerRoute, NavigationRoute } from 'workbox-routing';
import { NetworkOnly } from 'workbox-strategies';

const CACHE_NAME = 'offline-html';
const FALLBACK_HTML_URL = '/offline';
self.addEventListener('install', async (event: ExtendableEvent) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.add(FALLBACK_HTML_URL)),
    );
});

navigationPreload.enable();

const networkOnly = new NetworkOnly();
const navigationHandler = async (params) => {
    try {
        // Attempt a network request.
        return await networkOnly.handle(params);
    } catch (error) {
        // If it fails, return the cached HTML.
        return caches.match(FALLBACK_HTML_URL, {
            cacheName: CACHE_NAME,
        });
    }
};

// Register this strategy to handle all navigations.
registerRoute(new NavigationRoute(navigationHandler));
