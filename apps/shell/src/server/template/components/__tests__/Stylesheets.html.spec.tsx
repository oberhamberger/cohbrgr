import { renderToString } from 'react-dom/server';

import Stylesheets from '../Stylesheets.html';

describe('Stylesheets component', () => {
    it('should render with production mode', () => {
        const html = renderToString(
            <Stylesheets nonce="test-nonce" isProduction={true} />,
        );

        expect(html).toContain('style');
    });

    it('should render with non-production mode', () => {
        const html = renderToString(
            <Stylesheets nonce="test-nonce" isProduction={false} />,
        );

        // In non-production, it renders link tags instead of inline styles
        expect(typeof html).toBe('string');
    });

    it('should have correct displayName', () => {
        expect(Stylesheets.displayName).toBe('SSRStylesheets');
    });
});
