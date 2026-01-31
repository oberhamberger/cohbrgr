import { renderToString } from 'react-dom/server';

import { TranslationCache } from '@cohbrgr/localization';

import Javascript from '../Javascript.html';

const mockTranslationCache: TranslationCache = {
    read: () => ({ lang: 'en', keys: { 'hero.title': 'Test Title' } }),
    getResolved: () => ({ lang: 'en', keys: { 'hero.title': 'Test Title' } }),
};

describe('Javascript component', () => {
    it('should render initial state script', () => {
        const html = renderToString(
            <Javascript
                nonce="test-nonce"
                isProduction={true}
                translationCache={mockTranslationCache}
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
                translationCache={mockTranslationCache}
            />,
        );

        expect(html).toContain('nonce="my-nonce"');
    });

    it('should set isProduction in initial state', () => {
        const html = renderToString(
            <Javascript
                nonce="test-nonce"
                isProduction={true}
                translationCache={mockTranslationCache}
            />,
        );

        expect(html).toContain('"isProduction":true');
    });

    it('should include translations in initial state', () => {
        const html = renderToString(
            <Javascript
                nonce="test-nonce"
                isProduction={true}
                translationCache={mockTranslationCache}
            />,
        );

        expect(html).toContain('"translations"');
        expect(html).toContain('hero.title');
    });

    it('should handle missing translations gracefully', () => {
        const emptyCache: TranslationCache = {
            read: () => ({ lang: 'en', keys: {} }),
            getResolved: () => undefined,
        };

        const html = renderToString(
            <Javascript
                nonce="test-nonce"
                isProduction={true}
                translationCache={emptyCache}
            />,
        );

        expect(html).toContain('"translations":{}');
    });

    it('should have correct displayName', () => {
        expect(Javascript.displayName).toBe('SSRJavascript');
    });
});
