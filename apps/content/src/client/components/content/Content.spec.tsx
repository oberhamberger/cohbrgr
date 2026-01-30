import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { TranslationProvider } from 'src/client/contexts/translation';
import { TranslationKeys } from 'src/client/types/translation';

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

const renderWithProvider = (ui: React.ReactElement) => {
    return render(
        <TranslationProvider context={{ lang: 'en', keys: mockTranslations }}>
            {ui}
        </TranslationProvider>,
    );
};

describe('Main Content Component', () => {
    it('displays translated title', async () => {
        renderWithProvider(<Content nonce={nonce} />);
        const items = await screen.findAllByText('My Name is Christian.');
        expect(items).toHaveLength(1);
    });

    it('displays navigation with translated links', async () => {
        const { container } = renderWithProvider(<Content nonce={nonce} />);
        expect(container.getElementsByTagName('nav').length).toEqual(1);
        expect(container.getElementsByTagName('li').length).toEqual(3);

        expect(screen.getByText('Github')).toBeInTheDocument();
        expect(screen.getByText('Bluesky')).toBeInTheDocument();
        expect(screen.getByText('LinkedIn')).toBeInTheDocument();
    });

    it('renders HTML content in hero text', () => {
        renderWithProvider(<Content nonce={nonce} />);
        const link = screen.getByRole('link', { name: 'Netconomy' });
        expect(link).toHaveAttribute('href', 'https://netconomy.net');
    });
});
