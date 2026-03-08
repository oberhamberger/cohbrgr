import { NextFunction, Request, Response } from 'express';

import { correlationId, CORRELATION_ID_HEADER } from '../correlationId';

describe('correlationId middleware', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockNext: NextFunction;

    beforeEach(() => {
        mockRequest = {
            headers: {},
        };
        mockResponse = {
            locals: {},
            setHeader: jest.fn(),
        };
        mockNext = jest.fn();
    });

    it('should generate a UUID when no header is present', () => {
        correlationId(
            mockRequest as Request,
            mockResponse as Response,
            mockNext,
        );

        expect(mockResponse.locals!['correlationId']).toMatch(
            /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
        );
        expect(mockResponse.setHeader).toHaveBeenCalledWith(
            CORRELATION_ID_HEADER,
            mockResponse.locals!['correlationId'],
        );
        expect(mockNext).toHaveBeenCalled();
    });

    it('should use the incoming header when present', () => {
        mockRequest.headers = {
            [CORRELATION_ID_HEADER]: 'incoming-id-123',
        };

        correlationId(
            mockRequest as Request,
            mockResponse as Response,
            mockNext,
        );

        expect(mockResponse.locals!['correlationId']).toBe('incoming-id-123');
        expect(mockResponse.setHeader).toHaveBeenCalledWith(
            CORRELATION_ID_HEADER,
            'incoming-id-123',
        );
        expect(mockNext).toHaveBeenCalled();
    });

    it('should set the correlation ID as a response header', () => {
        correlationId(
            mockRequest as Request,
            mockResponse as Response,
            mockNext,
        );

        expect(mockResponse.setHeader).toHaveBeenCalledWith(
            CORRELATION_ID_HEADER,
            expect.any(String),
        );
    });
});
