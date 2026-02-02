import { useContext } from 'react';

import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

import { TranslationContext, TranslationProvider } from './context';
import { TranslationKeys } from './types';

const TestConsumer = () => {
    const context = useContext(TranslationContext);
    return (
        <div>
            <span data-testid="lang">{context.lang}</span>
            <span data-testid="title">{context.translate('hero.title')}</span>
        </div>
    );
};

const mockTranslations: TranslationKeys = {
    'hero.subtitle': 'c.f.k.o',
    'hero.title': 'Test Title',
    'hero.text': 'Test text',
    'hero.nav.github': 'Github',
    'hero.nav.bluesky': 'Bluesky',
    'hero.nav.linkedin': 'LinkedIn',
    'offline.nav.refresh': 'return',
    'offline.nav.back': 'back',
};

describe('translation context', () => {
    describe('TranslationContext', () => {
        it('should have default values', () => {
            render(
                <TranslationContext.Provider
                    value={{
                        lang: 'en',
                        keys: mockTranslations,
                        translate: (key) => mockTranslations[key] ?? key,
                        isDefault: false,
                    }}
                >
                    <TestConsumer />
                </TranslationContext.Provider>,
            );

            expect(screen.getByTestId('lang')).toHaveTextContent('en');
            expect(screen.getByTestId('title')).toHaveTextContent('Test Title');
        });

        it('should use initial context default translate function when no provider', () => {
            render(<TestConsumer />);

            expect(screen.getByTestId('lang')).toHaveTextContent('en');
            // Default translate returns the key as-is
            expect(screen.getByTestId('title')).toHaveTextContent('hero.title');
        });
    });

    describe('TranslationProvider', () => {
        it('should provide translation values to children', () => {
            render(
                <TranslationProvider
                    context={{
                        lang: 'en',
                        keys: mockTranslations,
                    }}
                >
                    <TestConsumer />
                </TranslationProvider>,
            );

            expect(screen.getByTestId('lang')).toHaveTextContent('en');
            expect(screen.getByTestId('title')).toHaveTextContent('Test Title');
        });

        it('should use default context when not provided', () => {
            render(
                <TranslationProvider context={undefined as never}>
                    <TestConsumer />
                </TranslationProvider>,
            );

            expect(screen.getByTestId('lang')).toHaveTextContent('en');
        });

        it('should return key when translation is missing', () => {
            const partialTranslations = {
                ...mockTranslations,
                'hero.title': undefined,
            } as unknown as TranslationKeys;

            render(
                <TranslationProvider
                    context={{
                        lang: 'en',
                        keys: partialTranslations,
                    }}
                >
                    <TestConsumer />
                </TranslationProvider>,
            );

            expect(screen.getByTestId('title')).toHaveTextContent('hero.title');
        });
    });
});
