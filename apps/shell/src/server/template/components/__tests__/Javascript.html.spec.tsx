import { renderToString } from 'react-dom/server';

import Javascript from '../Javascript.html';

describe('Javascript component', () => {
    it('should render initial state script', () => {
        const html = renderToString(
            <Javascript nonce="test-nonce" isProduction={true} />,
        );

        expect(html).toContain('initial-state');
        expect(html).toContain('__initial_state__');
    });

    it('should include nonce attribute', () => {
        const html = renderToString(
            <Javascript nonce="my-nonce" isProduction={true} />,
        );

        expect(html).toContain('nonce="my-nonce"');
    });

    it('should set isProduction in initial state', () => {
        const html = renderToString(
            <Javascript nonce="test-nonce" isProduction={true} />,
        );

        expect(html).toContain('"isProduction":true');
    });

    it('should have correct displayName', () => {
        expect(Javascript.displayName).toBe('SSRJavascript');
    });
});
