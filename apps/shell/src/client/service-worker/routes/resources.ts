import { RouteMatchCallback } from 'workbox-core';
import { ExpirationPlugin } from 'workbox-expiration';
import { Route } from 'workbox-routing';
import { CacheFirst } from 'workbox-strategies';

const resourceCacheFirst = new CacheFirst({
    cacheName: 'resources',
    plugins: [
        new ExpirationPlugin({
            maxEntries: 20,
            maxAgeSeconds: 60 * 60 * 24,
        }),
    ],
});

// this resource handler is meant for images+fonts that may be referenced
// without being checked into the codebase under /resources/static
const resourceMatch: RouteMatchCallback = ({ request }) =>
    request.destination === 'image' || request.destination === 'font';

const resourceRoute = new Route(resourceMatch, resourceCacheFirst);

export default resourceRoute;
