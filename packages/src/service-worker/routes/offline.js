"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FALLBACK_HTML_URL = exports.OFFLINE_CACHE_NAME = void 0;
exports.OFFLINE_CACHE_NAME = 'offline';
exports.FALLBACK_HTML_URL = '/offline';
const offlineNavigationHandler = async ({ request }) => {
    const { destination, mode } = request;
    if (destination === 'document' && mode === 'navigate') {
        const offlineCache = await self.caches.open(exports.OFFLINE_CACHE_NAME);
        return ((await offlineCache.match(exports.OFFLINE_CACHE_NAME)) || Response.error());
    }
    return Response.error();
};
exports.default = offlineNavigationHandler;
//# sourceMappingURL=offline.js.map