import React from 'react';
import { hydrate } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import App from 'src/client/components/App';
import registerServiceWorker from 'src/client/utils/register-service-worker';

declare const __initial_state__;

hydrate(
    <React.StrictMode>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </React.StrictMode>,
    document.getElementById('root'),
);

if (__initial_state__?.isProduction) {
    registerServiceWorker();
}
