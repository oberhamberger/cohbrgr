import { renderToString } from 'react-dom/server';

import { SSRDataRegistry } from '@cohbrgr/localization';

import Javascript from '../Javascript.html';

const mockSSRRegistry: SSRDataRegistry = {
    registerPromise: () => {},
    getData: () => ({ lang: 'en', keys: { 'hero.title': 'Test Title' } }),
    isCollecting: false,
};

describe('Javascript component', () => {
    it('should render initial state script', () => {
        const html = renderToString(
            <Javascript
                nonce="test-nonce"
                isProduction={true}
                ssrRegistry={mockSSRRegistry}
            />,
        );

        expect(html).toContain('initial-state');
        expect(html).toContain('__initial_state__');
    });

    it('should include nonce attribute', () => {
        const html = renderToString(
            <Javascript
                nonce="my-nonce"
                isProduction={true}
                ssrRegistry={mockSSRRegistry}
            />,
        );

        expect(html).toContain('nonce="my-nonce"');
    });

    it('should set isProduction in initial state', () => {
        const html = renderToString(
            <Javascript
                nonce="test-nonce"
                isProduction={true}
                ssrRegistry={mockSSRRegistry}
            />,
        );

        expect(html).toContain('"isProduction":true');
    });

    it('should include translations in initial state', () => {
        const html = renderToString(
            <Javascript
                nonce="test-nonce"
                isProduction={true}
                ssrRegistry={mockSSRRegistry}
            />,
        );

        expect(html).toContain('"translations"');
        expect(html).toContain('hero.title');
    });

    it('should have correct displayName', () => {
        expect(Javascript.displayName).toBe('SSRJavascript');
    });
});
