import { StrictMode } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { hydrateRoot } from 'react-dom/client';
import App from 'src/client/App';
import { TranslationProvider } from 'src/client/contexts/translation';
import { TranslationKeys } from 'src/client/types/translation';

/**
 * Default English translations as fallback for client-only rendering.
 */
const defaultTranslations: TranslationKeys = {
    'hero.subtitle': 'c.f.k.o',
    'hero.title': 'My Name is Christian.',
    'hero.text':
        "I am a Frontend Architect at <a href='https://netconomy.net'>Netconomy</a>. I mainly work with React and Node.js on online commerce platforms.",
    'hero.nav.github': 'Github',
    'hero.nav.bluesky': 'Bluesky',
    'hero.nav.linkedin': 'LinkedIn',
    'offline.nav.refresh': 'return',
    'offline.nav.back': 'zurück',
};

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
                <TranslationProvider
                    context={{ lang: 'en', keys: defaultTranslations }}
                >
                    <App />
                </TranslationProvider>
            </QueryClientProvider>
        </StrictMode>,
    );
}
