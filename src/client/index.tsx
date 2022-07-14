import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from 'src/client/components/App';
import registerServiceWorker from 'src/client/utils/register-service-worker';
import { State } from 'src/client/store/state';

declare const __initial_state__: State;
const { isProduction } = __initial_state__;
const root = document.getElementById('root');

if (root) {
    hydrateRoot(
        root,
        <React.StrictMode>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </React.StrictMode>,
    );
}

if (isProduction) {
    registerServiceWorker();
}
