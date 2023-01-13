import { Workbox } from 'workbox-window';

const serviceWorker = '/sw.js';

const registerServiceWorker = async () => {
    if ('serviceWorker' in navigator) {
        const workbox = new Workbox(serviceWorker);
        workbox.register();
    }
};

registerServiceWorker();
