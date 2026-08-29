import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Request, Response } from 'express';
import { ConfigData, HtmlValidate } from 'html-validate';
import 'html-validate/vitest';
import httpMocks, { MockRequest, MockResponse } from 'node-mocks-http';
import render from 'src/server/middleware/render';

vi.mock('src/server/content-health', () => ({
    isContentHealthy: () => true,
}));

const mockTranslationResponse = {
    lang: 'en',
    keys: {
        'hero.title': 'Test Title',
        'hero.subtitle': 'Test Subtitle',
        'notfound.nav.back': 'return',
    },
};

const mockNavigationResponse = [
    { id: 'notfound-back', labelKey: 'notfound.nav.back', path: '/' },
];

describe('render middleware', () => {
    let mockRequest: MockRequest<Request>;
    let mockResponse: MockResponse<Response>;

    const htmlValidatorConfig: ConfigData = {
        extends: ['html-validate:document'],
        root: true,
        rules: {
            'require-sri': 'off',
        },
    };
    const htmlvalidate = new HtmlValidate(htmlValidatorConfig);

    beforeEach(() => {
        // The 404 page pulls its navigation from the API too, so the mock has
        // to answer both endpoints.
        global.fetch = vi.fn().mockImplementation((url: string) =>
            Promise.resolve({
                ok: true,
                json: () =>
                    Promise.resolve(
                        url.includes('/navigation/')
                            ? mockNavigationResponse
                            : mockTranslationResponse,
                    ),
            }),
        );
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    // doesn't work with federated modules yet
    // it('startpage should return valid html and return 200', async () => {
    //     mockRequest = httpMocks.createRequest({
    //         method: 'GET',
    //         url: '/',
    //     });

    //     mockResponse = httpMocks.createResponse({
    //         locals: {
    //             nonce: '1234',
    //         },
    //     });

    //     await render(true, true)(mockRequest, mockResponse);

    //     const htmlResponse = mockResponse._getData();
    //     const docType = '<!DOCTYPE html>';

    //     expect(mockResponse.statusCode).toEqual(200);
    //     expect(htmlResponse.length).toBeGreaterThan(0);
    //     expect(htmlResponse.startsWith(docType)).toBe(true);

    //     htmlvalidate.validateString(htmlResponse).then((report) => {
    //         expect(report.valid).toEqual(true);
    //         expect(report.errorCount).toBeFalsy();
    //         expect(report.warningCount).toBeFalsy();
    //     });
    // });

    it('not found page should return valid html and return status 404', async () => {
        mockRequest = httpMocks.createRequest({
            method: 'GET',
            url: '/asdf',
        });

        mockResponse = httpMocks.createResponse({
            locals: {
                nonce: '1234',
            },
        });

        await render(true, true)(mockRequest, mockResponse);

        const htmlResponse = mockResponse._getData();
        const docType = '<!DOCTYPE html>';

        expect(mockResponse.statusCode).toEqual(404);
        expect(htmlResponse.length).toBeGreaterThan(0);
        expect(htmlResponse.startsWith(docType)).toBe(true);

        htmlvalidate.validateString(htmlResponse).then((report) => {
            expect(report.valid).toEqual(true);
            expect(report.errorCount).toBeLessThan(1);
        });
    });

    it('offlinepage should return valid html', async () => {
        mockRequest = httpMocks.createRequest({
            method: 'GET',
            url: '/offline',
        });

        mockResponse = httpMocks.createResponse({
            locals: {
                nonce: '1234',
            },
        });
        await render(true, true)(mockRequest, mockResponse);

        const htmlResponse = mockResponse._getData();
        const docType = '<!DOCTYPE html>';

        expect(mockResponse.statusCode).toEqual(200);
        expect(htmlResponse.length).toBeGreaterThan(0);
        expect(htmlResponse.startsWith(docType)).toBe(true);

        htmlvalidate.validateString(htmlResponse).then((report) => {
            expect(report.valid).toEqual(true);
            expect(report.errorCount).toBeLessThan(1);
        });
    });

    it('should handle HEAD requests', async () => {
        mockRequest = httpMocks.createRequest({
            method: 'HEAD',
            url: '/offline',
        });

        mockResponse = httpMocks.createResponse({
            locals: {
                nonce: '1234',
            },
        });

        await render(true, true)(mockRequest, mockResponse);

        expect(mockResponse.statusCode).toEqual(200);
    });

    it('should render with non-production mode', async () => {
        mockRequest = httpMocks.createRequest({
            method: 'GET',
            url: '/offline',
        });

        mockResponse = httpMocks.createResponse({
            locals: {
                nonce: '1234',
            },
        });

        await render(false, true)(mockRequest, mockResponse);

        const htmlResponse = mockResponse._getData();
        expect(mockResponse.statusCode).toEqual(200);
        expect(htmlResponse.length).toBeGreaterThan(0);
    });
});
