import { NextFunction, Request, Response } from 'express';

import { logging } from '../logging';

describe('logging middleware', () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockNext: Partial<NextFunction>;

    beforeEach(() => {
        mockRequest = {
            ip: 'test',
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

    it('should call next() for all requests', async () => {
        logging(true)(
            mockRequest as Request,
            mockResponse as Response,
            mockNext as NextFunction,
        );
        expect(mockNext).toHaveBeenCalled();
    });
});
