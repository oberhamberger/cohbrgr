import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Suspense } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';

import { TranslationKeys } from '@cohbrgr/localization';

import App from './App';

const mockTranslations: TranslationKeys = {
    'hero.subtitle': 'C·V·Q·O',
    'hero.subtitle.label': 'Codex Visioque',
    'hero.title': 'My Name is Christian.',
    'hero.text':
        "I am a Frontend Architect at <a href='https://netconomy.net'>Netconomy</a>.",
    'hero.nav.codex': 'Codex',
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

const mockNavigationNodes = [
    { id: 'hero-codex', labelKey: 'hero.nav.codex', path: '/codex' },
    {
        id: 'hero-github',
        labelKey: 'hero.nav.github',
        path: 'https://github.com/oberhamberger',
        external: true,
    },
    {
        id: 'hero-bluesky',
        labelKey: 'hero.nav.bluesky',
        path: 'https://bsky.app/profile/cohbrgr.bsky.social',
        external: true,
    },
    {
        id: 'hero-linkedin',
        labelKey: 'hero.nav.linkedin',
        path: 'https://www.linkedin.com/in/oberhamberger/',
        external: true,
    },
];

// The component now calls two endpoints, so the mock has to route on URL.
const mockApi = (translations: TranslationKeys) =>
    vi.fn().mockImplementation((url: string) =>
        Promise.resolve({
            ok: true,
            json: () =>
                Promise.resolve(
                    url.includes('/navigation/')
                        ? mockNavigationNodes
                        : { lang: 'en', keys: translations },
                ),
        }),
    );

describe('App', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        global.fetch = mockApi(mockTranslations);
    });

    afterEach(() => {
        vi.restoreAllMocks();
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
        const { container } = renderWithQueryClient(
            <App nonce="custom-nonce" />,
        );

        await screen.findByText('My Name is Christian.');

        expect(container.querySelector('nav')).toBeInTheDocument();
    });
});
