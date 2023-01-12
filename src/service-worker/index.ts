import {
    registerRoute,
    setCatchHandler,
    NavigationRoute,
} from 'workbox-routing';
import { precacheAndRoute } from 'workbox-precaching';
import { NetworkFirst } from 'workbox-strategies';
import * as navigationPreload from 'workbox-navigation-preload';

import resourceRoute from 'src/service-worker/routes/resources';
import offlineNavigationHandler, {
    FALLBACK_HTML_URL,
    OFFLINE_CACHE_NAME,
} from 'src/service-worker/routes/offline';

declare const self: ServiceWorkerGlobalScope;
precacheAndRoute(self.__WB_MANIFEST);

navigationPreload.enable();
const navigationRoute = new NavigationRoute(new NetworkFirst());
registerRoute(navigationRoute);

self.addEventListener('install', async (event) => {
    event.waitUntil(
        caches
            .open(OFFLINE_CACHE_NAME)
            .then((cache) => cache.add(FALLBACK_HTML_URL)),
    );
});

registerRoute(resourceRoute);
setCatchHandler(offlineNavigationHandler);
