import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from 'src/client/components/App';
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
