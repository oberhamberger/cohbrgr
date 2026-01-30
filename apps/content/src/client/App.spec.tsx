import '@testing-library/jest-dom';
import { TranslationKeys, TranslationProvider } from '@cohbrgr/localization';
import { render, screen } from '@testing-library/react';

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

const renderWithProvider = (ui: React.ReactElement) => {
    return render(
        <TranslationProvider
            context={{ lang: 'en', keys: mockTranslations, isDefault: false }}
        >
            {ui}
        </TranslationProvider>,
    );
};

describe('App', () => {
    it('renders Content component', async () => {
        renderWithProvider(<App nonce="test-nonce" />);
        const items = await screen.findAllByText('My Name is Christian.');
        expect(items).toHaveLength(1);
    });

    it('has correct displayName', () => {
        expect(App.displayName).toBe('App');
    });

    it('passes nonce prop to Content', () => {
        const { container } = renderWithProvider(<App nonce="custom-nonce" />);
        expect(container.querySelector('nav')).toBeInTheDocument();
    });
});
