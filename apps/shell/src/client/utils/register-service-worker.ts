import { Workbox } from 'workbox-window';

const serviceWorker = '/sw.js';
const isProduction = window.__initial_state__?.isProduction;

/**
 * Registers the service worker in production mode or unregisters it in development mode.
 */
const registerServiceWorker = async () => {
    if ('serviceWorker' in navigator) {
        if (isProduction) {
            const workbox = new Workbox(serviceWorker);
            return await workbox.register();
        } else {
            return await navigator.serviceWorker.ready
                .then((registration) => {
                    registration.unregister();
                })
                .catch((error) => {
                    console.error(error.message);
                });
        }
    }
    return Promise.resolve();
};

export default registerServiceWorker;
