import { renderToString } from 'react-dom/server';

import Javascript, { DEHYDRATED_STATE_PLACEHOLDER } from '../Javascript.html';

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

    it('should include dehydratedState placeholder for post-render injection', () => {
        const html = renderToString(
            <Javascript nonce="test-nonce" isProduction={true} />,
        );

        expect(html).toContain('"dehydratedState"');
        expect(html).toContain(DEHYDRATED_STATE_PLACEHOLDER);
    });

    it('should have correct displayName', () => {
        expect(Javascript.displayName).toBe('SSRJavascript');
    });
});
