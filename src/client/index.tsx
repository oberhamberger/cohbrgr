import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from 'src/client/components/App';
import registerServiceWorker from 'src/client/utils/register-service-worker';
import { AppStateProvider } from 'src/client/contexts/app-state';

const root = document.getElementById('root');

if (root) {
    hydrateRoot(
        root,
        <React.StrictMode>
            <AppStateProvider context={window.__initial_state__}>
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            </AppStateProvider>
        </React.StrictMode>,
    );
}

if (window.__initial_state__?.isProduction) {
    registerServiceWorker();
}

delete window.__initial_state__.nonce;
