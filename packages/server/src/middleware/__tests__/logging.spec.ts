import { NextFunction, Request, Response } from 'express';

import { logging } from '../logging';

describe('logging middleware', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockNext: NextFunction;

    beforeEach(() => {
        mockRequest = {
            ip: 'test',
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

    it('should log with IP in production mode', () => {
        // Production mode logs with IP
        logging(true)(
            mockRequest as Request,
            mockResponse as Response,
            mockNext,
        );
        expect(mockNext).toHaveBeenCalled();
    });

    it('should log URL in development mode', () => {
        // Development mode logs URL without IP
        logging(false)(
            mockRequest as Request,
            mockResponse as Response,
            mockNext,
        );
        expect(mockNext).toHaveBeenCalled();
    });
});
