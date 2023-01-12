import { RouteMatchCallback } from 'workbox-core';
import { Route } from 'workbox-routing';
import { NetworkOnly } from 'workbox-strategies';

const navigateNetworkOnly = new NetworkOnly();
const navigateMatch: RouteMatchCallback = ({ request }) =>
    request.mode === 'navigate';

const navigationRoute = new Route(navigateMatch, navigateNetworkOnly);

export default navigationRoute;