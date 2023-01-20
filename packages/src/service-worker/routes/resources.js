"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const workbox_routing_1 = require("workbox-routing");
const workbox_strategies_1 = require("workbox-strategies");
const workbox_expiration_1 = require("workbox-expiration");
const resourceCacheFirst = new workbox_strategies_1.CacheFirst({
    cacheName: 'resources',
    plugins: [
        new workbox_expiration_1.ExpirationPlugin({
            maxEntries: 20,
            maxAgeSeconds: 60 * 60 * 24,
        }),
    ],
});
// this resource handler is meant for images+fonts that may be referenced
// without being checked into the codebase under /resources/static
const resourceMatch = ({ request }) => request.destination === 'image' || request.destination === 'font';
const resourceRoute = new workbox_routing_1.Route(resourceMatch, resourceCacheFirst);
exports.default = resourceRoute;
//# sourceMappingURL=resources.js.map