import { StrictMode, Suspense } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { hydrateRoot } from 'react-dom/client';
import App from 'src/client/App';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            refetchOnWindowFocus: false,
        },
    },
});

const root = document.getElementById('content');

if (root) {
    hydrateRoot(
        root,
        <StrictMode>
            <QueryClientProvider client={queryClient}>
                <Suspense fallback={null}>
                    <App />
                </Suspense>
            </QueryClientProvider>
        </StrictMode>,
    );
}
