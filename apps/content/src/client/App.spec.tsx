import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

import App from './App';

describe('App', () => {
    it('renders Content component', async () => {
        render(<App nonce="test-nonce" />);
        const items = await screen.findAllByText('My name is Christian');
        expect(items).toHaveLength(1);
    });

    it('has correct displayName', () => {
        expect(App.displayName).toBe('App');
    });

    it('passes nonce prop to Content', () => {
        const { container } = render(<App nonce="custom-nonce" />);
        expect(container.querySelector('nav')).toBeInTheDocument();
    });
});
