import { afterEach, describe, expect, it, vi } from 'vitest';

import {
    API_FAILURE_PREFIX,
    reportApiFailure,
} from 'src/client/queries/api-failure';

afterEach(() => {
    vi.restoreAllMocks();
});

describe('reportApiFailure', () => {
    it('writes a structured ERROR line on the server', () => {
        const written: string[] = [];
        vi.spyOn(process.stderr, 'write').mockImplementation((chunk) => {
            written.push(String(chunk));
            return true;
        });
        vi.stubGlobal('window', undefined);

        reportApiFailure({
            endpoint: '/navigation/hero',
            error: new Error('HTTP 429 Too Many Requests'),
            degradedTo: 'no navigation',
        });

        expect(written).toHaveLength(1);
        const entry = JSON.parse(written[0] as string);
        expect(entry.severity).toBe('ERROR');
        expect(entry.endpoint).toBe('/navigation/hero');
        expect(entry.reason).toBe('HTTP 429 Too Many Requests');
        expect(entry.message).toContain(API_FAILURE_PREFIX);
    });

    it('keeps the status code, so 429 and 304 are told apart', () => {
        const written: string[] = [];
        vi.spyOn(process.stderr, 'write').mockImplementation((chunk) => {
            written.push(String(chunk));
            return true;
        });
        vi.stubGlobal('window', undefined);

        reportApiFailure({
            endpoint: '/translation/en',
            error: new Error('HTTP 304 Not Modified'),
            degradedTo: 'the bundled fallback copy',
        });

        expect(JSON.parse(written[0] as string).reason).toContain('304');
    });

    it('survives a thrown value that is not an Error', () => {
        vi.spyOn(process.stderr, 'write').mockImplementation(() => true);
        vi.stubGlobal('window', undefined);

        expect(() =>
            reportApiFailure({
                endpoint: '/navigation/hero',
                error: 'socket hang up',
                degradedTo: 'no navigation',
            }),
        ).not.toThrow();
    });
});
