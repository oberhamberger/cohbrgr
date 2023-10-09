const serviceWorker = '/sw.js';
const isProduction = window.__initial_state__?.isProduction;

const registerServiceWorker = async () => {
    if ('serviceWorker' in navigator) {
        if (isProduction) {
            const { Workbox } = await import('workbox-window');
            const workbox = new Workbox(serviceWorker);
            workbox.register();
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
};

export default registerServiceWorker;
