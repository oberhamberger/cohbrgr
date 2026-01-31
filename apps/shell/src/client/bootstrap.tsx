import { StrictMode, Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { hydrateRoot } from 'react-dom/client';
import App from 'src/client/App';
import { AppStateProvider } from 'src/client/contexts/app-state';
import registerServiceWorker from 'src/client/utils/register-service-worker';

import {
    createTranslationCache,
    SuspenseTranslationLoader,
    TranslationCacheProvider,
} from '@cohbrgr/localization';

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

    // Create cache pre-populated with SSR translations for hydration
    const translationCache = createTranslationCache(undefined, {
        lang: 'en',
        keys: translations,
    });

    hydrateRoot(
        root,
        <StrictMode>
            <QueryClientProvider client={queryClient}>
                <TranslationCacheProvider cache={translationCache}>
                    <AppStateProvider context={window.__initial_state__}>
                        <Suspense fallback={null}>
                            <SuspenseTranslationLoader>
                                <BrowserRouter>
                                    <App />
                                </BrowserRouter>
                            </SuspenseTranslationLoader>
                        </Suspense>
                    </AppStateProvider>
                </TranslationCacheProvider>
            </QueryClientProvider>
        </StrictMode>,
    );
}

registerServiceWorker();
