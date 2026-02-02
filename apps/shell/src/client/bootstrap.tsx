import { StrictMode, Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';

import {
    HydrationBoundary,
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query';
import { hydrateRoot } from 'react-dom/client';
import App from 'src/client/App';
import { AppStateProvider } from 'src/client/contexts/app-state';
import registerServiceWorker from 'src/client/utils/register-service-worker';

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
    // Get dehydrated state from SSR transfer
    const dehydratedState = window.__initial_state__?.dehydratedState;

    hydrateRoot(
        root,
        <StrictMode>
            <QueryClientProvider client={queryClient}>
                <HydrationBoundary state={dehydratedState}>
                    <AppStateProvider context={window.__initial_state__}>
                        <Suspense fallback={null}>
                            <BrowserRouter>
                                <App />
                            </BrowserRouter>
                        </Suspense>
                    </AppStateProvider>
                </HydrationBoundary>
            </QueryClientProvider>
        </StrictMode>,
    );
}

registerServiceWorker();
