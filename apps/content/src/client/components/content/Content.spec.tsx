import '@testing-library/jest-dom';
import { Suspense } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';

import { TranslationKeys } from '@cohbrgr/localization';

import Content from './Content';

const nonce = '123456789';

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

describe('Main Content Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            json: () => Promise.resolve({ lang: 'en', keys: mockTranslations }),
        });
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('displays translated title', async () => {
        renderWithQueryClient(<Content nonce={nonce} />);
        const items = await screen.findAllByText('My Name is Christian.');
        expect(items).toHaveLength(1);
    });

    it('displays navigation with translated links', async () => {
        const { container } = renderWithQueryClient(<Content nonce={nonce} />);

        await screen.findByText('My Name is Christian.');

        expect(container.getElementsByTagName('nav').length).toEqual(1);
        expect(container.getElementsByTagName('li').length).toEqual(3);

        expect(screen.getByText('Github')).toBeInTheDocument();
        expect(screen.getByText('Bluesky')).toBeInTheDocument();
        expect(screen.getByText('LinkedIn')).toBeInTheDocument();
    });

    it('renders HTML content in hero text', async () => {
        renderWithQueryClient(<Content nonce={nonce} />);

        await screen.findByText('My Name is Christian.');

        const link = screen.getByRole('link', { name: 'Netconomy' });
        expect(link).toHaveAttribute('href', 'https://netconomy.net');
    });
});
