import { cloudRunOrigins, productionDomain } from './origins';

describe('cloudRunOrigins', () => {
    it('defines shell Cloud Run origin', () => {
        expect(cloudRunOrigins.shell).toMatch(/^https:\/\/.*\.run\.app$/);
    });

    it('defines content Cloud Run origin', () => {
        expect(cloudRunOrigins.content).toMatch(/^https:\/\/.*\.run\.app$/);
    });

    it('defines api Cloud Run origin', () => {
        expect(cloudRunOrigins.api).toMatch(/^https:\/\/.*\.run\.app$/);
    });

    it('uses HTTPS for all origins', () => {
        Object.values(cloudRunOrigins).forEach((origin) => {
            expect(origin).toMatch(/^https:\/\//);
        });
    });

    it('does not include trailing slashes', () => {
        Object.values(cloudRunOrigins).forEach((origin) => {
            expect(origin).not.toMatch(/\/$/);
        });
    });
});

describe('productionDomain', () => {
    it('is the cohbrgr.com domain', () => {
        expect(productionDomain).toBe('https://cohbrgr.com');
    });

    it('uses HTTPS', () => {
        expect(productionDomain).toMatch(/^https:\/\//);
    });

    it('does not include a trailing slash', () => {
        expect(productionDomain).not.toMatch(/\/$/);
    });
});
