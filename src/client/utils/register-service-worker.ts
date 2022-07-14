const serviceWorker = '/sw.js';

const registerServiceWorker = async () => {
    if ('serviceWorker' in navigator) {
        const { Workbox } = await import('workbox-window');
        const workbox = new Workbox(serviceWorker);
        workbox.register();
    }
};

export default registerServiceWorker;
