import '@testing-library/jest-dom';
import { Suspense } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';

import { TranslationKeys } from '@cohbrgr/localization';

import App from './App';

const mockTranslations: TranslationKeys = {
    'hero.subtitle': 'c.f.k.o',
    'hero.title': 'My Name is Christian.',
    'hero.text':
        "I am a Frontend Architect at <a href='https://netconomy.net'>Netconomy</a>.",
    'hero.nav.github': 'Github',
    'hero.nav.bluesky': 'Bluesky',
    'hero.nav.linkedin': 'LinkedIn',
    'offline.nav.refresh': 'return',
    'offline.nav.back': 'back',
};

const createQueryClient = () =>
    new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
            },
        },
    });

const renderWithQueryClient = (ui: React.ReactElement) => {
    const queryClient = createQueryClient();
    return render(
        <QueryClientProvider client={queryClient}>
            <Suspense fallback={<div>Loading...</div>}>{ui}</Suspense>
        </QueryClientProvider>,
    );
};

describe('App', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            json: () =>
                Promise.resolve({ lang: 'en', keys: mockTranslations }),
        });
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('renders Content component', async () => {
        renderWithQueryClient(<App nonce="test-nonce" />);
        const items = await screen.findAllByText('My Name is Christian.');
        expect(items).toHaveLength(1);
    });

    it('has correct displayName', () => {
        expect(App.displayName).toBe('App');
    });

    it('passes nonce prop to Content', async () => {
        const { container } = renderWithQueryClient(<App nonce="custom-nonce" />);

        await screen.findByText('My Name is Christian.');

        expect(container.querySelector('nav')).toBeInTheDocument();
    });
});
