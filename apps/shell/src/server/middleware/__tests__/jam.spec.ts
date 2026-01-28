import type { NextFunction, Request, Response } from 'express';

import jam from '../jam';

describe('jam middleware', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockNext: NextFunction;

    beforeEach(() => {
        mockRequest = {
            path: '/',
        };
        mockResponse = {
            locals: { cspNonce: 'test-nonce' },
            statusCode: 200,
            send: jest.fn().mockReturnThis(),
        };
        mockNext = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should call next() in non-production mode', async () => {
        const middleware = jam(false);

        await middleware(
            mockRequest as Request,
            mockResponse as Response,
            mockNext,
        );

        expect(mockNext).toHaveBeenCalled();
        expect(mockResponse.send).not.toHaveBeenCalled();
    });

    it('should call next() when no matching static file exists', async () => {
        mockRequest.path = '/non-existent-route';
        const middleware = jam(true);

        await middleware(
            mockRequest as Request,
            mockResponse as Response,
            mockNext,
        );

        expect(mockNext).toHaveBeenCalled();
    });

    it('should call next() for unmatched routes', async () => {
        mockRequest.path = '/some/random/path';
        const middleware = jam(true);

        await middleware(
            mockRequest as Request,
            mockResponse as Response,
            mockNext,
        );

        expect(mockNext).toHaveBeenCalled();
    });

    it('should call next() for root path when file does not exist', async () => {
        mockRequest.path = '/';
        const middleware = jam(true);

        await middleware(
            mockRequest as Request,
            mockResponse as Response,
            mockNext,
        );

        expect(mockNext).toHaveBeenCalled();
    });

    it('should call next() for offline path when file does not exist', async () => {
        mockRequest.path = '/offline';
        const middleware = jam(true);

        await middleware(
            mockRequest as Request,
            mockResponse as Response,
            mockNext,
        );

        expect(mockNext).toHaveBeenCalled();
    });
});
