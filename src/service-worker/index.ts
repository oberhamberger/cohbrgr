import { enable as navigationPreloadEnable } from 'workbox-navigation-preload';
import { registerRoute, setCatchHandler } from 'workbox-routing';
import { precacheAndRoute } from 'workbox-precaching';

import navigateRoute from 'src/service-worker/routes/navigate';
import resourceRoute from 'src/service-worker/routes/resources';
import offlineNavigationHandler, {
    FALLBACK_HTML_URL,
    OFFLINE_CACHE_NAME,
} from 'src/service-worker/routes/offline';

declare const self: ServiceWorkerGlobalScope;
precacheAndRoute(self.__WB_MANIFEST);

self.addEventListener('install', async (event) => {
    event.waitUntil(
        caches
            .open(OFFLINE_CACHE_NAME)
            .then((cache) => cache.add(FALLBACK_HTML_URL)),
    );
});

navigationPreloadEnable();

registerRoute(navigateRoute);
registerRoute(resourceRoute);
setCatchHandler(offlineNavigationHandler);
