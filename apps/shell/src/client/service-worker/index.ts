import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching';
import { registerRoute, setCatchHandler } from 'workbox-routing';

import navigationRoute from 'src/client/service-worker/routes/navigation';
import offlineNavigationHandler, {
    FALLBACK_HTML_URL,
    OFFLINE_CACHE_NAME,
} from 'src/client/service-worker/routes/offline';
import resourceRoute from 'src/client/service-worker/routes/resources';

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
