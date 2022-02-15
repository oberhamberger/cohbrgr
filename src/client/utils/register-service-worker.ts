const serviceWorker = '/sw.js';

const registerServiceWorker = async () => {
    if ('serviceWorker' in navigator) {
        const { Workbox } = await import('workbox-window');
        const wb = new Workbox(serviceWorker);
        wb.register();
    }
};

export default registerServiceWorker;
