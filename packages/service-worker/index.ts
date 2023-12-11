import { registerRoute, setCatchHandler } from 'workbox-routing';
import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching';

import navigationRoute from 'packages/service-worker/routes/navigation';
import resourceRoute from 'packages/service-worker/routes/resources';
import offlineNavigationHandler, {
    FALLBACK_HTML_URL,
    OFFLINE_CACHE_NAME,
} from 'packages/service-worker/routes/offline';

declare const self: ServiceWorkerGlobalScope;

cleanupOutdatedCaches();
precacheAndRoute(self.__WB_MANIFEST);

self.addEventListener('install', async (event) => {
    event.waitUntil(
        caches
            .open(OFFLINE_CACHE_NAME)
            .then((cache) => cache.add(FALLBACK_HTML_URL)),
    );
});

registerRoute(navigationRoute);
registerRoute(resourceRoute);
setCatchHandler(offlineNavigationHandler);
