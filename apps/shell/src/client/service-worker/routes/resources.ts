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

/**
 * Route matcher callback that identifies image and font requests for caching.
 */
const resourceMatch: RouteMatchCallback = ({ request }) =>
    request.destination === 'image' || request.destination === 'font';

const resourceRoute = new Route(resourceMatch, resourceCacheFirst);

export default resourceRoute;
