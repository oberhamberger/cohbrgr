import { StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from 'packages/client/App';
import registerServiceWorker from 'packages/client/utils/register-service-worker';
import { AppStateProvider } from 'packages/client/contexts/app-state';

const root = document.getElementById('root');

if (root) {
    hydrateRoot(
        root,
        <StrictMode>
            <AppStateProvider context={window.__initial_state__}>
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            </AppStateProvider>
        </StrictMode>,
    );
}

registerServiceWorker();
