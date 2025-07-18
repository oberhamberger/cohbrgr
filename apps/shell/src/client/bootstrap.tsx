import { hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from 'src/client/App';
import { AppStateProvider } from 'src/client/contexts/app-state';
import registerServiceWorker from 'src/client/utils/register-service-worker';

import { StrictMode } from 'react';

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
