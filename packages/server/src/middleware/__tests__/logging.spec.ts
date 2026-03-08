import { NextFunction, Request, Response } from 'express';

import { logging } from '../logging';

const mockLoggerInfo = jest.fn();
jest.mock('@cohbrgr/utils', () => ({
    Logger: {
        info: (...args: unknown[]) => mockLoggerInfo(...args),
    },
}));

describe('logging middleware', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockNext: NextFunction;

    beforeEach(() => {
        mockLoggerInfo.mockReset();
        mockRequest = {
            ip: '127.0.0.1',
            url: '/test-url',
            headers: {
                'user-agent': 'test',
            },
        };
        mockResponse = {
            statusCode: 0,
            json: jest.fn(),
            send: jest.fn(),
        };
        mockNext = jest.fn();
    });

    it('should call next() for production requests', () => {
        logging(true)(
            mockRequest as Request,
            mockResponse as Response,
            mockNext,
        );
        expect(mockNext).toHaveBeenCalled();
    });

    it('should call next() for development requests', () => {
        logging(false)(
            mockRequest as Request,
            mockResponse as Response,
            mockNext,
        );
        expect(mockNext).toHaveBeenCalled();
    });

    it('should log IP and URL in production mode', () => {
        logging(true)(
            mockRequest as Request,
            mockResponse as Response,
            mockNext,
        );
        expect(mockLoggerInfo).toHaveBeenCalledWith(
            '127.0.0.1 requests: /test-url',
        );
    });

    it('should log URL without IP in development mode', () => {
        logging(false)(
            mockRequest as Request,
            mockResponse as Response,
            mockNext,
        );
        expect(mockLoggerInfo).toHaveBeenCalledWith('Requesting: /test-url');
    });
});
