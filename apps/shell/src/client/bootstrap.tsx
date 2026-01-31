import { StrictMode } from 'react';
import { BrowserRouter } from 'react-router-dom';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { hydrateRoot } from 'react-dom/client';
import App from 'src/client/App';
import { AppStateProvider } from 'src/client/contexts/app-state';
import registerServiceWorker from 'src/client/utils/register-service-worker';

import { TranslationProvider } from '@cohbrgr/localization';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            refetchOnWindowFocus: false,
        },
    },
});

const root = document.getElementById('root');

if (root) {
    const translations = window.__initial_state__?.translations ?? {};

    hydrateRoot(
        root,
        <StrictMode>
            <QueryClientProvider client={queryClient}>
                <AppStateProvider context={window.__initial_state__}>
                    <TranslationProvider
                        context={{
                            lang: 'en',
                            keys: translations,
                            isDefault: false,
                        }}
                    >
                        <BrowserRouter>
                            <App />
                        </BrowserRouter>
                    </TranslationProvider>
                </AppStateProvider>
            </QueryClientProvider>
        </StrictMode>,
    );
}

registerServiceWorker();
