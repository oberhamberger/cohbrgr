import React, { FunctionComponent } from 'react';

interface IServiceWorkerProps {
    nonce: string;
}
export type ServiceWorkerProps = IServiceWorkerProps;

const ServiceWorker: FunctionComponent<ServiceWorkerProps> = (
    props: ServiceWorkerProps,
) => {
    return (
        <script
            crossOrigin="use-credentials"
            nonce={props.nonce}
            dangerouslySetInnerHTML={{
                __html: `
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js');
    });
}`,
            }}
        ></script>
    );
};

export default ServiceWorker;
