import '@testing-library/jest-dom';
import { useContext } from 'react';

import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { TranslationContext, TranslationKeys } from '@cohbrgr/localization';

import TranslationLoader from './TranslationLoader';

const mockFallbackTranslations: TranslationKeys = {
    'hero.title': 'Fallback Title',
    'hero.subtitle': 'Fallback Subtitle',
};

const mockApiTranslations = {
    lang: 'en',
    keys: {
        'hero.title': 'API Title',
        'hero.subtitle': 'API Subtitle',
    },
};

const TestConsumer = () => {
    const context = useContext(TranslationContext);
    return (
        <div>
            <span data-testid="lang">{context.lang}</span>
            <span data-testid="title">{context.translate('hero.title')}</span>
            <span data-testid="isDefault">{context.isDefault.toString()}</span>
        </div>
    );
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
        <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
    );
};

describe('TranslationLoader', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        global.fetch = jest.fn();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should render with fallback translations initially', () => {
        (global.fetch as jest.Mock).mockImplementation(
            () => new Promise(() => {}), // Never resolves
        );

        renderWithQueryClient(
            <TranslationLoader
                fallback={{ lang: 'en', keys: mockFallbackTranslations }}
            >
                <TestConsumer />
            </TranslationLoader>,
        );

        expect(screen.getByTestId('title')).toHaveTextContent('Fallback Title');
        expect(screen.getByTestId('isDefault')).toHaveTextContent('true');
    });

    it('should update to API translations when data is fetched', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve(mockApiTranslations),
        });

        renderWithQueryClient(
            <TranslationLoader
                fallback={{ lang: 'en', keys: mockFallbackTranslations }}
            >
                <TestConsumer />
            </TranslationLoader>,
        );

        await waitFor(() => {
            expect(screen.getByTestId('title')).toHaveTextContent('API Title');
        });

        expect(screen.getByTestId('isDefault')).toHaveTextContent('false');
    });

    it('should keep fallback when API fails', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: false,
            statusText: 'Server Error',
        });

        renderWithQueryClient(
            <TranslationLoader
                fallback={{ lang: 'en', keys: mockFallbackTranslations }}
            >
                <TestConsumer />
            </TranslationLoader>,
        );

        // Wait a bit to ensure the query has failed
        await waitFor(
            () => {
                expect(screen.getByTestId('title')).toHaveTextContent(
                    'Fallback Title',
                );
            },
            { timeout: 1000 },
        );
    });

    it('should have correct displayName', () => {
        expect(TranslationLoader.displayName).toBe('TranslationLoader');
    });
});
