import { expect, test } from '@playwright/test';

test.describe('Security Headers', () => {
    test('response includes Content-Security-Policy', async ({ request }) => {
        const response = await request.get('/');
        const csp = response.headers()['content-security-policy'];

        expect(csp).toBeDefined();
        expect(csp).toContain("default-src 'self'");
        expect(csp).toContain('script-src');
        expect(csp).toContain('nonce-');
    });

    test('response includes X-Content-Type-Options', async ({ request }) => {
        const response = await request.get('/');
        expect(response.headers()['x-content-type-options']).toBe('nosniff');
    });

    test('response includes correlation ID', async ({ request }) => {
        const response = await request.get('/');
        const correlationId = response.headers()['x-correlation-id'];

        expect(correlationId).toBeDefined();
        expect(correlationId).toMatch(
            /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
        );
    });

    test('incoming correlation ID is propagated', async ({ request }) => {
        const customId = 'e2e-test-correlation-id';
        const response = await request.get('/', {
            headers: { 'x-correlation-id': customId },
        });

        expect(response.headers()['x-correlation-id']).toBe(customId);
    });

    test('CSP nonce is unique per request', async ({ request }) => {
        const response1 = await request.get('/');
        const response2 = await request.get('/');

        const csp1 = response1.headers()['content-security-policy'];
        const csp2 = response2.headers()['content-security-policy'];

        const nonce1 = csp1?.match(/nonce-([a-f0-9]+)/)?.[1];
        const nonce2 = csp2?.match(/nonce-([a-f0-9]+)/)?.[1];

        expect(nonce1).toBeDefined();
        expect(nonce2).toBeDefined();
        expect(nonce1).not.toBe(nonce2);
    });
});
