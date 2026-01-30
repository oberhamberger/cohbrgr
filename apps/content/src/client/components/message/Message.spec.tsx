import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { TranslationProvider } from 'src/client/contexts/translation';
import { TranslationKeys } from 'src/client/types/translation';

import Message from './Message';

const mockTranslations: TranslationKeys = {
    'hero.subtitle': 'c.f.k.o',
    'hero.title': 'My Name is Christian.',
    'hero.text': '<a href="https://example.com">Link</a>',
    'hero.nav.github': 'Github',
    'hero.nav.bluesky': 'Bluesky',
    'hero.nav.linkedin': 'LinkedIn',
    'offline.nav.refresh': 'return',
    'offline.nav.back': 'back',
};

const renderWithProvider = (ui: React.ReactElement) => {
    return render(
        <TranslationProvider context={{ lang: 'en', keys: mockTranslations }}>
            {ui}
        </TranslationProvider>,
    );
};

describe('Message Component', () => {
    it('renders translated text for a given key', () => {
        renderWithProvider(<Message id="hero.title" />);

        expect(screen.getByText('My Name is Christian.')).toBeInTheDocument();
    });

    it('renders different translation keys correctly', () => {
        renderWithProvider(<Message id="hero.nav.github" />);

        expect(screen.getByText('Github')).toBeInTheDocument();
    });

    it('renders the key itself when translation not found', () => {
        const emptyTranslations = {} as TranslationKeys;
        render(
            <TranslationProvider context={{ lang: 'en', keys: emptyTranslations }}>
                <Message id="hero.title" />
            </TranslationProvider>,
        );

        expect(screen.getByText('hero.title')).toBeInTheDocument();
    });

    it('renders fallback when key not found', () => {
        const emptyTranslations = {} as TranslationKeys;
        render(
            <TranslationProvider context={{ lang: 'en', keys: emptyTranslations }}>
                <Message id="hero.title" fallback="Fallback Text" />
            </TranslationProvider>,
        );

        expect(screen.getByText('Fallback Text')).toBeInTheDocument();
    });

    it('renders HTML content when html prop is true', () => {
        renderWithProvider(<Message id="hero.text" html />);

        const link = screen.getByRole('link');
        expect(link).toHaveAttribute('href', 'https://example.com');
        expect(link).toHaveTextContent('Link');
    });

    it('does not render HTML when html prop is false', () => {
        renderWithProvider(<Message id="hero.text" />);

        expect(screen.queryByRole('link')).not.toBeInTheDocument();
        expect(
            screen.getByText('<a href="https://example.com">Link</a>'),
        ).toBeInTheDocument();
    });
});
