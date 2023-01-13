import React, { FunctionComponent } from 'react';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import Logger from 'src/server/utils/logger';

interface IServiceWorkerProps {
    nonce: string;
    isProduction: boolean;
}
export type ServiceWorkerProps = IServiceWorkerProps;

const registerSWFile = resolve(__dirname + '/../client/registerSW.js');
let registerSWFileContents = '';
try {
    registerSWFileContents = readFileSync(registerSWFile, 'utf8');
} catch (err) {
    Logger.warn(
        'HTML-Template: no files for registering the Service Worker found in current context',
    );
}

const ServiceWorker: FunctionComponent<ServiceWorkerProps> = (
    props: ServiceWorkerProps,
) => {
    if (!props.isProduction) {
        return null;
    }

    return (
        <script
            nonce={props.nonce}
            dangerouslySetInnerHTML={{ __html: registerSWFileContents }}
        ></script>
    );
};

ServiceWorker.displayName = 'SSRServiceWorker';

export default ServiceWorker;
