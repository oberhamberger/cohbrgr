"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const workbox_routing_1 = require("workbox-routing");
const workbox_strategies_1 = require("workbox-strategies");
const navigateNetworkOnly = new workbox_strategies_1.NetworkOnly();
const navigateMatch = ({ request }) => request.mode === 'navigate';
const navigationRoute = new workbox_routing_1.Route(navigateMatch, navigateNetworkOnly);
exports.default = navigationRoute;
//# sourceMappingURL=navigation.js.map