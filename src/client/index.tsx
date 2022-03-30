import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from 'src/client/components/App';
import registerServiceWorker from 'src/client/utils/register-service-worker';

declare const __initial_state__;

hydrateRoot(
    document.getElementById('root') as HTMLElement,
    <React.StrictMode>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </React.StrictMode>,
);

if (__initial_state__?.isProduction) {
    registerServiceWorker();
}
