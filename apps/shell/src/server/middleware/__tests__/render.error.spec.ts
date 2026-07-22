import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Request, Response } from 'express';
import httpMocks, { MockRequest, MockResponse } from 'node-mocks-http';
import render from 'src/server/middleware/render';

vi.mock('src/server/content-health', () => ({
    isContentHealthy: () => true,
}));

const mockRenderToPipeableStream = vi.fn();
vi.mock('react-dom/server', () => ({
    renderToPipeableStream: (...args: unknown[]) =>
        mockRenderToPipeableStream(...args),
}));

describe('render middleware error handling', () => {
    let mockRequest: MockRequest<Request>;
    let mockResponse: MockResponse<Response>;

    beforeEach(() => {
        mockRenderToPipeableStream.mockReset();
        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: () => Promise.resolve({ lang: 'en', keys: {} }),
        });
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should send styled error page when onShellError is triggered', async () => {
        mockRenderToPipeableStream.mockImplementation(
            (
                _element: unknown,
                options: { onShellError?: (error: Error) => void },
            ) => {
                if (options?.onShellError) {
                    options.onShellError(new Error('Shell render failed'));
                }
                return { pipe: vi.fn(), abort: vi.fn() };
            },
        );

        mockRequest = httpMocks.createRequest({ method: 'GET', url: '/' });
        mockResponse = httpMocks.createResponse({
            locals: { cspNonce: '1234' },
        });

        await render(true, true)(mockRequest, mockResponse);

        expect(mockResponse.statusCode).toEqual(500);
        const body = mockResponse._getData();
        expect(body).toContain('Something went wrong');
        expect(body).toContain('nonce="1234"');
    });

    it('should send styled error page when onError is triggered', async () => {
        mockRenderToPipeableStream.mockImplementation(
            (
                _element: unknown,
                options: {
                    onError?: (
                        error: Error,
                        errorInfo: { componentStack: string },
                    ) => void;
                },
            ) => {
                if (options?.onError) {
                    options.onError(new Error('Render error'), {
                        componentStack: '',
                    });
                }
                return { pipe: vi.fn(), abort: vi.fn() };
            },
        );

        mockRequest = httpMocks.createRequest({ method: 'GET', url: '/' });
        mockResponse = httpMocks.createResponse({
            locals: { cspNonce: '1234' },
        });

        await render(true, true)(mockRequest, mockResponse);

        expect(mockResponse.statusCode).toEqual(500);
        expect(mockResponse._getData()).toContain('Something went wrong');
    });

    it('should send styled error page when renderToPipeableStream throws synchronously', async () => {
        mockRenderToPipeableStream.mockImplementation(() => {
            throw new Error('Sync failure');
        });

        mockRequest = httpMocks.createRequest({ method: 'GET', url: '/' });
        mockResponse = httpMocks.createResponse({
            locals: { cspNonce: '1234' },
        });

        await render(true, true)(mockRequest, mockResponse);

        expect(mockResponse.statusCode).toEqual(500);
        expect(mockResponse._getData()).toContain('Something went wrong');
    });
});
