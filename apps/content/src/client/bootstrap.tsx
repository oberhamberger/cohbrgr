import { StrictMode } from 'react';

import { defaultTranslations } from '@cohbrgr/localization';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { hydrateRoot } from 'react-dom/client';
import App from 'src/client/App';
import { TranslationLoader } from 'src/client/components/translation-loader';

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
                <TranslationLoader
                    fallback={{ lang: 'en', keys: defaultTranslations }}
                >
                    <App />
                </TranslationLoader>
            </QueryClientProvider>
        </StrictMode>,
    );
}
